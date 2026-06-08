import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlanningApplicationService } from './planning.service';
import { environment } from '../../../environments/environment';

describe('PlanningApplicationService', () => {
  let service: PlanningApplicationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlanningApplicationService]
    });
    service = TestBed.inject(PlanningApplicationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll should make GET request', () => {
    service.getAll({ page: 1, pageSize: 10 }).subscribe();
    const req = httpMock.expectOne(r => r.url.includes('/planning-applications'));
    expect(req.request.method).toBe('GET');
    req.flush({ data: [], success: true, errors: [], pagination: { page: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false } });
  });

  it('create should make POST request', () => {
    const request = { opportunityId: '1', applicationReference: 'PA/001', description: 'Test', localAuthority: 'Council', applicationType: 'Full' };
    service.create(request as any).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/planning-applications`);
    expect(req.request.method).toBe('POST');
    req.flush({ data: { id: '1' }, success: true, errors: [] });
  });

  it('changeStatus should make PATCH request', () => {
    service.changeStatus('123', 'Submitted').subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/planning-applications/123/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ newStatus: 'Submitted' });
    req.flush(null);
  });
});
