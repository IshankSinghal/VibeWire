import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";
import {
  getAllContacts,
  getContactsDMList,
  searchContacts,
} from "../controllers/ContactControllers.js";

const contactRoutes = Router();

contactRoutes.post("/search", verifyToken, searchContacts);
contactRoutes.get("/get-contacts-for-DM", verifyToken, getContactsDMList);
contactRoutes.get("/get-all-contacts", verifyToken, getAllContacts);

export default contactRoutes;
