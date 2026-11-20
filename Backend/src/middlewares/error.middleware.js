// Galti ka jawab. 500 (server ki apni galti) par andar ki detail (database, file path) user ko nahi dikhate.
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  if (err.type === 'entity.too.large') statusCode = 413;
  if (err.type === 'entity.parse.failed') statusCode = 400;
  if (statusCode >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err.stack || err.message);
  }
  const message =
    statusCode >= 500
      ? 'Something went wrong on our side. Please try again.'
      : statusCode === 413
        ? 'Request is too large'
        : statusCode === 400 && err.type === 'entity.parse.failed'
          ? 'Invalid request body'
          : err.message || 'Request failed';
  res.status(statusCode).json({ success: false, message });
};

module.exports = errorMiddleware;
