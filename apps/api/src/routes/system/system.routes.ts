import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { errorMessageSchema } from "@api/lib/helpers";
import {
  checkUserTypeSchema,
  testEmailResponseSchema,
  testEmailSchema
} from "./system.schema";

const tags: string[] = ["System"];

// List route definition
export const checkUserType = createRoute({
  tags,
  summary: "Check user type",
  path: "/check-user-type",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(checkUserTypeSchema, "The user type"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    )
  }
});

export const testEmail = createRoute({
  tags,
  summary: "Test email sending functionality",
  path: "/test-email",
  method: "post",
  request: {
    body: jsonContentRequired(testEmailSchema, "Email test data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      testEmailResponseSchema,
      "Email test result"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Bad request"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Failed to send email"
    )
  }
});

export type CheckUserTypeRoute = typeof checkUserType;
export type TestEmailRoute = typeof testEmail;
