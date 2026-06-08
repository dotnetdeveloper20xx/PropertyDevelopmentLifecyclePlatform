import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OpportunityService } from './opportunity.service';
import { environment } from '../../../environments/environment';

describe('OpportunityService', () => {
  let service: OpportunityService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OpportunityService]
    });
    service = TestBed.inject(OpportunityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll should make GET request with params', () => {
    service.getAll({ page: 1, pageSize: 20, search: 'test' }).subscribe();
    const req = httpMock.expectOne(r => r.url.includes('/opportunities') && r.params.has('search'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('search')).toBe('test');
    expect(req.request.params.get('page')).toBe('1');
    req.flush({ data: [], success: true, errors: [] });
  });

  it('getById should make GET request with id', () => {
    const id = '123';
    service.getById(id).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/opportunities/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: {}, success: true, errors: [] });
  });

  it('create should make POST request', () => {
    const request = { name: 'Test', location: 'London', landSize: 2.5 };
    service.create(request as any).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/opportunities`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush({ data: { id: '1', name: 'Test', status: 'Identified' }, success: true, errors: [] });
  });

  it('getStats should make GET request to stats endpoint', () => {
    service.getStats().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/opportunities/stats`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: { totalOpportunities: 5 }, success: true, errors: [] });
  });
});
