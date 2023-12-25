import { cn } from '@/lib/utils'
import React from 'react'

type Props = {
    className?: string,
    children: React.ReactNode
}

const MaxWidthWrapper = ({ className, children }: Props) => {
    return (
        <div className={cn('mx-auto w-full max-w-screen-xl px-2.5 mdd:px-20', className)}>{children}</div>
    )
}

export default MaxWidthWrapper