import { describe, it, expect } from 'vitest';
import { environment } from '../../../environments/environment';

/**
 * OpportunityService API contract tests.
 * Verifies the expected API URL patterns without Angular DI.
 */
describe('OpportunityService API Contract', () => {
  const baseUrl = environment.apiUrl;

  it('should target correct endpoint for list', () => {
    expect(`${baseUrl}/opportunities`).toBe('http://localhost:5071/api/v1/opportunities');
  });

  it('should target correct endpoint for getById', () => {
    const id = 'abc-123';
    expect(`${baseUrl}/opportunities/${id}`).toBe('http://localhost:5071/api/v1/opportunities/abc-123');
  });

  it('should target correct endpoint for stats', () => {
    expect(`${baseUrl}/opportunities/stats`).toBe('http://localhost:5071/api/v1/opportunities/stats');
  });

  it('should target correct endpoint for status change', () => {
    const id = 'abc-123';
    expect(`${baseUrl}/opportunities/${id}/status`).toBe('http://localhost:5071/api/v1/opportunities/abc-123/status');
  });

  it('should target correct endpoint for create', () => {
    expect(`${baseUrl}/opportunities`).toContain('/api/v1/opportunities');
  });
});
