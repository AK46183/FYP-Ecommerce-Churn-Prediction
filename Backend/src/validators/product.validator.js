const productValidation = (data) => {
  const errors = [];
  if (!data.name) errors.push('Product name is required');
  if (data.price === undefined || data.price < 0) errors.push('Valid price is required');
  return errors;
};

module.exports = { productValidation };