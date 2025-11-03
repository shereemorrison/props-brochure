import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import GUI from 'lil-gui';
import Program from './program';
import { Size } from '../../types/types';
import gsap from 'gsap';
import Menu from '../../components/Menu';

// Global flag to prevent animation restart across remounts (React Strict Mode)
let globalAnimationStarted = false;

interface WebGLProgramProps {
  onPageClick?: (pageIndex: number) => void;
  skipAnimation?: boolean;
}

export default function WebGLProgram({ onPageClick, skipAnimation = false }: WebGLProgramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const programRef = useRef<Program | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const debugRef = useRef<GUI | null>(null);
  const sizesRef = useRef<Size | null>(null);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  // Track when to show the menu
  // Initialize showMenu to true if skipping animation (for back navigation)
  const [showMenu, setShowMenu] = useState(skipAnimation);
  const [canvasOpacity, setCanvasOpacity] = useState(skipAnimation ? 0 : 1);
  const initializedRef = useRef(false);

  useEffect(() => {
    console.log("[DEBUG] WebGLProgram useEffect called", { 
      skipAnimation, 
      initializedRef: initializedRef.current,
      globalAnimationStarted 
    });
    
    // If skipping animation, always show menu immediately (even on remount)
    if (skipAnimation) {
      setCanvasOpacity(0);
      setShowMenu(true);
      initializedRef.current = true;
      globalAnimationStarted = true;
      return;
    }
    
    // Prevent re-initialization if already initialized OR if animation already started globally
    if (initializedRef.current || globalAnimationStarted) {
      console.log("[DEBUG] WebGLProgram: Already initialized or animation started globally, skipping");
      return;
    }
    
    if (!canvasRef.current || !containerRef.current) {
      console.log("[DEBUG] WebGLProgram: Canvas or container not ready");
      return;
    }

    console.log("[DEBUG] WebGLProgram: Initializing Three.js scene");
    initializedRef.current = true;
    globalAnimationStarted = true;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance' // Help with mobile performance
    });
    
    // Check if WebGL context was created successfully
    const gl = renderer.getContext();
    if (!gl) {
      console.error("[DEBUG] WebGLProgram: Failed to create WebGL context!");
      console.error("[DEBUG] This might be a simulator limitation. WebGL often doesn't work in mobile simulators.");
      console.error("[DEBUG] Please test on a real device or try a different browser simulator.");
      // Show menu immediately if WebGL fails (graceful degradation)
      setShowMenu(true);
      return;
    }
    
    // Check WebGL version and capabilities
    const webglInfo = {
      renderer: gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION),
      vendor: gl.getParameter(gl.VENDOR),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
    };
    
    console.log("[DEBUG] WebGLProgram: WebGL context created successfully", webglInfo);
    
    // Warn if using software rendering (common in simulators)
    if (webglInfo.renderer.toLowerCase().includes('software') || 
        webglInfo.renderer.toLowerCase().includes('swiftshader')) {
      console.warn("[DEBUG] WARNING: Using software WebGL rendering (likely simulator). Performance will be poor and may not work correctly.");
      console.warn("[DEBUG] Please test on a real device for accurate results.");
    }
    // @ts-ignore - Raycaster constructor doesn't need arguments in Three.js
    const raycaster = new THREE.Raycaster();
    const debug = new GUI();

    // @ts-ignore - Position property exists on PerspectiveCamera
    camera.position.set(0, 0, 6);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setClearColor(0x000000, 0);

    const fov = camera.fov * (Math.PI / 180);
    // @ts-ignore - Position property exists on PerspectiveCamera
    const height = camera.position.z * Math.tan(fov / 2) * 2;
    const width = height * camera.aspect;
    const sizes: Size = { width, height };

    const program = new Program({ scene, debug, sizes, skipAnimation });
    console.log("[DEBUG] WebGLProgram: Program instance created (material will be created asynchronously)");

    debug.hide();

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    programRef.current = program;
    debugRef.current = debug;
    sizesRef.current = sizes;
    raycasterRef.current = raycaster;

    // Listen for custom event to start animation when curtains split
    const handleStartAnimation = () => {
      console.log("[DEBUG] WebGLProgram: Received startAnimation event");
      
      // Robust retry mechanism for mobile - multiple attempts with increasing delays
      const tryStartAnimation = (attempt = 1, maxAttempts = 10) => {
        console.log(`[DEBUG] WebGLProgram: Attempt ${attempt} to start animation`);
        
        if (programRef.current && programRef.current.animationTimeline) {
          // Check if material is also ready (ensure texture is loaded)
          if (programRef.current.material && programRef.current.material.uniforms) {
            if (programRef.current.animationTimeline.paused()) {
              console.log("[DEBUG] WebGLProgram: Starting animation");
              programRef.current.startAnimation();
              return true;
            } else {
              console.log("[DEBUG] WebGLProgram: Animation already running");
              return true;
            }
          } else {
            console.log("[DEBUG] WebGLProgram: Material not ready yet");
          }
        } else {
          console.log("[DEBUG] WebGLProgram: Program or timeline not ready yet");
        }
        
        // Retry with exponential backoff (50ms, 100ms, 200ms, 400ms, 500ms, then 500ms each)
        if (attempt < maxAttempts) {
          const delay = attempt <= 4 ? 50 * Math.pow(2, attempt - 1) : 500;
          setTimeout(() => {
            tryStartAnimation(attempt + 1, maxAttempts);
          }, delay);
        } else {
          console.error("[DEBUG] WebGLProgram: Failed to start animation after all retries");
          // Last resort: try to start anyway if program exists
          if (programRef.current && programRef.current.animationTimeline) {
            try {
              programRef.current.startAnimation();
            } catch (error) {
              console.error("[DEBUG] WebGLProgram: Error starting animation:", error);
            }
          }
        }
        
        return false;
      };
      
      tryStartAnimation();
      
      // Mark that the event was fired (for program.ts to check if it loads late)
      (window as any).__webglAnimationEventFired = true;
    };
    window.addEventListener('startWebGLAnimation', handleStartAnimation);
    
    // Also listen for material ready event as a backup trigger on mobile
    const handleMaterialReady = () => {
      console.log("[DEBUG] WebGLProgram: Material ready event received");
      // Small delay to ensure timeline is also ready
      setTimeout(() => {
        if (programRef.current && programRef.current.animationTimeline && programRef.current.animationTimeline.paused()) {
          // Only start if event was already fired (curtains already split)
          if ((window as any).__webglAnimationEventFired) {
            console.log("[DEBUG] WebGLProgram: Material ready, starting delayed animation");
            programRef.current.startAnimation();
          }
        }
      }, 200);
    };
    window.addEventListener('webglMaterialReady', handleMaterialReady);

    // ============================================
    // RESPONSIVE RESIZE HANDLER with ResizeObserver
    // ============================================
    const handleResize = (entries?: ResizeObserverEntry[]) => {
      let width: number;
      let height: number;

      if (entries && entries[0]) {
        // Called from ResizeObserver - use container dimensions
        const entry = entries[0];
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      } else {
        // Called from window resize - use window dimensions
        width = window.innerWidth;
        height = window.innerHeight;
      }

      // Ensure valid dimensions
      if (width <= 0 || height <= 0) return;

      // Update camera
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

      // Update program
      if (program) {
        const fov = camera.fov * (Math.PI / 180);
        // @ts-ignore - Position property exists on PerspectiveCamera
        const viewHeight = camera.position.z * Math.tan(fov / 2) * 2;
        const viewWidth = viewHeight * camera.aspect;
        const newSizes = { width: viewWidth, height: viewHeight };

        program.onResize(newSizes);
        if (sizesRef.current) {
          sizesRef.current.width = viewWidth;
          sizesRef.current.height = viewHeight;
        }
      }

      console.log(`Resized to: ${width}x${height}`);
    };

    // Use ResizeObserver for the most accurate resize detection
    const resizeObserver = new ResizeObserver((entries) => {
      // Use requestAnimationFrame to batch updates
      requestAnimationFrame(() => handleResize(entries));
    });

    resizeObserver.observe(containerRef.current);
    resizeObserverRef.current = resizeObserver;

    // Fallback window resize listener
    const windowResizeHandler = () => {
      requestAnimationFrame(() => handleResize());
    };
    window.addEventListener('resize', windowResizeHandler);

    // Initial resize
    handleResize();

    // ============================================
    // RAYCASTING for Click Detection
    // ============================================
    const handlePointerDown = (event: PointerEvent) => {
      // Don't interfere with clicks - menu now handles navigation
        return;
    };

    // Add pointer event listener to canvas
    canvasRef.current.addEventListener('pointerdown', handlePointerDown);

    // ============================================
    // HOVER EFFECT (Optional - shows visual feedback)
    // ============================================
    const handlePointerMove = (event: PointerEvent) => {
      // Simplified hover - menu handles navigation now
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'default';
      }
    };

    canvasRef.current.addEventListener('pointermove', handlePointerMove);

    // ============================================
    // ANIMATION LOOP & TRANSITION DETECTION
    // ============================================
    // EDIT THIS SECTION TO MODIFY THE FADE OUT TIMING
    // ============================================
    let rotationComplete = false;
    let animationStarted = false;
    
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Only render if material is ready
      if (program.material && program.material.uniforms) {
        renderer.render(scene, camera);
        program.render();
        
        // Log when animation starts
        if (!animationStarted && program.material.uniforms.uProgress.value > 0) {
          animationStarted = true;
          console.log("[DEBUG] WebGLProgram: Animation started, uProgress:", program.material.uniforms.uProgress.value);
        }
      } else {
        // Material not ready yet - still render empty scene to keep animation loop running
        renderer.render(scene, camera);
      }
      
      // STEP 2: FADE OUT (triggers when rotation completes)
      // When rotation completes, fade out brochure then show grid
      if (!rotationComplete && program.material && program.material.uniforms.uProgress.value >= 1.0) {
        rotationComplete = true;
        console.log("[DEBUG] WebGLProgram: Rotation complete, uProgress:", program.material.uniforms.uProgress.value);
          
        // Fade out the brochure/canvas smoothly
        // Duration: 0.8 seconds
        // EDIT THIS TO CHANGE FADE TIMING
              gsap.to([canvasRef.current, containerRef.current], {
                opacity: 0,
          duration: 0.8,
          ease: 'power2.in',
                onComplete: () => {
            // Hide canvas after fade
                  setCanvasOpacity(0);
                  if (canvasRef.current) {
                    canvasRef.current.style.opacity = '0';
                    canvasRef.current.style.pointerEvents = 'none';
                  }
                  if (containerRef.current) {
                    containerRef.current.style.opacity = '0';
                    containerRef.current.style.pointerEvents = 'none';
                  }
                  
            // STEP 3: SHOW MENU (after fade completes)
            setShowMenu(true);
            console.log("[DEBUG] WebGLProgram: Menu shown");
                      }
        });
      }
    };
    // ============================================
    // END FADE OUT TIMING EDIT SECTION
    // ============================================

    animate();

    // ============================================
    // CLEANUP
    // ============================================
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      window.removeEventListener('resize', windowResizeHandler);
      window.removeEventListener('startWebGLAnimation', handleStartAnimation);
      window.removeEventListener('webglMaterialReady', handleMaterialReady);
      
      // Clean up global flag
      delete (window as any).__webglAnimationEventFired;

      if (canvasRef.current) {
        canvasRef.current.removeEventListener('pointerdown', handlePointerDown);
        canvasRef.current.removeEventListener('pointermove', handlePointerMove);
      }

      renderer.dispose();
      debug.destroy();
    };
  }, [onPageClick, skipAnimation]);

  return (
    <>
      <div
        ref={containerRef}
        className="webgl-wrapper"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 0, // Behind curtains (curtains at z-index 20) during reveal
          touchAction: 'none',
          opacity: 1, // Always visible - opacity controlled by canvasOpacity only affects interaction
          pointerEvents: canvasOpacity > 0 ? 'auto' : 'none',
          backgroundColor: 'transparent', // Transparent so we see the canvas content, not black
        }}
      >
        <canvas
          ref={canvasRef}
          className="webgl-canvas"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            touchAction: 'none',
            transformOrigin: 'center center'
          }}
        />
      </div>
      
      {/* Impressive Menu */}
      <Menu 
        isVisible={showMenu} 
        onPageClick={onPageClick}
        skipAnimation={skipAnimation}
      />
    </>
  );
}