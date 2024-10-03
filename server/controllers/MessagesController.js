import Message from "../models/MessagesModel.js ";
import { mkdirSync, renameSync } from "fs";

export const getMessages = async (request, response, next) => {
  try {
    const user1 = request.userId;
    const user2 = request.body.id;
    if (!user1 || !user2) {
      return response.status(400).send("Both Usser IDs are required.");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return response.status(200).json({ messages });
  } catch (error) {
    console.error("Error occurred while searching contacts:", error);
    return response.status(500).send("Internal Server Error");
  }
};

export const uploadFile = async (request, response, next) => {
  try {
    // Check if the file exists in the request
    if (!request.file) {
      return response.status(400).send("File is required");
    }

    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${request.file.originalname}`;

    mkdirSync(fileDir, { recursive: true });
    renameSync(request.file.path, fileName);

    const newMessage = new Message({
      sender: request.userId,
      recipient: request.body.recipientId, // or channelId if it's a channel message
      fileUrl: fileName,
      messageType: "file",
      timestamp: new Date(),
    });

    await newMessage.save();

    // Respond with success and the new file path
    return response.status(200).json({ filePath: fileName });
  } catch (error) {
    console.error("Error occurred during file upload:", error);
    return response.status(500).send("Internal Server Error");
  }
};
