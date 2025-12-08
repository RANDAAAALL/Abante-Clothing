"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma/prisma";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { EditAccountDetailsFormType, EditAccountDetailsSchema } from "@/lib/validations/edit-account-detail-schema";
import { hashPassword } from "@/lib/hash/create-hash-password";
import { isValidHashedPassword } from "@/lib/hash/compare-hash-password";
import { redirect } from "next/navigation";

export type EditAccountFormData = {
  email: string;
  username: string;
  password?: string;
};

export async function actionUpdateAccountDetails(formData: EditAccountDetailsFormType) {
  try {
    // check authentication
    if (!(await isAuthenticatedUser())) redirect("/login");
    

    // get user payload
    const payload = await UserPayload();
    if (!payload) redirect("/login");

    const user_ID = Number(payload.user_ID);
    if (!user_ID) redirect("/login");
    
    // validate form data
    const parsedEditFormData = EditAccountDetailsSchema.safeParse(formData);
    
    if (!parsedEditFormData.success) {
      return {
        errorMessage: "Invalid form data",
        errors: parsedEditFormData.error.flatten().fieldErrors,
        status: 400
      };
    }

    const { email, username, password } = parsedEditFormData.data;

    // check if email already exists excluding current user
    const existingEmail = await prisma.users.findFirst({
      where: { 
        email: email,
        user_ID: { not: user_ID } 
      }
    });

    if (existingEmail) {
      return {
        errorMessage: "Email already exists. Please try another email",
        status: 409
      };
    }

    // check if username already exists excluding current user
    const existingUsername = await prisma.users.findFirst({
      where: { 
        username: username,
        user_ID: { not: user_ID } 
      }
    });

    if (existingUsername) {
      return {
        errorMessage: "Username already exists. Please try another username",
        status: 409
      };
    }

    // prepare update data
    const updateData: {
      email: string;
      username: string;
      password?: string;
    } = {
      email: email,
      username: username,
    };

    // handle password if it is provided and not empty
    if (password && password.trim() !== "") {
      const storedPassword = await prisma.users.findUnique({
        where: { user_ID: user_ID },
        select: { password: true }
      });

      if (!storedPassword?.password) {
        return {
          errorMessage: "Invalid form data",
          status: 500
        };
      }

      // compare both password if it is new or not
      if (await isValidHashedPassword(password, storedPassword.password)) {
        return {
          errorMessage: "New password cannot be the same as your current password.",
          status: 400
        };
      }

      const newHashedPassword = await hashPassword(password);
      updateData.password = newHashedPassword;
    }

    // update user account details
    await prisma.users.update({
      where: { user_ID: user_ID },
      data: updateData
    });

    // revalidate cache tags
    updateTag("account-details");
    updateTag("customer-feedbacks");

    return {
      successMessage: "Account details updated successfully.",
      status: 200
    };

  } catch (err: unknown) {
    // console.error("Update account details error:", err);
    return {
      errorMessage: "Failed to update account details.",
      status: 500
    };
  }
}
