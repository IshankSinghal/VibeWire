import User from "../models/USerModel.js";

export const searchContacts = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;

    // Check if search term is missing
    if (!searchTerm) {
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
        { $or: [{ firstName: regX }, { lastName: regX }, { email: regX }] }, // Search by name or email
      ],
    });

    return response.status(200).json({ contacts });
  } catch (error) {
    console.error("Error occurred while searching contacts:", error);
    return response.status(500).send("Internal Server Error");
  }
};
