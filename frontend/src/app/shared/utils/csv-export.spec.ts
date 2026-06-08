import { exportToCsv } from './csv-export';

describe('exportToCsv', () => {
  let createElementSpy: jasmine.Spy;
  let clickSpy: jasmine.Spy;
  let revokeObjectURLSpy: jasmine.Spy;

  beforeEach(() => {
    clickSpy = jasmine.createSpy('click');
    createElementSpy = spyOn(document, 'createElement').and.returnValue({
      href: '',
      download: '',
      click: clickSpy
    } as any);
    spyOn(URL, 'createObjectURL').and.returnValue('blob:test');
    revokeObjectURLSpy = spyOn(URL, 'revokeObjectURL');
  });

  it('should create a download link and click it', () => {
    exportToCsv('test', ['Name', 'Value'], [['Item1', '100'], ['Item2', '200']]);
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test');
  });

  it('should handle empty data', () => {
    exportToCsv('empty', ['Col1'], []);
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should escape quotes in values', () => {
    exportToCsv('quoted', ['Name'], [['Value with "quotes"']]);
    expect(clickSpy).toHaveBeenCalled();
  });
});
