
import React, { useState, useEffect } from 'react';
import { SliderConfig, SliderMode, AspectRatio, ObjectFit, ImageItem, SlideDirection, TransitionStyle } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderProps {
  config: SliderConfig;
}

const Slider: React.FC<SliderProps> = ({ config }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    images,
    mode,
    direction,
    transitionStyle,
    aspectRatio,
    customAspectWidth,
    customAspectHeight,
    objectFit,
    showArrows,
    showDots,
    autoPlay,
    interval,
    borderRadius,
    gap,
  } = config;

  const nextSlide = () => {
    if (isAnimating || images.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 700);
  };

  const prevSlide = () => {
    if (isAnimating || images.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 700);
  };

  // Auto-play logic respecting the visual direction flow
  useEffect(() => {
    if (autoPlay && images.length > 1 && mode !== SliderMode.LINEAR) {
      const timer = setInterval(() => {
        // If RTL, the flow is "forwards" (next index)
        // If LTR, the flow is "backwards" visually, or we progress index but images come from left
        // Actually, to make auto-play feel consistent with the setting:
        // RTL auto-play should move content Left (next slide)
        // LTR auto-play should move content Right (prev slide)
        if (direction === SlideDirection.RTL) {
          nextSlide();
        } else {
          prevSlide();
        }
      }, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, images.length, mode, direction, isAnimating]);

  const getAspectStyle = (): React.CSSProperties => {
    switch (aspectRatio) {
      case AspectRatio.SQUARE: return { aspectRatio: '1 / 1' };
      case AspectRatio.LANDSCAPE: return { aspectRatio: '16 / 9' };
      case AspectRatio.PORTRAIT: return { aspectRatio: '4 / 5' };
      case AspectRatio.CLASSIC: return { aspectRatio: '4 / 3' };
      case AspectRatio.CUSTOM: return { aspectRatio: `${customAspectWidth} / ${customAspectHeight}` };
      default: return { aspectRatio: 'auto' };
    }
  };

  const getImageFilter = (item: ImageItem) => {
    return `grayscale(${item.grayscale}%) sepia(${item.sepia}%) brightness(${item.brightness}%) contrast(${item.contrast}%)`;
  };

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg text-gray-400 italic">
        No images added yet.
      </div>
    );
  }

  // Linear mode (Horizontal scrolling strip)
  if (mode === SliderMode.LINEAR) {
    return (
      <div 
        className="w-full overflow-x-auto no-scrollbar flex items-start"
        style={{ gap: `${gap}px`, direction: direction === SlideDirection.RTL ? 'ltr' : 'rtl' }}
      >
        {images.map((item, idx) => (
          <div 
            key={idx} 
            className="flex-shrink-0 relative overflow-hidden"
            style={{ 
              borderRadius: `${borderRadius}px`,
              width: aspectRatio === AspectRatio.AUTO ? 'auto' : '85%',
              ...getAspectStyle()
            }}
          >
            <img 
              src={item.url} 
              alt={`Slide ${idx}`} 
              className="w-full h-full"
              style={{ 
                objectFit,
                filter: getImageFilter(item)
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  // Helper to calculate slide positions and transforms
  const getSlideStyle = (idx: number): React.CSSProperties => {
    const isCurrent = currentIndex === idx;
    
    // Calculate shortest path offset for circular wrapping
    let offset = idx - currentIndex;
    const half = images.length / 2;
    if (offset > half) offset -= images.length;
    if (offset < -half) offset += images.length;

    // Visual Direction Adjustment:
    // RTL: Next (offset +1) is on the Right.
    // LTR: Next (offset +1) is on the Left.
    const visualOffset = direction === SlideDirection.RTL ? offset : -offset;

    if (mode === SliderMode.FADE) {
      return {
        opacity: isCurrent ? 1 : 0,
        zIndex: isCurrent ? 10 : 0,
        transition: 'opacity 0.7s ease-in-out',
        pointerEvents: isCurrent ? 'auto' : 'none'
      };
    }

    // mode === SliderMode.CAROUSEL
    if (transitionStyle === TransitionStyle.WHEEL) {
      // Circular 3D rotation logic
      const anglePerSlide = 360 / Math.max(images.length, 4); 
      const rotationY = visualOffset * (images.length > 4 ? anglePerSlide : 45);
      const translateZ = 400; // Radius of the wheel
      const opacity = Math.max(0, 1 - Math.abs(visualOffset) * 0.6);
      const scale = isCurrent ? 1 : 0.85;

      return {
        opacity: opacity,
        transform: `rotateY(${rotationY}deg) translateZ(${translateZ}px) scale(${scale})`,
        zIndex: isCurrent ? 20 : 10 - Math.abs(Math.round(visualOffset)),
        transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease',
        pointerEvents: isCurrent ? 'auto' : 'none',
        visibility: Math.abs(visualOffset) > 2 ? 'hidden' : 'visible'
      };
    }

    // Standard Slide Transition
    return {
      transform: `translateX(${visualOffset * 100}%)`,
      zIndex: isCurrent ? 10 : 5,
      transition: 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
      pointerEvents: isCurrent ? 'auto' : 'none'
    };
  };

  return (
    <div 
      className="relative group w-full overflow-hidden select-none" 
      style={{ 
        borderRadius: `${borderRadius}px`,
        perspective: transitionStyle === TransitionStyle.WHEEL ? '1200px' : 'none'
      }}
    >
      <div 
        className={`relative w-full ${transitionStyle === TransitionStyle.WHEEL ? 'transform-gpu' : ''}`}
        style={{
          ...getAspectStyle(),
          transformStyle: transitionStyle === TransitionStyle.WHEEL ? 'preserve-3d' : 'flat'
        }}
      >
        {images.map((item, idx) => (
          <div
            key={idx}
            className="absolute inset-0 w-full h-full"
            style={getSlideStyle(idx)}
          >
            <img 
              src={item.url} 
              alt={`Slide ${idx}`} 
              className="w-full h-full"
              style={{ 
                objectFit,
                filter: getImageFilter(item),
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            />
            {/* Soft shadow for 3D mode */}
            {transitionStyle === TransitionStyle.WHEEL && !isAnimating && currentIndex !== idx && (
              <div className="absolute inset-0 bg-black/10 pointer-events-none transition-opacity" />
            )}
          </div>
        ))}
      </div>

      {showArrows && images.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/20 backdrop-blur-lg text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/50 active:scale-90"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/20 backdrop-blur-lg text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/50 active:scale-90"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {showDots && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 p-1.5 bg-black/10 backdrop-blur-md rounded-full">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
