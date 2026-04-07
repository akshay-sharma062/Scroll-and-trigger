import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageSequence from './components/ImageSequence';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const overlayRef = useRef(null);
  const heroRef = useRef(null);
  const feat1Ref = useRef(null);
  const feat2Ref = useRef(null);
  const feat3Ref = useRef(null);

  useEffect(() => {
    // Fade out hero overlay right after user starts scrolling
    gsap.to(overlayRef.current, {
      opacity: 0,
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: '+=400',
        scrub: true,
      }
    });

    // Content sections fade in
    const sections = [feat1Ref.current, feat2Ref.current, feat3Ref.current];
    sections.forEach((sec, i) => {
      gsap.fromTo(sec, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0, 
          duration: 1, 
          scrollTrigger: {
            trigger: sec,
            start: 'top 80%', // when top of element hits 80% viewport height
            end: 'bottom 40%',
            toggleActions: 'play none none reverse', // smooth fade out when scrolling up if desired
          }
        }
      );
    });
  }, []);

  return (
    // #main-container is heavily tied to ImageSequence triggering scroll calculation
    // Height determines length of scroll/animation mapping! Wait, 'top top' to 'bottom bottom' means whole page.
    <div id="main-container" style={{ position: 'relative' }}>
      <ImageSequence />
      
      {/* Hero Section */}
      <section className="section" ref={heroRef} style={{ zIndex: 10 }}>
        <div className="hero-overlay glass-panel" ref={overlayRef}>
          <h1>Experience Motion<br />Like Never Before</h1>
          <p style={{ marginBottom: '2rem' }}>A cinematic scroll journey powered by frames</p>
          <a href="#explore" className="btn-primary" onClick={e => {
            e.preventDefault();
            window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' })
          }}>Explore</a>
        </div>
      </section>

      {/* Spacers for scrolling progression & dynamic content */}
      <div className="scroll-spacer" id="explore"></div>

      <section className="feature-section left" ref={feat1Ref}>
        <div className="feature-content glass-panel" style={{ marginLeft: '5vw' }}>
          <h2>Precision Animation</h2>
          <p>Every frame is carefully mapped to your scroll path. Pause anywhere, move at your own speed.</p>
        </div>
      </section>

      <div className="scroll-spacer"></div>

      <section className="feature-section right" ref={feat2Ref}>
        <div className="feature-content glass-panel" style={{ marginRight: '5vw' }}>
          <h2>Smooth Performance</h2>
          <p>Built with lightweight Canvas rendering and GSAP ensuring 60fps cinematic fluidity.</p>
        </div>
      </section>

      <div className="scroll-spacer"></div>

      <section className="feature-section left" ref={feat3Ref}>
        <div className="feature-content glass-panel" style={{ marginLeft: '5vw' }}>
          <h2>Modern Experience</h2>
          <p>Immerse yourself in dynamic design, seamlessly engaging all the senses.</p>
        </div>
      </section>

      <div className="scroll-spacer"></div>
      <div className="scroll-spacer"></div> {/* Extra space for finishing animation */}

      <section className="footer-section">
        <h2>Start Your Journey</h2>
        <p style={{ marginBottom: '3rem' }}>The future of web experiences starts here.</p>
        <button className="btn-primary">Get Started</button>
        
        <div className="footer-nav">
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>
            © 2026 Premium Experiences. All rights reserved. Cinematic Frame Concept.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
