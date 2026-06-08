import { describe, it, expect, vi } from 'vitest';
import { exportToCsv } from './csv-export';

describe('exportToCsv', () => {
  beforeEach(() => {
    // Mock DOM APIs for download
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:mock'), revokeObjectURL: vi.fn() });
    vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: vi.fn(),
      setAttribute: vi.fn()
    } as any);
    vi.spyOn(document.body, 'appendChild').mockImplementation((el) => el);
    vi.spyOn(document.body, 'removeChild').mockImplementation((el) => el);
  });

  it('should not throw when called with valid data', () => {
    expect(() => {
      exportToCsv('test.csv', ['Name', 'Status'], [['Opportunity 1', 'Active'], ['Opportunity 2', 'Closed']]);
    }).not.toThrow();
  });

  it('should handle empty data array', () => {
    expect(() => {
      exportToCsv('empty.csv', ['Name', 'Status'], []);
    }).not.toThrow();
  });

  it('should handle data with special characters', () => {
    expect(() => {
      exportToCsv('special.csv', ['Name', 'Description'], [['Test "quoted"', 'Contains, comma']]);
    }).not.toThrow();
  });
});
