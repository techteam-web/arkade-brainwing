import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Marzipano from "marzipano";
import gsap from "gsap";

const Locations = () => {
  const navigate = useNavigate();
  const panoRef = useRef(null);
  const marzipanoViewerRef = useRef(null);
  const currentSceneRef = useRef(null);
  const hotspotContainerRef = useRef(null);
  const activeHotspotsRef = useRef([]);

  // UI Refs for animations
  const containerRef = useRef(null);
  const selectorRef = useRef(null);
  const logoRef = useRef(null);
  const backButtonRef = useRef(null);
  const categoryItemsRef = useRef([]);

  // State
  const [activeCategory, setActiveCategory] = useState("connectivity");
  const [activeScene, setActiveScene] = useState("day"); // 'day' or 'evening'
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [isAutorotating, setIsAutorotating] = useState(true);

  // Category definitions with display names and colors
  const categories = [
    {
      id: "connectivity",
      name: "Excellent Connectivity",
      color: "#3b82f6",
      icon: "🚇",
    },
    { id: "shopping", name: "Shopping Avenues", color: "#f59e0b", icon: "🛍️" },
    {
      id: "hotels",
      name: "Hotels & Restaurants",
      color: "#ef4444",
      icon: "🏨",
    },
    { id: "hospitals", name: "Hospitals", color: "#22c55e", icon: "🏥" },
    { id: "education", name: "Education Hub", color: "#8b5cf6", icon: "🎓" },
    { id: "leisure", name: "Leisure", color: "#ec4899", icon: "🎭" },
    { id: "business", name: "Business Hub", color: "#06b6d4", icon: "🏢" },
  ];

  // All hotspot data extracted from data.js (positions in radians)
  const allHotspots = [
    // Connectivity
    {
      yaw: 2.01465788070706,
      pitch: 0.17475258385381665,
      title: "connectivity_metro_station",
      category: "connectivity",
      displayName: "Metro Station",
    },
    {
      yaw: -3.1034650079244965,
      pitch: 0.002193119247424491,
      title: "connectivity_western_express_highway",
      category: "connectivity",
      displayName: "Western Express Highway",
    },
    {
      yaw: -2.6601021967986576,
      pitch: 0.02952928441915148,
      title: "connectivity_goregaon_station",
      category: "connectivity",
      displayName: "Goregaon Station",
    },

    // Shopping
    {
      yaw: 1.5212844860217354,
      pitch: 0.03830003434735829,
      title: "shopping_infinity_mall",
      category: "shopping",
      displayName: "Infinity Mall",
    },
    {
      yaw: 1.9226076314046177,
      pitch: 0.20359537914382386,
      title: "shopping_inorbit_mall_malad",
      category: "shopping",
      displayName: "Inorbit Mall Malad",
    },
    {
      yaw: 2.000212945080449,
      pitch: 0.3358633579558372,
      title: "shopping_metro_cash&carry",
      category: "shopping",
      displayName: "Metro Cash & Carry",
    },
    {
      yaw: 2.9705692230841,
      pitch: -0.01227089164262729,
      title: "shopping_oberoi_mall",
      category: "shopping",
      displayName: "Oberoi Mall",
    },
    {
      yaw: -1.7011072669818859,
      pitch: 0.19920421417035428,
      title: "shopping_dmart",
      category: "shopping",
      displayName: "DMart",
    },

    // Hotels & Restaurants
    {
      yaw: 1.5418042517328336,
      pitch: 0.034186904115010464,
      title: "hotels_flags_joeys_combined",
      category: "hotels",
      displayName: "Joey's Pizza",
    },
    // {
    //   yaw: 1.5417818801654768,
    //   pitch: 0.031089475967213787,
    //   title: "hotels_flag's_2_veg",
    //   category: "hotels",
    //   displayName: "Flag's 2 Veg",
    // },
    {
      yaw: 1.8348360832681117,
      pitch: 0.0931815948797432,
      title: "hotels_greens_ocean_combined",
      category: "hotels",
      displayName: "Ocean Kitchen Fine Dine",
    },
    // {
    //   yaw: 1.8461435034793094,
    //   pitch: 0.08456046020932817,
    //   title: "hotels_greens_veg_restaurant",
    //   category: "hotels",
    //   displayName: "Greens Veg Restaurant",
    // },
    {
      yaw: 2.7089959746135026,
      pitch: 0.05815265659072466,
      title: "hotels_radisson_hotel",
      category: "hotels",
      displayName: "Radisson Hotel",
    },
    {
      yaw: 2.971725124934955,
      pitch: -0.015885487560456824,
      title: "hotels_the_westin",
      category: "hotels",
      displayName: "The Westin",
    },

    // Hospitals
    {
      yaw: 1.8752062307720383,
      pitch: 0.004099062905059014,
      title: "hospitals_sun_superspeciality_hospital_borivali",
      category: "hospitals",
      displayName: "Sun Superspeciality Hospital",
    },
    {
      yaw: 2.5906901220098195,
      pitch: 0.008808680730041374,
      title: "hospitals_lifeline_medicare_hospital",
      category: "hospitals",
      displayName: "Lifeline Medicare Hospital",
    },
    {
      yaw: -2.6930259036110494, 
  pitch: -0.008709222218848686, 
  title: "hospitals_srv_hospitals", 
  category: "hospitals", 
  displayName: "SRV Hospitals" 
    },
    {
      yaw: -2.462781983216715,
      pitch: 0.06110387784161553,
      title: "hospitals_kapadia_multispecialty_hospital",
      category: "hospitals",
      displayName: "Kapadia Multispecialty Hospital",
    },
    {
      yaw: -1.6847279737125938,
      pitch: 0.04860836062083429,
      title: "hospitals_oscar_superspeciality",
      category: "hospitals",
      displayName: "Oscar Superspeciality",
    },

    // Education
    {
      yaw: 1.457385120769862,
      pitch: 0.0045955054820687735,
      title: "education_ryan_international",
      category: "education",
      displayName: "Ryan International",
    },
    {
      yaw: -3.126481287971572,
      pitch: 0.009258101107340266,
      title: "education_oberoi_international",
      category: "education",
      displayName: "Oberoi International",
    },
    {
      yaw: -2.203188824590864,
      pitch: 0.014084085788706346,
      title: "education_st. John's_universal_school",
      category: "education",
      displayName: "St. John's Universal School",
    },
    {
      yaw: -1.6838915939072834,
      pitch: 0.0500749008074628,
      title: "education_vibgyor_high_school",
      category: "education",
      displayName: "Vibgyor High School",
    },

    // Leisure
    {
      yaw: 1.7188009677985931,
      pitch: 0.04695875619216494,
      title: "leisure_goregaon_sports_club",
      category: "leisure",
      displayName: "Goregaon Sports Club",
    },
    {
      yaw: -2.5765691058875273,
      pitch: 0.026255502926961327,
      title: "leisure_movietime_the_hub_mall",
      category: "leisure",
      displayName: "Movietime - The Hub Mall",
    },

    // Business
    {
      yaw: -2.4031635043199557,
      pitch: 0.023594364583704674,
      title: "business_nesco_it_park",
      category: "business",
      displayName: "NESCO IT Park",
    },
  ];

  // Scene configuration
  const scenes = {
    day: {
      id: "1-day-120m",
      name: "Day",
      hasMarkers: true,
    },
    evening: {
      id: "0-evening-120m",
      name: "Night",
      hasMarkers: false,
    },
  };

  // Get tile path
  const getTilePath = useCallback((sceneId) => {
    return `/images/LocationPano/tiles/${sceneId}`;
  }, []);

  // Get marker image path
  const getMarkerImagePath = useCallback((hotspotTitle) => {
    return `/images/pngs/${hotspotTitle}.webp`;
  }, []);

  // Get markers count for a category
  const getMarkerCount = useCallback((categoryId) => {
    return allHotspots.filter((h) => h.category === categoryId).length;
  }, []);

  // Clear all hotspots
  const clearHotspots = useCallback(() => {
    if (hotspotContainerRef.current && activeHotspotsRef.current.length > 0) {
      activeHotspotsRef.current.forEach((hotspot) => {
        try {
          hotspotContainerRef.current.destroyHotspot(hotspot);
        } catch (e) {
          // Hotspot may already be destroyed
        }
      });
      activeHotspotsRef.current = [];
    }
  }, []);

  // Create hotspots for active category
  const createHotspots = useCallback(
    (categoryId) => {
      if (!hotspotContainerRef.current || activeScene !== "day") {
        return;
      }

      // Clear existing hotspots
      clearHotspots();

      // Get hotspots for this category
      const categoryHotspots = allHotspots.filter(
        (h) => h.category === categoryId,
      );
      const category = categories.find((c) => c.id === categoryId);

      // Store inner elements for animation
      const innerElements = [];

      categoryHotspots.forEach((hotspot) => {
        // 1. OUTER WRAPPER (Controlled by Marzipano for Positioning)
        // We do NOT apply transitions or transforms here to avoid conflicting with Marzipano
        const outerWrapper = document.createElement("div");
        outerWrapper.className = "location-hotspot-container";
        outerWrapper.style.cssText = `
        position: relative;
        width: 0;
        height: 0;
        z-index: 1000;
        pointer-events: none; /* Ensure outer wrapper doesn't block events */
      `;

        // 2. INNER WRAPPER (Controlled by GSAP/CSS for Style)
        // This is what we animate. It sits inside the positioned outerWrapper.
        const innerWrapper = document.createElement("div");
        innerWrapper.className = "location-hotspot-inner";

        // --- EDIT HERE TO CHANGE SIZE ---
        // 1. Set width and height (e.g., 80px)
        // 2. Set top and left to NEGATIVE HALF of that size (e.g., -40px)
        innerWrapper.style.cssText = `
        position: absolute;
        top: -130px;  /* Should be -90px for 180px height */
  left: -90px;  /* Correct for 180px width */
  width: 180px;
  height: 180px;
        pointer-events: none; /* Allows clicks to pass through to the panorama */
        filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
        opacity: 0; /* Start hidden for animation */
        transform: scale(0); /* Start scaled down */
      `;

        // Create image element for the marker
        const img = document.createElement("img");
        img.src = getMarkerImagePath(hotspot.title);
        img.alt = hotspot.displayName;
        img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      `;

        img.onerror = () => {
          img.style.display = "none";
          const fallback = document.createElement("div");
          // --- EDIT HERE FOR FALLBACK SIZE (When image fails) ---
          // Make this slightly smaller than the main wrapper
          fallback.style.cssText = `
          width: 60px; 
          height: 60px;
          background: ${category?.color || "#d4956a"};
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.4);
          margin: 10px; /* (Container Size - Fallback Size) / 2 */
        `;
          fallback.textContent = category?.icon || "📍";
          innerWrapper.appendChild(fallback);
        };
        innerWrapper.appendChild(img);

        // Tooltips and Hover listeners removed to allow panning through markers

        // Add inner to outer
        outerWrapper.appendChild(innerWrapper);

        // Create Marzipano hotspot using the OUTER wrapper
        const position = { yaw: hotspot.yaw, pitch: hotspot.pitch };
        const marzipanoHotspot = hotspotContainerRef.current.createHotspot(
          outerWrapper,
          position,
        );
        activeHotspotsRef.current.push(marzipanoHotspot);
        innerElements.push(innerWrapper);
      });

      // Animate markers appearing (Using Inner Elements)
      // We animate opacity and scale on the inner element, leaving the outer element's transform alone
      gsap.to(innerElements, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: "back.out(1.2)",
      });
    },
    [activeScene, clearHotspots, getMarkerImagePath, categories],
  );

  // Toggle autorotate
  const toggleAutorotate = useCallback(() => {
    const viewer = marzipanoViewerRef.current;
    if (!viewer) return;

    if (isAutorotating) {
      viewer.stopMovement();
      viewer.setIdleMovement(Infinity);
      setIsAutorotating(false);
    } else {
      const autorotate = Marzipano.autorotate({
        yawSpeed: 0.03,
        targetPitch: 0,
        targetFov: Math.PI / 2,
      });
      viewer.startMovement(autorotate);
      viewer.setIdleMovement(3000, autorotate);
      setIsAutorotating(true);
    }
  }, [isAutorotating]);

  // Load scene
  const loadScene = useCallback(
    (sceneKey) => {
      setIsLoading(true);
      const viewer = marzipanoViewerRef.current;
      if (!viewer) return;

      const sceneConfig = scenes[sceneKey];
      const tilePath = getTilePath(sceneConfig.id);

      // Levels from data.js
      const levels = [
        { tileSize: 256, size: 256, fallbackOnly: true },
        { tileSize: 512, size: 512 },
        { tileSize: 512, size: 1024 },
        { tileSize: 512, size: 2048 },
        { tileSize: 512, size: 4096 },
      ];

      const geometry = new Marzipano.CubeGeometry(levels);

      const limiter = Marzipano.RectilinearView.limit.traditional(
        4096,
        (100 * Math.PI) / 180,
        (120 * Math.PI) / 180,
      );

      // Get current view position if scene exists
      let initialView = { yaw: 0, pitch: 0, fov: Math.PI / 2 };
      if (currentSceneRef.current) {
        const currentView = currentSceneRef.current.view();
        if (currentView && typeof currentView.yaw === "function") {
          initialView = {
            yaw: currentView.yaw(),
            pitch: currentView.pitch(),
            fov: currentView.fov(),
          };
        }
      }

      const view = new Marzipano.RectilinearView(initialView, limiter);

      const source = Marzipano.ImageUrlSource.fromString(
        tilePath + "/{z}/{f}/{y}/{x}.jpg",
        { cubeMapPreviewUrl: tilePath + "/preview.jpg" },
      );

      const scene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view,
        pinFirstLevel: true,
      });

      scene.switchTo({ transitionDuration: 400 });

      currentSceneRef.current = scene;
      hotspotContainerRef.current = scene.hotspotContainer();

      // Setup autorotate
      if (isAutorotating) {
        const autorotate = Marzipano.autorotate({
          yawSpeed: 0.03,
          targetPitch: 0,
          targetFov: Math.PI / 2,
        });
        viewer.startMovement(autorotate);
        viewer.setIdleMovement(3000, autorotate);
      }

      // Create hotspots if day scene
      setTimeout(() => {
        if (sceneConfig.hasMarkers) {
          createHotspots(activeCategory);
        }
        setIsLoading(false);
      }, 500);
    },
    [getTilePath, isAutorotating, activeCategory, createHotspots],
  );

  // Initialize Marzipano viewer
  useEffect(() => {
    if (!panoRef.current || marzipanoViewerRef.current) return;

    const viewerOpts = {
      controls: {
        mouseViewMode: "drag",
      },
      stage: {
        progressive: true,
      },
    };

    const viewer = new Marzipano.Viewer(panoRef.current, viewerOpts);
    marzipanoViewerRef.current = viewer;

    // --- DEVELOPER HELPER: Log coordinates on click ---
    // Click anywhere on the screen to get the current Yaw/Pitch
    // Copy the values from the console to update 'allHotspots'
    const debugClickListener = () => {
      const view = viewer.view();
      if (view) {
        console.log(
          `🎯 Center View -> yaw: ${view.yaw()}, pitch: ${view.pitch()}`,
        );
      }
    };
    viewer.domElement().addEventListener("click", debugClickListener);

    loadScene(activeScene);

    return () => {
      if (marzipanoViewerRef.current) {
        // Remove listener to prevent duplicates if re-mounting
        try {
          marzipanoViewerRef.current
            .domElement()
            .removeEventListener("click", debugClickListener);
        } catch (e) {
          // ignore
        }
        marzipanoViewerRef.current.destroy();
        marzipanoViewerRef.current = null;
      }
    };
  }, []);

  // Handle scene change
  useEffect(() => {
    if (marzipanoViewerRef.current && currentSceneRef.current) {
      clearHotspots();
      loadScene(activeScene);
    }
  }, [activeScene]);

  // Handle category change
  useEffect(() => {
    if (hotspotContainerRef.current && activeScene === "day") {
      createHotspots(activeCategory);
    }
  }, [activeCategory, createHotspots, activeScene]);

  // Initial UI animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" },
      );

      gsap.fromTo(
        backButtonRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.4, ease: "power2.out" },
      );

      gsap.fromTo(
        selectorRef.current,
        { opacity: 0, x: 40, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.7,
          delay: 0.5,
          ease: "power3.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCategoryChange = (categoryId) => {
    if (categoryId !== activeCategory) {
      setActiveCategory(categoryId);

      // Animate category items
      gsap.fromTo(
        categoryItemsRef.current,
        { opacity: 0.5 },
        { opacity: 1, duration: 0.3, stagger: 0.02 },
      );
    }
  };

  const handleSceneChange = (sceneKey) => {
    if (sceneKey !== activeScene) {
      setActiveScene(sceneKey);
      gsap.fromTo(
        panoRef.current,
        { opacity: 0.5 },
        { opacity: 1, duration: 0.5, ease: "power2.out" },
      );
    }
  };

  const handleBackToMenu = () => {
    navigate("/", { state: { menuOpen: true } });
  };

  const currentCategory = categories.find((c) => c.id === activeCategory);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
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

        .pano-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .category-item {
          transition: all 0.3s ease;
        }

        .category-item:hover {
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

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(200, 150, 100, 0.3); }
          50% { box-shadow: 0 0 30px rgba(200, 150, 100, 0.5); }
        }

        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Marzipano Panorama Container */}
      <div ref={panoRef} className="pano-container" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          <div
            className="flex flex-col items-center gap-4"
            style={{ fontFamily: "Arboria, sans-serif" }}
          >
            <div className="relative w-14 h-14">
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent animate-spin-slow"
                style={{
                  borderTopColor: "rgba(200,150,100,0.9)",
                  borderRightColor: "rgba(200,150,100,0.3)",
                  borderBottomColor: "rgba(200,150,100,0.1)",
                }}
              />
              <div
                className="absolute inset-3 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(200,150,100,0.3) 0%, transparent 70%)",
                }}
              />
            </div>
            <span className="text-white/60 text-xs uppercase tracking-[0.25em]">
              Loading Location
            </span>
          </div>
        </div>
      )}

      {/* Subtle Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
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
            filter: "drop-shadow(0 0 20px rgba(200,160,120,0.4))",
          }}
          onClick={handleBackToMenu}
        />
      </div>

      {/* Back Button */}
      <button
        ref={backButtonRef}
        onClick={handleBackToMenu}
        className="absolute top-24 md:top-28 lg:top-32 left-6 md:left-8 z-20 flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 group"
        style={{
          background: "rgba(20,18,25,0.75)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(200,160,120,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <svg
          className="w-4 h-4 text-white/60 group-hover:text-amber-200/90 transition-colors duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span
          className="text-white/60 text-xs uppercase tracking-[0.15em] group-hover:text-amber-200/90 transition-colors duration-300"
          style={{ fontFamily: "Arboria, sans-serif" }}
        >
          Back
        </span>
      </button>

      {/* Current View Badge - Top Center */}
      <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 z-20">
        <div
          className="flex items-center gap-3 px-5 py-2.5 rounded-full"
          style={{
            background: "rgba(20,18,25,0.75)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(200,160,120,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background:
                currentCategory?.color ||
                "linear-gradient(135deg, #d4956a 0%, #a85a35 100%)",
              boxShadow: `0 0 12px ${currentCategory?.color || "rgba(200,150,100,0.6)"}`,
            }}
          />
          <span
            className="text-white/90 text-xs uppercase tracking-[0.2em]"
            style={{ fontFamily: "Arboria, sans-serif" }}
          >
            Locations • {currentCategory?.name}
          </span>
        </div>
      </div>

      {/* Day/Night Toggle - Top Right */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20 flex items-center gap-3">
        {/* Autorotate Toggle */}
        <button
          onClick={toggleAutorotate}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 group"
          style={{
            background: isAutorotating
              ? "linear-gradient(135deg, rgba(200,150,100,0.3) 0%, rgba(180,130,90,0.2) 100%)"
              : "rgba(20,18,25,0.75)",
            backdropFilter: "blur(12px)",
            border: isAutorotating
              ? "1px solid rgba(200,160,120,0.4)"
              : "1px solid rgba(200,160,120,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <svg
            className={`w-4 h-4 transition-all duration-300 ${
              isAutorotating
                ? "text-amber-200 animate-rotate-slow"
                : "text-white/60 group-hover:text-amber-200/90"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span
            className={`text-xs uppercase tracking-[0.15em] transition-colors duration-300 hidden md:inline ${
              isAutorotating
                ? "text-amber-200"
                : "text-white/60 group-hover:text-amber-200/90"
            }`}
            style={{ fontFamily: "Arboria, sans-serif" }}
          >
            {isAutorotating ? "Auto" : "Manual"}
          </span>
        </button>

        {/* Day/Night Toggle */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{
            background: "rgba(20,18,25,0.75)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(200,160,120,0.2)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <button
            onClick={() => handleSceneChange("day")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300"
            style={{
              background:
                activeScene === "day"
                  ? "linear-gradient(135deg, rgba(200,150,100,0.4) 0%, rgba(180,130,90,0.2) 100%)"
                  : "transparent",
              border:
                activeScene === "day"
                  ? "1px solid rgba(200,160,120,0.3)"
                  : "1px solid transparent",
            }}
          >
            <svg
              className={`w-4 h-4 transition-colors duration-300 ${activeScene === "day" ? "text-amber-200" : "text-white/50"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span
              className={`text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${activeScene === "day" ? "text-amber-200" : "text-white/50"}`}
              style={{ fontFamily: "Arboria, sans-serif" }}
            >
              Day
            </span>
          </button>

          <button
            onClick={() => handleSceneChange("evening")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300"
            style={{
              background:
                activeScene === "evening"
                  ? "linear-gradient(135deg, rgba(100,100,180,0.4) 0%, rgba(80,80,150,0.2) 100%)"
                  : "transparent",
              border:
                activeScene === "evening"
                  ? "1px solid rgba(150,150,200,0.3)"
                  : "1px solid transparent",
            }}
          >
            <svg
              className={`w-4 h-4 transition-colors duration-300 ${activeScene === "evening" ? "text-indigo-300" : "text-white/50"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            <span
              className={`text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${activeScene === "evening" ? "text-indigo-300" : "text-white/50"}`}
              style={{ fontFamily: "Arboria, sans-serif" }}
            >
              Night
            </span>
          </button>
        </div>
      </div>

      {/* Category Selector Panel - Right Side */}
      <div
        ref={selectorRef}
        className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20"
      >
        <div
          className="relative"
          style={{
            background:
              "linear-gradient(145deg, rgba(28,24,32,0.92) 0%, rgba(18,16,22,0.96) 100%)",
            borderRadius: "20px",
            boxShadow:
              "0 25px 80px rgba(0,0,0,0.6), 0 0 80px rgba(200,150,100,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
            padding: isMenuExpanded ? "1.25rem" : "0.75rem",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(200,160,120,0.18)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            width: isMenuExpanded ? "240px" : "auto",
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
              background:
                "radial-gradient(circle, rgba(200,150,100,0.4) 0%, transparent 70%)",
            }}
          />

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsMenuExpanded(!isMenuExpanded)}
            className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 group"
            style={{
              background: "linear-gradient(135deg, #d4956a 0%, #a85a35 100%)",
              boxShadow: "0 4px 20px rgba(200,130,80,0.5)",
            }}
          >
            <svg
              className={`w-4 h-4 text-white transition-transform duration-400 ${isMenuExpanded ? "rotate-0" : "rotate-180"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isMenuExpanded ? (
            <>
              {/* Header */}
              <div className="mb-4">
                <span
                  className="text-white/40 text-[10px] uppercase tracking-[0.25em] mb-2 block"
                  style={{ fontFamily: "Arboria, sans-serif" }}
                >
                  Location Categories
                </span>
                {activeScene === "evening" && (
                  <div
                    className="text-amber-200/60 text-[10px] mt-2 px-2 py-1.5 rounded-lg"
                    style={{
                      background: "rgba(200,150,100,0.1)",
                      border: "1px solid rgba(200,150,100,0.2)",
                    }}
                  >
                    ⓘ Switch to Day view to see markers
                  </div>
                )}
              </div>

              {/* Divider */}
              <div
                className="h-[1px] mb-4"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(200,150,100,0.35) 50%, transparent 100%)",
                }}
              />

              {/* Category List */}
              <div className="flex flex-col gap-1.5 max-h-[320px] overflow-y-auto scrollbar-thin pr-1">
                {categories.map((category, index) => (
                  <button
                    key={category.id}
                    ref={(el) => (categoryItemsRef.current[index] = el)}
                    onClick={() => handleCategoryChange(category.id)}
                    disabled={activeScene === "evening"}
                    className={`category-item w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      activeScene === "evening"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    style={{
                      background:
                        activeCategory === category.id
                          ? `linear-gradient(135deg, ${category.color}30 0%, ${category.color}15 100%)`
                          : "transparent",
                      border:
                        activeCategory === category.id
                          ? `1px solid ${category.color}60`
                          : "1px solid transparent",
                    }}
                  >
                    {/* Hover effect */}
                    {activeCategory !== category.id &&
                      activeScene !== "evening" && (
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${category.color}15 0%, transparent 100%)`,
                          }}
                        />
                      )}

                    <div className="relative flex items-center gap-3">
                      {/* Category icon */}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all duration-300"
                        style={{
                          background:
                            activeCategory === category.id
                              ? category.color
                              : "rgba(255,255,255,0.08)",
                          boxShadow:
                            activeCategory === category.id
                              ? `0 4px 15px ${category.color}50`
                              : "none",
                        }}
                      >
                        {category.icon}
                      </div>

                      <span
                        className={`text-sm transition-colors duration-300 ${
                          activeCategory === category.id
                            ? "text-white font-medium"
                            : "text-white/50 group-hover:text-white/85"
                        }`}
                        style={{ fontFamily: "Arboria, sans-serif" }}
                      >
                        {category.name}
                      </span>
                    </div>

                    {/* Marker count badge */}
                    <span
                      className={`relative text-xs px-2 py-0.5 rounded-full transition-all duration-300 ${
                        activeCategory === category.id
                          ? "text-white"
                          : "text-white/30 group-hover:text-white/55"
                      }`}
                      style={{
                        background:
                          activeCategory === category.id
                            ? `${category.color}40`
                            : "rgba(255,255,255,0.05)",
                      }}
                    >
                      {getMarkerCount(category.id)}
                    </span>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div
                className="mt-4 pt-3"
                style={{
                  borderTop: "1px solid rgba(200,150,100,0.12)",
                }}
              >
                <p
                  className="text-center text-white/25 text-[9px] uppercase tracking-[0.2em]"
                  style={{ fontFamily: "Arboria, sans-serif" }}
                >
                  360° Location View
                </p>
              </div>
            </>
          ) : (
            /* Collapsed State */
            <div className="flex items-center gap-3 px-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{
                  background:
                    currentCategory?.color ||
                    "linear-gradient(135deg, #d4956a 0%, #a85a35 100%)",
                  boxShadow: `0 4px 15px ${currentCategory?.color || "rgba(200,130,80,0.4)"}50`,
                }}
              >
                {currentCategory?.icon || "📍"}
              </div>
              <div className="text-right">
                <span
                  className="text-white/90 text-sm font-medium block truncate max-w-[100px]"
                  style={{ fontFamily: "Arboria, sans-serif" }}
                >
                  {currentCategory?.name || "Locations"}
                </span>
                <span
                  className="text-white/45 text-[10px]"
                  style={{ fontFamily: "Arboria, sans-serif" }}
                >
                  {getMarkerCount(activeCategory)} markers
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
            background: "rgba(20,18,25,0.75)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(200,160,120,0.18)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <div className="relative w-9 h-9">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <path
                d="M12 2 L14 8 L12 6 L10 8 Z"
                fill="rgba(200,150,100,0.9)"
              />
              <path
                d="M12 22 L14 16 L12 18 L10 16 Z"
                fill="rgba(255,255,255,0.25)"
              />
              <path
                d="M22 12 L16 14 L18 12 L16 10 Z"
                fill="rgba(255,255,255,0.15)"
              />
              <path
                d="M2 12 L8 14 L6 12 L8 10 Z"
                fill="rgba(255,255,255,0.15)"
              />
              <circle cx="12" cy="12" r="2" fill="rgba(200,150,100,0.7)" />
            </svg>
            <span
              className="absolute -top-0.5 left-1/2 -translate-x-1/2 text-[8px] text-amber-200/70 font-semibold"
              style={{ fontFamily: "Arboria, sans-serif" }}
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
            background: "rgba(20,18,25,0.6)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-white/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            <span
              className="text-white/50 text-[10px] uppercase tracking-[0.15em]"
              style={{ fontFamily: "Arboria, sans-serif" }}
            >
              Drag to explore
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locations;
