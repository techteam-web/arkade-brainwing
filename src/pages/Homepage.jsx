import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState(0);
  const navigate = useNavigate();
  
  // Refs for GSAP animations
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const taglineRef = useRef(null);
  const buttonRef = useRef(null);
  const bottomControlsRef = useRef(null);
  const overlayRef = useRef(null);
  const accentLineRef = useRef(null);
  
  // Menu refs
  const contentRef = useRef(null);
  const menuContainerRef = useRef(null);
  const menuCardRef = useRef(null);
  const menuItemsRef = useRef([]);
  const quickCardsRef = useRef(null);
  const statsRef = useRef(null);
  const bottomNavRef = useRef(null);
  const menuHeadingRef = useRef(null);

  // Menu items data
  const menuItems = [
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ), 
      label: 'Views', 
      path: '/views' 
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ), 
      label: 'Locations', 
      path: '/locations' 
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ), 
      label: 'Floor Plans', 
      path: '/floor-plans' 
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ), 
      label: 'Apartments', 
      path: '/apartments' 
    },
    { 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ), 
      label: 'Amenities', 
      path: '/amenities' 
    },
  ];

  // Quick cards data
  const quickCards = [
    { label: 'Explore Location', path: '/locations' },
    { label: 'Choose Floor Plan', path: '/floor-plans' },
    { label: 'Tour Apartments', path: '/apartments' },
    { label: 'View Amenities', path: '/amenities' },
  ];

  // Stats data
  const stats = [
    { value: '39+', label: 'Years' },
    { value: '31', label: 'Projects' },
    { value: '5500+', label: 'Happy Families' },
  ];

  // Initial page load animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([logoRef.current, labelRef.current, headingRef.current, subheadingRef.current, taglineRef.current, buttonRef.current, bottomControlsRef.current, accentLineRef.current], {
        opacity: 0,
      });

      const masterTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      masterTl.to(overlayRef.current, {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.inOut'
      });

      masterTl.to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.8');

      masterTl.fromTo(labelRef.current, 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');

      masterTl.fromTo(headingRef.current, 
        { opacity: 0, y: 60, clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
        { opacity: 1, y: 0, clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)', duration: 1.2, ease: 'power3.out' }, '-=0.5');

      masterTl.to(subheadingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, '-=0.6');

      masterTl.fromTo(taglineRef.current,
        { opacity: 0, letterSpacing: '0.5em' },
        { opacity: 1, letterSpacing: '0.1em', duration: 1, ease: 'power2.out' }, '-=0.4');

      masterTl.fromTo(accentLineRef.current,
        { opacity: 0, scaleX: 0, transformOrigin: 'left center' },
        { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power2.out' }, '-=0.6');

      masterTl.fromTo(buttonRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }, '-=0.3');

      masterTl.to(bottomControlsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }, '-=0.4');

      // Button glow animation
      gsap.to(buttonRef.current, {
        boxShadow: '0 0 50px rgba(200, 130, 80, 0.35), 0 15px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 3
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Menu open/close animations
  useEffect(() => {
    if (isMenuOpen) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
      
      // Animate content out
      tl.to(contentRef.current, {
        opacity: 0,
        x: -50,
        duration: 0.5,
        onComplete: () => {
          if (contentRef.current) contentRef.current.style.display = 'none';
        }
      });

      // Show menu container
      tl.set(menuContainerRef.current, { display: 'flex' });
      
      // Animate menu card in with glass effect
      tl.fromTo(menuCardRef.current,
        { opacity: 0, x: -40, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: 'power3.out' }, '-=0.2');

      // Stagger menu items with elegant slide
      tl.fromTo(menuItemsRef.current,
        { opacity: 0, x: -30, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.4');

      // Animate heading change
      tl.fromTo(menuHeadingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.5');

      // Show quick cards with stagger
      tl.fromTo(quickCardsRef.current?.children || [],
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.4');

      // Show stats
      tl.fromTo(statsRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 }, '-=0.3');

      // Show bottom nav
      tl.fromTo(bottomNavRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4 }, '-=0.3');

      // Show book button
     

      // Show top right controls
      

    } else if (menuContainerRef.current && contentRef.current) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

      tl.to([menuCardRef.current, quickCardsRef.current, statsRef.current, bottomNavRef.current, menuHeadingRef.current],
        { opacity: 0, duration: 0.3 });

      tl.set(menuContainerRef.current, { display: 'none' });
      tl.set(contentRef.current, { display: 'flex' });

      tl.to(contentRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power3.out'
      });
    }
  }, [isMenuOpen]);

  const handleMenuItemClick = (path, index) => {
    setActiveMenuItem(index);
    setTimeout(() => {
      navigate(path);
    }, 200);
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
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

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Cinematic Opening Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black z-50 pointer-events-none"
      />

      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/bg-image.png')` }}
        />
        {/* Premium Left Gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, rgba(15,12,20,0.95) 0%, rgba(20,15,25,0.85) 25%, rgba(30,25,35,0.5) 45%, transparent 65%)'
          }}
        />
        {/* Warm accent gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(180,130,100,0.08) 0%, transparent 40%, rgba(180,130,100,0.05) 100%)'
          }}
        />
        {/* Top vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 10% 10%, rgba(10,8,15,0.7) 0%, transparent 50%)'
          }}
        />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Grain texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div 
        className="absolute left-8 md:left-12 lg:left-16 top-1/4 bottom-1/4 w-[1px] opacity-20 z-10"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(200,160,120,0.6) 30%, rgba(200,160,120,0.6) 70%, transparent 100%)'
        }}
      />
      
      <div className="absolute top-8 left-8 md:top-12 md:left-12 lg:top-16 lg:left-16 z-10 pointer-events-none">
        <div 
          className="w-24 h-24 opacity-30"
          style={{
            borderLeft: '1px solid rgba(200,160,120,0.5)',
            borderTop: '1px solid rgba(200,160,120,0.5)',
          }}
        />
      </div>

      <div 
        className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(200,150,100,0.15) 0%, transparent 70%)'
        }}
      />

      {/* Logo - Always Visible */}
      <div 
        ref={logoRef}
        className="absolute top-8 left-8 md:top-12 md:left-12 lg:top-16 lg:left-16 z-20"
      >
        <div 
          className="absolute inset-0 -m-4 rounded-full blur-2xl opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(200,160,120,0.4) 0%, transparent 70%)'
          }}
        />
        <img 
          src="/images/logo.png" 
          alt="Eventful Life" 
          className="relative h-20 md:h-28 lg:h-32 w-auto drop-shadow-2xl cursor-pointer transition-transform duration-300 hover:scale-105"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(200,160,120,0.3))'
          }}
          onClick={() => setIsMenuOpen(false)}
        />
      </div>

      {/* Top Right Controls - Menu State */}
      

      {/* Initial Content State */}
      <div 
        ref={contentRef}
        className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12 lg:p-16"
      >
        {/* Spacer for logo */}
        <div className="h-20 md:h-28 lg:h-32" />

        {/* Center Content */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl">
          <div 
            ref={labelRef}
            className="flex items-center gap-3 mb-6"
            style={{ fontFamily: 'Arboria, sans-serif' }}
          >
            <div className="w-8 h-[1px] bg-gradient-to-r from-amber-600/80 to-transparent" />
            <span className="text-amber-200/60 text-xs uppercase tracking-[0.3em]">
              Luxury Residences
            </span>
          </div>

          <h1 
            ref={headingRef}
            className="text-white mb-6"
            style={{ 
              fontFamily: 'Sallim, serif',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: 1.1,
              textShadow: '0 4px 30px rgba(0,0,0,0.4), 0 0 60px rgba(200,150,100,0.1)'
            }}
          >
            An Eventful Life
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <h2 
              ref={subheadingRef}
              className="text-white/90 text-xl md:text-2xl lg:text-3xl"
              style={{ 
                fontFamily: 'Arboria, sans-serif',
                transform: 'translateY(20px)',
                fontWeight: 300,
                letterSpacing: '0.02em'
              }}
            >
              At Goregaon West
            </h2>
            <div 
              className="hidden md:block flex-1 max-w-24 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, rgba(200,160,120,0.5) 0%, transparent 100%)'
              }}
            />
          </div>

          <p 
            ref={taglineRef}
            className="text-white/50 text-sm md:text-base uppercase tracking-widest"
            style={{ 
              fontFamily: 'Arboria, sans-serif',
              fontWeight: 300
            }}
          >
            With sports, active life & serene zones
          </p>

          <div 
            ref={accentLineRef}
            className="mt-8 w-16 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, rgba(200,140,100,0.8) 0%, rgba(200,140,100,0.2) 100%)'
            }}
          />
        </div>

        {/* Bottom Section */}
        <div className="flex items-end justify-between">
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t border-l border-amber-600/30" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b border-r border-amber-600/30" />
            
            <button
              ref={buttonRef}
              onClick={() => setIsMenuOpen(true)}
              className="group relative px-10 py-5 md:px-12 md:py-6 overflow-hidden transition-all duration-500 hover:scale-105"
              style={{ 
                fontFamily: 'Arboria, sans-serif',
                background: 'linear-gradient(135deg, #d4956a 0%, #c47a4a 40%, #a85a35 100%)',
                boxShadow: '0 0 30px rgba(200, 130, 80, 0.25), 0 15px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                borderRadius: '4px',
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div 
                  className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)'
                  }}
                />
              </div>
              
              <div 
                className="absolute inset-x-0 top-0 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                }}
              />
              
              <span className="relative z-10 text-white text-xs md:text-sm font-medium tracking-[0.25em] uppercase">
                Enter Experience
              </span>
            </button>
          </div>

          <div className="flex flex-col items-end gap-3">
            <span 
              className="text-white/30 text-[10px] uppercase tracking-widest hidden md:block"
              style={{ fontFamily: 'Arboria, sans-serif' }}
            >
              Controls
            </span>
            <div 
              ref={bottomControlsRef}
              className="flex items-center gap-2"
              style={{ transform: 'translateY(20px)' }}
            >
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-12 h-12 rounded flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {isMuted ? (
                  <svg className="w-5 h-5 text-white/50 group-hover:text-amber-200/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-amber-200/80 group-hover:text-amber-200 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>

              <div className="w-[1px] h-6 bg-white/10" />

              <button
                onClick={() => setIsMenuOpen(true)}
                className="w-12 h-12 rounded flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <svg className="w-5 h-5 text-white/50 group-hover:text-amber-200/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu State Container */}
      <div 
        ref={menuContainerRef}
        className="absolute inset-0 z-10 flex-col p-8 md:p-12 lg:p-16"
        style={{ display: 'none' }}
      >
        {/* Spacer for logo */}
        <div className="h-20 md:h-28 lg:h-32" />

        {/* Main Menu Content */}
        <div className="flex-1 flex items-center">
          <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-center">
            {/* Left: Menu Card - Dark Premium Theme */}
            <div 
              ref={menuCardRef}
              className="w-full max-w-xs relative"
              style={{
                background: 'linear-gradient(135deg, rgba(30,25,35,0.85) 0%, rgba(20,18,25,0.95) 100%)',
                borderRadius: '20px',
                boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 100px rgba(200,150,100,0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
                padding: '1.25rem',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(200,160,120,0.15)',
              }}
            >
              {/* Decorative corner accents */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-amber-500/30 rounded-tl-lg" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-amber-500/30 rounded-tr-lg" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-amber-500/30 rounded-bl-lg" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-amber-500/30 rounded-br-lg" />

              {/* Ambient glow */}
              <div 
                className="absolute -top-20 -left-20 w-40 h-40 rounded-full pointer-events-none opacity-30 blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(200,150,100,0.3) 0%, transparent 70%)'
                }}
              />

              {menuItems.map((item, index) => (
                <button
                  key={item.label}
                  ref={(el) => (menuItemsRef.current[index] = el)}
                  onClick={() => handleMenuItemClick(item.path, index)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden"
                  style={{
                    background: activeMenuItem === index 
                      ? 'linear-gradient(135deg, rgba(200,150,100,0.2) 0%, rgba(180,130,90,0.1) 100%)'
                      : 'transparent',
                    border: activeMenuItem === index 
                      ? '1px solid rgba(200,150,100,0.3)'
                      : '1px solid transparent',
                  }}
                >
                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(200,150,100,0.1) 0%, transparent 100%)'
                    }}
                  />
                  
                  {/* Icon container */}
                  <div 
                    className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{
                      background: activeMenuItem === index 
                        ? 'linear-gradient(135deg, #d4956a 0%, #a85a35 100%)'
                        : 'rgba(255,255,255,0.05)',
                      boxShadow: activeMenuItem === index 
                        ? '0 4px 20px rgba(200,130,80,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                        : 'none',
                      border: activeMenuItem === index 
                        ? 'none'
                        : '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className={`transition-colors duration-300 ${
                      activeMenuItem === index 
                        ? 'text-white' 
                        : 'text-white/40 group-hover:text-amber-200/80'
                    }`}>
                      {item.icon}
                    </div>
                  </div>

                  {/* Label */}
                  <span 
                    className={`relative text-sm font-medium transition-all duration-300 ${
                      activeMenuItem === index 
                        ? 'text-amber-100' 
                        : 'text-white/50 group-hover:text-white/80'
                    }`}
                    style={{ fontFamily: 'Arboria, sans-serif', letterSpacing: '0.04em' }}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator */}
                  {activeMenuItem === index && (
                    <div 
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #d4956a 0%, #f0b080 100%)',
                        boxShadow: '0 0 10px rgba(200,150,100,0.6)'
                      }}
                    />
                  )}

                  {/* Hover arrow */}
                  <svg 
                    className={`ml-auto w-4 h-4 transition-all duration-300 ${
                      activeMenuItem === index 
                        ? 'opacity-0 w-0' 
                        : 'opacity-0 group-hover:opacity-100 text-amber-200/60 translate-x-0 group-hover:translate-x-1'
                    }`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}

              {/* Bottom decorative line */}
              <div 
                className="mt-4 mx-4 h-[1px]"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(200,150,100,0.3) 50%, transparent 100%)'
                }}
              />

              {/* Menu footer text */}
              <p 
                className="text-center text-white/20 text-[10px] uppercase tracking-[0.2em] mt-3"
                style={{ fontFamily: 'Arboria, sans-serif' }}
              >
                Explore Arkade
              </p>
            </div>

            {/* Center: Heading */}
            <div ref={menuHeadingRef} className="flex-1 max-w-xl">
              <h1 
                className="text-white mb-4"
                style={{ 
                  fontFamily: 'Sallim, serif',
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  lineHeight: 1.1,
                  textShadow: '0 4px 30px rgba(0,0,0,0.4)'
                }}
              >
                An Eventful Life
              </h1>
              <p 
                className="text-white/60 text-sm md:text-base uppercase tracking-[0.2em]"
                style={{ fontFamily: 'Arboria, sans-serif' }}
              >
                Arkade at Goregaon West
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-6">
          {/* Quick Cards */}
          <div 
            ref={quickCardsRef}
            className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          >
            {quickCards.map((card, index) => (
              <button
                key={card.label}
                onClick={() => navigate(card.path)}
                className="flex-shrink-0 group relative overflow-hidden transition-all duration-500 hover:scale-105"
                style={{
                  width: '180px',
                  height: '100px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(30,25,35,0.8) 0%, rgba(20,18,25,0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(200,160,120,0.2)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                {/* Colored accent bar at top */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: index === 0 
                      ? 'linear-gradient(90deg, #c45a3a 0%, #e07850 100%)'
                      : 'linear-gradient(90deg, rgba(200,150,100,0.5) 0%, rgba(200,150,100,0.2) 100%)',
                    borderRadius: '16px 16px 0 0'
                  }}
                />

                {/* Hover glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(200,150,100,0.1) 0%, transparent 70%)'
                  }}
                />

                {/* Icon */}
                <div className="absolute top-4 right-4 text-white/20 group-hover:text-amber-200/40 transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <span 
                    className="text-white/80 text-xs font-medium tracking-wide group-hover:text-amber-100 transition-colors duration-300"
                    style={{ fontFamily: 'Arboria, sans-serif' }}
                  >
                    {card.label}
                  </span>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div 
                    className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)'
                    }}
                  />
                </div>

                {/* Corner accent */}
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-amber-500/20 rounded-bl" />
              </button>
            ))}
          </div>

          {/* Stats and Bottom Nav Row */}
          <div className="flex items-end justify-between">
            {/* Bottom Nav */}
            <div 
              ref={bottomNavRef}
              className="flex items-center gap-2"
            >
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <svg className="w-5 h-5 text-white/60 group-hover:text-amber-200/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              <button
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <svg className="w-5 h-5 text-white/60 group-hover:text-amber-200/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <svg className="w-5 h-5 text-white/60 group-hover:text-amber-200/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Stats */}
            <div 
              ref={statsRef}
              className="hidden md:flex items-center gap-2 px-5 py-3 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {stats.map((stat, index) => (
                <div key={stat.label} className="flex items-center">
                  <div className="flex items-baseline gap-1.5 px-3">
                    <span 
                      className="text-amber-100 text-lg font-medium"
                      style={{ fontFamily: 'Arboria, sans-serif' }}
                    >
                      {stat.value}
                    </span>
                    <span 
                      className="text-white/40 text-xs"
                      style={{ fontFamily: 'Arboria, sans-serif' }}
                    >
                      {stat.label}
                    </span>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="w-[1px] h-4 bg-white/10" />
                  )}
                </div>
              ))}
            </div>

            {/* Book Site Visit Button */}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;