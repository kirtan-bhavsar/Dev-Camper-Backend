import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user",
  },
  password: {
    type: String,
    select: false,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

dotenv.config();

// Encrypting password befo~re saving it to the database
userSchema.pre("save", async function (next) {
  // this is added, so that when we are saving the resetPasswordToken and resetPasswordExpire,
  // it doesn't runs password encryption
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  console.log("encrypting password works !");
  this.password = await bcrypt.hash(this.password, salt);
  console.log(this.password);
});

userSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log(this);
  console.log(enteredPassword, this.password, "passwords");
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default mongoose.model("User", userSchema);
