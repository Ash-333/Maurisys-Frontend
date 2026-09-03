/**
 * Nepalese Rupee formatting, used everywhere a price is shown.
 *
 * Grouping is lakh-style (रु 1,20,000 rather than रु 120,000), which is the
 * South Asian convention — `en-IN` produces exactly that. The symbol is kept
 * separate from Intl's own currency formatting because Intl renders NPR as
 * "NPR" or "Rs", not रु.
 *
 * Mirrors formatNPR() in Maurisys-Backend/services/quote/computeQuote.js —
 * if you change the format here, change it there too so chatbot quotes and
 * page prices look the same.
 */
export const formatNPR = (amount) => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return '';
  return `रु ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n)}`;
};

export default formatNPR;
