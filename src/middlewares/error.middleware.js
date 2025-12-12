import logger from "../config/logger.js";
import ApiError from "../core/ApiError.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    logger.error(`[ApiError] ${err.message}`);
    logger.error(err.stack);
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  logger.error(`[SERVER ERROR] ${err.message}`);
  logger.error(err.stack);  // <-- Agora mostra o stack trace inteiro

  return res.status(500).json({
    error: "Erro interno do servidor",
  });
}
