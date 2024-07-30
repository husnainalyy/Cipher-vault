import { z } from "zod"

export const usernameValidation = z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be no more than 20 characters long" })
    .regex(/^[a-zA-Z0-9_]*$/, { message: "Username can only contain letters, numbers, and underscores" });

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "the email is not valid" }),
    password:z.string().min(8).max(14)
})