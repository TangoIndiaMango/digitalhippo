"use client"

import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

type Props = {
  orderEmail: string;
  orderId: string;
  isPaid: boolean;
}

const PaymentStatus = ({ orderEmail, orderId, isPaid }: Props) => {
  const { data } = trpc.paymnet.pollOrderStatus.useQuery({ orderId }, {
    enabled: isPaid === false,
    refetchInterval: (data) => (data?.isPaid ? false : 1000),
  })

  const router = useRouter()

  useEffect(() => {
    if (data?.isPaid) router.refresh()

  }, [data?.isPaid, router])


  return (
    <div className='mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600'>
      <div>
        <p className='font-medium text-gray-900'>Shipping To</p>
        <p>{orderEmail}</p>
      </div>


      <div>
        <p className='font-medium text-gray-900'>Order Status</p>
        <p>{isPaid ? "Payment Successfull" : "Pending Payment"}</p>

      </div>
    </div>
  )
}

export default PaymentStatus