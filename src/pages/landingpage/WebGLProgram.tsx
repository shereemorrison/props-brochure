import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import GUI from 'lil-gui';
import Program from './program';
import { Size } from '../../types/types';
import gsap from 'gsap';

interface WebGLProgramProps {
  onPageClick?: (pageIndex: number) => void;
  skipAnimation?: boolean;
}

export default function WebGLProgram({ onPageClick, skipAnimation = false }: WebGLProgramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pagesGridRef = useRef<HTMLDivElement>(null);
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
  
  // Track when to show the grid
  const [showPagesGrid, setShowPagesGrid] = useState(false);
  const [canvasOpacity, setCanvasOpacity] = useState(1);

  useEffect(() => {
    // If skipping animation, show grid immediately
    if (skipAnimation) {
      setCanvasOpacity(0);
      setShowPagesGrid(true);
      
      // Animate grid in after it mounts
      setTimeout(() => {
        if (pagesGridRef.current) {
          const cards = pagesGridRef.current.querySelectorAll('.page-card');
          gsap.fromTo(cards, 
            {
              opacity: 0,
              scale: 0.8,
              y: 30
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.6,
              ease: 'back.out(1.2)',
              stagger: 0.1
            }
          );
        }
      }, 50);
      
      return;
    }
    
    if (!canvasRef.current || !containerRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    const raycaster = new THREE.Raycaster();
    const debug = new GUI();

    camera.position.z = 6;
    scene.add(camera);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setClearColor(0x000000, 0);

    const fov = camera.fov * (Math.PI / 180);
    const height = camera.position.z * Math.tan(fov / 2) * 2;
    const width = height * camera.aspect;
    const sizes: Size = { width, height };

    const program = new Program({ scene, debug, sizes, skipAnimation });

    debug.hide();

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    programRef.current = program;
    debugRef.current = debug;
    sizesRef.current = sizes;
    raycasterRef.current = raycaster;

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
      // Don't interfere with clicks before pages are flat
      if (!program.material || program.material.uniforms.uSplitProgress.value < 0.95) {
        return;
      }

      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const rect = canvasRef.current!.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update raycaster
      raycaster.setFromCamera(mouseRef.current, camera);

      // Check for intersections with the instanced mesh
      if (program.instancedMesh) {
        const intersects = raycaster.intersectObject(program.instancedMesh);

        if (intersects.length > 0) {
          const intersection = intersects[0];
          const instanceId = intersection.instanceId;

          if (instanceId !== undefined) {
            // Pages 12-17 are indices 11-16
            // Map to pageIndex 0-5 for Act One through Contact
            if (instanceId >= 11 && instanceId <= 16) {
              const pageIndex = instanceId - 11;
              const pageNames = ['Act One', 'Act Two', 'Act Three', 'Act Four', 'Acknowledgements', 'Contact'];

              console.log(`Clicked page ${pageIndex} (${pageNames[pageIndex]}) - instanceId: ${instanceId}`);

              if (onPageClick) {
                onPageClick(pageIndex);
              }
            }
          }
        }
      }
    };

    // Add pointer event listener to canvas
    canvasRef.current.addEventListener('pointerdown', handlePointerDown);

    // ============================================
    // HOVER EFFECT (Optional - shows visual feedback)
    // ============================================
    let hoveredInstanceId: number | null = null;

    const handlePointerMove = (event: PointerEvent) => {
      if (!program.material || program.material.uniforms.uSplitProgress.value < 0.95) {
        if (canvasRef.current) {
          canvasRef.current.style.cursor = 'default';
        }
        return;
      }

      const rect = canvasRef.current!.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseRef.current, camera);

      if (program.instancedMesh) {
        const intersects = raycaster.intersectObject(program.instancedMesh);

        if (intersects.length > 0) {
          const intersection = intersects[0];
          const instanceId = intersection.instanceId;

          if (instanceId !== undefined && instanceId >= 11 && instanceId <= 16) {
            // Hovering over a clickable page
            if (canvasRef.current) {
              canvasRef.current.style.cursor = 'pointer';
            }
            hoveredInstanceId = instanceId;
          } else {
            if (canvasRef.current) {
              canvasRef.current.style.cursor = 'default';
            }
            hoveredInstanceId = null;
          }
        } else {
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'default';
          }
          hoveredInstanceId = null;
        }
      }
    };

    canvasRef.current.addEventListener('pointermove', handlePointerMove);

    // ============================================
    // ANIMATION LOOP & TRANSITION DETECTION
    // ============================================
    let fadeTriggered = false;
    
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      renderer.render(scene, camera);
      program.render();
      
      // Check if pages are flat and trigger fade effect
      if (!fadeTriggered && program.material && program.material.uniforms.uSplitProgress.value >= 0.95) {
        fadeTriggered = true;
        
        // Fade effect: smooth fade out using shader uniform for uniform fade across all pages
        if (canvasRef.current && containerRef.current && program.material) {
          const fadeOutUniform = program.material.uniforms.uFadeOut;
          
          // Animate the fade out uniform in the shader for uniform fade across all pages
          gsap.to(fadeOutUniform, {
            value: 1,
            duration: 0.6,
            ease: 'power2.in',
            onComplete: () => {
              // Also fade canvas/container for backup
              gsap.to([canvasRef.current, containerRef.current], {
                opacity: 0,
                duration: 0.1,
                onComplete: () => {
                  // Ensure canvas is fully hidden
                  setCanvasOpacity(0);
                  if (canvasRef.current) {
                    canvasRef.current.style.opacity = '0';
                    canvasRef.current.style.pointerEvents = 'none';
                  }
                  if (containerRef.current) {
                    containerRef.current.style.opacity = '0';
                    containerRef.current.style.pointerEvents = 'none';
                  }
                  
                  // Small delay before showing grid for smooth transition
                  setTimeout(() => {
                    setShowPagesGrid(true);
                    
                    // Animate grid in one by one with staggered effect
                    setTimeout(() => {
                      if (pagesGridRef.current) {
                        const cards = pagesGridRef.current.querySelectorAll('.page-card');
                        gsap.fromTo(cards, 
                          {
                            opacity: 0,
                            scale: 0.7,
                            y: 40,
                            rotation: -5
                          },
                          {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            rotation: 0,
                            duration: 0.7,
                            ease: 'back.out(1.4)',
                            stagger: {
                              each: 0.15,
                              from: 'start'
                            }
                          }
                        );
                      }
                    }, 100);
                  }, 200);
                }
              });
            }
          });
        }
      }
    };

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

      if (canvasRef.current) {
        canvasRef.current.removeEventListener('pointerdown', handlePointerDown);
        canvasRef.current.removeEventListener('pointermove', handlePointerMove);
      }

      renderer.dispose();
      debug.destroy();
    };
  }, [onPageClick, skipAnimation]);

  // Page data for the grid
  const pages = [
    { title: 'Act One', image: '/pages/p6.jpg', index: 0 },
    { title: 'Act Two', image: '/pages/p7.jpg', index: 1 },
    { title: 'Act Three', image: '/pages/p8.jpg', index: 2 },
    { title: 'Act Four', image: '/pages/p9.jpg', index: 3 },
    { title: 'Credits', image: '/pages/p10.jpg', index: 4 },
    { title: 'Contact', image: '/pages/p11.jpg', index: 5 },
  ];

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
          zIndex: 1,
          touchAction: 'none',
          opacity: canvasOpacity,
          pointerEvents: canvasOpacity > 0 ? 'auto' : 'none',
          visibility: canvasOpacity > 0 ? 'visible' : 'hidden'
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
      
      {/* Responsive Pages Grid */}
      {showPagesGrid && (
        <div
          ref={pagesGridRef}
          className="pages-grid-container"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            zIndex: 10,
            backgroundColor: '#000',
            padding: 'clamp(1rem, 4vh, 3rem) clamp(0.5rem, 2vw, 2rem)',
            WebkitOverflowScrolling: 'touch',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            minHeight: '100vh'
          }}
        >
          <div
            className="pages-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, clamp(90px, 18vw, 150px)), 1fr))',
              gap: 'clamp(0.5rem, 2vw, 1.5rem)',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: '1400px',
              width: '100%',
              boxSizing: 'border-box',
              padding: 'clamp(1rem, 4vh, 2rem) clamp(0.25rem, 1vw, 1rem)',
              margin: 'auto'
            }}
          >
            {pages.map((page) => (
              <div
                key={page.index}
                className="page-card"
                onClick={() => {
                  if (onPageClick) {
                    onPageClick(page.index);
                  }
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (onPageClick) {
                    onPageClick(page.index);
                  }
                }}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '2 / 3',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  borderRadius: '0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  maxWidth: 'clamp(90px, 18vw, 150px)',
                  minWidth: 'clamp(75px, 15vw, 90px)',
                  margin: '0 auto',
                  touchAction: 'manipulation',
                  backgroundColor: 'rgba(255, 215, 0, 0.05)',
                  opacity: 0, // Start invisible, GSAP will animate
                  justifySelf: 'center' // Center each card within its grid cell
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 215, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
                }}
              >
                <img
                  src={page.image}
                  alt={page.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement!;
                    parent.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                    parent.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ffd700; font-family: 'Bungee', 'Playfair Display', serif; font-size: clamp(0.9rem, 2.5vw, 1.2rem); text-align: center; padding: 1.5rem; line-height: 1.3;">${page.title}</div>`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}