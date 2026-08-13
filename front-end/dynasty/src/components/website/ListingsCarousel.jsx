import { useCallback } from "react";

import useEmblaCarousel from "embla-carousel-react";

import Autoplay from "embla-carousel-autoplay";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ListingCarouselCard from "./ListingCarouselCard";

export default function ListingsCarousel({
  listings,
}) {

  const [emblaRef, emblaApi] =
    useEmblaCarousel(
      {
        loop: true,
        align: "start",
      },
      [
        Autoplay({
          delay: 3000,
          stopOnInteraction: false,
        }),
      ]
    );

  const scrollPrev = useCallback(() => {

    if (emblaApi)
      emblaApi.scrollPrev();

  }, [emblaApi]);

  const scrollNext = useCallback(() => {

    if (emblaApi)
      emblaApi.scrollNext();

  }, [emblaApi]);

  return (

  <div className="relative">

    {/* Left Arrow */}

    <button
      onClick={scrollPrev}
      className="
        absolute
        left-0
        top-1/2
        -translate-y-1/2
        z-20

        w-12
        h-12

        rounded-full

        border
        border-[#C9A758]

        bg-black/70
        backdrop-blur

        text-[#C9A758]

        hover:bg-[#C9A758]
        hover:text-black

        transition-all
        duration-300
      "
    >
      <ChevronLeft size={22} />
    </button>



    {/* Right Arrow */}

    <button
      onClick={scrollNext}
      className="
        absolute
        right-0
        top-1/2
        -translate-y-1/2
        z-20

        w-12
        h-12

        rounded-full

        border
        border-[#C9A758]

        bg-black/70
        backdrop-blur

        text-[#C9A758]

        hover:bg-[#C9A758]
        hover:text-black

        transition-all
        duration-300
      "
    >
      <ChevronRight size={22} />
    </button>



    {/* Embla Viewport */}

    <div
      ref={emblaRef}
      className="overflow-hidden"
    >

      <div className="flex">

        {listings.map((listing) => (

          <div
            key={listing.id}
            className="
              flex-[0_0_100%]
              md:flex-[0_0_50%]
              xl:flex-[0_0_33.333%]

              px-4
            "
          >

            <ListingCarouselCard
              listing={listing}
            />

          </div>

        ))}

      </div>

    </div>

  </div>

);}