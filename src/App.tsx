import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LandingPage from "./pages/landingpage/LandingPage";
import DayPage from "./pages/DayPage";
import StagePage from "./pages/StagePage";
import Credits from "./pages/Credits";
import Contact from "./pages/Contact";
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
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      // Initial states - start with lights visible, others below
      gsap.set(".counter-word[data-word='lights']", { y: 0, opacity: 1 });
      gsap.set(".counter-word[data-word='camera']", { y: 200, opacity: 0 });
      gsap.set(".counter-word[data-word='action']", { y: 200, opacity: 0 });
      
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

      // TIMING CALCULATION:
      // - lights/camera/action starts at 0s (same time as progress bar)
      // - WebGLProgram starts loading: 0s (immediately, so it has plenty of time to initialize)
      // - lights: 0s start, 0.7s duration → ends 0.7s
      // - camera enter: starts at 0.25s (overlap), 0.7s duration → ends 0.95s
      // - camera exit: starts at 1.1s, 0.7s duration → ends 1.8s
      // - action enter: starts at 1.35s, 0.7s duration → ends 2.05s
      // - action exit: starts at 2.2s, 0.7s duration → ends 2.9s
      // - Props Theatre transition starts: 2.9s + 0.2s = 3.1s
      // - Props Theatre transition ends: 3.1s + 0.8s = 3.9s (slower, smoother transition)
      // - Curtains split starts: 3.9s (immediately after Props Theatre transition)

      // Progress bar animation - starts at 0s, matches the word transitions
      gsap.from(".progress-fill", {
        width: 0,
        duration: 2,
        ease: "power2.inOut",
      });

      // lights/camera/action animation
      // lights is visible from start (no transition in) - same time as Props Theatre appears
      // lights stays visible for similar duration as camera/action, then transitions up/out
      // camera and action animate in/out sequentially
      tl.to(".counter-word[data-word='lights']", {
        y: -200,
        opacity: 0,
        duration: 0.7,
        delay: 0.7, // Stay visible for 0.7s before transitioning up (same duration as camera/action visible time)
      })
        .fromTo(
          ".counter-word[data-word='camera']",
          {
            y: 200,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          "-=0.45" // Overlap with lights exit
        )
        .to(
          ".counter-word[data-word='camera']",
          {
            y: -200,
            opacity: 0,
            duration: 0.7,
          },
          "+=0.15"
        )
        .fromTo(
          ".counter-word[data-word='action']",
          {
            y: 200,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
          },
          "-=0.45" // Overlap with camera exit
        )
        .to(
          ".counter-word[data-word='action']",
          {
            y: -200,
            opacity: 0,
            duration: 0.7,
          },
          "+=0.15"
        );

      // Letters turn gold during progress bar fill
      gsap.to(".letter", {
        color: "#ffd700",
        textShadow: "0 0 10px #ffd700",
        duration: 0.2,
        delay: 1,
        stagger: 0.2,
        ease: "power2.out",
      });

      // Progress fill fades out slightly before Props Theatre transition
      gsap.to(".progress-fill", {
        opacity: 0,
        delay: 2.9, // Right when action ends
        duration: 0.5,
      });

      // Start loading WebGLProgram immediately (at 0s) behind curtains
      // This gives it plenty of time to initialize and render before curtains split
      // WebGLProgram is already rendered from the start (showMainPage starts as true)
      // It's just hidden behind the curtains until they split
      console.log("[DEBUG] WebGLProgram should already be loading behind curtains at 0s");

      // Props Theatre letters transition off - starts 0.2s after lights/camera/action ends
      // Action ends at 2.9s, so transition starts at 3.1s
      // Slower, smoother transition: longer duration, bigger stagger, smoother easing
      // Letters fly further off the edges for a more dramatic effect
      // Split from the center of the entire phrase (all 12 letters together)
      // First 6 letters (indices 0-5: "Props" + "T") go left, last 6 (indices 6-11: "heatre") go right
      // Query letters when animation actually starts (not during setup)
      // Add animation to timeline at 3.1s
      tl.call(() => {
        const allLetters = loading.current?.querySelectorAll(".props .letter, .theatre .letter");
        if (allLetters && allLetters.length === 12) {
          console.log("[DEBUG] Found", allLetters.length, "letters for Props Theatre transition");
          // Add animation to the timeline so it runs at the correct time
          tl.to(Array.from(allLetters), {
            x: (index) => {
              // Split from center: 12 letters total, first 6 go left, last 6 go right
              return index < 6 ? -500 : 500;
            },
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power1.inOut",
          }, "<"); // Start immediately after the call (at 3.1s)
        } else {
          console.warn("[DEBUG] Expected 12 letters, found:", allLetters?.length || 0);
        }
      }, [], 3.1); // Run at 3.1s when animation should start

      // Hide word-loader and counter when Props Theatre transition completes
      // Props Theatre transition ends at 3.1s + 0.8s = 3.9s
      tl.to(".loadings .word-loader, .loadings .counter", {
        opacity: 0,
        duration: 0.2, // Slightly longer fade
        ease: "power2.inOut",
      }, 3.9) // Right when Props Theatre transition completes
      // Curtains split immediately after Props Theatre transition completes
      // Start WebGLProgram animation at the same time curtains split
      .call(() => {
        console.log("[DEBUG] Curtains splitting - starting WebGLProgram animation at 3.9s");
        window.dispatchEvent(new CustomEvent('startWebGLAnimation'));
      }, [], 3.9) // Same time as Props Theatre transition completes
      .to(".loadings-left", {
        x: "-100%",
        duration: 1.5,
        ease: "power3.inOut",
        onStart: () => console.log("[DEBUG] Left curtain animation started at 3.9s"),
        onComplete: () => console.log("[DEBUG] Left curtain animation completed")
      }, 3.9) // Same time as Props Theatre transition completes
      .to(".loadings-right", {
        x: "100%",
        duration: 1.5,
        ease: "power3.inOut",
        onStart: () => console.log("[DEBUG] Right curtain animation started at 3.9s"),
        onComplete: () => console.log("[DEBUG] Right curtain animation completed")
      }, 3.9) // Same time as Props Theatre transition completes
      // Make background transparent immediately when curtains split
      // Lower z-index so it doesn't block the page behind
      // This reveals WebGLProgram behind while curtains are still animating off screen
      .to(".loadings", {
        backgroundColor: "rgba(0, 0, 0, 0)",
        zIndex: -1, // Put below wrapper (z-index 0) so page is immediately visible
        duration: 0.2,
        ease: "power2.out",
      }, 3.9) // Same time as curtains split
      // Hide the entire loading screen after curtains have moved off screen
      .to(".loadings", {
        opacity: 0,
        duration: 0.1,
        ease: "power2.inOut",
        onComplete: () => {
          console.log("[DEBUG] Loading screen fade complete, hiding");
          gsap.set(".loadings", { display: "none" });
          setLoadingHidden(true);
        }
      }, 5.4); // After curtains animation completes (3.9s + 1.5s)
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
            
            <div className="word-loader">
              <div className="word-progress">
                <div className="word-container props">
                  <span className="letter">P</span>
                  <span className="letter">r</span>
                  <span className="letter">o</span>
                  <span className="letter">p</span>
                  <span className="letter">s</span>
                </div>
                <div className="word-container theatre">
                  <span className="letter">T</span>
                  <span className="letter">h</span>
                  <span className="letter">e</span>
                  <span className="letter">a</span>
                  <span className="letter">t</span>
                  <span className="letter">r</span>
                  <span className="letter">e</span>
                </div>
              </div>
              <div className="progress-fill"></div>
            </div>

            <div className="counter">
              <div className="counter-word" data-word="lights">lights</div>
              <div className="counter-word" data-word="camera">camera</div>
              <div className="counter-word" data-word="action">action</div>
            </div>
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
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;

