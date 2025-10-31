import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { performances } from '../data/performances';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function ActFour() {
  const navigate = useNavigate();
  const perf = performances.find(p => p.id === 'act4');
  const blurbRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  if (!perf) return null;

  // Split the blurb into words
  const words = perf.blurb.split(' ');

  useGSAP(() => {
    // Wait for all refs to be ready
    if (!blurbRef.current || !titleRef.current || !subtitleRef.current || !backgroundRef.current || !storyContainerRef.current) {
      return;
    }

    const wordElements = blurbRef.current.querySelectorAll('.word');
    if (wordElements.length === 0) return;

    // Refresh ScrollTrigger to recalculate
    ScrollTrigger.refresh();

    // Set initial state for background
    gsap.set(backgroundRef.current, {
      scale: 1,
      opacity: 0.2
    });

    // Animate background image with ScrollTrigger - use pin and scroll
    ScrollTrigger.create({
      trigger: storyContainerRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(backgroundRef.current, {
          scale: 1 + (progress * 0.3), // Scale from 1 to 1.3
          opacity: 0.2 + (progress * 0.2) // Opacity from 0.2 to 0.4
        });
      }
    });

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

    // Set initial state for words - hidden initially for animation
    gsap.set(wordElements, {
      opacity: 0,
      y: 20
    });

    // Words - animate on scroll with split text effect
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
    sectionRefs.current.forEach((section) => {
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none',
        onEnter: () => {
          gsap.to(section, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power2.out'
          });
        }
      });

      // Set initial state
      gsap.set(section, {
        opacity: 0,
        y: 50,
        scale: 0.95
      });
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === storyContainerRef.current || 
            trigger.vars.trigger === blurbRef.current ||
            sectionRefs.current.includes(trigger.vars.trigger as HTMLDivElement)) {
          trigger.kill();
        }
      });
    };
  }, { scope: storyContainerRef, dependencies: [perf] });

  return (
    <div className="detail-page act-one-story">
      <div className="story-background-image" ref={backgroundRef} style={{ backgroundImage: `url(${new URL('../assets/propstheatrelogo.webp', import.meta.url).toString()})` }} />
      <button className="back-button" onClick={() => navigate('/')}>← Back</button>
      <div className="detail-content" ref={storyContainerRef}>
        <h1 ref={titleRef}>{perf.title || perf.day}</h1>
        <div className="detail-subtitle" ref={subtitleRef}>{perf.day}</div>
        
        <section className="story-section" ref={el => { sectionRefs.current[0] = el as HTMLDivElement }}>
          <p ref={blurbRef} className="story-blurb">
            {words.map((word, index) => (
              <span key={index} className="word" style={{ display: 'inline-block', marginRight: index < words.length - 1 ? '0.25em' : '0' }}>
                {word}
              </span>
            ))}
          </p>
        </section>

        <section className="story-section cast-section" ref={el => { sectionRefs.current[1] = el as HTMLDivElement }}>
          <h2>Cast & Crew</h2>
          <div className="cast-grid">
            {perf.cast.map((member, i) => (
              <div key={i} className="cast-member-card">
                <div style={{ fontWeight: 'bold', color: '#ffd700', fontFamily: "Bungee, 'Playfair Display', serif" }}>{member.name}</div>
                <div style={{ color: '#ffffff', opacity: 0.8, fontFamily: "Bungee, 'Playfair Display', serif" }}>{member.role}</div>
              </div>
            ))}
          </div>
        </section>

        {perf.awards.length > 0 && (
          <section className="story-section" ref={el => { sectionRefs.current[2] = el as HTMLDivElement }}>
            <h2>Awards & Recognition</h2>
            <div className="awards-grid">
              {perf.awards.map((award, i) => (
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

