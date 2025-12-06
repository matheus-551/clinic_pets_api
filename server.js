import express from "express";
import logger from "./config/logger.js";
import { morganLogger } from "./middlewares/logger.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import { validateDbConnection } from "./config/database.js";

import ownersRoutes from "./routes/owners.routes.js";
import "dotenv/config";

const app = express();
app.use(express.json());

app.use(morganLogger);

app.use("/api/v1", ownersRoutes);
app.use(errorHandler);

await validateDbConnection();

app.listen(process.env.PORT, () =>
  logger.info(`Server is running on: http://localhost:${process.env.PORT}`)
);