import { describe, it, expect, beforeEach } from 'vitest';
import { ToastService } from './toast.service';
import { firstValueFrom } from 'rxjs';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    service = new ToastService();
  });

  it('should add a success toast', async () => {
    service.success('Operation complete');
    const toasts = await firstValueFrom(service.toasts$);
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].message).toBe('Operation complete');
  });

  it('should add an error toast', async () => {
    service.error('Something went wrong');
    const toasts = await firstValueFrom(service.toasts$);
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe('error');
    expect(toasts[0].message).toBe('Something went wrong');
  });

  it('should add an info toast', async () => {
    service.info('FYI');
    const toasts = await firstValueFrom(service.toasts$);
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe('info');
  });

  it('should add a warning toast', async () => {
    service.warning('Watch out');
    const toasts = await firstValueFrom(service.toasts$);
    expect(toasts.length).toBe(1);
    expect(toasts[0].type).toBe('warning');
  });

  it('should dismiss a toast by id', async () => {
    service.success('First', 0);
    service.success('Second', 0);
    let toasts = await firstValueFrom(service.toasts$);
    expect(toasts.length).toBe(2);
    service.dismiss(toasts[0].id);
    toasts = await firstValueFrom(service.toasts$);
    expect(toasts.length).toBe(1);
    expect(toasts[0].message).toBe('Second');
  });

  it('should accumulate multiple toasts', async () => {
    service.success('One', 0);
    service.error('Two', 0);
    service.info('Three', 0);
    const toasts = await firstValueFrom(service.toasts$);
    expect(toasts.length).toBe(3);
  });
});
