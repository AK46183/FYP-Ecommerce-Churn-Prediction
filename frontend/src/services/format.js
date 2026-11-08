export function formatPKR(amount) {
  if (typeof amount !== 'number') return ''
  return `PKR ${amount.toLocaleString('en-PK')}`
}
