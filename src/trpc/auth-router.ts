
import { getPayloadClient } from "../getPayload";
import { publicProcedure, router } from "./trpc";
import { AuthCreditentialsValidation } from "../lib/validators/accountCredentialsValidators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import payload from "payload";

export const authRouter = router({
    createPayloadUser: publicProcedure.input(AuthCreditentialsValidation).mutation(async ({ input }) => {
        const { email, password } = input
        const payload = await getPayloadClient()

        // if user exist
        const { docs: users } = await payload.find({
            collection: "users",
            where: {
                email: {
                    equals: email,
                }
            }
        })

        if (users.length !== 0) throw new TRPCError({ code: "CONFLICT", message: "User already exist" })

        //create user
        await payload.create({
            collection: "users",
            data: {
                email,
                password,
                role: "user",
            },
        })

        return {
            success: true,
            sendToEmail: email,
        }

    }), //create a user in our cms

    verifyEmail: publicProcedure.input(z.object({ token: z.string() })).query(async ({ input }) => {
        const { token } = input

        const payload = await getPayloadClient()

        const isVerified = await payload.verifyEmail({
            collection: "users",
            token,
        })
        if (!isVerified) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" })
        }

        return { success: true, message: "Email verified" }
    }),

    // when you login to a website its an exchange from your login details to the server and the server returns you back a token. and the token is your email and password stored like a cookie
    signIn: publicProcedure.input(AuthCreditentialsValidation).mutation(async ({ input, ctx }) => {
        const { email, password } = input
        const { res } = ctx
        const payload = await getPayloadClient()
        try {
            await payload.login({
                collection: "users",
                data: {
                    email, password,
                },
                //set the cookie which is sent from the server
                res,
                
            })

            return {success: true, message: "Login successful"}
        } catch (error) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" })
        }
    })
})