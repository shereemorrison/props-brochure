import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { days } from '../data/performances';
import { getGalleryImages } from '../data/gallery';
import { getPerformersByStageAndDay, performers } from '../data/performers';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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

  // Get performers for this stage and day
  const performers = parentDayId ? getPerformersByStageAndDay(stageId, parentDayId) : [];
  
  // Create cast array from performers with awards
  const castMembers = performers.length > 0 
    ? performers.map(p => ({ name: p.name, awards: p.awards || [] }))
    : stageData.cast.map(c => ({ name: c.name, awards: [] }));

  // Get gallery images from data file
  useEffect(() => {
    setImagesLoading(true);
    
    // Get images for this stage from the gallery data file
    const images = getGalleryImages(stageId || '');
    console.log(`Found ${images.length} gallery images for stage: ${stageId}`);
    
    setImagePaths(images);
      setImagesLoading(false);
  }, [stageId]);

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

      // Check if section is already in viewport
      const rect = section.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;

      // Set initial state
      gsap.set(section, {
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 50,
        scale: isInView ? 1 : 0.95
      });

      // If already in view, skip animation
      if (isInView) return;

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
    
    // Ensure Cast & Crew section is always visible - fallback if ScrollTrigger doesn't fire
    // Check all sections and make sure they're visible if they're in viewport
    const ensureSectionsVisible = () => {
      sectionRefs.current.forEach((section) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 1.5 && rect.bottom > -window.innerHeight * 0.5;
        if (isInView) {
          const currentOpacity = gsap.getProperty(section, 'opacity') as number;
          if (currentOpacity === 0 || currentOpacity === undefined) {
            gsap.to(section, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: 'power2.out'
            });
          }
        }
      });
    };

    // Check immediately and after a short delay
    requestAnimationFrame(() => {
      ensureSectionsVisible();
    });
    
    if (!imagesLoading) {
      refreshTimerRef.current = setTimeout(() => {
        ScrollTrigger.refresh();
        ensureSectionsVisible();
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
        {stageData.writtenBy && (
          <div style={{
            fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
            fontFamily: "Oswald, sans-serif",
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            marginTop: 'clamp(0.5rem, 1.5vh, 1rem)',
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
            fontStyle: 'italic'
          }}>
            Written by {stageData.writtenBy}
          </div>
        )}
        
        <section className="story-section" ref={el => { sectionRefs.current[0] = el as HTMLDivElement }}>
          <p ref={blurbRef} className="story-blurb">
            {words.map((word, index) => (
              <span key={index} className="word" style={{ display: 'inline-block', marginRight: index < words.length - 1 ? '0.25em' : '0' }}>
                {word}
              </span>
            ))}
          </p>
        </section>

        {/* Cast Section - moved above Gallery */}
        <section className="story-section cast-section" ref={el => { sectionRefs.current[1] = el as HTMLDivElement }}>
          <h2>Cast</h2>
          {castMembers.length > 0 ? (
            <div className="cast-grid">
              {castMembers.map((member, i) => {
                // Find the performer to get their commitment (which is the award)
                const performer = performers.find(p => p.name === member.name);
                const commitment = performer?.commitment;
                
                // Don't show award if it's Beginner, Intermediate, or (None)
                const shouldShowAward = commitment && 
                  commitment !== '(None)' && 
                  commitment !== 'Beginner' && 
                  commitment !== 'Intermediate';
                
                return (
                  <div key={i} className="cast-member-card">
                    <div style={{ fontWeight: 'bold', color: '#ffd700', fontFamily: "Oswald, sans-serif" }}>{member.name}</div>
                    {shouldShowAward && (
                      <div style={{ color: '#ffffff', opacity: 0.8, fontFamily: "Oswald, sans-serif", fontSize: 'clamp(0.85rem, 2vw, 1rem)', marginTop: '0.25rem' }}>
                        {commitment}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.7)', 
              fontFamily: "Oswald, sans-serif",
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              marginTop: 'clamp(1rem, 2vh, 1.5rem)',
              marginBottom: 'clamp(1rem, 2vh, 1.5rem)'
            }}>
              Performer information coming soon
            </p>
          )}
        </section>

        {/* Stage Images Gallery */}
        <section className="story-section stage-images-section" ref={el => { sectionRefs.current[2] = el as HTMLDivElement }}>
          <h2>Gallery</h2>
          {imagesLoading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: "Oswald, sans-serif"
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
              fontFamily: "Oswald, sans-serif"
            }}>
              No images found
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
                  <div style={{ fontWeight: 'bold', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)', fontFamily: "Oswald, sans-serif" }}>{award.name}</div>
                  <div style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', opacity: 0.8, fontFamily: "Oswald, sans-serif" }}>{award.recipient}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
