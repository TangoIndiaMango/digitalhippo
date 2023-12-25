
import { inferAsyncReturnType } from '@trpc/server';
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { getPayloadClient } from "./getPayload";
import { nextApp, nextHandler } from "./next-utils";
import { appRouter } from './trpc';
import bodyParser from 'body-parser';
import { IncomingMessage } from 'http';
import { stripeWebhookHandler } from './hooks/webhooks';
import nextBuild from "next/dist/build";
import path from 'path';

const app = express()
const PORT = Number(process.env.PORT) || 3000

export type WebHookRequest = IncomingMessage & { rawBody: Buffer }

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({
    req, res
})

export type ExpressContext = inferAsyncReturnType<typeof createContext> //making typescript know we have this to avoid complaining

const start = async () => {

    const webHookMiddleware = bodyParser.json({
        verify: (req: WebHookRequest, _, buffer) => {
            req.rawBody = buffer
        }
    })
    app.post(`/api/webhook/stripe`, webHookMiddleware, stripeWebhookHandler)


    const payload = await getPayloadClient({
        initOptions: {
            express: app,
            onInit: async (cms) => {
                cms.logger.info(`Admin URL: ${cms.getAdminURL()}`)
            }
        }
    })

    if (process.env.NEXT_BUILD) {
        app.listen(PORT, async () => {
            payload.logger.info("Next.js is building for production")

            // @ts-expect-error
            await nextBuild(path.join(__dirname, '../'))


            process.exit()
        })

        return
    }


    //setup trpc when we get a request in our server so we forward to trpc in nextjs to handle.. so the middleware to enable that

    app.use('/api/trpc', trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext, //this allow us to take something from express req and res and attach to the context to be used in next js

    }))


    app.use((req, res) => nextHandler(req, res))

    nextApp.prepare().then(() => {
        payload.logger.info(`Server ready at:${PORT}`)


        app.listen(PORT, async () => {
            payload.logger.info(`Next js app URL:${process.env.NEXT_PUBLIC_SERVER_URL}`)
        })
    })
}

start()