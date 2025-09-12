import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import env from "@api/env";
import emailService from "@api/lib/email";
import type { CheckUserTypeRoute, TestEmailRoute } from "./system.routes";

// check User type handler
export const checkUserTypeHandler: AppRouteHandler<CheckUserTypeRoute> = async (
  c
) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session || !user) {
      return c.json(
        { message: "Unauthorized access" },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    if (user.role === "admin") {
      return c.json({ userType: "systemAdmin" as const }, HttpStatusCodes.OK);
    }

    if (session.activeOrganizationId) {
      return c.json({ userType: "hotelOwner" as const }, HttpStatusCodes.OK);
    }

    // Check user id exists as member in member table
    const userOrg = await db.query.member.findFirst({
      where: (fields, { eq }) => eq(fields.userId, user.id)
    });

    if (userOrg) {
      // Set active organization as created organization
      // const switchRes = await auth.api.setActiveOrganization({
      //   body: {
      //     organizationId: userOrg.organizationId
      //   },
      //   headers: {
      //     cookie: c.req.header("cookie")
      //   }
      // });

      // console.log({ switchRes });

      return c.json({ userType: "hotelOwner" as const }, HttpStatusCodes.OK);
    }

    return c.json({ userType: "user" as const }, HttpStatusCodes.OK);
  } catch (error) {
    console.log(error);
    return c.json({ userType: "user" as const }, HttpStatusCodes.OK);
  }
};

// Test email handler
export const testEmailHandler: AppRouteHandler<TestEmailRoute> = async (c) => {
  try {
    const { to, type } = c.req.valid("json");

    let success = false;
    let message = "";

    switch (type) {
      case "welcome": {
        success = await emailService.sendWelcomeEmail(to, "Test User");
        message = success
          ? "Welcome email sent successfully"
          : "Failed to send welcome email";
        break;
      }
      case "reset": {
        const resetUrl = `${env.CLIENT_APP_URL}/auth/reset-password?token=test-token`;
        success = await emailService.sendPasswordResetEmail(
          to,
          resetUrl,
          "test-token"
        );
        message = success
          ? "Password reset email sent successfully"
          : "Failed to send password reset email";
        break;
      }
      case "verification": {
        const verifyUrl = `${env.CLIENT_APP_URL}/auth/verify-email?token=test-token`;
        success = await emailService.sendEmailVerificationEmail(
          to,
          verifyUrl,
          "test-token"
        );
        message = success
          ? "Email verification email sent successfully"
          : "Failed to send email verification email";
        break;
      }
      default:
        return c.json(
          { success: false, message: "Invalid email type" },
          HttpStatusCodes.BAD_REQUEST
        );
    }

    return c.json(
      { success, message },
      success ? HttpStatusCodes.OK : HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  } catch (error) {
    console.error("Error in testEmailHandler:", error);
    return c.json(
      { success: false, message: "Internal server error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
