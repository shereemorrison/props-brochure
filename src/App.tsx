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

function App() {
  const [showMainPage, setShowMainPage] = useState(false);
  const [loadingHidden, setLoadingHidden] = useState(false);
  const loading = useRef<HTMLDivElement>(null);
  const landingPageRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle refresh - always redirect to home (menu)
  useEffect(() => {
    // Only redirect if we're not already on the home page and showMainPage hasn't been set yet
    if (location.pathname !== '/' && !showMainPage) {
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

      // Progress bar animation - matches the word transitions
      gsap.from(".progress-fill", {
        width: 0,
        duration: 2,
        ease: "power2.inOut",
      });

      // Animate words moving up sequentially, timed to finish just before Props Theatre transition
      // Props Theatre letters transition at delay 3.5s, so finish words around 3.2s
      tl.to(".counter-word[data-word='lights']", {
        y: -200,
        opacity: 0,
        duration: 0.7,
        delay: 0.5,
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
          "-=0.45"
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
          "-=0.45"
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

      gsap.to(".letter", {
        color: "#ffd700",
        textShadow: "0 0 10px #ffd700",
        duration: 0.2,
        delay: 1,
        stagger: 0.2,
        ease: "power2.out",
      });

      gsap.to(".progress-fill", {
        opacity: 0,
        delay: 3,
        duration: 0.5,
      });

      gsap.to(".props, .theatre .letter", {
        x: (index) => index < 2 ? -200 : 200,
        opacity: 0,
        duration: 0.5,
        delay: 3.5,
        stagger: 0.05,
        ease: "power2.in",
      });

      // After Props Theatre swipes out, show pages animation behind curtains
      // Pages start when word-loader fades, then curtains split to reveal them
      tl.to(".loadings .word-loader, .loadings .counter", {
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut",
      }, 4.0)
      .call(() => {
        // Show pages animation behind curtains (original timing - 4.2s)
        console.log("[DEBUG] Showing pages animation at 4.2s");
        setShowMainPage(true);
      }, [], 4.2)
      .to(".loadings-left", {
        x: "-100%",
        duration: 1.5,
        ease: "power3.inOut",
        onStart: () => console.log("[DEBUG] Left curtain animation started at 4.3s"),
        onComplete: () => console.log("[DEBUG] Left curtain animation completed")
      }, 4.3)
      .to(".loadings-right", {
        x: "100%",
        duration: 1.5,
        ease: "power3.inOut",
        onStart: () => console.log("[DEBUG] Right curtain animation started at 4.3s"),
        onComplete: () => console.log("[DEBUG] Right curtain animation completed")
      }, 4.3)
      .to(".loadings", {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          console.log("[DEBUG] Loading screen fade complete, hiding");
          gsap.set(".loadings", { display: "none" });
          setLoadingHidden(true);
        }
      }, 5.8);
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
            <div className="loadings-left"></div>
            <div className="loadings-right"></div>
            
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

