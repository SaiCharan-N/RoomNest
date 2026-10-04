function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = 'A record with that value already exists.';
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid identifier provided.';
  }

  if (statusCode === 500) {
    message = 'Something went wrong on our end. Please try again later.';
  }

  res.status(statusCode).json({ message });
}

module.exports = { notFound, errorHandler };
