import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './Header';

interface MenuProps {
  onPageClick?: (pageIndex: number) => void;
  isVisible: boolean;
  skipAnimation?: boolean;
}

const menuItems = [
  { id: 'monday-24th', title: 'Mon', subtitle: '24th', route: '/day/monday-24th', year: 2025, background: '/theatre/theatre1.webp' },
  { id: 'tuesday-25th', title: 'Tues', subtitle: '25th', route: '/day/tuesday-25th', year: 2025, background: '/theatre/theatre2.webp' },
  { id: 'wednesday-26th', title: 'Wed', subtitle: '26th', route: '/day/wednesday-26th', year: 2025, background: '/theatre/theatre3.webp' },
  { id: 'thursday-27th', title: 'Thurs', subtitle: '27th', route: '/day/thursday-27th', year: 2025, background: '/theatre/theatre4.webp' },
  { id: 'credits', title: 'Onwards', subtitle: '2026', route: '/acknowledgements', background: '/theatre/theatre5.webp' },
  { id: 'contact', title: 'Contact', subtitle: '', route: '/contact', year: null, background: '/theatre/theatre6.webp' },
];

export default function Menu({ onPageClick, isVisible, skipAnimation = false }: MenuProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload all menu images before showing animation
  useEffect(() => {
    if (!isVisible) {
      setImagesLoaded(false); // Reset when hidden
      return;
    }

    const imageUrls = menuItems.map(item => item.background).filter(Boolean) as string[];
    
    const preloadImages = async () => {
      try {
        // Preload and decode all images
        await Promise.all(
          imageUrls.map(
            (src) =>
              new Promise<void>((resolve) => {
                const img = new Image();
                img.onload = () => {
                  // Wait for decode to complete
                  img.decode().then(() => resolve()).catch(() => resolve());
                };
                img.onerror = () => resolve(); // Resolve even on error to not block
                img.src = src;
              })
          )
        );
        // Small delay to ensure browser has rendered
        await new Promise(resolve => setTimeout(resolve, 100));
        setImagesLoaded(true);
      } catch (error) {
        // If decode fails, still proceed after a delay
        setTimeout(() => setImagesLoaded(true), 500);
      }
    };

    preloadImages();
  }, [isVisible]);

  useEffect(() => {
    // Only start animation when menu is visible
    if (!isVisible || !containerRef.current) return;
    
    // If skipping animation (back navigation), show items immediately without waiting for images
    if (skipAnimation) {
      gsap.set(itemsRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0
      });
      return;
    }
    
    // For normal animation, wait for images to load
    if (!imagesLoaded) return;

    gsap.registerPlugin(ScrollTrigger);

    // Set initial states for animation
    gsap.set(itemsRef.current, {
      opacity: 0,
      y: 40,
      scale: 0.7,
      rotation: -5
    });

    // Create timeline
    const tl = gsap.timeline({ delay: 0.3 });

    // Menu items - staggered entrance with page-like effect
    tl.to(itemsRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.7,
      ease: 'back.out(1.4)',
      stagger: {
        each: 0.15,
        from: 'start'
      }
    });

    return () => {
      tl.kill();
    };
  }, [isVisible, imagesLoaded, skipAnimation]);

  const [touchStartMap, setTouchStartMap] = useState<Map<number, { y: number; time: number }>>(new Map());
  
  const handleItemClick = (index: number, route: string) => {
    if (onPageClick) {
      onPageClick(index);
    } else {
      navigate(route);
    }
  };
  
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    // Don't stop propagation - allow scroll to work
    const touch = e.touches[0];
    setTouchStartMap(prev => {
      const newMap = new Map(prev);
      newMap.set(index, { y: touch.clientY, time: Date.now() });
      return newMap;
    });
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    // Allow scrolling - don't prevent default
    // If user is scrolling, clear any pending click
    const touch = e.touches[0];
    let scrolling = false;
    
    touchStartMap.forEach((start, idx) => {
      const deltaY = Math.abs(touch.clientY - start.y);
      if (deltaY > 5) {
        scrolling = true;
      }
    });
    
    if (scrolling) {
      // User is scrolling, clear all touch starts
      setTouchStartMap(new Map());
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent, index: number, route: string) => {
    // Don't stop propagation - allow scroll to work
    const touchStart = touchStartMap.get(index);
    
    if (!touchStart) {
      // No touch start recorded, treat as potential scroll
      return;
    }
    
    const touch = e.changedTouches[0];
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    const deltaTime = Date.now() - touchStart.time;
    
    // Only trigger click if movement was very small (< 5px) and quick (< 250ms)
    // This prevents clicks when user is scrolling
    if (deltaY < 5 && deltaTime < 250) {
      e.preventDefault(); // Only prevent default if it's actually a click
      handleItemClick(index, route);
    }
    
    // Clear touch start
    setTouchStartMap(prev => {
      const newMap = new Map(prev);
      newMap.delete(index);
      return newMap;
    });
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className="impressive-menu"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        maxHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex: 100,
        background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #000000 100%)',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        // Ensure touch scrolling works
        touchAction: 'pan-y',
        // Prevent horizontal scroll
        overscrollBehaviorX: 'contain',
        overscrollBehaviorY: 'auto'
      }}
    >
      {/* Header - Matching Landing Page - scrolls with content */}
      <Header fixed={false} />

      {/* Content */}
      <div
        className="menu-content-container"
        onTouchMove={handleTouchMove}
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh', // Ensure minimum height
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start', // Allow natural scrolling on mobile
          padding: 'clamp(2rem, 6vh, 4rem) clamp(1rem, 3vw, 3rem)',
          paddingTop: 'clamp(2rem, 6vh, 4rem)', // Normal padding since header scrolls
          paddingBottom: 'clamp(2rem, 4vh, 3rem)', // Base padding, mobile gets extra via CSS
          boxSizing: 'border-box',
          // Ensure content can grow beyond viewport
          flexShrink: 0,
          // Ensure content is scrollable
          width: '100%'
        }}
      >
        {/* Menu Items Grid - Page-like Layout */}
        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <div
              key={item.id}
              ref={el => { itemsRef.current[index] = el as HTMLDivElement }}
              onClick={() => handleItemClick(index, item.route)}
              onTouchStart={(e) => handleTouchStart(e, index)}
              onTouchEnd={(e) => handleTouchEnd(e, index, item.route)}
              className="menu-item-card"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '2 / 3',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 'clamp(10px, 2vw, 16px)',
                border: '2px solid rgba(255, 215, 0, 0.5)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                maxWidth: 'clamp(140px, 25vw, 220px)',
                minWidth: 'clamp(120px, 20vw, 140px)',
                margin: '0 auto',
                touchAction: 'pan-y', // Allow vertical scrolling, but still allow clicks
                backgroundColor: 'rgba(255, 215, 0, 0.05)',
                opacity: skipAnimation ? 1 : 0, // Start visible if skipping animation, GSAP will animate otherwise
                justifySelf: 'center'
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.05,
                  y: -4,
                  boxShadow: '0 8px 30px rgba(255, 215, 0, 0.4)',
                  borderColor: 'rgba(255, 215, 0, 1)',
                  duration: 0.3,
                  ease: 'power2.out'
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  y: 0,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  borderColor: 'rgba(255, 215, 0, 0.5)',
                  duration: 0.3,
                  ease: 'power2.out'
                });
              }}
            >
              {/* Background Image */}
              {item.background && (
                <img
                  src={item.background}
                  alt={item.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    zIndex: 0
                  }}
                  onError={(e) => {
                    // Fallback if image doesn't exist - show text overlay
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                  loading="eager"
                />
              )}

              {/* Content overlay - no dark background, just text container */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 'clamp(0.75rem, 2vw, 1.25rem)',
                  zIndex: 2
                }}
              >
                <h2
                  style={{
                    fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
                    fontFamily: 'var(--font-heading), "Oswald", sans-serif',
                    fontWeight: 700,
                    color: '#ffd700',
                    margin: '0 0 clamp(0.25rem, 1vw, 0.5rem) 0',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                    letterSpacing: '0.05em',
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}
                >
                  {item.title}
                </h2>
                {item.subtitle && (
                  <div
                    style={{
                      fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
                      fontFamily: 'var(--font-heading), "Oswald", sans-serif',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textAlign: 'center',
                      textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                      marginBottom: item.year ? 'clamp(0.25rem, 1vw, 0.5rem)' : '0'
                    }}
                  >
                    {item.subtitle}
                  </div>
                )}
                {item.year && (
                  <div
                    style={{
                      fontSize: 'clamp(0.85rem, 2.2vw, 1.1rem)',
                      fontFamily: 'var(--font-heading), "Oswald", sans-serif',
                      color: 'rgba(255, 255, 255, 0.7)',
                      textAlign: 'center',
                      textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                      marginTop: 'clamp(0.25rem, 1vw, 0.5rem)',
                      paddingTop: 'clamp(0.25rem, 1vw, 0.5rem)',
                      borderTop: '1px solid rgba(255, 215, 0, 0.3)'
                    }}
                  >
                    {item.year}
                  </div>
                )}
              </div>

              {/* Shine effect on hover */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  transition: 'left 0.5s ease',
                  zIndex: 3,
                  pointerEvents: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.left = '100%';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
