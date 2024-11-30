'use client'

import React, { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

const LenisComponent: React.FC = () => {
    useEffect(() => {
        const lenis = new Lenis()

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [])

    return null
}

export default LenisComponent