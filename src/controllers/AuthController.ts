// src/controllers/AuthController.ts
import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/User";
import { SignJWT, jwtVerify } from "jose";
import { UserRole } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Create a secret key instance
const getJwtSecret = () => {
  return new TextEncoder().encode(JWT_SECRET);
};

// Response helper
export class ApiResponse {
  static success(data: any, message?: string, status: number = 200) {
    return NextResponse.json(
      {
        success: true,
        data,
        message,
      },
      { status }
    );
  }

  static error(error: string, status: number = 500) {
    return NextResponse.json(
      {
        success: false,
        error,
      },
      { status }
    );
  }

  static validationError(errors: Record<string, string>) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        errors,
      },
      { status: 400 }
    );
  }
}

// Auth middleware
export class AuthMiddleware {
  static async verifyAuth(req: NextRequest) {
    try {
      const token = this.extractTokenFromRequest(req);
      console.log(
        "🔐 [AuthMiddleware] Token received:",
        token ? `${token.substring(0, 20)}...` : "No token"
      );

      if (!token) {
        console.log("❌ [AuthMiddleware] No token provided");
        return { error: "Authorization token required" };
      }

      // Verify the token using jose
      console.log("🔐 [AuthMiddleware] Verifying token...");
      const { payload } = await jwtVerify(token, getJwtSecret());
      console.log("✅ [AuthMiddleware] Token decoded:", {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        exp: payload.exp
          ? new Date(payload.exp * 1000).toISOString()
          : "No expiry",
      });

      // Find user in database
      console.log("👤 [AuthMiddleware] Finding user by ID:", payload.userId);
      const user = await UserModel.findById(payload.userId as string);
      console.log(
        "👤 [AuthMiddleware] User found:",
        user
          ? {
              id: user.id,
              email: user.email,
              role: user.role,
              status: user.status,
            }
          : "No user found"
      );

      if (!user) {
        console.log("❌ [AuthMiddleware] User not found in database");
        return { error: "User not found" };
      }

      // Check if user account is active
      if (user.status !== "ACTIVE") {
        console.log(
          "❌ [AuthMiddleware] User account not active:",
          user.status
        );
        return { error: "Account is not active" };
      }

      console.log(
        "✅ [AuthMiddleware] Authentication successful for user:",
        user.email
      );
      return { user, decoded: payload };
    } catch (error: any) {
      console.error("❌ [AuthMiddleware] Token verification error:", {
        name: error.name,
        message: error.message,
        code: error.code,
      });

      if (error.code === "ERR_JWT_EXPIRED") {
        return { error: "Token expired" };
      } else if (error.code === "ERR_JWT_INVALID") {
        return { error: "Invalid token" };
      }

      return { error: "Authentication failed" };
    }
  }

  static requireRole(roles: (UserRole | string)[]) {
    return async (req: NextRequest) => {
      console.log("🔐 [requireRole] Checking roles:", roles);
      const authResult = await AuthMiddleware.verifyAuth(req);
      if (authResult.error) {
        console.log("❌ [requireRole] Auth failed:", authResult.error);
        return { error: authResult.error };
      }

      const userRole = authResult.user!.role;
      console.log(
        "👤 [requireRole] User role:",
        userRole,
        "Required roles:",
        roles
      );

      if (!roles.includes(userRole)) {
        console.log(
          "❌ [requireRole] Insufficient permissions. User role:",
          userRole,
          "Required:",
          roles
        );
        return { error: "Insufficient permissions" };
      }

      console.log("✅ [requireRole] Role check passed");
      return authResult;
    };
  }

  static extractTokenFromRequest(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    console.log(
      "🔐 [extractToken] Authorization header:",
      authHeader ? `${authHeader.substring(0, 20)}...` : "No header"
    );

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ [extractToken] No Bearer token found");
      return null;
    }

    const token = authHeader.substring(7);
    console.log(
      "✅ [extractToken] Token extracted:",
      token.substring(0, 20) + "..."
    );
    return token;
  }
}

