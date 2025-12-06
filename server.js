import express from "express";
import "dotenv/config";

import logger from "./src/config/logger.js";
import { morganLogger } from "./src/middlewares/logger.middleware.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";

import { validateDbConnection } from "./src/config/database.js";

import ownersRoutes from "./src/routes/owners.routes.js";
import petsRoutes from "./src/routes/pets.routes.js";

const app = express();
app.use(express.json());

app.use(morganLogger);

const PREFIX = process.env.NODE_ENV === "production" ? "/api/v1" : "/api/v1";

app.use(PREFIX, ownersRoutes);
app.use(PREFIX, petsRoutes);
app.use(errorHandler);

await validateDbConnection();

app.listen(process.env.PORT, () =>
  logger.info(`Server is running on: http://localhost:${process.env.PORT}`)
);