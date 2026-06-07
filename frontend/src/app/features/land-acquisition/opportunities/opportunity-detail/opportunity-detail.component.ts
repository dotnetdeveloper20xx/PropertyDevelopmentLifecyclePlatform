import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { PageDescriptionComponent } from '../../../../shared/components/page-description/page-description.component';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { OpportunityService } from '../../../../core/services/opportunity.service';
import { DueDiligenceService, DueDiligenceListItem, DueDiligenceStatus } from '../../../../core/services/due-diligence.service';
import { OfferService, OfferListItem, OfferStatus } from '../../../../core/services/offer.service';
import { DocumentService, DocumentListItem, DocumentType } from '../../../../core/services/document.service';
import { ActivityService, ActivityItem } from '../../../../core/services/activity.service';
import { AcquisitionService, AcquisitionRecord } from '../../../../core/services/acquisition.service';
import { ModalService } from '../../../../core/services/modal.service';
import { ToastService } from '../../../../core/services/toast.service';
import { OpportunityDetail } from '../../../../core/models/opportunity.model';

@Component({
  selector: 'app-opportunity-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    LoadingStateComponent, StatusBadgeComponent, PageHeaderComponent,
    PageDescriptionComponent, BreadcrumbComponent, EmptyStateComponent, FormFieldComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <app-loading-state message="Loading opportunity..."></app-loading-state>
    } @else if (opportunity) {
      <app-breadcrumb [items]="[{label: 'Home', url: '/dashboard'},{label: 'Opportunities', url: '/opportunities'},{label: opportunity.name}]"></app-breadcrumb>
      <app-page-header [title]="opportunity.name" [subtitle]="opportunity.location">
        <div class="flex items-center gap-2">
          <app-status-badge [status]="opportunity.status"></app-status-badge>
          <a [routerLink]="['/opportunities', opportunityId, 'edit']" class="btn btn-ghost btn-xs">Edit</a>
          @if (opportunity.status !== 'Withdrawn' && opportunity.status !== 'Acquired') {
            <button class="btn btn-warning btn-xs" (click)="confirmWithdraw()">Withdraw</button>
          }
          <button class="btn btn-error btn-xs btn-outline" (click)="confirmDelete()">Delete</button>
        </div>
      </app-page-header>
      <app-page-description description="Full details of this land opportunity. Use the tabs to manage due diligence, offers, documents, and view the audit trail."
        guidance="Progress this opportunity by completing due diligence, then submitting an offer." helpLink="/help/land-acquisition/la-pipeline"></app-page-description>

      <!-- Tabs -->
      <div role="tablist" class="tabs tabs-bordered mb-6">
        <button role="tab" class="tab" [class.tab-active]="activeTab==='details'" (click)="switchTab('details')">Details</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab==='dd'" (click)="switchTab('dd')">Due Diligence ({{dueDiligences.length}})</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab==='offers'" (click)="switchTab('offers')">Offers ({{offers.length}})</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab==='docs'" (click)="switchTab('docs')">Documents ({{documents.length}})</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab==='activity'" (click)="switchTab('activity')">Activity</button>
        <button role="tab" class="tab" [class.tab-active]="activeTab==='acquisition'" (click)="switchTab('acquisition')">Acquisition</button>
      </div>

      <!-- DETAILS TAB -->
      @if (activeTab==='details') {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="card bg-base-100 shadow-sm border border-base-300"><div class="card-body"><h3 class="card-title text-sm">Land Information</h3><dl class="space-y-2 mt-2 text-sm"><div><dt class="text-base-content/50">Size</dt><dd class="font-medium">{{opportunity.landSize}} {{opportunity.landSizeUnit}}</dd></div><div><dt class="text-base-content/50">Current Use</dt><dd>{{opportunity.currentUse||'—'}}</dd></div><div><dt class="text-base-content/50">Title Number</dt><dd>{{opportunity.titleNumber||'—'}}</dd></div><div><dt class="text-base-content/50">Post Code</dt><dd>{{opportunity.postCode||'—'}}</dd></div></dl></div></div>
          <div class="card bg-base-100 shadow-sm border border-base-300"><div class="card-body"><h3 class="card-title text-sm">Financial</h3><dl class="space-y-2 mt-2 text-sm"><div><dt class="text-base-content/50">Asking Price</dt><dd class="font-medium">{{opportunity.askingPrice?('£'+(opportunity.askingPrice|number:'1.0-0')):'—'}}</dd></div><div><dt class="text-base-content/50">Estimated Value</dt><dd>{{opportunity.estimatedValue?('£'+(opportunity.estimatedValue|number:'1.0-0')):'—'}}</dd></div><div><dt class="text-base-content/50">Dev Cost</dt><dd>{{opportunity.estimatedDevelopmentCost?('£'+(opportunity.estimatedDevelopmentCost|number:'1.0-0')):'—'}}</dd></div><div><dt class="text-base-content/50">ROI</dt><dd>{{opportunity.roi?(opportunity.roi+'%'):'—'}}</dd></div></dl></div></div>
          <div class="card bg-base-100 shadow-sm border border-base-300"><div class="card-body"><h3 class="card-title text-sm">Source & Agent</h3><dl class="space-y-2 mt-2 text-sm"><div><dt class="text-base-content/50">Source</dt><dd>{{opportunity.source||'—'}}</dd></div><div><dt class="text-base-content/50">Agent</dt><dd>{{opportunity.agentName||'—'}}</dd></div><div><dt class="text-base-content/50">Owner</dt><dd>{{opportunity.landOwnerName||'—'}}</dd></div></dl></div></div>
        </div>
      }

      <!-- DUE DILIGENCE TAB -->
      @if (activeTab==='dd') {
        @if (dueDiligences.length===0 && !showDdForm()) {
          <app-empty-state title="No Due Diligence Checks" message="Add legal, environmental, planning, utilities, or valuation checks to assess risk.">
            <div class="flex flex-col items-center gap-3"><button class="btn btn-primary btn-sm" (click)="showDdForm.set(true)">Add Due Diligence Check</button><a routerLink="/help/land-acquisition/la-due-diligence" class="text-xs text-primary hover:underline">What is due diligence? →</a></div>
          </app-empty-state>
        } @else {
          @if (!showDdForm() && !editingDdId()) { <div class="flex justify-end mb-4"><button class="btn btn-primary btn-sm" (click)="showDdForm.set(true)">+ Add Check</button></div> }
          @if (showDdForm()) {
            <div class="card bg-base-100 border border-primary/30 shadow-sm mb-4"><div class="card-body">
              <h3 class="font-semibold mb-3">New Due Diligence Check</h3>
              <form [formGroup]="ddForm" (ngSubmit)="createDueDiligence()"><div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <app-form-field label="Type" fieldId="ddType" [required]="true"><select id="ddType" formControlName="type" class="select select-bordered w-full"><option value="">Select...</option><option value="Legal">Legal</option><option value="Environmental">Environmental</option><option value="Planning">Planning</option><option value="Utilities">Utilities</option><option value="Valuation">Valuation</option></select></app-form-field>
                <app-form-field label="Assigned To" fieldId="ddAssigned"><input id="ddAssigned" type="text" formControlName="assignedTo" class="input input-bordered w-full" /></app-form-field>
                <app-form-field label="Notes" fieldId="ddNotes"><input id="ddNotes" type="text" formControlName="notes" class="input input-bordered w-full" /></app-form-field>
              </div><div class="flex justify-end gap-2 mt-4"><button type="button" class="btn btn-ghost btn-sm" (click)="showDdForm.set(false)">Cancel</button><button type="submit" class="btn btn-primary btn-sm" [disabled]="ddForm.invalid">Create</button></div></form>
            </div></div>
          }
          @if (dueDiligences.length>0) {
            <div class="space-y-3">
              @for (dd of dueDiligences; track dd.id) {
                <div class="card bg-base-100 border border-base-300">
                  <div class="card-body p-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <span class="badge badge-sm" [class]="getDdStatusClass(dd.status)">{{dd.status}}</span>
                        <span class="font-medium text-sm">{{dd.type}}</span>
                        <span class="text-xs text-base-content/50">{{dd.assignedTo||'Unassigned'}}</span>
                      </div>
                      <div class="flex gap-1">
                        @if (dd.status==='Pending') { <button class="btn btn-info btn-xs" (click)="updateDdStatus(dd.id,'InProgress')">Start</button> }
                        @if (dd.status==='InProgress') {
                          <button class="btn btn-success btn-xs" (click)="updateDdStatus(dd.id,'Completed')">Complete</button>
                          <button class="btn btn-error btn-xs" (click)="updateDdStatus(dd.id,'Failed')">Fail</button>
                        }
                      </div>
                    </div>
                    @if (dd.riskLevel) { <p class="text-xs mt-2">Risk: <strong>{{dd.riskLevel}}</strong></p> }
                  </div>
                </div>
              }
            </div>
          }
        }
      }

      <!-- OFFERS TAB -->
      @if (activeTab==='offers') {
        @if (offers.length===0 && !showOfferForm()) {
          <app-empty-state title="No Offers Made Yet" message="Submit an offer once due diligence is satisfactory.">
            <div class="flex flex-col items-center gap-3"><button class="btn btn-primary btn-sm" (click)="showOfferForm.set(true)">Make an Offer</button><a routerLink="/help/land-acquisition/la-offers" class="text-xs text-primary hover:underline">How do offers work? →</a></div>
          </app-empty-state>
        } @else {
          @if (!showOfferForm()) { <div class="flex justify-end mb-4"><button class="btn btn-primary btn-sm" (click)="showOfferForm.set(true)">+ New Offer</button></div> }
          @if (showOfferForm()) {
            <div class="card bg-base-100 border border-primary/30 shadow-sm mb-4"><div class="card-body">
              <h3 class="font-semibold mb-3">New Offer</h3>
              <form [formGroup]="offerForm" (ngSubmit)="createOffer()"><div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <app-form-field label="Amount (£)" fieldId="offerAmt" [required]="true"><input id="offerAmt" type="number" formControlName="amount" class="input input-bordered w-full" /></app-form-field>
                <app-form-field label="Valid Until" fieldId="offerValid"><input id="offerValid" type="date" formControlName="validUntil" class="input input-bordered w-full" /></app-form-field>
                <app-form-field label="Conditions" fieldId="offerCond"><input id="offerCond" type="text" formControlName="conditions" class="input input-bordered w-full" /></app-form-field>
              </div><div class="flex justify-end gap-2 mt-4"><button type="button" class="btn btn-ghost btn-sm" (click)="showOfferForm.set(false)">Cancel</button><button type="submit" class="btn btn-primary btn-sm" [disabled]="offerForm.invalid">Submit Offer</button></div></form>
            </div></div>
          }
          @if (offers.length>0) {
            <div class="overflow-x-auto"><table class="table table-zebra w-full"><thead><tr><th>Amount</th><th>Date</th><th>Valid Until</th><th>Status</th><th>Counter</th><th>Actions</th></tr></thead><tbody>
              @for (offer of offers; track offer.id) {
                <tr><td class="font-medium">£{{offer.amount|number:'1.0-0'}}</td><td>{{offer.offerDate|date:'mediumDate'}}</td><td>{{offer.validUntil?(offer.validUntil|date:'mediumDate'):'—'}}</td><td><span class="badge badge-sm" [class]="getOfferStatusClass(offer.status)">{{offer.status}}</span></td><td>{{offer.counterOfferAmount?('£'+(offer.counterOfferAmount|number:'1.0-0')):'—'}}</td>
                <td>@if(offer.status==='UnderReview'){<div class="flex gap-1"><button class="btn btn-success btn-xs" (click)="changeOfferStatus(offer.id,'Accepted')">Accept</button><button class="btn btn-error btn-xs" (click)="changeOfferStatus(offer.id,'Rejected')">Reject</button></div>}</td></tr>
              }
            </tbody></table></div>
          }
        }
      }

      <!-- DOCUMENTS TAB -->
      @if (activeTab==='docs') {
        @if (documents.length===0 && !showDocForm()) {
          <app-empty-state title="No Documents Attached" message="Attach title deeds, search reports, environmental assessments, or contracts.">
            <button class="btn btn-primary btn-sm" (click)="showDocForm.set(true)">Upload Document</button>
          </app-empty-state>
        } @else {
          @if (!showDocForm()) { <div class="flex justify-end mb-4"><button class="btn btn-primary btn-sm" (click)="showDocForm.set(true)">+ Upload Document</button></div> }
          @if (showDocForm()) {
            <div class="card bg-base-100 border border-primary/30 shadow-sm mb-4"><div class="card-body">
              <h3 class="font-semibold mb-3">Upload Document</h3>
              <form [formGroup]="docForm" (ngSubmit)="createDocument()"><div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <app-form-field label="File Name" fieldId="docName" [required]="true"><input id="docName" type="text" formControlName="fileName" class="input input-bordered w-full" placeholder="e.g., Title_Deed_2024.pdf" /></app-form-field>
                <app-form-field label="Document Type" fieldId="docType" [required]="true"><select id="docType" formControlName="docType" class="select select-bordered w-full"><option value="">Select...</option><option value="TitleDeed">Title Deed</option><option value="SearchReport">Search Report</option><option value="LegalDocument">Legal Document</option><option value="EnvironmentalReport">Environmental Report</option><option value="PlanningDocument">Planning Document</option><option value="ValuationReport">Valuation Report</option><option value="Contract">Contract</option><option value="Other">Other</option></select></app-form-field>
                <app-form-field label="Description" fieldId="docDesc"><input id="docDesc" type="text" formControlName="description" class="input input-bordered w-full" /></app-form-field>
              </div><div class="flex justify-end gap-2 mt-4"><button type="button" class="btn btn-ghost btn-sm" (click)="showDocForm.set(false)">Cancel</button><button type="submit" class="btn btn-primary btn-sm" [disabled]="docForm.invalid">Upload</button></div></form>
            </div></div>
          }
          @if (documents.length>0) {
            <div class="space-y-2">
              @for (doc of documents; track doc.id) {
                <div class="flex items-center justify-between p-3 bg-base-100 border border-base-300 rounded-lg">
                  <div class="flex items-center gap-3">
                    <span class="text-lg">{{getDocIcon(doc.docType)}}</span>
                    <div><p class="text-sm font-medium">{{doc.fileName}}</p><p class="text-xs text-base-content/50">{{doc.docType}} · {{formatFileSize(doc.fileSizeBytes)}} · {{doc.createdAt|date:'mediumDate'}}</p></div>
                  </div>
                  <button class="btn btn-ghost btn-xs text-error" (click)="deleteDocument(doc.id)">Delete</button>
                </div>
              }
            </div>
          }
        }
      }

      <!-- ACTIVITY TAB -->
      @if (activeTab==='activity') {
        @if (activities.length===0) {
          <app-empty-state title="No Activity Yet" message="Activity will appear here once changes are made."></app-empty-state>
        } @else {
          <div class="space-y-3">
            @for (item of activities; track item.id) {
              <div class="flex items-start gap-3 p-3 bg-base-100 border border-base-300 rounded-lg">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm" [class]="getActivityBg(item.action)">{{getActivityEmoji(item.action)}}</div>
                <div class="flex-1"><p class="text-sm"><strong>{{item.userName}}</strong> {{getActivityVerb(item.action)}} <span class="text-base-content/60">{{item.entityName}}</span></p>
                @if(item.affectedColumns){<p class="text-xs text-base-content/50 mt-1">Changed: {{item.affectedColumns}}</p>}
                <p class="text-xs text-base-content/40 mt-1">{{item.timestamp|date:'medium'}}</p></div>
              </div>
            }
          </div>
        }
      }

      <!-- ACQUISITION TAB -->
      @if (activeTab==='acquisition') {
        @if (acquisitionRecord) {
          <div class="card bg-base-100 border border-base-300 shadow-sm">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold">Acquisition Record</h3>
                <span class="badge badge-success">{{acquisitionRecord.status}}</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><dt class="text-xs text-base-content/50">Purchase Price</dt><dd class="font-bold text-lg">£{{acquisitionRecord.purchasePrice|number:'1.0-0'}}</dd></div>
                <div><dt class="text-xs text-base-content/50">Completion Date</dt><dd class="font-medium">{{acquisitionRecord.completionDate|date:'mediumDate'}}</dd></div>
                <div><dt class="text-xs text-base-content/50">Registry Reference</dt><dd>{{acquisitionRecord.registryReference||'Pending'}}</dd></div>
                <div><dt class="text-xs text-base-content/50">Solicitor</dt><dd>{{acquisitionRecord.solicitorName||'—'}}</dd></div>
                <div><dt class="text-xs text-base-content/50">Solicitor Contact</dt><dd>{{acquisitionRecord.solicitorContact||'—'}}</dd></div>
                <div><dt class="text-xs text-base-content/50">Notes</dt><dd>{{acquisitionRecord.notes||'—'}}</dd></div>
              </div>
            </div>
          </div>
        } @else if (!showAcquisitionForm()) {
          <app-empty-state title="Not Yet Acquired" message="Once contracts are exchanged and the purchase is complete, record the acquisition details here. This moves the opportunity to 'Acquired' status.">
            <button class="btn btn-primary btn-sm" (click)="showAcquisitionForm.set(true)" [disabled]="opportunity.status==='Withdrawn'">Record Acquisition</button>
          </app-empty-state>
        }
        @if (showAcquisitionForm() && !acquisitionRecord) {
          <div class="card bg-base-100 border border-primary/30 shadow-sm"><div class="card-body">
            <h3 class="font-semibold mb-3">Record Acquisition Completion</h3>
            <form [formGroup]="acquisitionForm" (ngSubmit)="createAcquisition()">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <app-form-field label="Purchase Price (£)" fieldId="acqPrice" [required]="true" helpTooltip="The final agreed purchase price"><input id="acqPrice" type="number" formControlName="purchasePrice" class="input input-bordered w-full" /></app-form-field>
                <app-form-field label="Completion Date" fieldId="acqDate" [required]="true" helpTooltip="Date the purchase was legally completed"><input id="acqDate" type="date" formControlName="completionDate" class="input input-bordered w-full" /></app-form-field>
                <app-form-field label="Land Registry Reference" fieldId="acqReg" helpTooltip="Registry reference number (if already registered)"><input id="acqReg" type="text" formControlName="registryReference" class="input input-bordered w-full" placeholder="e.g., LR12345" /></app-form-field>
                <app-form-field label="Solicitor Name" fieldId="acqSol"><input id="acqSol" type="text" formControlName="solicitorName" class="input input-bordered w-full" /></app-form-field>
                <app-form-field label="Solicitor Contact" fieldId="acqSolC"><input id="acqSolC" type="text" formControlName="solicitorContact" class="input input-bordered w-full" /></app-form-field>
                <app-form-field label="Notes" fieldId="acqNotes"><input id="acqNotes" type="text" formControlName="notes" class="input input-bordered w-full" /></app-form-field>
              </div>
              <div class="flex justify-end gap-2 mt-4"><button type="button" class="btn btn-ghost btn-sm" (click)="showAcquisitionForm.set(false)">Cancel</button><button type="submit" class="btn btn-primary btn-sm" [disabled]="acquisitionForm.invalid">Complete Acquisition</button></div>
            </form>
          </div></div>
        }
      }

      <div class="mt-6"><a routerLink="/opportunities" class="btn btn-ghost btn-sm">← Back to List</a></div>
    } @else {
      <div class="card bg-base-100 border border-base-300 p-8 text-center"><div class="text-4xl mb-4">🔍</div><h3 class="text-lg font-semibold">Opportunity Not Found</h3><a routerLink="/opportunities" class="btn btn-primary btn-sm mt-4">Back to Opportunities</a></div>
    }
  `
})
export class OpportunityDetailComponent implements OnInit {
  opportunity: OpportunityDetail | null = null;
  loading = true;
  activeTab = 'details';
  opportunityId = '';

  dueDiligences: DueDiligenceListItem[] = [];
  offers: OfferListItem[] = [];
  documents: DocumentListItem[] = [];
  activities: ActivityItem[] = [];
  acquisitionRecord: AcquisitionRecord | null = null;

  showDdForm = signal(false);
  showOfferForm = signal(false);
  showDocForm = signal(false);
  showAcquisitionForm = signal(false);
  editingDdId = signal<string | null>(null);

  ddForm: FormGroup;
  offerForm: FormGroup;
  docForm: FormGroup;
  acquisitionForm: FormGroup;

  constructor(
    private route: ActivatedRoute, private router: Router, private fb: FormBuilder,
    private opportunityService: OpportunityService, private ddService: DueDiligenceService,
    private offerService: OfferService, private documentService: DocumentService,
    private activityService: ActivityService, private acquisitionService: AcquisitionService,
    private modalService: ModalService,
    private toastService: ToastService, private cdr: ChangeDetectorRef
  ) {
    this.ddForm = this.fb.group({ type: ['', Validators.required], assignedTo: [''], notes: [''] });
    this.offerForm = this.fb.group({ amount: [null, [Validators.required, Validators.min(1)]], validUntil: [''], conditions: [''] });
    this.docForm = this.fb.group({ fileName: ['', Validators.required], docType: ['', Validators.required], description: [''] });
    this.acquisitionForm = this.fb.group({
      purchasePrice: [null, [Validators.required, Validators.min(1)]],
      completionDate: ['', Validators.required],
      registryReference: [''],
      solicitorName: [''],
      solicitorContact: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.opportunityId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.opportunityId) this.loadOpportunity();
    else this.loading = false;
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'dd' && this.dueDiligences.length === 0) this.loadDueDiligences();
    if (tab === 'offers' && this.offers.length === 0) this.loadOffers();
    if (tab === 'docs' && this.documents.length === 0) this.loadDocuments();
    if (tab === 'activity' && this.activities.length === 0) this.loadActivity();
    if (tab === 'acquisition' && !this.acquisitionRecord) this.loadAcquisition();
  }

  private loadOpportunity(): void {
    this.opportunityService.getById(this.opportunityId).subscribe({
      next: r => { this.opportunity = r.data; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }
  private loadDueDiligences(): void { this.ddService.getByOpportunity(this.opportunityId).subscribe({ next: r => { this.dueDiligences = r.data ?? []; this.cdr.markForCheck(); } }); }
  private loadOffers(): void { this.offerService.getByOpportunity(this.opportunityId).subscribe({ next: r => { this.offers = r.data ?? []; this.cdr.markForCheck(); } }); }
  private loadDocuments(): void { this.documentService.getByOpportunity(this.opportunityId).subscribe({ next: r => { this.documents = r.data ?? []; this.cdr.markForCheck(); } }); }
  private loadActivity(): void { this.activityService.getByOpportunity(this.opportunityId).subscribe({ next: r => { this.activities = r.data ?? []; this.cdr.markForCheck(); } }); }

  createDueDiligence(): void {
    if (this.ddForm.invalid) return;
    this.ddService.create(this.opportunityId, this.ddForm.value).subscribe({
      next: r => { if (r.data) this.dueDiligences = [r.data, ...this.dueDiligences]; this.ddForm.reset(); this.showDdForm.set(false); this.toastService.success('Due diligence check created'); this.cdr.markForCheck(); },
      error: () => this.toastService.error('Failed to create due diligence check')
    });
  }

  updateDdStatus(id: string, status: DueDiligenceStatus): void {
    this.ddService.update(this.opportunityId, id, { status }).subscribe({
      next: () => {
        const idx = this.dueDiligences.findIndex(d => d.id === id);
        if (idx >= 0) { this.dueDiligences[idx] = { ...this.dueDiligences[idx], status }; this.dueDiligences = [...this.dueDiligences]; }
        this.toastService.success(`Due diligence marked as ${status}`);
        this.cdr.markForCheck();
      },
      error: () => this.toastService.error('Failed to update status')
    });
  }

  createOffer(): void {
    if (this.offerForm.invalid) return;
    const req = { ...this.offerForm.value, validUntil: this.offerForm.value.validUntil || undefined };
    this.offerService.create(this.opportunityId, req).subscribe({
      next: r => { if (r.data) this.offers = [r.data, ...this.offers]; this.offerForm.reset(); this.showOfferForm.set(false); this.toastService.success('Offer submitted'); this.cdr.markForCheck(); },
      error: () => this.toastService.error('Failed to submit offer')
    });
  }

  changeOfferStatus(offerId: string, newStatus: OfferStatus): void {
    this.offerService.changeStatus(this.opportunityId, offerId, { newStatus }).subscribe({
      next: r => { if (r.data) { const i = this.offers.findIndex(o => o.id === offerId); if (i >= 0) this.offers[i] = r.data; this.offers = [...this.offers]; } this.toastService.success(`Offer ${newStatus.toLowerCase()}`); this.cdr.markForCheck(); },
      error: () => this.toastService.error('Failed to update offer')
    });
  }

  createDocument(): void {
    if (this.docForm.invalid) return;
    const req = { ...this.docForm.value, fileSizeBytes: 0, filePath: `/uploads/${this.docForm.value.fileName}` };
    this.documentService.create(this.opportunityId, req).subscribe({
      next: r => { if (r.data) this.documents = [r.data, ...this.documents]; this.docForm.reset(); this.showDocForm.set(false); this.toastService.success('Document uploaded'); this.cdr.markForCheck(); },
      error: () => this.toastService.error('Failed to upload document')
    });
  }

  deleteDocument(docId: string): void {
    this.modalService.confirm({ title: 'Delete Document', message: 'Are you sure you want to delete this document?', confirmText: 'Delete', type: 'danger' }).subscribe(ok => {
      if (ok) {
        this.documentService.delete(this.opportunityId, docId).subscribe({
          next: () => { this.documents = this.documents.filter(d => d.id !== docId); this.toastService.success('Document deleted'); this.cdr.markForCheck(); },
          error: () => this.toastService.error('Failed to delete document')
        });
      }
    });
  }

  private loadAcquisition(): void {
    this.acquisitionService.getByOpportunity(this.opportunityId).subscribe({
      next: r => { this.acquisitionRecord = r.data ?? null; this.cdr.markForCheck(); }
    });
  }

  createAcquisition(): void {
    if (this.acquisitionForm.invalid) return;
    this.acquisitionService.create(this.opportunityId, this.acquisitionForm.value).subscribe({
      next: r => {
        this.acquisitionRecord = r.data ?? null;
        this.showAcquisitionForm.set(false);
        this.toastService.success('Acquisition recorded — opportunity marked as Acquired');
        if (this.opportunity) this.opportunity = { ...this.opportunity, status: 'Acquired' };
        this.cdr.markForCheck();
      },
      error: (err) => this.toastService.error(err.error?.errors?.[0] ?? 'Failed to record acquisition')
    });
  }

  confirmWithdraw(): void {
    this.modalService.confirm({ title: 'Withdraw Opportunity', message: `Withdraw "${this.opportunity?.name}"?`, confirmText: 'Withdraw', type: 'warning' }).subscribe(ok => {
      if (ok) this.opportunityService.changeStatus(this.opportunityId, 'Withdrawn').subscribe({ next: () => { this.toastService.success('Opportunity withdrawn'); this.router.navigate(['/opportunities']); } });
    });
  }

  confirmDelete(): void {
    this.modalService.confirm({ title: 'Delete Opportunity', message: `Permanently delete "${this.opportunity?.name}"?`, confirmText: 'Delete', type: 'danger' }).subscribe(ok => {
      if (ok) this.opportunityService.delete(this.opportunityId).subscribe({ next: () => { this.toastService.success('Opportunity deleted'); this.router.navigate(['/opportunities']); } });
    });
  }

  getDdStatusClass(s: DueDiligenceStatus): string { return { Pending: 'badge-ghost', InProgress: 'badge-info', Completed: 'badge-success', Failed: 'badge-error' }[s] ?? 'badge-ghost'; }
  getOfferStatusClass(s: OfferStatus): string { return { UnderReview: 'badge-warning', Accepted: 'badge-success', Rejected: 'badge-error', CounterOffered: 'badge-info', Withdrawn: 'badge-ghost' }[s] ?? 'badge-ghost'; }
  getDocIcon(t: DocumentType): string { return { TitleDeed: '📜', SearchReport: '🔍', LegalDocument: '⚖️', EnvironmentalReport: '🌿', PlanningDocument: '📐', ValuationReport: '💰', Contract: '📝', Other: '📄' }[t] ?? '📄'; }
  formatFileSize(bytes: number): string { if (!bytes) return '—'; if (bytes < 1024) return bytes + 'B'; if (bytes < 1048576) return (bytes / 1024).toFixed(1) + 'KB'; return (bytes / 1048576).toFixed(1) + 'MB'; }
  getActivityBg(a: string): string { return { Create: 'bg-success/20', Update: 'bg-info/20', Delete: 'bg-error/20' }[a] ?? 'bg-base-300'; }
  getActivityEmoji(a: string): string { return { Create: '✨', Update: '✏️', Delete: '🗑️' }[a] ?? '📋'; }
  getActivityVerb(a: string): string { return { Create: 'created', Update: 'updated', Delete: 'deleted' }[a] ?? a.toLowerCase(); }
}
