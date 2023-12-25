"use client"
import { TQueryValidators } from '@/lib/validators/queryValidators'
import { Product } from '@/payload-types'
import { trpc } from '@/trpc/client'
import Link from 'next/link'
import React from 'react'
import ProductListing from './ProductListing'

type ProductReelProps = {
  title: string
  subtitlle?: string
  href?: string
  query: TQueryValidators
}

const FALLBACK_LIMIT = 4

const ProductReel = ({ title, subtitlle, href, query }: ProductReelProps) => {

  const { data: queryResult, isLoading } = trpc.getInfiniteProduct.useInfiniteQuery({
    limit: query.limit ?? FALLBACK_LIMIT,
    query
  }, {
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })

  const products = queryResult?.pages.flatMap((page) => page.items)

  let map: (Product | null)[] = []
  if (products && products.length) {
    map = products
  } else if (isLoading) {
    // have as many skeleton button just like waht will be displayed
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null)
  }

  // console.log(data)
  return (
    <section className='py-12'>
      <div className='md:flex md:items-center md:justify-between mb-4'>
        <div className='max-w-2xl px-4lg:max-w-4xl lg:px-0'>
          {title ? <h1 className='text-2xl font-bold text-gray-600 sm:text-3xl text-center'>{title}</h1> : null}

          {subtitlle ? <p className='mt-2 text-sm text-muted-foreground'>{subtitlle}</p> : null}
        </div>


        {
          href ? <Link href={href} className='hidden text-sm font-medium text-grey-600 hover:text-grey-400 md:block'> Shop the collection{' '} <span arial-hidden="true">&rarr;</span></Link> : null
        }
      </div>

      <div className='relative'>
        <div className='mt-6 flex items-center w-full'>
          <div className='w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-y-8'>
            {map.map((product, i) => (
              <ProductListing key={`product-${i}`} product={product} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductReel