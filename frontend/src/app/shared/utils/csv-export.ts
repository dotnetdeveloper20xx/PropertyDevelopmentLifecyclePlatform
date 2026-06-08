/**
 * Shared CSV export utility.
 * Generates a CSV file from tabular data and triggers browser download.
 */
export function exportToCsv(fileName: string, headers: string[], rows: string[][]): void {
  const escapeCsv = (value: string): string => `"${(value ?? '').replace(/"/g, '""')}"`;
  const csvContent = [
    headers.map(escapeCsv).join(','),
    ...rows.map(row => row.map(escapeCsv).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
