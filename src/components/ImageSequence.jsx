import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ImageSequence() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  
  // Settings
  const frameCount = 80;
  // Use public absolute path
  const currentFrame = index => (
    `/Camera_moves_through_202604071831_000/Camera_moves_through_202604071831_${index.toString().padStart(3, '0')}.jpg`
  );

  // Preload images
  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      loadedImages.push(img);
      img.onload = () => {
        loadedCount++;
        // If it's the very first image, try passing it instantly so we can see something before scrolling
        if (loadedCount === 1 || i === 0) {
          render(0, loadedImages);
        }
      }
    }
    setImages(loadedImages);
  }, []);

  // Setup GSAP and Canvas drawing
  const render = (index, imgArray = images) => {
    if (!canvasRef.current || !imgArray[index]) return;
    
    // We get the actual image
    const img = imgArray[index];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    
    // Update canvas size safely
    // The screen bounding helps make the aspect ratio responsive
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    canvas.width = vw;
    canvas.height = vh;

    // Simulate "object-fit: cover" dynamically for canvas
    const imgAspect = img.width / img.height;
    const canvasAspect = vw / vh;
    
    let renderableWidth, renderableHeight, xStart, yStart;
    
    if (imgAspect < canvasAspect) {
      // image is taller than canvas -> cut top/bottom
      renderableWidth = vw;
      renderableHeight = vw / imgAspect;
      xStart = 0;
      yStart = (vh - renderableHeight) / 2;
    } else {
      // image is wider than canvas -> cut left/right
      renderableHeight = vh;
      renderableWidth = vh * imgAspect;
      yStart = 0;
      xStart = (vw - renderableWidth) / 2;
    }
    
    context.clearRect(0, 0, vw, vh);
    // Draw scaled
    context.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
  };

  useEffect(() => {
    if (images.length === 0) return;

    // Create a local object to tween a property "frame"
    const playhead = { frame: 0 };
    
    const trigger = ScrollTrigger.create({
      trigger: '#main-container', // Main wrapper of the page
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1, // Smooth dampening on scrub
      onUpdate: (self) => {
        // Calculate frame index based on scroll progress (0 to 1)
        // Ensure index doesn't go over frameCount-1
        let frameIndex = Math.min(
          frameCount - 1, 
          Math.ceil(self.progress * (frameCount - 1))
        );
        
        // Render step
        requestAnimationFrame(() => render(frameIndex));
      }
    });

    // Fade in initially after load
    gsap.to(canvasRef.current, {
      opacity: 1,
      duration: 1.5,
      ease: 'power2.inOut',
      delay: 0.5
    });

    // Resize handler
    const handleResize = () => {
      // We grab current scroll progress to know which frame to redraw at new screen size
      const progress = trigger?.progress || 0;
      const index = Math.min(frameCount - 1, Math.ceil(progress * (frameCount - 1)));
      render(index);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      trigger.kill();
    };
  }, [images]);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
}
