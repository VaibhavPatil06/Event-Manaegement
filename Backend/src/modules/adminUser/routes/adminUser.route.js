import express from "express";
import { isAdmin } from "../../middleware/auth.js";
import {
  login,
  logout,
  me,
  registerUser,
  updateProfileDetails,
} from "../controllers/adminUser.controller.js";

const router = express.Router();

router.get("/me", isAdmin, me);
router.post("/login", login);
router.put("/logout", isAdmin, logout);
// router.put("/update-user", isAdmin, updateProfileDetails);
router.post("/register-user", registerUser);

// router.post('/forgot-password',forgotPassword)
// router.post('/reset-password',resetPassword)
// router.get('/verify-token',verfiyForgetPasswordToken)
// // router.put("/password_change_v1", verifyToken, passwordChange_v1)
// router.put("/update-pwd", isAdmin, passwordChange)

export default router;
