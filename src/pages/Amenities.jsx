import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

// Register plugins
gsap.registerPlugin(useGSAP, CustomEase);

// Create custom ease outside component
CustomEase.create(
  "hop",
  "M0,0 C0.083,0.294 0.117,0.767 0.413,0.908 0.606,1 0.752,1 1,1",
);

// Views data
const views = [
  {
    id: 1,
    name: "Swimming Pool",
    src: "/images/amenities/swimming-pool.webp",
  },
  {
    id: 2,
    name: "Podium",
    src: "/images/amenities/podium-view.webp",
  },
  {
    id: 3,
    name: "Pathway",
    src: "/images/amenities/pathway.webp",
  },
  {
    id: 4,
    name: "Multipurpose Hall",
    src: "/images/amenities/multipurpose-hall.webp",
  },
  {
    id: 5,
    name: "Fitness Center",
    src: "/images/amenities/fitness-center.webp",
  },
  {
    id: 6,
    name: "Floor Cut",
    src: "/images/amenities/floor-cut.webp",
  },
];

const Amenities = ({ duration = 1.2 }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const animatingRef = useRef(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Touch handling
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const minSwipeDistance = 50;

  // Accumulated delta for touchpad/mouse wheel
  const accumulatedDelta = useRef(0);
  const SCROLL_THRESHOLD = 80;

  // Lock body scroll
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100vh";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, []);

  // Calculate progress
  const totalSlides = views.length;
  const overallProgress = ((currentSlideIndex + 1) / totalSlides) * 100;

  // Animate text elements when slide becomes active
  const animateTextElements = (slideElement) => {
    const title = slideElement.querySelector(".slide-title");
    const counter = slideElement.querySelector(".slide-counter");

    if (title) {
      gsap.set(title, { opacity: 0, x: -30 });
      gsap.to(title, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });
    }

    if (counter) {
      gsap.set(counter, { opacity: 0, x: 30 });
      gsap.to(counter, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });
    }
  };

  const { contextSafe } = useGSAP(
    () => {
      const slider = containerRef.current.querySelector(".slider");
      let slideElements = slider.querySelectorAll(".slide");

      // Initialize all slides except first with clipPath hidden to the right
      slideElements.forEach((slide, index) => {
        if (index > 0) {
          gsap.set(slide, {
            clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
          });
          // Reset text for non-active slides
          const title = slide.querySelector(".slide-title");
          const counter = slide.querySelector(".slide-counter");
          if (title) gsap.set(title, { opacity: 0, x: -30 });
          if (counter) gsap.set(counter, { opacity: 0, x: 30 });
        }
      });

      // Animate first slide text
      const firstSlide = slideElements[0];
      if (firstSlide) {
        animateTextElements(firstSlide);
      }

      // Navigate to next slide (horizontal: left)
      const handleSliderNext = () => {
        if (animatingRef.current) return;

        slideElements = slider.querySelectorAll(".slide");
        const currentIdx = parseInt(
          slideElements[0].getAttribute("data-slide-index"),
        );

        // Prevent going past last slide
        if (currentIdx >= views.length - 1) return;

        animatingRef.current = true;

        const firstSlide = slideElements[0];
        const secondSlide = slideElements[1];

        if (slideElements.length > 1) {
          const nextSlideIndex = parseInt(
            secondSlide.getAttribute("data-slide-index"),
          );
          setCurrentSlideIndex(nextSlideIndex);

          const firstAnimTarget = firstSlide.querySelector(".slide-content");
          const secondAnimTarget = secondSlide.querySelector(".slide-content");

          // Set initial position for incoming slide content
          gsap.set(secondAnimTarget, { x: 300 });

          // Animate incoming slide content
          gsap.to(secondAnimTarget, {
            x: 0,
            duration: duration,
            ease: "hop",
          });

          // Animate outgoing slide content
          gsap.to(firstAnimTarget, {
            x: -300,
            duration: duration,
            ease: "hop",
          });

          // Reveal incoming slide with horizontal clipPath
          gsap.to(secondSlide, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: duration,
            ease: "hop",
            onUpdate: function () {
              const progress = this.progress();
              if (progress >= 0.33 && !secondSlide.dataset.textAnimated) {
                secondSlide.dataset.textAnimated = "true";
                animateTextElements(secondSlide);
              }
            },
            onComplete: function () {
              // Reset outgoing slide's text
              const firstSlideTitle = firstSlide.querySelector(".slide-title");
              const firstSlideCounter =
                firstSlide.querySelector(".slide-counter");
              if (firstSlideTitle)
                gsap.set(firstSlideTitle, { opacity: 0, x: -30 });
              if (firstSlideCounter)
                gsap.set(firstSlideCounter, { opacity: 0, x: 30 });

              // Move first slide to end
              firstSlide.remove();
              slider.appendChild(firstSlide);

              // Reset clipPath for moved slide
              gsap.set(firstSlide, {
                clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
              });

              delete secondSlide.dataset.textAnimated;
              animatingRef.current = false;
            },
          });
        } else {
          animatingRef.current = false;
        }
      };

      // Navigate to previous slide (horizontal: right)
      const handleSliderPrev = () => {
        if (animatingRef.current) return;

        // Prevent going before first slide
        if (currentSlideIndex <= 0) return;

        animatingRef.current = true;

        slideElements = slider.querySelectorAll(".slide");
        const lastSlide = slideElements[slideElements.length - 1];
        const currentSlide = slideElements[0];

        if (slideElements.length > 1) {
          const prevSlideIndex = parseInt(
            lastSlide.getAttribute("data-slide-index"),
          );
          setCurrentSlideIndex(prevSlideIndex);

          const currentAnimTarget =
            currentSlide.querySelector(".slide-content");
          const lastAnimTarget = lastSlide.querySelector(".slide-content");

          // Reset incoming slide's text
          const lastSlideTitle = lastSlide.querySelector(".slide-title");
          const lastSlideCounter = lastSlide.querySelector(".slide-counter");
          if (lastSlideTitle) gsap.set(lastSlideTitle, { opacity: 0, x: -30 });
          if (lastSlideCounter)
            gsap.set(lastSlideCounter, { opacity: 0, x: 30 });

          // Move last slide to front
          slider.removeChild(lastSlide);
          slider.insertBefore(lastSlide, currentSlide);

          // Set up incoming slide (coming from left)
          gsap.set(lastSlide, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          });
          gsap.set(lastAnimTarget, { x: -300 });
          gsap.set(currentAnimTarget, { x: 0 });

          // Animate incoming slide content
          gsap.to(lastAnimTarget, {
            x: 0,
            duration: duration,
            ease: "hop",
          });

          // Animate outgoing slide content
          gsap.to(currentAnimTarget, {
            x: 300,
            duration: duration,
            ease: "hop",
          });

          // Hide outgoing slide with horizontal clipPath
          gsap.to(currentSlide, {
            clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
            duration: duration,
            ease: "hop",
            onUpdate: function () {
              const progress = this.progress();
              if (progress >= 0.33 && !lastSlide.dataset.textAnimated) {
                lastSlide.dataset.textAnimated = "true";
                animateTextElements(lastSlide);
              }
            },
            onComplete: function () {
              // Reset outgoing slide's text
              const currentSlideTitle =
                currentSlide.querySelector(".slide-title");
              const currentSlideCounter =
                currentSlide.querySelector(".slide-counter");
              if (currentSlideTitle)
                gsap.set(currentSlideTitle, { opacity: 0, x: -30 });
              if (currentSlideCounter)
                gsap.set(currentSlideCounter, { opacity: 0, x: 30 });

              gsap.set(currentAnimTarget, { x: 0 });
              delete lastSlide.dataset.textAnimated;
              animatingRef.current = false;
            },
          });
        } else {
          animatingRef.current = false;
        }
      };

      // Handle wheel events (both horizontal and vertical scroll)
      const handleWheel = contextSafe((event) => {
        if (animatingRef.current) {
          accumulatedDelta.current = 0;
          return;
        }

        // Use deltaX for horizontal scroll, deltaY for vertical
        const delta =
          Math.abs(event.deltaX) > Math.abs(event.deltaY)
            ? event.deltaX
            : event.deltaY;

        accumulatedDelta.current += delta;

        if (Math.abs(accumulatedDelta.current) >= SCROLL_THRESHOLD) {
          if (accumulatedDelta.current > 0) {
            handleSliderNext();
          } else {
            handleSliderPrev();
          }
          accumulatedDelta.current = 0;
        }
      });

      window.addEventListener("wheel", handleWheel, { passive: true });
      window.handleSliderNext = handleSliderNext;
      window.handleSliderPrev = handleSliderPrev;

      return () => {
        window.removeEventListener("wheel", handleWheel);
        delete window.handleSliderNext;
        delete window.handleSliderPrev;
      };
    },
    { scope: containerRef, dependencies: [currentSlideIndex] },
  );

  // Touch event handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;

    // Only respond to horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > minSwipeDistance) {
        // Swipe left -> next slide
        if (window.handleSliderNext) {
          window.handleSliderNext();
        }
      } else if (deltaX < -minSwipeDistance) {
        // Swipe right -> previous slide
        if (window.handleSliderPrev) {
          window.handleSliderPrev();
        }
      }
    }

    touchStartX.current = 0;
    touchStartY.current = 0;
    touchEndX.current = 0;
    touchEndY.current = 0;
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (window.handleSliderNext) window.handleSliderNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (window.handleSliderPrev) window.handleSliderPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleBackToMenu = () => {
    navigate("/", { state: { menuOpen: true } });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        overscrollBehavior: "none",
        touchAction: "none",
      }}
    >
      {/* Logo - Top Left */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50">
        <img
          src="/images/logo.svg"
          alt="Logo"
          className="h-8 sm:h-10 md:h-12 w-auto"
        />
      </div>

      {/* Close Button - Top Right */}
      <button
        onClick={handleBackToMenu}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/40 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 cursor-pointer group"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Navigation Arrows */}
      <button
        onClick={() => window.handleSliderPrev && window.handleSliderPrev()}
        className={`fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 cursor-pointer group ${
          currentSlideIndex === 0
            ? "opacity-30 pointer-events-none"
            : "opacity-100"
        }`}
        disabled={currentSlideIndex === 0}
      >
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:-translate-x-0.5 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={() => window.handleSliderNext && window.handleSliderNext()}
        className={`fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 cursor-pointer group ${
          currentSlideIndex === totalSlides - 1
            ? "opacity-30 pointer-events-none"
            : "opacity-100"
        }`}
        disabled={currentSlideIndex === totalSlides - 1}
      >
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:translate-x-0.5 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slider Container */}
      <div className="slider absolute top-0 left-0 w-full h-full overflow-hidden">
        {views.map((view, index) => (
          <div
            key={view.id}
            data-slide-index={index}
            className="slide absolute top-0 left-0 w-full h-full overflow-hidden will-change-transform"
          >
            <div className="slide-content absolute top-0 left-0 w-screen h-screen bg-black flex items-center justify-center">
              {/* Image */}
              <img
                src={view.src}
                alt={view.name}
                className="w-full h-full object-cover"
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />

              {/* Title - Bottom Left */}
              <div className="absolute left-6 sm:left-10 md:left-16 lg:left-24 bottom-20 sm:bottom-24 md:bottom-28 lg:bottom-32 z-30">
                <h2 className="slide-title text-white tracking-wider font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] opacity-0">
                  {view.name}
                </h2>
              </div>

              {/* Counter - Bottom Right */}
              <div className="absolute right-6 sm:right-10 md:right-16 lg:right-24 bottom-20 sm:bottom-24 md:bottom-28 lg:bottom-32 z-30">
                <span className="slide-counter text-white/80 tracking-widest font-light text-lg sm:text-xl md:text-2xl opacity-0">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(totalSlides).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar - Bottom Center */}
      <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[60%] sm:w-[50%] md:w-[40%] lg:w-[30%]">
        <div className="relative w-full h-0.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500 ease-out rounded-full"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center items-center gap-2 mt-3">
          {views.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (animatingRef.current || index === currentSlideIndex) return;

                const diff = index - currentSlideIndex;
                if (diff > 0) {
                  for (let i = 0; i < diff; i++) {
                    setTimeout(() => {
                      if (window.handleSliderNext) window.handleSliderNext();
                    }, i * 100);
                  }
                } else {
                  for (let i = 0; i < Math.abs(diff); i++) {
                    setTimeout(() => {
                      if (window.handleSliderPrev) window.handleSliderPrev();
                    }, i * 100);
                  }
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlideIndex
                  ? "bg-white scale-125"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Amenities;
