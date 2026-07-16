import { useState } from 'react'

interface PhotoCarouselProps {
  images: { src: string; alt: string }[]
}

export default function PhotoCarousel({ images }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0)

  function go(delta: number) {
    setIndex((current) => (current + delta + images.length) % images.length)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-2xl border border-border">
        <div
          className="flex aspect-[4/3] transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((image) => (
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              className="h-full w-full shrink-0 object-cover"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Foto anterior"
          className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground transition-opacity hover:opacity-80"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Próxima foto"
          className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-foreground transition-opacity hover:opacity-80"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-center gap-2">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ir para foto ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
