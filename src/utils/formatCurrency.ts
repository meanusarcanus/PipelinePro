export const CURRENCY_SYMBOL = '₱';
export const CURRENCY_CODE = 'PHP';

export const formatCurrency = (amount: number, compact: boolean = false): string => {
  if (compact) {
    if (Math.abs(amount) >= 1_000_000) {
      return `₱${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `₱${(amount / 1_000).toFixed(0)}k`;
    }
    return `₱${amount.toLocaleString()}`;
  }
  return `₱${amount.toLocaleString()}`;
};
