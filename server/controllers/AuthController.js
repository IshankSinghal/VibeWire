//THIS FILE CONTAINS WHAT WILL HAPPEN ONCE THE USER SIGN UP---

import { request, response } from "express";
import User from "../models/USerModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password Required!");
    }
    const user = await User.create({ email, password });
    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and Password Required!");
    }
    
    //FOR LOG IN WE WILL CHECK IF THE USER ALREADY REGISTERED OR NOT...
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).send("User not registered!");
    }
    
    //HERE WE CHECK IF THE PASSWORD ENTERED CORRECT OR NOT...
    const auth = await compare(password, user.password);
    // console.log(user.password +"/"+ password );
    if (!auth) {
      return response.status(400).send("Password Incorrect!");
    }

    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (request, response, next) => {
  try {
    const userData = await User.findById(request.userId);
    if (!userData) {
      return response.status(404).send("User Not Found!");
    }
    return response.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (request, response, next) => {
  const { userId } = request;
  const { firstName, lastName, color } = request.body;

  if (!firstName || !lastName || !color) {
    return response
      .status(400)
      .send("First Name, Last Name and Color are required.");
  }

  const userData = await User.findByIdAndUpdate(
    userId,
    { firstName, lastName, color, profileSetup: true },
    { new: true, runValidators: true }
  );

  return response.status(200).json({
    id: userData.id,
    email: userData.email,
    profileSetup: userData.profileSetup,
    firstName: userData.firstName,
    lastName: userData.lastName,
    image: userData.image,
    color: userData.color,
  });
};

export const addProfileImage = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).SEND("FILE IS REQUIRED");
    }

    const date = Date.now();
    let fileName = "uploads/profiles" + date + request.file.originalname;
    renameSync(request.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    return response.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const deleteProfileImage = async (request, response, next) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).send("User not found");
    }

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    return response.status(200).send("Profile Image Removed Successfully.");
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};

export const logOut = async (request, response, next) => {
  try {
    response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return response.status(200).send("Loged Out Successfully.");
  } catch (error) {
    console.log({ error });
    return response.status(500).send("Internal Server Error");
  }
};
