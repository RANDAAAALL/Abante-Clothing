"use client"

import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react";

export default function useAutoPlayCarousel(){
    const plugin = useRef(Autoplay({delay: 2000, stopOnInteraction: true}));

    return { plugin, pluginReset: plugin.current.reset , pluginStop: plugin.current.stop };
}