import logger from "../config/logger.js";
import ApiError from "../core/ApiError.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(err);
  return res.status(500).json({ error: "Erro interno do servidor" });
}
