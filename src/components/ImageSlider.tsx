"use client"

import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css" //note for swiper to work
import "swiper/css/pagination"
import type SwiperType from 'swiper'
import { Pagination } from 'swiper/modules'
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
type ImageSliderProps = {
    urls: string[];
}

const ImageSlider = ({ urls }: ImageSliderProps) => {
    const [swiper, setSwiper] = useState<null | SwiperType>(null)

    // images cover array we will be on the first at default
    const [activeIndex, setActiveIndex] = useState(0)

    const [slidConfig, setSlideConfig] = useState({
        isBeginning: true,
        isEnd: activeIndex === (urls.length ?? 0) - 1
    })

    useEffect(() => {
        swiper?.on("slideChange", ({ activeIndex }) => {
            setActiveIndex(activeIndex)
            setSlideConfig({
                isBeginning: activeIndex === 0,
                isEnd: activeIndex === (urls.length ?? 0) - 1,
            })
        })
    }, [swiper, urls])

    const activeStyles = "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300"

    const inactiveStyles = "hidden text-gray-400"

    return (
        <div className='group relative bg-zinc-100  aspect-square overflow-hidden rounded-xl'>
            <div className='absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition:'>
                <button
                onClick={(e) => {
                    e.preventDefault()
                    swiper?.slideNext()
                }}
                 className={cn(activeStyles, "right-3 transition", {
                    [inactiveStyles] : slidConfig.isEnd,
                    "hover:bg-primary-300 text-primary-800 opacity-100": !slidConfig.isEnd
                })}
                aria-label='Next Image'>
                    <ChevronRightIcon className='h-4 w-4 text-zinc-700 '/> {' '}
                </button>
                <button
                onClick={(e) => {
                    e.preventDefault()
                    swiper?.slidePrev()

                }}
                className={cn(activeStyles, "left-3 transition", {
                    [inactiveStyles] : slidConfig.isBeginning,
                    "hover:bg-primary-300 text-primary-800 opacity-100": !slidConfig.isBeginning
                })}
                aria-label='Previous Image'
                >
                    <ChevronLeftIcon className='h-4 w-4 text-zinc-700 '/> {' '}
                </button>
            </div>

            <Swiper 
            pagination={{
                renderBullet: (_, className) => {
                    return `<span class="${className} rounded-full transition"></span>`
                }
            }}
            onSwiper={(swiper) => setSwiper(swiper)}
                spaceBetween={50}
                modules={[Pagination]}
                slidesPerView={1}
                className='h-full w-full'>
                {urls.map((url, index) => (<SwiperSlide key={index} className='-z-10 relative h-full w-full'>
                    <Image
                        fill
                        loading='eager'
                        className='-z-10 h-full w-full object-cover object-center'
                        src={url}
                        alt='Product Image' />
                </SwiperSlide>))}
            </Swiper>
        </div>
    )
}

export default ImageSlider