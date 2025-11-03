import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LandingPage from "./pages/landingpage/LandingPage";
import DayPage from "./pages/DayPage";
import StagePage from "./pages/StagePage";
import Credits from "./pages/Credits";
import Contact from "./pages/Contact";
import ThankYou from "./pages/ThankYou";
// Legacy routes (kept for backwards compatibility)
import ActOne from "./pages/ActOne";
import ActTwo from "./pages/ActTwo";
import ActThree from "./pages/ActThree";
import ActFour from "./pages/ActFour";

// Import curtain image - bundled with app for immediate availability
// @ts-ignore - Image import handled by Vite
import curtainImage from "./assets/images/curtains.jpg";

function App() {
  // Always render the main page from the start - it's hidden behind curtains
  const [showMainPage, setShowMainPage] = useState(true);
  const [loadingHidden, setLoadingHidden] = useState(false);
  const loading = useRef<HTMLDivElement>(null);
  const landingPageRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Preload curtain image first (highest priority) to prevent flash on mobile
  // Then preload all WebGL images
  useEffect(() => {
    // Curtain image is already imported and bundled, so it's immediately available
    // No need to preload - it's part of the app bundle
    console.log("[DEBUG] Curtain image is bundled and ready:", curtainImage);
    const imagePaths = [
      "/pages/p1.jpg",
      "/pages/p2.jpg",
      "/pages/p3.jpg",
      "/pages/p4.jpg",
      "/pages/p5.jpg",
      "/pages/p6.jpg",
      "/pages/p7.jpg",
      "/pages/p8.jpg",
      "/pages/p9.jpg",
      "/pages/p10.jpg",
      "/pages/p11.jpg",
      "/pages/p12.jpg",
      "/pages/p13.jpg",
    ];

    console.log("[DEBUG] Preloading WebGL images...");
    
    // Preload all images with aggressive loading (no lazy loading)
    const preloadPromises = imagePaths.map((path, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        let resolved = false;
        
        // Set timeout for mobile networks
        const timeout = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            console.warn(`[DEBUG] Image ${index + 1} (${path}) timed out during preload`);
            resolve(); // Resolve anyway to not block
          }
        }, 5000); // 5 second timeout - should be fast if preloaded via HTML
        
        img.onload = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            // Image loaded - resolve immediately
            resolve();
          }
        };
        
        img.onerror = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            console.error(`[DEBUG] Failed to preload image ${index + 1}: ${path}`);
            resolve(); // Resolve anyway to not block
          }
        };
        
        // Force eager loading (no lazy loading)
        img.loading = 'eager';
        img.src = path;
      });
    });

    Promise.all(preloadPromises).then(() => {
      console.log("[DEBUG] All WebGL images preloaded");
    }).catch((error) => {
      console.error("[DEBUG] Error during image preload:", error);
    });
  }, []); // Run immediately on mount

  // Handle refresh - always redirect to home (menu)
  useEffect(() => {
    // Only redirect if we're not already on the home page
    // Note: showMainPage is now always true from start, so wrapper is always rendered
    if (location.pathname !== '/') {
      console.log("[DEBUG] App: Redirecting to home from", location.pathname);
      navigate('/', { replace: true });
    }
  }, []); // Only run on mount (refresh)

  useGSAP(
    () => {
      // Initialize curtain elements - ensure they're positioned correctly
      const leftCurtain = document.querySelector(".loadings-left");
      const rightCurtain = document.querySelector(".loadings-right");
      
      console.log("[DEBUG] Curtain elements check:", {
        leftCurtain: leftCurtain ? "FOUND" : "NOT FOUND",
        rightCurtain: rightCurtain ? "FOUND" : "NOT FOUND",
        loadingRef: loading.current ? "FOUND" : "NOT FOUND"
      });
      
      if (leftCurtain && rightCurtain) {
        gsap.set(".loadings-left", { x: "0%", opacity: 1, display: "block" });
        gsap.set(".loadings-right", { x: "0%", opacity: 1, display: "block" });
        console.log("[DEBUG] Curtain elements initialized");
      } else {
        console.error("[DEBUG] Curtain elements not found in DOM!");
      }

      // Simplified timeline: curtains open immediately, synchronized with WebGL program rotation
      // Start curtains and WebGL animation at the same time
      
      // Wait for WebGL material to be ready, then start both animations simultaneously
      const startAnimations = () => {
        console.log("[DEBUG] Starting curtains and WebGL animation simultaneously");
        
        // Start WebGL program rotation animation
        window.dispatchEvent(new CustomEvent('startWebGLAnimation'));
        
        // Create timeline when ready to ensure proper timing
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        
        // Start curtains opening immediately, synchronized with WebGL animation
        const curtainDuration = 2.5; // Slower reveal
        tl.to(".loadings-left", {
          x: "-100%",
          duration: curtainDuration,
          ease: "power3.inOut",
          onStart: () => console.log("[DEBUG] Left curtain animation started"),
          onComplete: () => console.log("[DEBUG] Left curtain animation completed")
        })
        .to(".loadings-right", {
          x: "100%",
          duration: curtainDuration,
          ease: "power3.inOut",
          onStart: () => console.log("[DEBUG] Right curtain animation started"),
          onComplete: () => console.log("[DEBUG] Right curtain animation completed")
        }, "<") // Start at same time as left curtain
        // Make background transparent immediately when curtains split
        // Keep curtains at high z-index during reveal so they stay on top
        .to(".loadings", {
          backgroundColor: "rgba(0, 0, 0, 0)",
          duration: 0.2,
          ease: "power2.out",
        }, "<") // Start at same time as curtains
        // Hide the entire loading screen after curtains have moved off screen
        // Lower z-index after curtains are completely off screen
        .set(".loadings", {
          zIndex: -1, // Put below wrapper (z-index 0) after curtains are off screen
        }, curtainDuration) // After curtains animation completes
        .to(".loadings", {
          opacity: 0,
          duration: 0.1,
          ease: "power2.inOut",
          onComplete: () => {
            console.log("[DEBUG] Loading screen fade complete, hiding");
            gsap.set(".loadings", { display: "none" });
            setLoadingHidden(true);
          }
        }, curtainDuration); // After curtains animation completes
      };
      
      // Check if WebGL material is already ready
      const checkWebGLReady = () => {
        // Listen for WebGL material ready event, or start after delay
        let materialReady = false;
        
        const handleMaterialReady = () => {
          if (!materialReady) {
            materialReady = true;
            window.removeEventListener('webglMaterialReady', handleMaterialReady);
            startAnimations();
          }
        };
        
        window.addEventListener('webglMaterialReady', handleMaterialReady);
        
        // Fallback: start animations after delay even if event doesn't fire
        setTimeout(() => {
          if (!materialReady) {
            console.log("[DEBUG] WebGL material ready event not received, starting animations anyway");
            window.removeEventListener('webglMaterialReady', handleMaterialReady);
            startAnimations();
          }
        }, 1000); // Wait max 1 second for WebGL to be ready
      };
      
      // Start checking for WebGL readiness
      checkWebGLReady();
    },
    { scope: loading }
  );

  return (
    <>
      {/* Loading screen with curtains - keep mounted until curtain animation completes */}
      {!loadingHidden && (
        <div className="contain">
          <div className="loadings" ref={loading}>
            {/* Curtain elements for split animation */}
            <div 
              className="loadings-left"
              style={{ backgroundImage: `url(${curtainImage})` }}
            ></div>
            <div 
              className="loadings-right"
              style={{ backgroundImage: `url(${curtainImage})` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* App routes - pages animation starts behind curtains, revealed by split */}
      {showMainPage && (
        <div ref={landingPageRef}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* New day routes */}
            <Route path="/day/:dayId" element={<DayPage />} />
            <Route path="/stage/:stageId" element={<StagePage />} />
            {/* Legacy routes (kept for backwards compatibility) */}
            <Route path="/act-one" element={<ActOne />} />
            <Route path="/act-two" element={<ActTwo />} />
            <Route path="/act-three" element={<ActThree />} />
            <Route path="/act-four" element={<ActFour />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/acknowledgements" element={<Credits />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/thank-you" element={<ThankYou />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;

