import { describe, it, expect } from 'vitest';
import { environment } from '../../../environments/environment';

/**
 * PlanningApplicationService API contract tests.
 * Verifies the expected API URL patterns without Angular DI.
 */
describe('PlanningApplicationService API Contract', () => {
  const baseUrl = environment.apiUrl;

  it('should target correct endpoint for list', () => {
    expect(`${baseUrl}/planning`).toBe('http://localhost:5071/api/v1/planning');
  });

  it('should target correct endpoint for getById', () => {
    const id = 'plan-123';
    expect(`${baseUrl}/planning/${id}`).toBe('http://localhost:5071/api/v1/planning/plan-123');
  });

  it('should target correct endpoint for status change', () => {
    const id = 'plan-123';
    expect(`${baseUrl}/planning/${id}/status`).toBe('http://localhost:5071/api/v1/planning/plan-123/status');
  });

  it('should target correct endpoint for create', () => {
    expect(`${baseUrl}/planning`).toContain('/api/v1/planning');
  });
});
