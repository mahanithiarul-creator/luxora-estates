import React from 'react';

// Minimal theme toggle — scaffold for dark/light
export default function ThemeToggle() {
  return (
    <button aria-label="Toggle theme" className="p-2 rounded-md glass">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.2"><circle cx="12" cy="12" r="4"/></svg>
    </button>
  );
}
