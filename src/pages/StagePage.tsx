import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { days } from '../data/performances';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Import critical images from assets (bundled with app)
const stageoneImages = import.meta.glob('../assets/images/stageone/*.webp', { eager: true, as: 'url' });
const stagetwoImages = import.meta.glob('../assets/images/stagetwo/*.webp', { eager: true, as: 'url' });
const stagethreeImages = import.meta.glob('../assets/images/stagethree/*.webp', { eager: true, as: 'url' });

// Helper function to get bundled images for a stage
function getBundledImages(stageFolder: string): string[] {
  let images: Record<string, string> = {};
  if (stageFolder === 'stageone') {
    images = stageoneImages;
  } else if (stageFolder === 'stagetwo') {
    images = stagetwoImages;
  } else if (stageFolder === 'stagethree') {
    images = stagethreeImages;
  }
  
  // Sort by filename to ensure correct order (extract number from filename)
  return Object.values(images).sort((a, b) => {
    const matchA = a.match(/(\d+)\.webp/);
    const matchB = b.match(/(\d+)\.webp/);
    const numA = matchA ? parseInt(matchA[1]) : 0;
    const numB = matchB ? parseInt(matchB[1]) : 0;
    return numA - numB;
  });
}

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Helper function to get stage folder name from stage ID
function getStageFolder(stageId: string): string {
  if (stageId.includes('stage-one')) return 'stageone';
  if (stageId.includes('stage-two')) return 'stagetwo';
  if (stageId.includes('stage-three')) return 'stagethree';
  return 'stageone'; // default
}

// Dynamically discover images - first use bundled assets, then fall back to public folder
async function discoverImages(stageFolder: string, maxAttempts: number = 400): Promise<string[]> {
  const images: string[] = [];
  
  // First, add bundled images from assets (these are immediately available)
  const bundledImages = getBundledImages(stageFolder);
  images.push(...bundledImages);
  console.log(`[DEBUG] Loaded ${bundledImages.length} bundled images from assets for ${stageFolder}`);
  
  // Then try to discover additional images from public folder (starting from where bundled images end)
  const startIndex = bundledImages.length + 1;
  let consecutiveFailures = 0;
  const maxConsecutiveFailures = 15;
  let foundAny = false;
  
  // Try loading images sequentially from public folder
  for (let i = startIndex; i <= maxAttempts; i++) {
    const imagePath = `/${stageFolder}/${stageFolder}${i}.webp`;
    
    const result = await new Promise<string | null>((resolve) => {
      let resolved = false;
      const img = new Image();
      
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(null);
        }
      }, 1500);
      
      img.onload = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          resolve(imagePath);
        }
      };
      
      img.onerror = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          resolve(null);
        }
      };
      
      img.src = imagePath;
    });
    
    if (result) {
      images.push(result);
      consecutiveFailures = 0;
      foundAny = true;
    } else {
      consecutiveFailures++;
      if (foundAny && consecutiveFailures >= maxConsecutiveFailures) {
        break;
      }
    }
  }
  
  return images;
}

export default function StagePage() {
  const navigate = useNavigate();
  const { stageId } = useParams<{ stageId: string }>();
  
  const blurbRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Find the stage data from all days and also find which day it belongs to
  let stageData = null;
  let parentDayId = null;
  for (const day of days) {
    const found = day.stages.find(s => s.id === stageId);
    if (found) {
      stageData = found;
      parentDayId = day.id;
      break;
    }
  }
  
  if (!stageData) {
    return (
      <div className="detail-page">
        <button className="back-button" onClick={() => navigate('/')}>← Back</button>
        <div className="detail-content">
          <h1>Stage not found</h1>
        </div>
      </div>
    );
  }

  // Get stage folder and discover images dynamically
  const stageFolder = getStageFolder(stageId || '');
  
  useEffect(() => {
    setImagesLoading(true);
    discoverImages(stageFolder, 400).then((discoveredImages) => {
      console.log(`Found ${discoveredImages.length} images for ${stageFolder}`);
      // Limit to first 8 images
      const limitedImages = discoveredImages.slice(0, 8);
      console.log(`Setting ${limitedImages.length} images to display`);
      setImagePaths(limitedImages);
      setImagesLoading(false);
      
    }).catch((error) => {
      console.error('Error loading images:', error);
      setImagesLoading(false);
      setImagePaths([]);
    });
  }, [stageFolder]);

  // Split the summary into words
  const words = stageData.summary.split(' ');

  useGSAP(() => {
    // Wait for all refs to be ready
    if (!blurbRef.current || !titleRef.current || !subtitleRef.current || !storyContainerRef.current) {
      return;
    }

    const wordElements = blurbRef.current.querySelectorAll('.word');
    if (wordElements.length === 0) return;

    // Refresh ScrollTrigger to recalculate
    ScrollTrigger.refresh();

    // Title and subtitle - animate immediately
    gsap.fromTo([titleRef.current, subtitleRef.current], 
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out'
      }
    );

    // Set initial state for words
    gsap.set(wordElements, {
      opacity: 0,
      y: 20
    });

    // Words - animate on scroll
    ScrollTrigger.create({
      trigger: blurbRef.current,
      start: 'top 80%',
      toggleActions: 'play none none none',
      onEnter: () => {
        gsap.to(wordElements, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: 'power2.out'
        });
      }
    });

    // Story sections - animate as they come into view
    sectionRefs.current.forEach((section, index) => {
      if (!section) return;

      // Set initial state
      gsap.set(section, {
        opacity: 0,
        y: 50,
        scale: 0.95
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          gsap.to(section, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power2.out'
          });
        },
        onEnterBack: () => {
          gsap.to(section, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power2.out'
          });
        }
      });
    });
    
    // After images load, refresh ScrollTrigger to ensure cast section triggers work
    // Also check if cast section is already visible and make it visible
    if (!imagesLoading) {
      refreshTimerRef.current = setTimeout(() => {
        ScrollTrigger.refresh();
        const castSection = sectionRefs.current[2];
        if (castSection) {
          const rect = castSection.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight && rect.bottom > 0;
          if (isInView) {
            gsap.to(castSection, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power2.out',
              immediateRender: false
            });
          }
        }
      }, 500);
    }

    // Animate images as they come into view
    imagesRef.current.forEach((imgContainer, index) => {
      if (!imgContainer) return;

      // Set initial state - visible by default
      gsap.set(imgContainer, {
        opacity: 1,
        y: 0,
        scale: 1
      });

      // Only animate if there are multiple images and we want scroll animation
      if (imagesRef.current.length > 1) {
        ScrollTrigger.create({
          trigger: imgContainer,
          start: 'top 85%',
          toggleActions: 'play none none none',
          onEnter: () => {
            gsap.fromTo(imgContainer, 
              {
                opacity: 0,
                y: 30,
                scale: 0.95
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: 'power2.out'
              }
            );
          }
        });
      }
    });

    // Cleanup
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === storyContainerRef.current || 
            trigger.vars.trigger === blurbRef.current ||
            sectionRefs.current.includes(trigger.vars.trigger as HTMLDivElement) ||
            imagesRef.current.includes(trigger.vars.trigger as HTMLDivElement)) {
          trigger.kill();
        }
      });
    };
  }, { dependencies: [stageData, imagePaths, imagesLoading] });

  return (
    <div className="detail-page">
      
      <button className="back-button" onClick={() => navigate(parentDayId ? `/day/${parentDayId}` : '/')}>← Back</button>
      <div className="detail-content" ref={storyContainerRef}>
        <h1 ref={titleRef}>{stageData.title}</h1>
        <div className="detail-subtitle" ref={subtitleRef}>{stageData.stageNumber}</div>
        
        <section className="story-section" ref={el => { sectionRefs.current[0] = el as HTMLDivElement }}>
          <p ref={blurbRef} className="story-blurb">
            {words.map((word, index) => (
              <span key={index} className="word" style={{ display: 'inline-block', marginRight: index < words.length - 1 ? '0.25em' : '0' }}>
                {word}
              </span>
            ))}
          </p>
        </section>

        {/* Stage Images Gallery */}
        <section className="story-section stage-images-section" ref={el => { sectionRefs.current[1] = el as HTMLDivElement }}>
          <h2>Gallery</h2>
          {imagesLoading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: "Bungee, 'Playfair Display', serif"
            }}>
              Loading images...
            </div>
          ) : imagePaths.length > 0 ? (
            <div className="stage-images-grid">
              {imagePaths.map((imagePath, index) => (
                <div 
                  key={`${imagePath}-${index}`}
                  className="stage-image-container"
                  ref={el => { 
                    if (el) imagesRef.current[index] = el;
                  }}
                >
                  <img 
                    src={imagePath}
                    alt={`${stageData.title} - Image ${index + 1}`}
                    loading="eager"
                    onError={(e) => {
                      console.error(`Failed to load image ${index + 1}: ${imagePath}`);
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log(`Successfully loaded image ${index + 1}: ${imagePath}`);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: "Bungee, 'Playfair Display', serif"
            }}>
              No images found
            </div>
          )}
        </section>

        <section className="story-section cast-section" ref={el => { sectionRefs.current[2] = el as HTMLDivElement }}>
          <h2>Cast & Crew</h2>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontFamily: "Bungee, 'Playfair Display', serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            marginTop: 'clamp(1rem, 2vh, 1.5rem)',
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)'
          }}>
            Performer names and roles will go here
          </p>
          {stageData.cast.length > 0 && (
            <div className="cast-grid">
              {stageData.cast.map((member, i) => (
                <div key={i} className="cast-member-card">
                  <div style={{ fontWeight: 'bold', color: '#ffd700', fontFamily: "Bungee, 'Playfair Display', serif" }}>{member.name}</div>
                  <div style={{ color: '#ffffff', opacity: 0.8, fontFamily: "Bungee, 'Playfair Display', serif" }}>{member.role}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {stageData.awards.length > 0 && (
          <section className="story-section" ref={el => { sectionRefs.current[3] = el as HTMLDivElement }}>
            <h2>Awards & Recognition</h2>
            <div className="awards-grid">
              {stageData.awards.map((award, i) => (
                <div key={i} style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                  color: '#000000',
                  padding: 'clamp(1rem, 2.5vw, 1.5rem)',
                  borderRadius: 'clamp(10px, 2vw, 15px)',
                  textAlign: 'center',
                  boxShadow: '0 6px 20px rgba(255, 215, 0, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)' }}>{award.icon}</div>
                  <div style={{ fontWeight: 'bold', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)', fontFamily: "Bungee, 'Playfair Display', serif" }}>{award.name}</div>
                  <div style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', opacity: 0.8, fontFamily: "Bungee, 'Playfair Display', serif" }}>{award.recipient}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
