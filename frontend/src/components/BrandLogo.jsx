import React from 'react';

/**
 * BrandLogo Component
 * Renders the user's official DM logo emblem
 * Includes glowing cyan-teal gradient squircle with responsive sizing and hover elevation
 */
export default function BrandLogo({ className = "navbar-logo-img", size = 38 }) {
  return (
    <span className="navbar-logo-badge" aria-hidden="true">
      <img
        src="/images/dinesh-logo.png"
        alt="Dinesh M Logo"
        width={size}
        height={size}
        className={className}
        loading="eager"
        decoding="async"
      />
    </span>
  );
}
