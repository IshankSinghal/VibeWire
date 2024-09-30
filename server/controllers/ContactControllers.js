import mongoose from "mongoose";
import Message from "../models/MessagesModel.js";
import User from "../models/USerModel.js";

export const searchContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;

    // Check if search term is missing
    if (searchTerm === undefined || searchTerm === null) {
      return response.status(400).send("Search term is required.");
    }

    // Sanitize the search term to avoid regex special characters issues
    const sanitizeSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regX = new RegExp(sanitizeSearchTerm, "i");

    // Find contacts based on the sanitized search term
    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.userId } }, // Exclude the requesting user
        { $or: [{ firstName: regX }, { lastName: regX }] }, // Search by name or email
      ],
    });

    return response.status(200).json({ contacts });
  } catch (error) {
    console.error("Error occurred while searching contacts:", error);
    return response.status(500).send("Internal Server Error");
  }
};
export const getContactsDMList = async (request, response, next) => {
  try {
    let { userId } = request;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
          email: "$contactInfo.email",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return response.status(200).json({ contacts });
  } catch (error) {
    console.error("Error occurred while searching contacts:", error);
    return response.status(500).send("Internal Server Error");
  }
};
