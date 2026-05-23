import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/UserModel.js"; 
import { config } from 'dotenv';

config();

/**
 * Register a new User Profile
 * Handles validating structural inputs, hashing plain text passwords, 
 * and persistent storage write rules.
 * * @param {Object} userObj - Raw user request payload containing name fields, email, password, etc.
 * @returns {Object} Newly created user object without password property
 */
export const register = async (userObj) => {
  const { email, password, firstName, lastName } = userObj;

  if (!email || !password || !firstName) {
    const err = new Error("Required fields are missing (Email, Password, and First Name are mandatory).");
    err.status = 400;
    throw err;
  }

  // 1. Prevent duplicate email accounts before invoking document instantiation rules
  const normalEmail = email.trim().toLowerCase();
  const existingUser = await UserModel.findOne({ email: normalEmail });
  if (existingUser) {
    const err = new Error("An account with this email address already exists.");
    err.status = 400;
    throw err;
  }

  // 2. Cryptographically hash the plain-text credentials BEFORE creating the user model document
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 3. Compute a fallback username if your backend schema still strictly enforces it
  const computedUsername = userObj.username || `${firstName.trim()}_${lastName?.trim() || ""}`.replace(/\s+/g, "").toLowerCase();

  // 4. Instantiate model document with complete and structured parameters
  const userDoc = new UserModel({
    ...userObj,
    email: normalEmail,
    password: hashedPassword,
    username: computedUsername,
    role: userObj.role || "TRADER",
    walletBalance: userObj.walletBalance || 100000.00
  });
  
  // 5. Run validation safety check on completely mapped attributes
  await userDoc.validate();
  
  // 6. Save securely to your MongoDB collection cluster
  const created = await userDoc.save();
  
  // Convert document entity instance to a plain JavaScript object
  const newUserObj = created.toObject();
  
  // Strip password reference tracking strings before returning object data to route layer
  delete newUserObj.password;
  
  return newUserObj;
};

/**
 * Authenticates a User's Session Request
 * Cross-checks passwords via cryptographic comparison, enforces lowercase email matching, 
 * validates account active statuses, and returns custom token sessions.
 * * @param {Object} credentials - Input containing { email, password }
 * @returns {Object} { token, user } payload containing session tokens and active user records
 */
export const authenticate = async ({ email, password }) => {
  if (!email || !password) {
    const err = new Error("Email and password fields are required");
    err.status = 400;
    throw err;
  }

  // Coerce input string to match lowercase indexing to ensure predictable lookup tracking matching
  const normalEmail = email.trim().toLowerCase();

  // Look up user document profile matching email criteria
  const user = await UserModel.findOne({ email: normalEmail });
  if (!user) {
    const err = new Error("Invalid email or password combination.");
    err.status = 401;
    throw err;
  }

  // Cryptographically check incoming raw text against stored bcrypt hash strings
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid email or password combination.");
    err.status = 401;
    throw err;
  }

  // Block execution loops if active account flag is suspended by Admin dashboards
  if (user.isActive === false) {
    const err = new Error("Your account has been blocked. Please contact Platform Administration.");
    err.status = 403;
    throw err;
  }

  // Generate sign session payload token with essential state attributes injected 
  // Injects current wallet balances for immediate access down stream
  const token = jwt.sign(
    { 
      _id: user._id, 
      role: user.role, 
      email: user.email, 
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      walletBalance: user.walletBalance 
    }, 
    process.env.JWT_SECRET || "fallback_jwt_secret_phrase", 
    {
      expiresIn: "1d", // Session expiration life limit configuration settings
    }
  );

  // Convert schema response to raw JavaScript entity structure
  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj };
};