export class AuthController {
  static async register(req: NextRequest) {
    console.log("👤 [AuthController] Registration request received");
    try {
      const { email, password, name, username } = await req.json();
      console.log("👤 [AuthController] Registration data:", {
        email,
        name,
        username,
      });

      // Validation
      const validationErrors: Record<string, string> = {};

      if (!email) validationErrors.email = "Email is required";
      if (!password) validationErrors.password = "Password is required";
      if (!name) validationErrors.name = "Name is required";

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        validationErrors.email = "Invalid email format";
      }

      if (password && password.length < 6) {
        validationErrors.password = "Password must be at least 6 characters";
      }

      if (Object.keys(validationErrors).length > 0) {
        console.log("❌ [AuthController] Validation errors:", validationErrors);
        return ApiResponse.validationError(validationErrors);
      }

      console.log("👤 [AuthController] Creating user...");
      const user = await UserModel.create({
        email,
        password,
        name,
        username,
      });

      // Generate JWT token using jose
      console.log("🔐 [AuthController] Generating JWT token...");
      const token = await new SignJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(getJwtSecret());

      console.log(
        "✅ [AuthController] Registration successful for user:",
        user.email
      );
      return ApiResponse.success(
        {
          user,
          token,
        },
        "Registration successful",
        201
      );
    } catch (error: any) {
      console.error("❌ [AuthController] Registration error:", {
        message: error.message,
        stack: error.stack,
      });

      if (
        error.message.includes("already exists") ||
        error.message.includes("already taken")
      ) {
        return ApiResponse.error(error.message, 400);
      }

      return ApiResponse.error("Internal server error");
    }
  }

  static async login(req: NextRequest) {
    console.log("🔐 [AuthController] Login request received");
    try {
      const { email, password } = await req.json();
      console.log("🔐 [AuthController] Login attempt for email:", email);

      // Validation
      if (!email || !password) {
        console.log("❌ [AuthController] Missing email or password");
        return ApiResponse.error("Email and password are required", 400);
      }

      // Find user
      console.log("👤 [AuthController] Finding user by email:", email);
      const user = await UserModel.findByEmail(email);
      if (!user) {
        console.log("❌ [AuthController] User not found for email:", email);
        return ApiResponse.error("Invalid credentials", 401);
      }

      // Validate password
      console.log("🔐 [AuthController] Validating password...");
      const isValidPassword = await UserModel.validatePassword(
        password,
        user.password
      );
      if (!isValidPassword) {
        console.log("❌ [AuthController] Invalid password for user:", email);
        return ApiResponse.error("Invalid credentials", 401);
      }

      // Update last login
      console.log("👤 [AuthController] Updating last login for user:", user.id);
      await UserModel.updateLastLogin(user.id);

      // Generate JWT token using jose
      console.log("🔐 [AuthController] Generating JWT token...");
      const token = await new SignJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(getJwtSecret());

      // Get user data without password
      const userData = await UserModel.findById(user.id);

      console.log("✅ [AuthController] Login successful for user:", email);
      return ApiResponse.success(
        {
          user: userData,
          token,
        },
        "Login successful"
      );
    } catch (error) {
      console.error("❌ [AuthController] Login error:", error);
      return ApiResponse.error("Internal server error");
    }
  }

  static async logout(req: NextRequest) {
    console.log("🔐 [AuthController] Logout request received");
    try {
      const token = AuthMiddleware.extractTokenFromRequest(req);
      if (token) {
        console.log("🔐 [AuthController] Deleting session for token");
        await UserModel.deleteSession(token);
      }

      console.log("✅ [AuthController] Logout successful");
      return ApiResponse.success(null, "Logged out successfully");
    } catch (error) {
      console.error("❌ [AuthController] Logout error:", error);
      return ApiResponse.error("Internal server error");
    }
  }

  static async getProfile(req: NextRequest) {
    console.log("👤 [AuthController] Get profile request received");
    try {
      const authResult = await AuthMiddleware.verifyAuth(req);
      if (authResult.error) {
        console.log(
          "❌ [AuthController] Get profile failed:",
          authResult.error
        );
        return ApiResponse.error(authResult.error, 401);
      }

      console.log(
        "✅ [AuthController] Profile retrieved for user:",
        authResult.user!.email
      );
      return ApiResponse.success(
        authResult.user,
        "Profile retrieved successfully"
      );
    } catch (error) {
      console.error("❌ [AuthController] Get profile error:", error);
      return ApiResponse.error("Internal server error");
    }
  }

  static async updateProfile(req: NextRequest) {
    console.log("👤 [AuthController] Update profile request received");
    try {
      const authResult = await AuthMiddleware.verifyAuth(req);
      if (authResult.error) {
        console.log(
          "❌ [AuthController] Update profile auth failed:",
          authResult.error
        );
        return ApiResponse.error(authResult.error, 401);
      }

      const { name, image, bio, username } = await req.json();
      console.log(
        "👤 [AuthController] Updating profile for user:",
        authResult.user!.id,
        { name, username }
      );

      const updatedUser = await UserModel.updateUser(authResult.user!.id, {
        name,
        image,
        bio,
        username,
      });

      console.log("✅ [AuthController] Profile updated successfully");
      return ApiResponse.success(updatedUser, "Profile updated successfully");
    } catch (error: any) {
      console.error("❌ [AuthController] Update profile error:", error);

      if (error.message.includes("already taken")) {
        return ApiResponse.error(error.message, 400);
      }

      return ApiResponse.error("Internal server error");
    }
  }

  static async changePassword(req: NextRequest) {
    console.log("🔐 [AuthController] Change password request received");
    try {
      const authResult = await AuthMiddleware.verifyAuth(req);
      if (authResult.error) {
        console.log(
          "❌ [AuthController] Change password auth failed:",
          authResult.error
        );
        return ApiResponse.error(authResult.error, 401);
      }

      const { currentPassword, newPassword } = await req.json();

      if (!currentPassword || !newPassword) {
        console.log("❌ [AuthController] Missing current or new password");
        return ApiResponse.error(
          "Current password and new password are required",
          400
        );
      }

      if (newPassword.length < 6) {
        console.log("❌ [AuthController] New password too short");
        return ApiResponse.error(
          "New password must be at least 6 characters",
          400
        );
      }

      // Verify current password
      console.log("🔐 [AuthController] Verifying current password...");
      const user = await UserModel.findByEmail(authResult.user!.email);
      if (!user) {
        console.log(
          "❌ [AuthController] User not found during password change"
        );
        return ApiResponse.error("User not found", 404);
      }

      const isValidPassword = await UserModel.validatePassword(
        currentPassword,
        user.password
      );
      if (!isValidPassword) {
        console.log("❌ [AuthController] Current password is incorrect");
        return ApiResponse.error("Current password is incorrect", 400);
      }

      // Update password
      console.log("🔐 [AuthController] Updating password...");
      await UserModel.updatePassword(authResult.user!.id, newPassword);

      console.log("✅ [AuthController] Password updated successfully");
      return ApiResponse.success(null, "Password updated successfully");
    } catch (error) {
      console.error("❌ [AuthController] Change password error:", error);
      return ApiResponse.error("Internal server error");
    }
  }

  // Admin only endpoints
  static async createAdmin(req: NextRequest) {
    console.log("👨‍💼 [AuthController] Create admin request received");
    try {
      const authResult = await AuthMiddleware.requireRole(["SUPER_ADMIN"])(req);
      if (authResult.error) {
        console.log(
          "❌ [AuthController] Create admin permission denied:",
          authResult.error
        );
        return ApiResponse.error(authResult.error, 403);
      }

      const {
        email,
        password,
        name,
        username,
        role = "ADMIN",
      } = await req.json();
      console.log("👨‍💼 [AuthController] Creating admin:", {
        email,
        name,
        username,
        role,
      });

      // Validation
      const validationErrors: Record<string, string> = {};

      if (!email) validationErrors.email = "Email is required";
      if (!password) validationErrors.password = "Password is required";
      if (!name) validationErrors.name = "Name is required";

      if (password && password.length < 6) {
        validationErrors.password = "Password must be at least 6 characters";
      }

      if (Object.keys(validationErrors).length > 0) {
        console.log(
          "❌ [AuthController] Admin creation validation errors:",
          validationErrors
        );
        return ApiResponse.validationError(validationErrors);
      }

      const user = await UserModel.create({
        email,
        password,
        name,
        username,
        role: role as UserRole,
      });

      console.log(
        "✅ [AuthController] Admin created successfully:",
        user.email
      );
      return ApiResponse.success(user, "Admin created successfully", 201);
    } catch (error: any) {
      console.error("❌ [AuthController] Create admin error:", error);

      if (
        error.message.includes("already exists") ||
        error.message.includes("already taken")
      ) {
        return ApiResponse.error(error.message, 400);
      }

      return ApiResponse.error("Internal server error");
    }
  }

  static async getAllAdmins(req: NextRequest) {
    console.log("👨‍💼 [AuthController] Get all admins request received");
    try {
      const authResult = await AuthMiddleware.requireRole([
        "ADMIN",
        "SUPER_ADMIN",
      ])(req);
      if (authResult.error) {
        console.log(
          "❌ [AuthController] Get admins permission denied:",
          authResult.error
        );
        return ApiResponse.error(authResult.error, 403);
      }

      const admins = await UserModel.getAllAdmins();
      console.log("✅ [AuthController] Retrieved", admins.length, "admins");

      return ApiResponse.success(admins, "Admins retrieved successfully");
    } catch (error) {
      console.error("❌ [AuthController] Get admins error:", error);
      return ApiResponse.error("Internal server error");
    }
  }
}
