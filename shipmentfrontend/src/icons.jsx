import React from 'react';

// Minimal icon components (small SVGs) to avoid adding lucide-react dependency
// Each component accepts `className` and other props and uses currentColor for stroke/fill
const SvgWrapper = ({ children, className = '', ...props }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {children}
  </svg>
);

export const Search = (props) => (
  <SvgWrapper {...props}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </SvgWrapper>
);

export const Globe = (props) => (
  <SvgWrapper {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M2 12h20" />
    <path d="M12 2c2.5 3 2.5 11 0 20" />
  </SvgWrapper>
);

export const Plus = (props) => (
  <SvgWrapper {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </SvgWrapper>
);

export const Shield = (props) => (
  <SvgWrapper {...props}>
    <path d="M12 2l7 3v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V5l7-3z" />
  </SvgWrapper>
);

export const Truck = (props) => (
  <SvgWrapper {...props}>
    <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="7.5" cy="18.5" r="1.5" />
    <circle cx="18.5" cy="18.5" r="1.5" />
  </SvgWrapper>
);

export const Ship = (props) => (
  <SvgWrapper {...props}>
    <path d="M2 15s4 3 10 3 10-3 10-3-2-5-10-5S2 15 2 15z" />
    <path d="M8 8v3" />
    <path d="M12 5v6" />
    <path d="M16 7v4" />
  </SvgWrapper>
);

export const Plane = (props) => (
  <SvgWrapper {...props}>
    <path d="M2 12l20-7-7 7 7 7-20-7 7-3z" />
  </SvgWrapper>
);

export const Train = (props) => (
  <SvgWrapper {...props}>
    <rect x="3" y="3" width="18" height="12" rx="2" ry="2" />
    <path d="M7 16v2" />
    <path d="M17 16v2" />
    <circle cx="8.5" cy="18.5" r="1.5" />
    <circle cx="15.5" cy="18.5" r="1.5" />
  </SvgWrapper>
);

export default {
  Search,
  Globe,
  Plus,
  Shield,
  Truck,
  Ship,
  Plane,
  Train,
};
