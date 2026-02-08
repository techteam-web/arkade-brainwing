import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const FloorPlans = () => {
  const [activeWing, setActiveWing] = useState('A');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const imageContainerRef = useRef(null);
  const headerRef = useRef(null);
  const controlsRef = useRef(null);
  const zoomControlsRef = useRef(null);

  const wings = [
    { id: 'A', label: 'Wing A', image: '/images/floorplans/Wing-A-TypicalFloorPlan.jpg' },
    { id: 'B', label: 'Wing B', image: '/images/floorplans/Wing-B-TypicalFloorPlan.jpg' },
    { id: 'C', label: 'Wing C', image: '/images/floorplans/Wing-C-TypicalFloorPlan.jpg' },
  ];

  const currentWing = wings.find(w => w.id === activeWing);

  // Initial animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([headerRef.current, controlsRef.current, zoomControlsRef.current, imageContainerRef.current], {
        opacity: 0,
      });

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(headerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      });

      tl.to(controlsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }, '-=0.4');

      tl.to(imageContainerRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
      }, '-=0.4');

      tl.to(zoomControlsRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.5,
      }, '-=0.3');

      setIsLoaded(true);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Wing change animation
  useEffect(() => {
    if (isLoaded && imageRef.current) {
      gsap.fromTo(imageRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      );
      // Reset zoom and position on wing change
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [activeWing, isLoaded]);

  // Zoom with mouse wheel
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale(prev => {
      const newScale = Math.min(Math.max(prev + delta, 0.5), 5);
      // Reset position if zooming out to 1 or below
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, []);

  // Pan functionality
  const handleMouseDown = useCallback((e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  }, [scale, position]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging && scale > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Calculate bounds based on scale
      const maxOffset = (scale - 1) * 300;
      
      setPosition({
        x: Math.min(Math.max(newX, -maxOffset), maxOffset),
        y: Math.min(Math.max(newY, -maxOffset), maxOffset),
      });
    }
  }, [isDragging, dragStart, scale]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch support for mobile
  const handleTouchStart = useCallback((e) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  }, [scale, position]);

  const handleTouchMove = useCallback((e) => {
    if (isDragging && scale > 1 && e.touches.length === 1) {
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      
      const maxOffset = (scale - 1) * 300;
      
      setPosition({
        x: Math.min(Math.max(newX, -maxOffset), maxOffset),
        y: Math.min(Math.max(newY, -maxOffset), maxOffset),
      });
    }
  }, [isDragging, dragStart, scale]);

  // Zoom controls
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.5, 0.5);
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  const handleResetZoom = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    });
  };

  const handleBackToMenu = () => {
    navigate('/', { state: { menuOpen: true } });
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      {/* Custom Font Faces */}
      <style>{`
        @font-face {
          font-family: 'Sallim';
          src: url('/fonts/Sallim.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
        }
        
        @font-face {
          font-family: 'Arboria';
          src: url('/fonts/ARBORIA-BOOK.TTF') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0f0c14 0%, #1a1520 50%, #15121a 100%)'
          }}
        />
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        {/* Ambient glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(ellipse, rgba(200,150,100,0.15) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Header */}
      <div 
        ref={headerRef}
        className="absolute top-0 left-0 right-0 z-20 p-6 md:p-8 lg:p-10"
        style={{ transform: 'translateY(-20px)' }}
      >
        <div className="flex items-start justify-between">
          {/* Back button and title */}
          <div className="flex items-center gap-6">
            <button
              onClick={handleBackToMenu}
              className="group w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(200,160,120,0.2)',
              }}
            >
              <svg className="w-5 h-5 text-white/60 group-hover:text-amber-200/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-[1px] bg-gradient-to-r from-amber-600/80 to-transparent" />
                <span 
                  className="text-amber-200/60 text-[10px] uppercase tracking-[0.3em]"
                  style={{ fontFamily: 'Arboria, sans-serif' }}
                >
                  Floor Plans
                </span>
              </div>
              <h1 
                className="text-white text-2xl md:text-3xl"
                style={{ 
                  fontFamily: 'Sallim, serif',
                  textShadow: '0 4px 20px rgba(0,0,0,0.4)'
                }}
              >
                {currentWing?.label} - Typical Floor Plan
              </h1>
            </div>
          </div>

          {/* Logo */}
          <div className="hidden md:block">
            <img 
              src="/images/logo.png" 
              alt="Eventful Life" 
              className="h-16 w-auto opacity-80"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(200,160,120,0.2))'
              }}
            />
          </div>
        </div>
      </div>

      {/* Wing Selector */}
      <div 
        ref={controlsRef}
        className="absolute top-28 md:top-32 left-1/2 -translate-x-1/2 z-20"
        style={{ transform: 'translateY(-10px)' }}
      >
        <div 
          className="flex items-center gap-1 p-1.5 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(30,25,35,0.9) 0%, rgba(20,18,25,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(200,160,120,0.2)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {wings.map((wing) => (
            <button
              key={wing.id}
              onClick={() => setActiveWing(wing.id)}
              className="relative px-6 py-3 rounded-xl transition-all duration-300"
              style={{
                background: activeWing === wing.id 
                  ? 'linear-gradient(135deg, #d4956a 0%, #a85a35 100%)'
                  : 'transparent',
                boxShadow: activeWing === wing.id 
                  ? '0 4px 20px rgba(200,130,80,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                  : 'none',
              }}
            >
              <span 
                className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                  activeWing === wing.id ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
                style={{ fontFamily: 'Arboria, sans-serif' }}
              >
                {wing.label}
              </span>
              {activeWing === wing.id && (
                <div 
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{
                    background: '#fff',
                    boxShadow: '0 0 8px rgba(255,255,255,0.8)'
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Floor Plan Image Container */}
      <div 
        ref={imageContainerRef}
        className="absolute inset-0 flex items-center justify-center pt-20 pb-10"
        style={{ 
          opacity: 0,
          transform: 'scale(0.95)',
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Image wrapper with zoom/pan */}
        <div 
          ref={imageRef}
          className="relative max-w-[90vw] max-h-[75vh] select-none"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          {/* Decorative frame */}
          <div 
            className="absolute -inset-4 rounded-2xl pointer-events-none"
            style={{
              border: '1px solid rgba(200,160,120,0.15)',
              boxShadow: '0 0 80px rgba(200,150,100,0.08), inset 0 0 60px rgba(0,0,0,0.3)',
            }}
          />
          
          {/* Corner accents */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500/40 rounded-tl-lg" />
          <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500/40 rounded-tr-lg" />
          <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500/40 rounded-bl-lg" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500/40 rounded-br-lg" />

          {/* The floor plan image */}
          <img
            src={currentWing?.image}
            alt={`${currentWing?.label} Floor Plan`}
            className="w-auto h-auto max-w-full max-h-[70vh] rounded-lg shadow-2xl"
            style={{
              boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* Zoom Controls */}
      <div 
        ref={zoomControlsRef}
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2"
        style={{ transform: 'translateX(20px)' }}
      >
        <div 
          className="flex flex-col gap-1 p-2 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(30,25,35,0.9) 0%, rgba(20,18,25,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(200,160,120,0.2)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
          }}
        >
          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="group w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/5"
          >
            <svg className="w-5 h-5 text-white/60 group-hover:text-amber-200/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </button>

          {/* Zoom indicator */}
          <div className="px-2 py-1 text-center">
            <span 
              className="text-amber-200/80 text-xs font-medium"
              style={{ fontFamily: 'Arboria, sans-serif' }}
            >
              {Math.round(scale * 100)}%
            </span>
          </div>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="group w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/5"
          >
            <svg className="w-5 h-5 text-white/60 group-hover:text-amber-200/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>

          {/* Divider */}
          <div className="mx-2 h-[1px] bg-white/10" />

          {/* Reset */}
          <button
            onClick={handleResetZoom}
            className="group w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/5"
          >
            <svg className="w-5 h-5 text-white/60 group-hover:text-amber-200/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20">
        <div 
          className="flex items-center gap-4 px-6 py-3 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-2 text-white/40 text-xs" style={{ fontFamily: 'Arboria, sans-serif' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span>Scroll to zoom</span>
          </div>
          <div className="w-[1px] h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-white/40 text-xs" style={{ fontFamily: 'Arboria, sans-serif' }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
            <span>Drag to pan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlans;