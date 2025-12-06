import logger from "../config/logger.js";
import morgan from "morgan";

// cria um stream para enviar o output do morgan para o winston
const stream = {
  write: (message) => logger.http(message.trim())
};

// middleware de logs http com winston
export const morganLogger = morgan(
  ":method :url :status :response-time ms",
  { stream }
);
