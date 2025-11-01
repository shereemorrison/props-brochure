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
      antialias: true
    });
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
      // Use programRef to ensure we have the latest program instance
      if (programRef.current && programRef.current.animationTimeline) {
        if (programRef.current.animationTimeline.paused()) {
          programRef.current.startAnimation();
        } else {
          console.log("[DEBUG] WebGLProgram: Animation already running");
        }
      } else {
        console.log("[DEBUG] WebGLProgram: Program or timeline not ready yet, will retry");
        // Retry after a short delay if program isn't ready
        setTimeout(() => {
          if (programRef.current && programRef.current.animationTimeline && programRef.current.animationTimeline.paused()) {
            programRef.current.startAnimation();
          }
        }, 100);
      }
    };
    window.addEventListener('startWebGLAnimation', handleStartAnimation);

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

      renderer.render(scene, camera);
      program.render();
      
      // Log when animation starts
      if (!animationStarted && program.material && program.material.uniforms.uProgress.value > 0) {
        animationStarted = true;
        console.log("[DEBUG] WebGLProgram: Animation started, uProgress:", program.material.uniforms.uProgress.value);
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
          zIndex: 0, // Behind curtains (curtains are z-index 2 within loading screen z-index 20)
          touchAction: 'none',
          opacity: 1, // Always visible - opacity controlled by canvasOpacity only affects interaction
          pointerEvents: canvasOpacity > 0 ? 'auto' : 'none',
          backgroundColor: '#000', // Black background so canvas area is visible from start
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