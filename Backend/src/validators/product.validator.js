const productValidation = (data = {}) => {
  const errors = [];
  if (typeof data.name !== 'string' || !data.name.trim()) errors.push('Product name is required');
  // price: number ya number wala text ("1200"); "abc", minus, khaali sab ghalat
  const price = data.price === '' || data.price === null ? NaN : Number(data.price);
  if (!Number.isFinite(price) || price < 0) errors.push('Valid price is required');
  if (data.stock !== undefined && (!Number.isInteger(Number(data.stock)) || Number(data.stock) < 0)) {
    errors.push('Stock must be a whole number of 0 or more');
  }
  return errors;
};

module.exports = { productValidation };
