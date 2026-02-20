import { useEffect, useState } from 'react';

interface Slide {
    id: number;
    image: string;
    tag: string;
    title: string;
    titleHighlight?: string;
    description: string;
    buttonText: string;
    buttonLink: string;
}

const slides: Slide[] = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1600&q=80',
        tag: 'Autêntica culinária japonesa',
        title: 'Uma experiência',
        titleHighlight: 'única',
        description: 'Ingredientes frescos, técnicas tradicionais e um toque de modernidade em cada prato.',
        buttonText: 'Ver Cardápio',
        buttonLink: '#menu',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=1600&q=80',
        tag: 'Oferta especial',
        title: 'Promoção da semana',
        titleHighlight: '20% OFF',
        description: 'Use o cupom SAKURA20 no seu primeiro pedido e ganhe desconto especial!',
        buttonText: 'Pedir Agora',
        buttonLink: '#menu',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=1600&q=80',
        tag: 'Monte seu combo',
        title: 'Combos exclusivos',
        titleHighlight: 'para você',
        description: 'Peças selecionadas com preço especial. Perfeito para compartilhar ou saborear sozinho.',
        buttonText: 'Ver Combos',
        buttonLink: '#menu',
    },
];

export function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const slide = slides[currentSlide];

    return (
        <section className="relative flex items-center justify-center overflow-hidden h-125 sm:h-150">
            {/* Images */}
            {slides.map((s, index) => (
                <img
                    key={s.id}
                    src={s.image}
                    alt={s.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                />
            ))}

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-[#0d0d0d]" />

            {/* Content */}
            <div className="relative text-center px-5 w-full max-w-2xl mx-auto z-10">
                <p className="text-red-400 text-xs sm:text-sm tracking-[0.3em] uppercase mb-2 sm:mb-3 font-medium mt-3">
                    {slide.tag}
                </p>
                <h2 className="text-white text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
                    {slide.title}
                    {slide.titleHighlight && (
                        <>
                            <br />
                            <span className="text-red-500">{slide.titleHighlight}</span>
                        </>
                    )}
                    {!slide.titleHighlight && ' a cada peça'}
                </h2>
                <p className="text-gray-300 text-sm sm:text-lg max-w-lg mx-auto hidden sm:block">
                    {slide.description}
                </p>
                <a
                    href={slide.buttonLink}
                    className="inline-block mt-5 sm:mt-8 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl transition-colors text-sm sm:text-base"
                >
                    {slide.buttonText}
                </a>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors"
                aria-label="Slide anterior"
            >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors"
                aria-label="Próximo slide"
            >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                                ? 'bg-red-500 w-8'
                                : 'bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Ir para slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}