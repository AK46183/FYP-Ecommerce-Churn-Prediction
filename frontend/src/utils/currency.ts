export const USD_TO_PKR = 277.31

export function usdToPkr(
  usd: number,
): number {
  return Math.round(
    usd * USD_TO_PKR,
  )
}

export function formatPKR(
  usd: number,
): string {
  const pkr = usdToPkr(usd)

  return `Rs. ${pkr.toLocaleString(
    'en-PK',
  )}`
}