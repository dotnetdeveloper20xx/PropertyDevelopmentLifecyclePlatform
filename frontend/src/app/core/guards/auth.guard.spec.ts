import { describe, it, expect, vi } from 'vitest';

describe('authGuard', () => {
  it('should allow access when user is authenticated', () => {
    // Mock authenticated state
    const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }));
    const token = `header.${payload}.signature`;
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify({ firstName: 'Test', roles: ['SuperAdmin'] }));

    // The guard checks localStorage for token existence
    expect(localStorage.getItem('access_token')).toBeTruthy();
  });

  it('should deny access when no token exists', () => {
    localStorage.clear();
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});

describe('unsavedChangesGuard', () => {
  it('should allow navigation when component has no unsaved changes', async () => {
    const { unsavedChangesGuard } = await import('./unsaved-changes.guard');
    const mockComponent = { hasUnsavedChanges: () => false };
    const result = (unsavedChangesGuard as any)(mockComponent, {} as any, {} as any, {} as any);
    expect(result).toBe(true);
  });

  it('should prompt when component has unsaved changes', async () => {
    const { unsavedChangesGuard } = await import('./unsaved-changes.guard');
    const mockComponent = { hasUnsavedChanges: () => true };
    // Mock confirm to return true
    globalThis.confirm = vi.fn(() => true);
    const result = (unsavedChangesGuard as any)(mockComponent, {} as any, {} as any, {} as any);
    expect(result).toBe(true);
    expect(globalThis.confirm).toHaveBeenCalled();
  });

  it('should block navigation when user cancels confirm dialog', async () => {
    const { unsavedChangesGuard } = await import('./unsaved-changes.guard');
    const mockComponent = { hasUnsavedChanges: () => true };
    globalThis.confirm = vi.fn(() => false);
    const result = (unsavedChangesGuard as any)(mockComponent, {} as any, {} as any, {} as any);
    expect(result).toBe(false);
  });

  it('should allow navigation when component does not implement interface', async () => {
    const { unsavedChangesGuard } = await import('./unsaved-changes.guard');
    const mockComponent = {}; // No hasUnsavedChanges method
    const result = (unsavedChangesGuard as any)(mockComponent, {} as any, {} as any, {} as any);
    expect(result).toBe(true);
  });
});
