import express from "express";
import logger from "./src/config/logger.js";
import { morganLogger } from "./src/middlewares/logger.middleware.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";

import { validateDbConnection } from "./src/config/database.js";

import ownersRoutes from "./src/routes/owners.routes.js";
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