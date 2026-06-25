'use client';

import { useEffect } from 'react';

export function DynamicFavicon() {
  useEffect(() => {
    // Locate or dynamically create the shortcut icon link tag in document head
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    // Inline SVG data URLs representing the emojis
    const favicons = [
      'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>❤️</text></svg>',
      'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✈️</text></svg>',
    ];

    let index = 0;
    
    // Cycle favicon every 2 seconds
    const interval = setInterval(() => {
      index = (index + 1) % favicons.length;
      link.href = favicons[index];
    }, 2000);

    // Initial load favicon
    link.href = favicons[0];

    return () => clearInterval(interval);
  }, []);

  return null;
}
