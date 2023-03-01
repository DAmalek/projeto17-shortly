import { Router } from "express";
import { signUp } from "../controllers/user.controller.js";

const userRoute = Router();

userRoute.post("/signUp", signUp);

export default userRoute;
