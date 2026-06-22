import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const coreRef = useRef(null);
  const nebulaRef = useRef(null);
  
  // Mouse coordinates (target positions)
  const mouseRef = useRef({ x: -100, y: -100 });
  // Interpolated trailing coordinates
  const posRef = useRef({ x: 0, y: 0 });
  
  // Hover & Lock State
  const hoverRef = useRef({ isHovering: false, element: null });
  
  // Idle tracking
  const idleRef = useRef({ time: 0 });
  
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
      idleRef.current.time = 0; // Reset idle tracker on move

      // Instantly position the core
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
      }
    };

    const handleMouseDown = (e) => {
      const wave = document.createElement('div');
      wave.className = 'supernova-shockwave';
      wave.style.left = `${e.clientX}px`;
      wave.style.top = `${e.clientY}px`;
      document.body.appendChild(wave);

      // Recoil effect: squash the nebula momentarily on click
      if (nebulaRef.current) {
        nebulaRef.current.style.transform += ' scale(0.8)';
      }

      setTimeout(() => wave.remove(), 500);
    };

    // Event delegation for mouseover/mouseout
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor-lock]');
      if (target) {
        hoverRef.current = { isHovering: true, element: target };
        
        if (coreRef.current) {
          coreRef.current.style.opacity = '0';
        }
        
        if (nebulaRef.current) {
          const computedRadius = window.getComputedStyle(target).borderRadius;
          nebulaRef.current.style.backgroundColor = 'rgba(6, 182, 212, 0.08)';
          nebulaRef.current.style.borderColor = 'rgba(6, 182, 212, 0.8)';
          nebulaRef.current.style.borderRadius = computedRadius;
          nebulaRef.current.style.boxShadow = '0 0 16px rgba(6, 182, 212, 0.4)';
        }
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('[data-cursor-lock]');
      if (target) {
        // Prevent trigger if moving to a child within the same lock target
        if (e.relatedTarget && e.relatedTarget.closest('[data-cursor-lock]') === target) {
          return;
        }

        hoverRef.current = { isHovering: false, element: null };
        
        if (coreRef.current) {
          coreRef.current.style.opacity = '1';
        }
        
        if (nebulaRef.current) {
          nebulaRef.current.style.width = '36px';
          nebulaRef.current.style.height = '36px';
          nebulaRef.current.style.backgroundColor = 'transparent';
          nebulaRef.current.style.borderColor = 'rgba(6, 182, 212, 0.25)';
          nebulaRef.current.style.borderRadius = '50%';
          nebulaRef.current.style.boxShadow = 'none';
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Physics Animation Loop (Runs 60fps/120fps/144fps depending on monitor refresh rate)
    let animId;
    const renderPhysics = () => {
      idleRef.current.time += 1;
      
      const mouse = mouseRef.current;
      const pos = posRef.current;
      const hover = hoverRef.current;
      const nebula = nebulaRef.current;

      if (!nebula) {
        animId = requestAnimationFrame(renderPhysics);
        return;
      }

      if (!hover.isHovering) {
        // STATE A: FREE ROAMING
        let dx = mouse.x - pos.x;
        let dy = mouse.y - pos.y;

        // LERP trail movement (0.16 stiffness for smooth, heavy tail)
        pos.x += dx * 0.16;
        pos.y += dy * 0.16;

        let velX = dx * 0.16;
        let velY = dy * 0.16;
        let speed = Math.sqrt(velX * velX + velY * velY);

        // Update angle of rotation
        if (speed > 0.5) {
          lastAngleRef.current = Math.atan2(velY, velX) * (180 / Math.PI);
        }

        // Speed mapped to stretch and squash factors
        let stretch = 1 + (speed * 0.04);
        let squash  = 1 - (speed * 0.015);

        // Security clamps
        stretch = Math.min(stretch, 2.2);
        squash  = Math.max(squash, 0.6);

        // Breathing animation if inactive
        if (idleRef.current.time > 120 && speed < 0.1) {
          let breathe = 1 + Math.sin(Date.now() * 0.003) * 0.08;
          stretch = breathe;
          squash = breathe;
        }

        nebula.style.transform = `translate3d(calc(${pos.x}px - 50%), calc(${pos.y}px - 50%), 0) rotate(${lastAngleRef.current}deg) scaleX(${stretch}) scaleY(${squash})`;
      } else {
        // STATE B: LOCKED ONTO TARGET
        const rect = hover.element.getBoundingClientRect();
        
        // Exact center coordinates of the targeted element
        const targetCenterX = rect.left + (rect.width / 2);
        const targetCenterY = rect.top + (rect.height / 2);

        // Snappier LERP speed for target snapping
        pos.x += (targetCenterX - pos.x) * 0.28;
        pos.y += (targetCenterY - pos.y) * 0.28;

        // Nebula expands to outline the targeted element with minor breathing room padding
        nebula.style.width  = `${rect.width + 12}px`;
        nebula.style.height = `${rect.height + 12}px`;

        nebula.style.transform = `translate3d(calc(${pos.x}px - 50%), calc(${pos.y}px - 50%), 0) rotate(0deg) scale(1)`;
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
      <div id="cursor-core" ref={coreRef} />
      <div id="cursor-nebula" ref={nebulaRef} />
    </>
  );
}
