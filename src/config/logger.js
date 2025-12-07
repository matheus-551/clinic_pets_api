import winston from "winston";
import "winston-daily-rotate-file";

winston.addColors({
  error: "red bold",
  warn: "yellow",
  info: "cyan",
  http: "magenta",
  query: "green",
  debug: "white",
});

const customLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
  http: 3
};

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp }) => 
    `[${timestamp}] ${level}: ${message}`
  )
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp }) => 
    `[${timestamp}] ${level}: ${message}`
  )
);

const logger = winston.createLogger({
  levels: customLevels,    
  level: "http",  
  handleExceptions: true,
  transports: [
    new winston.transports.Console({ format: consoleFormat }),

    new winston.transports.DailyRotateFile({
      filename: "logs/%DATE%-server.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: fileFormat,
    })
  ]
});

export default logger;
