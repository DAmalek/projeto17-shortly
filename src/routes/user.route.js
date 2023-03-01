import { Router } from "express";
import { signIn, signUp } from "../controllers/user.controller.js";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { loginSchema, userSchema } from "../models/auth.schema.js";

const userRoute = Router();

userRoute.post("/signUp", validateSchema(userSchema), signUp);
userRoute.post("/signIn", validateSchema(loginSchema), signIn);
export default userRoute;
