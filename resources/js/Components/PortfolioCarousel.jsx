import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ArrowRight, Building2, Sparkles } from 'lucide-react';

export default function PortfolioCarousel({ items = [] }) {
    if (!items || items.length === 0) return null;

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [items.length]);

    const activeItem = items[currentIndex];

    return (
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl text-white">
            {/* Background Image with Overlay */}
            <div className="relative h-[380px] sm:h-[460px] w-full">
                <img
                    src={activeItem.cover_image}
                    alt={activeItem.title}
                    className="w-full h-full object-cover opacity-50 transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/70 to-transparent" />
            </div>

            {/* Slide Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 z-10">
                <div className="max-w-2xl space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-white shadow-md flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Featured Project</span>
                        </span>
                        {activeItem.client && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-neutral-300 backdrop-blur-md flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5 text-primary-light" />
                                {activeItem.client.name}
                            </span>
                        )}
                    </div>

                    <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
                        {activeItem.title}
                    </h2>

                    <p className="text-neutral-300 text-sm sm:text-base leading-relaxed line-clamp-2">
                        {activeItem.description}
                    </p>

                    <div className="pt-2">
                        <Link
                            href={`/portfolio/${activeItem.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all"
                        >
                            <span>Read Full Case Study</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white flex items-center justify-center transition-all z-20"
                aria-label="Previous Project"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white flex items-center justify-center transition-all z-20"
                aria-label="Next Project"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 right-6 sm:right-12 flex items-center gap-2 z-20">
                {items.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-white/30 hover:bg-white/60'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
