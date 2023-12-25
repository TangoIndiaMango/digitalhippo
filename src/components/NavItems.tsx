"use client"

import { PRODUCT_CATEGORIES } from '@/config'
import React, { useEffect, useRef, useState } from 'react'
import NavItem from './NavItem'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'

type Props = {}

const NavItems = (props: Props) => {
    const [activeIndex, setActiveIndex] = useState<null | Number>(null)

    useEffect(() => {
      const handler = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setActiveIndex(null)
        }
      }

      document.addEventListener('keydown', handler)

      return () => {
        document.removeEventListener('keydown', handler)

      }
    }, [])
    

    const isAnyOpen = activeIndex !== null

    const navRef = useRef<HTMLDivElement | null>(null)

    useOnClickOutside(navRef, () => setActiveIndex(null))
    return (
        <div className='flex gap-4 h-full' ref={navRef}>
            {PRODUCT_CATEGORIES.map((category, index) => {
                const handleOpen = () => {
                    if (activeIndex === index) {
                        setActiveIndex(null)
                    } else {
                        setActiveIndex(index)
                    }
                }

                const isOpen = index === activeIndex

                return (
                    <NavItem category={category} handleOpen={handleOpen} isOpen={isOpen} key={category.value} isAnyOpen={isAnyOpen} />
                )
            })}
        </div>
    )
}

export default NavItems