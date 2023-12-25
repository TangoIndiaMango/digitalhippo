"use client"

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/payload-types'

type Props = {
    product: Product
}

const AddToCartButton = ({product}: Props) => {

    const {addItem} = useCart()

    // show product was added to cart sucessfull
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsSuccess(false)

        }, 2000);

        return () => clearTimeout(timeout)
    }, [isSuccess])
    return (
        <Button onClick={() => {
            addItem(product)
            setIsSuccess(true)
            // console.log("added to cart")

        }}
            size='lg' className='w-full'>
            {isSuccess ? 'Added!' : 'Add to cart'}
        </Button>
    )
}

export default AddToCartButton