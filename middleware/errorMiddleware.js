const errorMiddleware = (err, req, res, next) => {
  const defaultError = {
    statusCode: 400,
    success: "failed",
    message: err,
  };

  if (err?.name === "ValidationError") {
    defaultError.statusCode = 400;

    defaultError.message = Object.values(err, errors)
      .map((el) => el.message)
      .join(",");
  }

  // Duplicate Error
  if (err.code && err.code === 11000) {
    (defaultError.statusCode = 400), (defaultError.message = `${Object.values(err.keyValue)} field has to be unique!`);
  }

  res.status(defaultError.statusCode).json({
    success: defaultError.success,
    message: defaultError.message,
  });
};

export default errorMiddleware;
