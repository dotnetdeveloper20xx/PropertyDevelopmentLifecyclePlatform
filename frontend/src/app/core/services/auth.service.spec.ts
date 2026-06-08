import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn should return false when no token', () => {
    expect(service.isLoggedIn).toBe(false);
  });

  it('login should store token and user on success', () => {
    const mockResponse = {
      data: {
        accessToken: 'test-token',
        refreshToken: 'refresh-token',
        accessTokenExpiresAt: '2026-01-01',
        user: { id: '1', email: 'admin@test.com', firstName: 'Admin', lastName: 'User', roles: ['SuperAdmin'] }
      },
      success: true, errors: []
    };
    service.login({ email: 'admin@test.com', password: 'pass' }).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush(mockResponse);
    expect(service.isLoggedIn).toBe(true);
    expect(service.currentUser?.email).toBe('admin@test.com');
  });

  it('logout should clear stored data', () => {
    localStorage.setItem('buildEstate_accessToken', 'token');
    service.logout();
    expect(service.isLoggedIn).toBe(false);
    expect(service.currentUser).toBeNull();
  });
});
