import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddlewares.js";

import {
  createChannel,
  getChannelMessages,
  getUserChannels,
} from "../controllers/Channelcontroller.js";
const channelRoute = new Router();

channelRoute.post("/create-channel", verifyToken, createChannel);
channelRoute.get("/get-user-channels", verifyToken, getUserChannels);
channelRoute.get(
  "/get-channel-messages/:channelId",
  verifyToken,
  getChannelMessages
);

export default channelRoute;
