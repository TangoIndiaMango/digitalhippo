import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { PRODUCT_CATEGORIES } from ".././../config";
import { CollectionConfig } from "payload/types";
import { Product } from "../../payload-types";
import { stripe } from "../../lib/stripe";

const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
    const user = req.user

    return { ...data, user: user.id }
}

export const Products: CollectionConfig = {
    slug: "products",
    admin: {
        useAsTitle: "name",
    },
    access: {}, //who ccan acccess the product can anyone
    // get notified know what to do when a product is created
    hooks: {
        beforeChange: [
            addUser, async (args) => {
                if (args.operation === "create") {
                    const data = args.data as Product

                    const createProduct = await stripe.products.create({
                        name: data.name,
                        default_price_data: {
                            currency: "USD",
                            unit_amount: Math.round(data.price * 100),
                        },
                    })
                    const updated: Product = {
                        ...data,
                        stripId: createProduct.id,
                        priceId: createProduct.default_price as string,
                    }

                    return updated

                } else if (args.operation === "update") {
                    const data = args.data as Product

                    const updateProduct = await stripe.products.update(data.stripId!, {
                        name: data.name,
                        default_price: data.priceId!
                    })
                    const updated: Product = {
                        ...data,
                        stripId: updateProduct.id,
                        priceId: updateProduct.default_price as string,
                    }
                    return updated
                }
            }
        ]
    },
    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
            hasMany: false,
            admin: {
                condition: () => false //the product wont be available on admin dashboard
            },

        },
        {
            name: "name",
            label: "Name", //name that shows on the db
            type: "text",
            required: true, //every product has a name
        },
        {
            name: "description",
            type: "textarea",
            label: "Product Details",
        },
        {
            name: "price",
            label: "Price in USD",
            min: 0,
            max: 10000,
            type: "number",
            required: true,
        },
        {
            name: "category",
            label: "Category",
            type: "select",
            options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
            required: true,
        },
        {
            name: "product_files",
            label: "Product File(s)",
            type: "relationship",
            relationTo: "product_files", //collection
            required: true,
            hasMany: false, //has one product file

        },
        {
            name: "approvedForSale",
            label: "Product Status",
            type: "select",
            access: {
                create: ({ req }) => req.user.role === "admin",
                read: ({ req }) => req.user.role === "admin",
                update: ({ req }) => req.user.role === "admin",

            }, //provided by payload cms
            defaultValue: "pending",
            options: [
                {
                    label: "Pending verification",
                    value: "pending",
                },
                {
                    label: "Approved for sale",
                    value: "approved",
                },
                {
                    label: "Denied",
                    value: "denied",
                },
            ],
        },
        {
            name: "priceId",
            access: {
                create: () => false,
                read: () => false,
                update: () => false,
            },
            type: "text",
            admin: {
                hidden: true,
            },
        },
        {
            name: "stripId",
            access: {
                create: () => false,
                read: () => false,
                update: () => false,
            },
            type: "text",
            admin: {
                hidden: true,
            },
        },
        {
            name: "images",
            type: "array",
            label: "Product Images",
            minRows: 1,
            maxRows: 5,
            required: true,
            labels: {
                singular: "image",
                plural: "images"
            },
            fields: [
                {
                    name: "image",
                    type: "upload",
                    relationTo: "media",
                    required: true,
                }
            ]
        }
    ]
}