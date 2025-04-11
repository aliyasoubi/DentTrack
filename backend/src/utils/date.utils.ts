export function calculateDaysUntil(date: Date): number {
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isValidDate(date: string): boolean {
  const timestamp = Date.parse(date);
  return !isNaN(timestamp);
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
} 