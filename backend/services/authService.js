import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/UserModel.js"; // Updated to the new trading app model
import { config } from 'dotenv';
config();

// Register function
export const register = async (userObj) => {
  // Create document
  const userDoc = new UserModel(userObj);
  
  // Validate for empty passwords and required fields
  await userDoc.validate();
  
  // Hash and replace plain password
  userDoc.password = await bcrypt.hash(userDoc.password, 10);
  
  // Save to database
  const created = await userDoc.save();
  
  // Convert document to object to remove password
  const newUserObj = created.toObject();
  
  // Remove password from the response
  delete newUserObj.password;
  
  // Return user obj without password
  return newUserObj;
};

// Authenticate function
export const authenticate = async ({ email, password }) => {
  // Check user with email
  const user = await UserModel.findOne({ email });
  if (!user) {
    const err = new Error("Invalid email");
    err.status = 401;
    throw err;
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid password");
    err.status = 401;
    throw err;
  }

  // Check isActive state (in case admin suspended the trader)
  if (user.isActive === false) {
    const err = new Error("Your account is blocked. Please contact Admin.");
    err.status = 403;
    throw err;
  }

  // Generate Token
  // Added walletBalance to the payload so the frontend can quickly reference the user's available funds
  const token = jwt.sign(
    { 
      _id: user._id, 
      role: user.role, 
      email: user.email, 
      firstName: user.firstName,
      walletBalance: user.walletBalance 
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: "1d", // Typically you want a longer or refreshable session for a trading app
    }
  );

  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj };
};