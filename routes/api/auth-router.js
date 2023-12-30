import { Router } from "express";
import isEmptyBody from "../../middlewares/isEmptyBody.js";
import { validateAccordingSchema } from "../../decorators/index.js";
import { userSignupSchema, userSigninSchema } from "../../models/User.js";
import authController from "../../conrolers/auth-controller.js";

const {signUp,signIn} = authController;

const authRouter = Router();

authRouter.post('/signup',isEmptyBody,validateAccordingSchema(userSignupSchema),signUp);
authRouter.get('/signin',isEmptyBody,validateAccordingSchema(userSigninSchema),signIn);

export default authRouter;