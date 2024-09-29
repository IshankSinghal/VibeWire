import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";
import { searchContacts } from "../controllers/ContactControllers.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContacts);

export default contactRoutes;
