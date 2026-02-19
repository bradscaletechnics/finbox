/**
 * Canadian Currency Formatting Utilities
 * All amounts in FinBox are in Canadian Dollars (CAD)
 */

/**
 * Format number as Canadian currency
 * @param amount - Amount in CAD
 * @param includeSymbol - Whether to include $ symbol (default: true)
 * @returns Formatted string (e.g., "$150,000" or "150,000")
 */
export function formatCAD(amount: number | string, includeSymbol: boolean = true): string {
  const num = typeof amount === "string" ? parseFloat(amount.replace(/[^0-9.-]/g, "")) : amount;

  if (isNaN(num)) return includeSymbol ? "$0" : "0";

  const formatted = num.toLocaleString("en-CA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return includeSymbol ? `$${formatted}` : formatted;
}

/**
 * Format number as Canadian currency with cents
 * @param amount - Amount in CAD
 * @returns Formatted string with 2 decimal places (e.g., "$1,234.56")
 */
export function formatCADWithCents(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount.replace(/[^0-9.-]/g, "")) : amount;

  if (isNaN(num)) return "$0.00";

  return `$${num.toLocaleString("en-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Parse CAD string to number
 * @param cadString - String like "$150,000" or "150000"
 * @returns Number value
 */
export function parseCAD(cadString: string): number {
  const cleaned = cadString.replace(/[^0-9.-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Format large CAD amounts with abbreviations
 * @param amount - Amount in CAD
 * @returns Formatted string (e.g., "$1.5M", "$250K")
 */
export function formatCADShort(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount.replace(/[^0-9.-]/g, "")) : amount;

  if (isNaN(num)) return "$0";

  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(0)}K`;
  }
  return `$${num.toFixed(0)}`;
}

/**
 * Format as percentage for Canadian tax rates
 * @param rate - Rate as decimal (0.4580) or percentage (45.80)
 * @param asDecimal - Whether input is decimal (default: false, expects percentage)
 * @returns Formatted string (e.g., "45.80%")
 */
export function formatTaxRate(rate: number, asDecimal: boolean = false): string {
  const percentage = asDecimal ? rate * 100 : rate;
  return `${percentage.toFixed(2)}%`;
}
