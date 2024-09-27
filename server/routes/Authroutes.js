import { Router } from "express";
import {
  getUserInfo,
  login,
  signup,
  updateProfile,
  addProfileImage,
  deleteProfileImage,
  logOut,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";
import multer from "multer";

const authRoutes = Router();
const upload = multer({ dest: "uploads/profiles/" });

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  addProfileImage
);
authRoutes.delete("/delete-profile-image", verifyToken, deleteProfileImage);
authRoutes.post("/logout", logOut);

export default authRoutes;
