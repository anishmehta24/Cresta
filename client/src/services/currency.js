const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
export const formatINR = (value) => {
  const num = Number(value) || 0
  return inr.format(num)
}
