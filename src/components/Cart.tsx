"use client"

import React, { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { ShoppingCart } from 'lucide-react'
import { Separator } from './ui/separator'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { ScrollArea } from './ui/scroll-area'
import CartItem from './CartItem'
type Props = {}

const Cart = (props: Props) => {

    const [isMounted, setIsMounted] = useState<boolean>(false)
    const { items } = useCart()
    const itemCount = items.length

    useEffect(() => {
        setIsMounted(true)
    
    },[])

    const cartTotal = items.reduce((total, { product }) => total + product.price, 0)

    const fee = 1
    return (
        <Sheet>
            <SheetTrigger className='group -m-22 flex items-center p-2'>
                <ShoppingCart aria-hidden='true' className='h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500' />
                <span className='ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800'>{isMounted ? itemCount : 0}</span>
            </SheetTrigger>
            <SheetContent className='flex w-full flex-col pr-0 sm:max-w-lg'>
                <SheetHeader className='space-y-2.5 pr-6'>
                    <SheetTitle>Cart ({isMounted ? itemCount : 0})</SheetTitle>

                </SheetHeader>
                {itemCount > 0 ? (<>
                    <div className='flex w-full flex-col pr-6'>
                        {/* Cart Logic */}
                        <ScrollArea>{
                            items.map(({ product }) => (<CartItem key={product.id} product={product} />))
                        }</ScrollArea>
                    </div>
                    <div className='space-y-4 pr-6'>
                        <Separator />
                        <div className='space-y-1.5 text-sm'>
                            <div className='flex'>
                                <span className='flex-1'> Shipping</span>
                                <span className='text-right text-sm text-gray-500'>Free</span>
                            </div>
                            <div className='flex'>
                                <span className='flex-1'> Transaction Fee</span>
                                <span className='text-right text-sm text-gray-500'>{formatPrice(fee)}</span>
                            </div>
                            <div className='flex'>
                                <span className='flex-1'> Total</span>
                                <span className='text-right text-sm text-gray-500'>{formatPrice(cartTotal + fee)}</span>
                            </div>
                        </div>

                        <SheetFooter>
                            <SheetTrigger asChild>
                                <Link href='/cart' className={buttonVariants({
                                    className: 'w-full'
                                })}>Continue to checkout</Link>
                            </SheetTrigger>
                        </SheetFooter>
                    </div>
                </>) : (<div className='flex h-full flex-col items-center justify-center space-y-1'>
                    <div aria-hidden='true' className='relative mb-4 h-60 w-60 text-muted-foreground'>
                        <Image src='/hippo-empty-cart.png'
                            fill
                            alt='empty cart'
                        />
                    </div>
                    <div className='text-xl font-semibold text-gray-900'>Your cart is empty</div>
                    <SheetTrigger asChild>
                        <Link href='/products' className={buttonVariants({
                            variant: 'link',
                            size: 'sm',
                            className: 'text-sm text-muted-foreground'
                        })}>Add Items</Link>
                    </SheetTrigger>
                </div>)}
            </SheetContent>
        </Sheet>
    )
}

export default Cart