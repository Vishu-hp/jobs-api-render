// const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log("h1:", err);

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong",
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }

  if (err.name === "ValidationError") {
    // as it's validation error
    customError.statusCode = 400;

    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
  }

  if (err.code && err.code === 11000) {
    // as it's sending duplicate value for field needing unique value
    customError.statusCode = 400;

    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
  }

  if (err.name === "CastError") {
    customError.statusCode = 404;
    customError.msg = `No job found with id ${err.value}`;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
