import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import path from "path";
import { buildConfig } from "payload/config";
import { Users } from "./collections/Users";
import dotenv from 'dotenv';
import { Products } from "./collections/Products/Products";
import { Media } from "./collections/Products/Media";
import { ProductFiles } from "./collections/Products/ProductFile";
import { Orders } from "./collections/Orders";

dotenv.config({
    path: path.resolve(__dirname, '../.env'),
})

export default buildConfig({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    collections: [Users, Products, Media, ProductFiles, Orders],
    routes: {
        admin: '/sell' //by default the cms admin dashboard is hosted under /admin but we want it on /sell
    },
    admin: {
        user: "users", // check this collection for what we need
        bundler: webpackBundler(),
        meta: {
            titleSuffix: "- DigitalHippo",
            favicon: "/favicon.ico", //by default the favicon is set to /favicon.ico but we want it to be set to /favicon.png,
            ogImage: "/thumbnail.jpg", // if you share a link to the app it looks just like the actual app

        },
    },
    rateLimit: {
        max: 2000, //by default it's 500 
    },
    editor: slateEditor({}),
    db: mongooseAdapter({
        url: process.env.MONGODB_URL!,
    }),
    typescript: { 
        outputFile: path.resolve(__dirname, "payload-types.ts"),
     },
})