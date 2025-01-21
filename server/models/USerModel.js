import { genSalt, hash } from "bcrypt";
import mongoose, { mongo } from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is Required."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required."],
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  wallpaper: {
    type: String,
    required: false,
  },
  profileSetup: {
    type: Boolean,
    required: false,
  },
});

//MIDDLEWARE TO ENCRYPT THE DATA--
userSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});

//USER MODEL WHITH THE USERSCHEMA...
const User = mongoose.model("Users", userSchema);

export default User;
