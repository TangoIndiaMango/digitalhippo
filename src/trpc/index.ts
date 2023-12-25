import { z } from "zod";
import { authRouter } from "./auth-router";
import { publicProcedure, router } from './trpc';
import { QueryValidators } from "../lib/validators/queryValidators";
import payload from 'payload';
import { getPayloadClient } from "../getPayload";
import { paymentRouter } from "./payment-router";

export const appRouter = router({
    auth: authRouter,
    paymnet: paymentRouter,

    getInfiniteProduct: publicProcedure.input(z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(), //last element rendered, begin fetching next page
        query: QueryValidators 
    })).query(async({input}) => {
        const {query, cursor} = input
        const {limit, sort, ...queryOpts} = query

        const payload = await getPayloadClient()

        // becuase we want to be able to extend the categories ----More explanation on this___
        const parsedQueryOpt: Record<string, {equals: string}> = {}
        Object.entries(queryOpts).forEach(([key, value]) => {
            parsedQueryOpt[key] = {
                equals: value,
            }
        
        })
        const page = cursor || 1

        const {docs: items, hasNextPage, nextPage} = await payload.find({
            collection: "products",
            where: {
                approvedForSale: {
                    equals: "approved",
                },
                ...parsedQueryOpt,
            },
            sort,
            depth: 1,
            limit,
            page,
        })

        // what we return here comes from our cms, eg instead of being docs we renamed it as items the next page also comes from the cms
        return {
            items,
            nextPage:hasNextPage ? nextPage : null,
        }
    })
})

export type AppRouter = typeof appRouter;