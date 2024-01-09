import { Router } from "express";
import isEmptyBody from "../../middlewares/isEmptyBody.js";
import { validateAccordingSchema } from "../../decorators/index.js";
import { userSignupSchema, userSigninSchema } from "../../models/User.js";
import authController from "../../conrolers/auth-controller.js";
import autentification from "../../middlewares/autentication.js";

const {signUp,signIn,getCurent,logout,cahngeSubscriber} = authController;

const authRouter = Router();

authRouter.post('/register',isEmptyBody,validateAccordingSchema(userSignupSchema),signUp);
authRouter.post('/login',isEmptyBody,validateAccordingSchema(userSigninSchema),signIn);
authRouter.get('/curent',autentification,getCurent);
authRouter.post('/logout',autentification,logout);
authRouter.patch('',autentification,cahngeSubscriber);

export default authRouter;