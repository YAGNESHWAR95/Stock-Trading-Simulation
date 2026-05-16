import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

/**
 * Middleware to verify JWT and check user roles.
 * @param  {...string} allowedRoles - List of roles permitted to access the route (e.g., "TRADER", "ADMIN")
 */
export const verifyToken = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // 1. Extract the token from HTTP-Only Cookies OR the Authorization Header
      let token = req.cookies?.token;
      
      if (!token && req.headers.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }

      // 2. If no token is found, block access
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: Please log in to continue" });
      }

      // 3. Verify the token using the secret key
      // Make sure you have JWT_SECRET defined in your .env file
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      
      // 4. Attach the decoded user payload to the request object
      // This makes req.user._id and req.user.role available to your APIs
      req.user = decodedToken;

      // 5. Role-Based Access Control (RBAC)
      // If roles were specified in the route, check if the user's role is in the list
      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: `Forbidden: Access denied for role '${req.user.role}'` 
        });
      }

      // 6. User is authenticated and authorized, proceed to the API logic
      next();
      
    } catch (err) {
      // Handle expired or modified tokens
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Unauthorized: Your session has expired. Please log in again." });
      }
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};