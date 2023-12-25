import { z } from "zod"

export const AuthCreditentialsValidation = z.object({
    email: z.string().email(),
    password: z.string().min(5, { message: "Password must be 5 characters long" })
})

export type TAuthCreditentialsValidator = z.infer<typeof AuthCreditentialsValidation>