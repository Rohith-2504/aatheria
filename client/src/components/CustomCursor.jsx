import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef(null);
  const coreRef = useRef(null);
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const blob3Ref = useRef(null);
  
  // Mouse coordinates (target positions)
  const mouseRef = useRef({ x: -100, y: -100 });
  
  // Coordinates for the multi-body physics chain
  const posCoreRef = useRef({ x: 0, y: 0 });
  const pos1Ref = useRef({ x: 0, y: 0 });
  const pos2Ref = useRef({ x: 0, y: 0 });
  const pos3Ref = useRef({ x: 0, y: 0 });
  
  // Hover & Lock State
  const hoverRef = useRef({ isHovering: false, element: null });
  
  // Rotation tracking
  const lastAngleRef = useRef(0);

  // 1. Detect if the device has a fine pointer (mouse/trackpad)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsDesktop(mediaQuery.matches);

    const handleMediaChange = (e) => {
      setIsDesktop(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  // 2. Physics loop and event listeners
  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseDown = (e) => {
      const wave = document.createElement('div');
      wave.className = 'supernova-shockwave';
      wave.style.left = `${e.clientX}px`;
      wave.style.top = `${e.clientY}px`;
      document.body.appendChild(wave);

      setTimeout(() => wave.remove(), 400); // Supernova removes at exactly 400ms
    };

    // Event delegation for mouseover/mouseout
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor-snap], [data-cursor-lock]');
      if (target) {
        hoverRef.current = { isHovering: true, element: target };
        
        if (coreRef.current) {
          coreRef.current.style.opacity = '0'; // Dissolve core dot into the snapped blob
        }
        
        if (blob1Ref.current) {
          const computedRadius = window.getComputedStyle(target).borderRadius;
          blob1Ref.current.style.borderRadius = computedRadius;
        }
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('[data-cursor-snap], [data-cursor-lock]');
      if (target) {
        // Prevent trigger if moving to a child within the same lock target
        if (e.relatedTarget && e.relatedTarget.closest('[data-cursor-snap], [data-cursor-lock]') === target) {
          return;
        }

        hoverRef.current = { isHovering: false, element: null };
        
        if (coreRef.current) {
          coreRef.current.style.opacity = '1';
        }
        
        if (blob1Ref.current) {
          blob1Ref.current.style.width = '24px';
          blob1Ref.current.style.height = '24px';
          blob1Ref.current.style.borderRadius = '50%';
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Physics Animation Loop
    let animId;
    const renderPhysics = () => {
      const mouse = mouseRef.current;
      const posCore = posCoreRef.current;
      const pos1 = pos1Ref.current;
      const pos2 = pos2Ref.current;
      const pos3 = pos3Ref.current;
      
      const core = coreRef.current;
      const blob1 = blob1Ref.current;
      const blob2 = blob2Ref.current;
      const blob3 = blob3Ref.current;
      const hover = hoverRef.current;

      if (!core || !blob1 || !blob2 || !blob3) {
        animId = requestAnimationFrame(renderPhysics);
        return;
      }

      // 1. Update Core position (high-stiffness fluid follow)
      posCore.x += (mouse.x - posCore.x) * 0.45;
      posCore.y += (mouse.y - posCore.y) * 0.45;
      core.style.transform = `translate3d(calc(${posCore.x}px - 50%), calc(${posCore.y}px - 50%), 0)`;

      if (!hover.isHovering) {
        // --- STATE A: FREE ROAMING ---
        // 2. LERP trailing blobs sequentially for fluid chain effect
        pos1.x += (posCore.x - pos1.x) * 0.22;
        pos1.y += (posCore.y - pos1.y) * 0.22;

        pos2.x += (pos1.x - pos2.x) * 0.14;
        pos2.y += (pos1.y - pos2.y) * 0.14;

        pos3.x += (pos2.x - pos3.x) * 0.08;
        pos3.y += (pos2.y - pos3.y) * 0.08;

        // 3. Squash and stretch calculations on the primary follower blob (blob-1)
        let dx = posCore.x - pos1.x;
        let dy = posCore.y - pos1.y;
        let speed = Math.sqrt(dx * dx + dy * dy);

        // Update angle of rotation
        if (speed > 0.5) {
          lastAngleRef.current = Math.atan2(dy, dx) * (180 / Math.PI);
        }

        // Speed mapped to stretch and squash factors
        let stretch = 1 + (speed * 0.04);
        let squash  = 1 - (speed * 0.015);

        // Clamps to prevent visual clipping
        stretch = Math.min(stretch, 2.2);
        squash  = Math.max(squash, 0.6);

        blob1.style.transform = `translate3d(calc(${pos1.x}px - 50%), calc(${pos1.y}px - 50%), 0) rotate(${lastAngleRef.current}deg) scaleX(${stretch}) scaleY(${squash})`;
        blob2.style.transform = `translate3d(calc(${pos2.x}px - 50%), calc(${pos2.y}px - 50%), 0)`;
        blob3.style.transform = `translate3d(calc(${pos3.x}px - 50%), calc(${pos3.y}px - 50%), 0)`;

      } else {
        // --- STATE B: SNAPPING / LOCK-ON ---
        const rect = hover.element.getBoundingClientRect();
        
        // Exact center coordinates of the targeted element
        const targetCenterX = rect.left + (rect.width / 2);
        const targetCenterY = rect.top + (rect.height / 2);

        // LERP all blobs towards the center of the snapped target so they merge into it
        pos1.x += (targetCenterX - pos1.x) * 0.28;
        pos1.y += (targetCenterY - pos1.y) * 0.28;

        pos2.x += (targetCenterX - pos2.x) * 0.22;
        pos2.y += (targetCenterY - pos2.y) * 0.22;

        pos3.x += (targetCenterX - pos3.x) * 0.16;
        pos3.y += (targetCenterY - pos3.y) * 0.16;

        // Blob 1 expands to outline the targeted element with 6px of padding on each side (+12px total width/height)
        blob1.style.width  = `${rect.width + 12}px`;
        blob1.style.height = `${rect.height + 12}px`;

        blob1.style.transform = `translate3d(calc(${pos1.x}px - 50%), calc(${pos1.y}px - 50%), 0) rotate(0deg) scale(1)`;
        blob2.style.transform = `translate3d(calc(${pos2.x}px - 50%), calc(${pos2.y}px - 50%), 0)`;
        blob3.style.transform = `translate3d(calc(${pos3.x}px - 50%), calc(${pos3.y}px - 50%), 0)`;
      }

      animId = requestAnimationFrame(renderPhysics);
    };

    animId = requestAnimationFrame(renderPhysics);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animId);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <>
      <div className="cursor-fluid-container" ref={containerRef}>
        <div className="cursor-core" ref={coreRef} />
        <div className="cursor-blob blob-1" ref={blob1Ref} />
        <div className="cursor-blob blob-2" ref={blob2Ref} />
        <div className="cursor-blob blob-3" ref={blob3Ref} />
      </div>

      {/* Hidden SVG Gooey Filter definitions */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'none' }}>
        <defs>
          <filter id="gooey-fluid">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </>
  );
}
