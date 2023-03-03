import { Router } from "express";
import {
  createShorten,
  destroyUrl,
  getUrlById,
  getUserData,
  openUrl,
} from "../controllers/url.controller.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { tokenValidation } from "../middlewares/token.validation.js";
import {
  deleteValidation,
  redirectValidation,
  uservalidation,
} from "../middlewares/urls.middleware.js";
import { urlSchema } from "../models/url.schema.js";

const urlRoute = Router();

urlRoute.post(
  "/urls/shorten",
  validateSchema(urlSchema),
  tokenValidation,
  createShorten
);
urlRoute.get("/urls/:id", getUrlById);
urlRoute.get("/urls/open/:shortUrl", redirectValidation, openUrl);
urlRoute.get("/urls/me", uservalidation, getUserData);
urlRoute.delete("/urls/:id", deleteValidation, destroyUrl);

export default urlRoute;
