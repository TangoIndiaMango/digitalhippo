import { User } from "../../payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";

const addUser: BeforeChangeHook = ({ req, data }) => {
    const user = req.user as User | null;
    return { ...data, users: user?.id }
}

const yourOwnAndPurchased: Access = async ({ req }) => {
    const user = req.user as User | null;
    if (user?.role === "admin") return true
    if (!user) return false

    const { docs: products } = await req.payload.find({
        collection: "products",
        depth: 0, // to avoid seaerching through the user entire db since all we need is the id if we use 1 it checks all
        where: {
            user: {
                equals: user.id,
            }
        },
    })

    const ownProductFileIds = products.map((prod) => prod.product_files).flat() //make sure it's an array for the ids of a product file

    //get the fil ids of what you purchased
    const { docs: orders } = await req.payload.find({
        collection: "orders",
        depth: 2, // multiple level of ddata
        where: {
            user: {
                equals: user.id,
            }
        },
    })

    const purchasedProductFileIds = orders.map((order) => {
        return order.product.map((prod) => {
            if (typeof prod === "string") return req.payload.logger.error('Search depth not sufficient to find purchased file IDs')

            return typeof prod.product_files === "string" ? prod.product_files : prod.product_files.id //make sure it's an array for the ids of a product file
        })

    }).filter(Boolean).flat() //make sure it's an array for the ids of a product file

    return {
        id: {
            in: [...ownProductFileIds, ...purchasedProductFileIds] //combine the two arrays of ids] if what you need is in the array it'll return to you
        }
    }
}



export const ProductFiles: CollectionConfig = {
    slug: 'product_files',
    admin: {
        hidden: ({ user }) => user.role !== "admin",
    },
    hooks: {
        beforeChange: [addUser]
    },
    access: {
        read: yourOwnAndPurchased,
        update: ({ req }) => req.user.role === "admin",
        delete: ({ req }) => req.user.role === "admin",

    },
    upload: {
        staticURL: "/product_files",
        staticDir: "product_files",
        mimeTypes: ["image/*", "font/", "application/postscript"],
    },
    fields: [
        {
            name: "users",
            type: "relationship",
            relationTo: "users",
            admin: {
                condition: () => false,
            },
            hasMany: false,
            required: true,
        }
    ]
}