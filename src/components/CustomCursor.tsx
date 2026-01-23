import React, { useState, useEffect } from 'react';

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true); // Show cursor once mouse moves
    };

    const onMouseLeave = () => {
      setIsVisible(false); // Hide cursor when mouse leaves window
    };

    const onMouseEnterLink = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], [role="link"], .cursor-pointer')) {
        setIsHoveringLink(true);
      }
    };

    const onMouseLeaveLink = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], [role="link"], .cursor-pointer')) {
        setIsHoveringLink(false);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', onMouseEnterLink, true); // Use capture phase
    document.addEventListener('mouseout', onMouseLeaveLink, true); // Use capture phase

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', onMouseEnterLink, true);
      document.removeEventListener('mouseout', onMouseLeaveLink, true);
    };
  }, []);

  if (!isVisible) return null; // Only render when mouse is active

  return (
    <div
      className={`fixed z-[9999] pointer-events-none rounded-full transition-all duration-200 ease-out 
                  ${isHoveringLink ? 'w-10 h-10 bg-primary/30' : 'w-6 h-6 border-2 border-primary/50'}`}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)', // Center the cursor on the mouse
      }}
    />
  );
};