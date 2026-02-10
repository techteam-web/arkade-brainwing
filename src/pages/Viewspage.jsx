import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Marzipano from 'marzipano';
import gsap from 'gsap';

const Viewspage = () => {
  const navigate = useNavigate();
  const panoRef = useRef(null);
  const marzipanoViewerRef = useRef(null);
  const currentSceneRef = useRef(null);
  const autorotateRef = useRef(null);
  
  // UI Refs for animations
  const containerRef = useRef(null);
  const selectorRef = useRef(null);
  const logoRef = useRef(null);
  const backButtonRef = useRef(null);
  
  // State
  const [activeWing, setActiveWing] = useState('a');
  const [activeFloor, setActiveFloor] = useState(6); // Index 6 = Floor 21 (default)
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [isAutorotating, setIsAutorotating] = useState(true);

  // Floor data mapped from your data.js files
  // Updated: Wing A now has 'm' suffix on all folders
  // Updated: Wing C has correct folder IDs (floor 9 = 3-c-9-29m, floor 12 = 2-c-12-38m)
  const floorData = {
    a: [
      { index: 0, floor: 3, meters: 10, id: '0-a-3-10m' },
      { index: 1, floor: 6, meters: 20, id: '1-a-6-20m' },
      { index: 2, floor: 9, meters: 29, id: '2-a-9-29m' },
      { index: 3, floor: 12, meters: 38, id: '3-a-12-38m' },
      { index: 4, floor: 15, meters: 48, id: '4-a-15-48m' },
      { index: 5, floor: 18, meters: 57, id: '5-a-18-57m' },
      { index: 6, floor: 21, meters: 68, id: '6-a-21-68m' },
    ],
    b: [
      { index: 0, floor: 3, meters: 10, id: '0-b-3-10m' },
      { index: 1, floor: 6, meters: 20, id: '1-b-6-20m' },
      { index: 2, floor: 9, meters: 29, id: '2-b-9-29m' },
      { index: 3, floor: 12, meters: 38, id: '3-b-12-38m' },
      { index: 4, floor: 15, meters: 48, id: '4-b-15-48m' },
      { index: 5, floor: 18, meters: 57, id: '5-b-18-57m' },
      { index: 6, floor: 21, meters: 68, id: '6-b-21-68m' },
    ],
    c: [
      { index: 0, floor: 3, meters: 10, id: '0-c-3-10m' },
      { index: 1, floor: 6, meters: 20, id: '1-c-6-20m' },
      { index: 2, floor: 9, meters: 29, id: '3-c-9-29m' },   // Folder name has '3' prefix
      { index: 3, floor: 12, meters: 38, id: '2-c-12-38m' }, // Folder name has '2' prefix
      { index: 4, floor: 15, meters: 48, id: '4-c-15-48m' },
      { index: 5, floor: 18, meters: 57, id: '5-c-18-57m' },
      { index: 6, floor: 21, meters: 68, id: '6-c-21-68m' },
    ],
  };

  const wings = ['a', 'b', 'c'];

  // Get current floor data
  const getCurrentFloor = useCallback(() => {
    return floorData[activeWing][activeFloor];
  }, [activeWing, activeFloor]);

  // Get tile path for current selection
  const getTilePath = useCallback((wing, floorIndex) => {
    const floor = floorData[wing][floorIndex];
    return `/images/Marzipano/tiles/${floor.id}`;
  }, []);

  // Setup autorotate
  const setupAutorotate = useCallback((viewer) => {
    // Create autorotate movement
    const autorotate = Marzipano.autorotate({
      yawSpeed: 0.05,        // Rotation speed (radians/sec)
      targetPitch: 0,        // Keep level
      targetFov: Math.PI / 2 // Keep default FOV
    });
    
    autorotateRef.current = autorotate;
    
    // Start autorotate if enabled
    if (isAutorotating) {
      viewer.startMovement(autorotate);
      viewer.setIdleMovement(3000, autorotate); // Resume after 3 sec of inactivity
    }
    
    return autorotate;
  }, [isAutorotating]);

  // Toggle autorotate
  const toggleAutorotate = useCallback(() => {
    const viewer = marzipanoViewerRef.current;
    if (!viewer) return;

    if (isAutorotating) {
      // Stop autorotate
      viewer.stopMovement();
      viewer.setIdleMovement(Infinity);
      setIsAutorotating(false);
    } else {
      // Start autorotate
      const autorotate = Marzipano.autorotate({
        yawSpeed: 0.05,
        targetPitch: 0,
        targetFov: Math.PI / 2
      });
      viewer.startMovement(autorotate);
      viewer.setIdleMovement(3000, autorotate);
      setIsAutorotating(true);
    }
  }, [isAutorotating]);

  // Load Marzipano scene
  const loadScene = useCallback((wing, floorIndex) => {
    setIsLoading(true);
    const viewer = marzipanoViewerRef.current;
    if (!viewer) return;

    const tilePath = getTilePath(wing, floorIndex);

    // Levels from your data.js
    const levels = [
      { tileSize: 256, size: 256, fallbackOnly: true },
      { tileSize: 512, size: 512 },
      { tileSize: 512, size: 1024 },
      { tileSize: 512, size: 2048 },
      { tileSize: 512, size: 4096 },
    ];

    // Cube geometry with faceSize from your data.js
    const geometry = new Marzipano.CubeGeometry(levels);

    // View limiter
    const limiter = Marzipano.RectilinearView.limit.traditional(
      4096,                    // Max resolution
      100 * Math.PI / 180,     // Max vertical FOV
      120 * Math.PI / 180      // Max horizontal FOV
    );

    // Initial view from your data.js
    const view = new Marzipano.RectilinearView(
      { 
        yaw: 0, 
        pitch: 0, 
        fov: Math.PI / 2  // 1.5707963267948966 from your data.js
      },
      limiter
    );

    // Cube map tile source
    const source = Marzipano.ImageUrlSource.fromString(
      tilePath + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: tilePath + "/preview.jpg" }
    );

    // Create scene
    const scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true,
    });

    // Switch to new scene with transition
    scene.switchTo({
      transitionDuration: 400,
    });

    currentSceneRef.current = scene;

    // Setup autorotate for new scene
    if (isAutorotating) {
      const autorotate = Marzipano.autorotate({
        yawSpeed: 0.05,
        targetPitch: 0,
        targetFov: Math.PI / 2
      });
      viewer.startMovement(autorotate);
      viewer.setIdleMovement(3000, autorotate);
    }

    // Hide loading after a short delay
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, [getTilePath, isAutorotating]);

  // Initialize Marzipano viewer
  useEffect(() => {
    if (!panoRef.current || marzipanoViewerRef.current) return;

    // Create viewer with settings from your data.js
    const viewerOpts = {
      controls: {
        mouseViewMode: 'drag',
      },
      stage: {
        progressive: true,
      },
    };

    const viewer = new Marzipano.Viewer(panoRef.current, viewerOpts);
    marzipanoViewerRef.current = viewer;

    // Load initial scene (Wing A, Floor 21)
    loadScene(activeWing, activeFloor);

    // Cleanup
    return () => {
      if (marzipanoViewerRef.current) {
        marzipanoViewerRef.current.destroy();
        marzipanoViewerRef.current = null;
      }
    };
  }, []);

  // Load scene when wing or floor changes
  useEffect(() => {
    if (marzipanoViewerRef.current) {
      loadScene(activeWing, activeFloor);
    }
  }, [activeWing, activeFloor, loadScene]);

  // Initial UI animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(logoRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' }
      );

      gsap.fromTo(backButtonRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.4, ease: 'power2.out' }
      );

      gsap.fromTo(selectorRef.current,
        { opacity: 0, x: 40, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 0.7, delay: 0.5, ease: 'power3.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleWingChange = (wing) => {
    if (wing !== activeWing) {
      setActiveWing(wing);
      gsap.fromTo(panoRef.current,
        { opacity: 0.5 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  };

  const handleFloorChange = (floorIndex) => {
    if (floorIndex !== activeFloor) {
      setActiveFloor(floorIndex);
      gsap.fromTo(panoRef.current,
        { opacity: 0.5 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  };
  const handleBackToMenu = () => {
    navigate("/", { state: { menuOpen: true } });
  };

  const currentFloor = getCurrentFloor();

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
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

        .pano-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .floor-item {
          transition: all 0.3s ease;
        }

        .floor-item:hover {
          transform: translateX(-4px);
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(200,150,100,0.3);
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(200,150,100,0.5);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin 1.5s linear infinite;
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 3s linear infinite;
        }
      `}</style>

      {/* Marzipano Panorama Container */}
      <div ref={panoRef} className="pano-container" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          <div 
            className="flex flex-col items-center gap-4"
            style={{ fontFamily: 'Arboria, sans-serif' }}
          >
            <div className="relative w-14 h-14">
              <div 
                className="absolute inset-0 rounded-full border-2 border-transparent animate-spin-slow"
                style={{
                  borderTopColor: 'rgba(200,150,100,0.9)',
                  borderRightColor: 'rgba(200,150,100,0.3)',
                  borderBottomColor: 'rgba(200,150,100,0.1)',
                }}
              />
              <div 
                className="absolute inset-3 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(200,150,100,0.3) 0%, transparent 70%)'
                }}
              />
            </div>
            <span className="text-white/60 text-xs uppercase tracking-[0.25em]">
              Loading View
            </span>
          </div>
        </div>
      )}

      {/* Subtle Vignette Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)'
        }}
      />

      {/* Logo - Top Left */}
      <div 
        ref={logoRef}
        className="absolute top-6 left-6 md:top-8 md:left-8 z-20"
      >
        <img 
          src="/images/logo.png" 
          alt="Eventful Life" 
          className="h-12 md:h-16 lg:h-20 w-auto drop-shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(200,160,120,0.4))'
          }}
          onClick={() => navigate('/')}
        />
      </div>

      {/* Back Button */}
      <button
        ref={backButtonRef}
        onClick={handleBackToMenu}
        className="absolute top-24 md:top-28 lg:top-32 left-6 md:left-8 z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 group"
        style={{
          background: 'rgba(20,18,25,0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(200,160,120,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <svg 
          className="w-4 h-4 text-white/60 group-hover:text-amber-200/90 transition-colors duration-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span 
          className="text-white/60 text-xs uppercase tracking-[0.15em] group-hover:text-amber-200/90 transition-colors duration-300"
          style={{ fontFamily: 'Arboria, sans-serif' }}
        >
          Back
        </span>
      </button>

      {/* Current View Badge - Top Center */}
      <div 
        className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div 
          className="flex items-center gap-3 px-5 py-2.5 rounded-full"
          style={{
            background: 'rgba(20,18,25,0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(200,160,120,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #d4956a 0%, #a85a35 100%)',
              boxShadow: '0 0 12px rgba(200,150,100,0.6)'
            }}
          />
          <span 
            className="text-white/90 text-xs uppercase tracking-[0.2em]"
            style={{ fontFamily: 'Arboria, sans-serif' }}
          >
            Wing {activeWing.toUpperCase()} • Floor {currentFloor.floor} • {currentFloor.meters}m
          </span>
        </div>
      </div>

      {/* Autorotate Toggle - Top Right */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
        <button
          onClick={toggleAutorotate}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 group"
          style={{
            background: isAutorotating 
              ? 'linear-gradient(135deg, rgba(200,150,100,0.3) 0%, rgba(180,130,90,0.2) 100%)'
              : 'rgba(20,18,25,0.75)',
            backdropFilter: 'blur(12px)',
            border: isAutorotating 
              ? '1px solid rgba(200,160,120,0.4)'
              : '1px solid rgba(200,160,120,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          {/* Autorotate Icon */}
          <svg 
            className={`w-4 h-4 transition-all duration-300 ${
              isAutorotating 
                ? 'text-amber-200 animate-rotate-slow' 
                : 'text-white/60 group-hover:text-amber-200/90'
            }`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span 
            className={`text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${
              isAutorotating 
                ? 'text-amber-200' 
                : 'text-white/60 group-hover:text-amber-200/90'
            }`}
            style={{ fontFamily: 'Arboria, sans-serif' }}
          >
            {isAutorotating ? 'Auto' : 'Manual'}
          </span>
        </button>
      </div>

      {/* View Selector Panel - Bottom Right */}
      <div 
        ref={selectorRef}
        className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20"
      >
        <div 
          className="relative"
          style={{
            background: 'linear-gradient(145deg, rgba(28,24,32,0.92) 0%, rgba(18,16,22,0.96) 100%)',
            borderRadius: '20px',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 80px rgba(200,150,100,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
            padding: isMenuExpanded ? '1.25rem' : '0.75rem',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(200,160,120,0.18)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            width: isMenuExpanded ? '200px' : 'auto',
          }}
        >
          {/* Decorative corner accents */}
          <div className="absolute top-2.5 left-2.5 w-5 h-5 border-t border-l border-amber-500/25 rounded-tl-lg" />
          <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t border-r border-amber-500/25 rounded-tr-lg" />
          <div className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b border-l border-amber-500/25 rounded-bl-lg" />
          <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b border-r border-amber-500/25 rounded-br-lg" />

          {/* Ambient glow */}
          <div 
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none opacity-30 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(200,150,100,0.4) 0%, transparent 70%)'
            }}
          />

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsMenuExpanded(!isMenuExpanded)}
            className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 group"
            style={{
              background: 'linear-gradient(135deg, #d4956a 0%, #a85a35 100%)',
              boxShadow: '0 4px 20px rgba(200,130,80,0.5)',
            }}
          >
            <svg 
              className={`w-4 h-4 text-white transition-transform duration-400 ${isMenuExpanded ? 'rotate-0' : 'rotate-180'}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isMenuExpanded ? (
            <>
              {/* Wing Selector */}
              <div className="mb-5">
                <span 
                  className="text-white/40 text-[10px] uppercase tracking-[0.25em] mb-3 block"
                  style={{ fontFamily: 'Arboria, sans-serif' }}
                >
                  Select Wing
                </span>
                <div className="flex gap-2">
                  {wings.map((wing) => (
                    <button
                      key={wing}
                      onClick={() => handleWingChange(wing)}
                      className="flex-1 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group"
                      style={{
                        background: activeWing === wing 
                          ? 'linear-gradient(135deg, #d4956a 0%, #a85a35 100%)'
                          : 'rgba(255,255,255,0.06)',
                        boxShadow: activeWing === wing 
                          ? '0 6px 24px rgba(200,130,80,0.45), inset 0 1px 0 rgba(255,255,255,0.25)'
                          : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                        border: activeWing === wing 
                          ? 'none'
                          : '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {/* Hover glow */}
                      {activeWing !== wing && (
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: 'linear-gradient(135deg, rgba(200,150,100,0.2) 0%, transparent 100%)'
                          }}
                        />
                      )}
                      <span 
                        className={`relative text-sm font-semibold tracking-wide ${
                          activeWing === wing ? 'text-white' : 'text-white/50 group-hover:text-white/90'
                        }`}
                        style={{ fontFamily: 'Arboria, sans-serif' }}
                      >
                        {wing.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div 
                className="h-[1px] mb-5"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(200,150,100,0.35) 50%, transparent 100%)'
                }}
              />

              {/* Floor Selector */}
              <div>
                <span 
                  className="text-white/40 text-[10px] uppercase tracking-[0.25em] mb-3 block"
                  style={{ fontFamily: 'Arboria, sans-serif' }}
                >
                  Select Floor
                </span>
                <div className="flex flex-col-reverse gap-1.5 max-h-[260px] overflow-y-auto scrollbar-thin pr-1">
                  {floorData[activeWing].map((floor, index) => (
                    <button
                      key={floor.id}
                      onClick={() => handleFloorChange(index)}
                      className="floor-item w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden"
                      style={{
                        background: activeFloor === index 
                          ? 'linear-gradient(135deg, rgba(200,150,100,0.28) 0%, rgba(180,130,90,0.15) 100%)'
                          : 'transparent',
                        border: activeFloor === index 
                          ? '1px solid rgba(200,150,100,0.4)'
                          : '1px solid transparent',
                      }}
                    >
                      {/* Hover effect */}
                      {activeFloor !== index && (
                        <div 
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: 'linear-gradient(135deg, rgba(200,150,100,0.12) 0%, transparent 100%)'
                          }}
                        />
                      )}

                      <div className="relative flex items-center gap-2.5">
                        {/* Floor indicator */}
                        <div 
                          className="w-2 h-2 rounded-full transition-all duration-300"
                          style={{
                            background: activeFloor === index 
                              ? 'linear-gradient(135deg, #d4956a 0%, #f0b080 100%)'
                              : 'rgba(255,255,255,0.2)',
                            boxShadow: activeFloor === index 
                              ? '0 0 10px rgba(200,150,100,0.7)'
                              : 'none',
                          }}
                        />
                        <span 
                          className={`text-sm transition-colors duration-300 ${
                            activeFloor === index 
                              ? 'text-amber-100 font-medium' 
                              : 'text-white/50 group-hover:text-white/85'
                          }`}
                          style={{ fontFamily: 'Arboria, sans-serif' }}
                        >
                          Floor {floor.floor}
                        </span>
                      </div>

                      <span 
                        className={`relative text-xs transition-colors duration-300 ${
                          activeFloor === index 
                            ? 'text-amber-200/80' 
                            : 'text-white/30 group-hover:text-white/55'
                        }`}
                        style={{ fontFamily: 'Arboria, sans-serif' }}
                      >
                        {floor.meters}m
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div 
                className="mt-5 pt-3"
                style={{
                  borderTop: '1px solid rgba(200,150,100,0.12)'
                }}
              >
                <p 
                  className="text-center text-white/25 text-[9px] uppercase tracking-[0.2em]"
                  style={{ fontFamily: 'Arboria, sans-serif' }}
                >
                  360° Panoramic Views
                </p>
              </div>
            </>
          ) : (
            /* Collapsed State */
            <div className="flex items-center gap-3 px-1">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #d4956a 0%, #a85a35 100%)',
                  boxShadow: '0 4px 15px rgba(200,130,80,0.4)',
                }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="text-right">
                <span 
                  className="text-white/90 text-sm font-medium block"
                  style={{ fontFamily: 'Arboria, sans-serif' }}
                >
                  {activeWing.toUpperCase()}-{currentFloor.floor}
                </span>
                <span 
                  className="text-white/45 text-[10px]"
                  style={{ fontFamily: 'Arboria, sans-serif' }}
                >
                  {currentFloor.meters}m
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compass - Bottom Left */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-20">
        <div 
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(20,18,25,0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(200,160,120,0.18)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <div className="relative w-9 h-9">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <path d="M12 2 L14 8 L12 6 L10 8 Z" fill="rgba(200,150,100,0.9)"/>
              <path d="M12 22 L14 16 L12 18 L10 16 Z" fill="rgba(255,255,255,0.25)"/>
              <path d="M22 12 L16 14 L18 12 L16 10 Z" fill="rgba(255,255,255,0.15)"/>
              <path d="M2 12 L8 14 L6 12 L8 10 Z" fill="rgba(255,255,255,0.15)"/>
              <circle cx="12" cy="12" r="2" fill="rgba(200,150,100,0.7)"/>
            </svg>
            <span 
              className="absolute -top-0.5 left-1/2 -translate-x-1/2 text-[8px] text-amber-200/70 font-semibold"
              style={{ fontFamily: 'Arboria, sans-serif' }}
            >
              N
            </span>
          </div>
        </div>
      </div>

      {/* Instructions Hint - Bottom Center */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 opacity-50 hover:opacity-90 transition-opacity duration-300">
        <div 
          className="flex items-center gap-5 px-5 py-2.5 rounded-full"
          style={{
            background: 'rgba(20,18,25,0.6)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span 
              className="text-white/50 text-[10px] uppercase tracking-[0.15em]"
              style={{ fontFamily: 'Arboria, sans-serif' }}
            >
              Drag to look around
            </span>
          </div>
          <div className="w-[1px] h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            <span 
              className="text-white/50 text-[10px] uppercase tracking-[0.15em]"
              style={{ fontFamily: 'Arboria, sans-serif' }}
            >
              Scroll to zoom
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewspage;