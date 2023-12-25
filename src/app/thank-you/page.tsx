import { getServerSideUser } from '@/lib/payload-utils';
import Image from 'next/image'
import React from 'react'
import { cookies } from "next/headers";
import { getPayloadClient } from '@/getPayload';
import { notFound, redirect } from 'next/navigation';
import { Product, ProductFile, User } from '@/payload-types';
import { PRODUCT_CATEGORIES } from '@/config';
import { ProductFiles } from '../../collections/Products/ProductFile';
import { formatPrice } from '@/lib/utils';
import { Order } from '../../payload-types';
import Link from 'next/link';
import PaymentStatus from '@/components/PaymentStatus';

type Props = {
    params: {
        [key: string]: string | string[] | undefined;
    }
}

const ThankYouPage = async ({ params }: Props) => {
    const orderId = params.orderId

    const nextCookies = cookies();
    const { user } = await getServerSideUser(nextCookies);

    const payload = await getPayloadClient()
    const { docs: orders } = await payload.find({
        collection: "orders",
        depth: 2, //give us the actual data instead of the id
        where: {
            id: {
                equals: orderId
            }
        }
    })

    const [order] = orders

    if (!order) return notFound()
    //confirm the user and if he's the one that purchase
    const orderUserId = typeof order.user === "string" ? order.user : order.user.id
    if (user && orderUserId !== user.id) {
        return redirect(`/sign-in?origin=thank-you?orderId=${order.id}`)
    }
    const products = order.product as Product[]
    const orderTotal = products.reduce((total, product) => {
        return total + product.price
    }, 0)


    return (
        <main className='relative lg:min-h-full'>
            <div className='hidden md:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12'>
                <Image fill src='/checkout-thank-you.jpg' className='h-full w-full object-cover object-center'
                    alt='Checkout thank you'
                />
            </div>

            <div>
                <div className='mx-auto  max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24'>
                    <div className='lg:col-start-2'>
                        <p className='text-sm font-medium text-blue-500'>Order Successful</p>
                        <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>Thank you for your order!</h1>

                        {order._isPaid ? (<p className='mt-2 text-base text-muted-foreground'>
                            Your order was processed and your assests are available to download below we&apos;ve send your reciept and order details to{' '} {typeof order.user !== "string" ? <span className='font-bold text-grey-500'>{order.user.email}</span> : null}
                        </p>) : (<p className='mt-2 text-base text-muted-foreground'>We appreciate your order and we are currently processing it. Hang tight as you&apos;ll get a confirmation soon</p>)}

                        <div className='mt-16 text-sm font-medium'>
                            <div className='text-muted-foreground'> Order No.</div>
                            <div className='mt-2 text-grey-500'> {order.id}</div>

                        </div>
                        <ul className='mt-8 space-y-4 text-sm font-medium text-muted-foreground'>
                            {(order.product as Product[]).map((product) => {
                                const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label
                                const downloadUrl = (product.product_files as ProductFile).url as string

                                const { image } = product.images[0]
                                return (
                                    <li key={product.id} className='flex space-x-6 py-6'>
                                        <div className='relative h-24 w-24'>
                                            {typeof image !== "string" && image.url ? (
                                                <Image fill alt={`${product.name} image`} src={image.url}
                                                    className='flex-none rounded-md bg-slate-200 object-cover object-center'
                                                />
                                            ) : null}
                                        </div>

                                        <div className='flex-auto flex flex-col justify-between'>
                                            <div className='space-y-1'>
                                                <p className='text-grey-900'>
                                                    {product.name}
                                                </p>
                                                <p className='my-1'>
                                                    {label}
                                                </p>

                                            </div>
                                            {order._isPaid ? (<a href={downloadUrl} download={product.name} className='text-blue-500 hover:underline underline-offset-1'>
                                                Download Asset
                                            </a>) : null}
                                        </div>

                                        <p className='flex-none font-medium text-green-500'>{formatPrice(product.price)}</p>
                                    </li>
                                )
                            })}
                        </ul>

                        <div className='space-y-6 border-t border-gray-200 pt-6 font-medium text-sm text-muted-foreground'>
                            <div className='flex justify-between'>
                                <p>Subtotal</p>
                                <p className='text-gray-900'>{formatPrice(orderTotal)}</p>
                            </div>
                            <div className='flex justify-between'>
                                <p>Transaction Fee</p>
                                <p className='text-gray-900'>{formatPrice(1)}</p>
                            </div>
                            <div className='flex justify-between text-gray-900 border-t border-gray-200'>
                                <p className='text-base'>Total</p>
                                <p className='text-base'>{formatPrice(orderTotal + 1)}</p>
                            </div>

                        </div>

                        <PaymentStatus isPaid={order._isPaid} orderEmail={(order.user as User).email} orderId={order.id}/>
                        <div className='mt-16 border-t border-gray-200 py-6 text-right'>
                            <Link href='/product' className='text-sm font-medium text-blue-600 hover:text-blue-500'> Continue Shopping <span aria-hidden='true'> &rarr;</span></Link>
                        Pa</div>
                    </div>
                </div>
                 
            </div>

        </main >
    )
}

export default ThankYouPage