const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const orderStatusValidation = (data = {}) => {
  const errors = [];
  if (!data.status) errors.push('Status is required');
  else if (!ORDER_STATUSES.includes(String(data.status).toLowerCase())) {
    errors.push(`Status must be one of: ${ORDER_STATUSES.join(', ')}`);
  }
  return errors;
};

module.exports = { orderStatusValidation, ORDER_STATUSES };
