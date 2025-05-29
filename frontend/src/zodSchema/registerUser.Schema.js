// src/zodSchema/registerUser.Schema.js
import { z } from "zod";

const roleEnum = ["USER", "ADMIN", "CLIENT" ]

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
const registerUserSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  role: z.enum(roleEnum),
  email: z.string().email( { message: "Invalid email address" }),
  password: z.string().regex(passwordRegex, { message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character" }),
  confirmPassword: z.string().regex(passwordRegex, { message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character" }),
});

export default registerUserSchema
