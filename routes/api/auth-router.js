import { Router } from "express";
//import isEmptyBody from "../../middlewares/isEmptyBody.js";
import { validateAccordingSchema } from "../../decorators/index.js";
import { userSignupSchema, userSigninSchema,resendEmailSchema } from "../../models/User.js";
import authController from "../../conrolers/auth-controller.js";
//import autentification from "../../middlewares/autentication.js";
import  updateAvatar  from "../../conrolers/avatarUpdate.js"
import {
    isEmptyBody,
     autentification,
     upload 
     } from "../../middlewares/index.js";

const {signUp,signIn,getCurent,logout,cahngeSubscribtion,verifyCod,resendEmail} = authController;
const authRouter = Router();

authRouter.post('/register',upload.single("avatarURL"),isEmptyBody,validateAccordingSchema(userSignupSchema),signUp);
authRouter.post('/login',isEmptyBody,validateAccordingSchema(userSigninSchema),signIn);
authRouter.get('/curent',autentification,getCurent);
authRouter.post('/logout',autentification,logout);
authRouter.patch('/',autentification,cahngeSubscribtion);
authRouter.patch('/avatars',autentification,upload.single("avatarURL"), updateAvatar);
authRouter.get('/verify/:verificationToken',verifyCod);
authRouter.post('/verify',isEmptyBody,validateAccordingSchema(resendEmailSchema),resendEmail);

export default authRouter;