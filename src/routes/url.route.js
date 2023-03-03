import { Router } from "express";
import { createShorten } from "../controllers/url.controller.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { tokenValidation } from "../middlewares/token.validation.js";
import { urlSchema } from "../models/url.schema.js";

const urlRoute = Router();

urlRoute.post(
  "/urls/shorten",
  validateSchema(urlSchema),
  tokenValidation,
  createShorten
);

export default urlRoute;
