import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../getPayload";
import { stripe } from "../lib/stripe";
import type Stripe from "stripe";
import payload from 'payload';

export const paymentRouter = router({
    createSession: privateProcedure.input(z.object({ productIds: z.array(z.string()) }))
        .mutation(async ({ ctx, input }) => {
            const { user } = ctx;
            let { productIds } = input

            if (productIds.length === 0) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "No products selected" })
            }

            //get products with the ids passed from the input

            const payload = await getPayloadClient()

            //check for the stripe id attached to a product
            // getting from our db
            const { docs: products } = await payload.find({
                collection: "products",
                where: {
                    id: {
                        in: productIds,
                    }
                }
            })
            // verified that have a price because thats what we can chekout in strip
            const filteredProducts = products.filter((prod) => Boolean(prod.priceId))
            // creating in our db
            const order = await payload.create({
                collection: "orders",
                data: {
                    _isPaid: false,
                    product: filteredProducts.map((prod) => prod.id),
                    user: user.id,
                }
            })

            //
            const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []
            filteredProducts.forEach((product) => {
                line_items.push({
                    price: product.priceId!,
                    quantity: 1,
                    adjustable_quantity: {
                        enabled: false,
                    }
                })
            })
            line_items.push({
                price: "price_1OQ426LsY7IpDK3H7jfhjr51",
                quantity: 1,
                adjustable_quantity: {
                    enabled: false,
                }
            })
            //create the checkout session
            try {
                const stripeSession = await stripe.checkout.sessions.create({
                    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
                    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
                    payment_method_types: ["card"],
                    mode: "payment",
                    metadata: {
                        userId: user.id,
                        orderId: order.id,
                    },
                    line_items,
                })

                // return url
                return {
                    url: stripeSession.url,
                }
            } catch (error) {
                console.log(error)
                return {
                    url: null
                }
            }
        }),

    // check if it's paid

    pollOrderStatus: privateProcedure.input(z.object({ orderId: z.string() })).query(async ({ input }) => {
        const { orderId } = input
        const payload = await getPayloadClient()

        const { docs: orders } = await payload.find({
            collection: "orders",
            where: {
                id: {
                    equals: orderId
                }
            }
        })
        if (!orders.length) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" })
        }

        const [order] = orders

        return {
            isPaid: order._isPaid,
        }
    })
})