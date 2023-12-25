"use client"

import React, { PropsWithChildren, useState } from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from '@/trpc/client';
import { httpBatchLink } from '@trpc/client';
type Props = {}

// allows us to use trpc throughout----PropsWithChildren is a react type that just helps rather than denoting children: ReactNode
const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() => trpc.createClient({
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include' //works properly through express and cookies will be passed
          })
        }
      })
    ]
  }))

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}
      >
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default Providers