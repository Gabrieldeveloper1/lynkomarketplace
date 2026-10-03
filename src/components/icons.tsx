import { useId, type ReactNode, type SVGProps } from "react";

/**
 * Conjunto de ícones SVG da Lynko.
 * Traço de 1.75px, pontas arredondadas, grade 24×24 — todos herdam `currentColor`.
 * Uso: <Icon.Wallet className="h-5 w-5" />
 */
export type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

function make(name: string, paths: ReactNode) {
  const Comp = ({ size, className, ...rest }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size ?? "1em"}
      height={size ?? "1em"}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {paths}
    </svg>
  );
  Comp.displayName = `Icon.${name}`;
  return Comp;
}

export const Icon = {
  Home: make(
    "Home",
    <>
      <path d="M3.5 10.8 12 3.5l8.5 7.3" />
      <path d="M5.5 9.5V19a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5V9.5" />
      <path d="M9.8 20.5v-5.2a1 1 0 0 1 1-1h2.4a1 1 0 0 1 1 1v5.2" />
    </>,
  ),
  Search: make(
    "Search",
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </>,
  ),
  Heart: make(
    "Heart",
    <path d="M12 20.2s-7.5-4.4-7.5-10.1A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.5c0 5.7-7.5 10.1-7.5 10.1Z" />,
  ),
  Message: make(
    "Message",
    <>
      <path d="M20.5 12.2a7.7 7.7 0 0 1-11.3 6.8L4 20.3l1.4-4.6A7.7 7.7 0 1 1 20.5 12.2Z" />
      <path d="M8.8 11.2h6.4M8.8 14.2h3.6" />
    </>,
  ),
  Dashboard: make(
    "Dashboard",
    <>
      <rect x="3.5" y="3.5" width="7.5" height="9" rx="2" />
      <rect x="13" y="3.5" width="7.5" height="5.5" rx="2" />
      <rect x="13" y="11" width="7.5" height="9.5" rx="2" />
      <rect x="3.5" y="14.5" width="7.5" height="6" rx="2" />
    </>,
  ),
  Bell: make(
    "Bell",
    <>
      <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2H4.5l1.5-2Z" />
      <path d="M10 21a2.2 2.2 0 0 0 4 0" />
    </>,
  ),
  Wallet: make(
    "Wallet",
    <>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a1.5 1.5 0 0 1 1.5 1.5V8" />
      <path d="M4 7.5V17a2.5 2.5 0 0 0 2.5 2.5h12A1.5 1.5 0 0 0 20 18v-8a1.5 1.5 0 0 0-1.5-1.5H5.5A1.5 1.5 0 0 1 4 7.5Z" />
      <circle cx="16.2" cy="14" r="1.1" fill="currentColor" stroke="none" />
    </>,
  ),
  Package: make(
    "Package",
    <>
      <path d="M12 3.2 20 7.6v8.8l-8 4.4-8-4.4V7.6l8-4.4Z" />
      <path d="m4.3 7.8 7.7 4.2 7.7-4.2M12 12v8.6" />
      <path d="m8 5.4 8 4.4" />
    </>,
  ),
  Bag: make(
    "Bag",
    <>
      <path d="M5.5 8.5h13l-1 11a1.5 1.5 0 0 1-1.5 1.3H8a1.5 1.5 0 0 1-1.5-1.3l-1-11Z" />
      <path d="M8.8 8.5V7a3.2 3.2 0 0 1 6.4 0v1.5" />
    </>,
  ),
  Plus: make("Plus", <path d="M12 5v14M5 12h14" />),
  PlusCircle: make(
    "PlusCircle",
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>,
  ),
  Store: make(
    "Store",
    <>
      <path d="M4 9.5 5.6 4.5h12.8L20 9.5" />
      <path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" />
      <path d="M5.5 12.3V20h13v-7.7" />
      <path d="M10 20v-4.5h4V20" />
    </>,
  ),
  Trend: make(
    "Trend",
    <>
      <path d="m3.5 16.5 5.2-5.2 3.6 3.6 7.2-7.4" />
      <path d="M15 7.5h4.5V12" />
    </>,
  ),
  Receipt: make(
    "Receipt",
    <>
      <path d="M6 3.5h12v17l-2.4-1.6-1.8 1.6-1.8-1.6-1.8 1.6-1.8-1.6L6 20.5v-17Z" />
      <path d="M9.2 8.5h5.6M9.2 12h5.6M9.2 15.2h3" />
    </>,
  ),
  Chart: make(
    "Chart",
    <>
      <path d="M4 20.5h16" />
      <rect x="5.5" y="12" width="3.2" height="6.5" rx="1" />
      <rect x="10.4" y="7" width="3.2" height="11.5" rx="1" />
      <rect x="15.3" y="9.8" width="3.2" height="8.7" rx="1" />
    </>,
  ),
  User: make(
    "User",
    <>
      <circle cx="12" cy="8.2" r="3.7" />
      <path d="M4.8 20c.7-3.6 3.6-5.6 7.2-5.6s6.5 2 7.2 5.6" />
    </>,
  ),
  Users: make(
    "Users",
    <>
      <circle cx="9.2" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.5-3.1 2.8-4.9 5.7-4.9s5.2 1.8 5.7 4.9" />
      <path d="M15.5 5.7a3.2 3.2 0 0 1 0 5.9M17.5 14.9c1.8.5 3 2.1 3.3 4.6" />
    </>,
  ),
  Shield: make("Shield", <path d="M12 3.3 19.5 6v5.6c0 4.5-3.1 7.9-7.5 9.1-4.4-1.2-7.5-4.6-7.5-9.1V6L12 3.3Z" />),
  ShieldCheck: make(
    "ShieldCheck",
    <>
      <path d="M12 3.3 19.5 6v5.6c0 4.5-3.1 7.9-7.5 9.1-4.4-1.2-7.5-4.6-7.5-9.1V6L12 3.3Z" />
      <path d="m8.8 12.1 2.2 2.2 4.2-4.4" />
    </>,
  ),
  Zap: make("Zap", <path d="M13.2 2.8 5 13.4h6l-.8 7.8 8.3-10.8h-6l.7-7.6Z" />),
  Flame: make(
    "Flame",
    <path d="M12.3 3c.3 3-1.8 4.3-3.2 6.1-1.4 1.8-1.9 3.2-1.9 4.9a5 5 0 0 0 10 0c0-2-.9-3.4-1.9-4.4-.1 1.2-.6 2-1.4 2.4.5-3.2-.3-6.5-1.6-9Z" />,
  ),
  Star: make(
    "Star",
    <path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.7l1-5.8-4.3-4.1 5.9-.9L12 3.6Z" />,
  ),
  Check: make("Check", <path d="m5 12.5 4.5 4.5L19 7.5" />),
  CheckCircle: make(
    "CheckCircle",
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.2 12.3 2.6 2.6 5-5.3" />
    </>,
  ),
  Verified: make(
    "Verified",
    <>
      <path d="M12 2.9 14.4 4.6l3 .1.9 2.9 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-.9 2.9-3 .1L12 21.1l-2.4-1.7-3-.1-.9-2.9-2.4-1.8.9-2.9-.9-2.9 2.4-1.8.9-2.9 3-.1L12 2.9Z" />
      <path d="m8.6 12.2 2.4 2.4 4.4-4.6" />
    </>,
  ),
  Clock: make(
    "Clock",
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </>,
  ),
  Alert: make(
    "Alert",
    <>
      <path d="M12 4 21 19.5H3L12 4Z" />
      <path d="M12 10v4.2" />
      <circle cx="12" cy="16.9" r=".6" fill="currentColor" />
    </>,
  ),
  Info: make(
    "Info",
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="7.9" r=".6" fill="currentColor" />
    </>,
  ),
  Help: make(
    "Help",
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.6a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2 1-1.2 1.8" />
      <circle cx="12" cy="16.9" r=".6" fill="currentColor" />
    </>,
  ),
  Image: make(
    "Image",
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <circle cx="9" cy="10" r="1.7" />
      <path d="m4 17 4.7-4.4a1.5 1.5 0 0 1 2 0L15 16.5l2-1.8a1.5 1.5 0 0 1 2 0l1.5 1.5" />
    </>,
  ),
  Upload: make(
    "Upload",
    <>
      <path d="M12 15.5V4.5M7.5 9 12 4.5 16.5 9" />
      <path d="M4.5 15.5v2A2.5 2.5 0 0 0 7 20h10a2.5 2.5 0 0 0 2.5-2.5v-2" />
    </>,
  ),
  Camera: make(
    "Camera",
    <>
      <path d="M4 8.5A2 2 0 0 1 6 6.5h1.6l1.2-2h6.4l1.2 2H18a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8.5Z" />
      <circle cx="12" cy="12.6" r="3.3" />
    </>,
  ),
  X: make("X", <path d="m6 6 12 12M18 6 6 18" />),
  ChevronLeft: make("ChevronLeft", <path d="m14.5 6-6 6 6 6" />),
  ChevronRight: make("ChevronRight", <path d="m9.5 6 6 6-6 6" />),
  ChevronDown: make("ChevronDown", <path d="m6 9.5 6 6 6-6" />),
  ArrowRight: make("ArrowRight", <path d="M4.5 12h15M13.5 6l6 6-6 6" />),
  ArrowUpRight: make("ArrowUpRight", <path d="M7 17 17 7M8.5 7H17v8.5" />),
  Lock: make(
    "Lock",
    <>
      <rect x="4.8" y="10.5" width="14.4" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <circle cx="12" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
    </>,
  ),
  Gift: make(
    "Gift",
    <>
      <rect x="3.5" y="8.5" width="17" height="4" rx="1.5" />
      <path d="M5 12.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6.5M12 8.5v12" />
      <path d="M12 8.5C10.6 8.5 8 8 8 6a2 2 0 0 1 3.4-1.4c.5.5.6 1.4.6 3.9ZM12 8.5c1.4 0 4-.5 4-2.5a2 2 0 0 0-3.4-1.4c-.5.5-.6 1.4-.6 3.9Z" />
    </>,
  ),
  Gamepad: make(
    "Gamepad",
    <>
      <path d="M7.5 7h9a4.5 4.5 0 0 1 4.4 3.6l.8 4.3a2.7 2.7 0 0 1-4.6 2.3L15 15.5H9L6.9 17.2A2.7 2.7 0 0 1 2.3 14.9l.8-4.3A4.5 4.5 0 0 1 7.5 7Z" />
      <path d="M8 9.8v3.4M6.3 11.5h3.4" />
      <circle cx="15.6" cy="10.6" r=".7" fill="currentColor" />
      <circle cx="17.6" cy="12.4" r=".7" fill="currentColor" />
    </>,
  ),
  Coins: make(
    "Coins",
    <>
      <ellipse cx="9.5" cy="7" rx="5.5" ry="2.8" />
      <path d="M4 7v4.5c0 1.5 2.5 2.8 5.5 2.8S15 13 15 11.5V7" />
      <path d="M15 10.2c2.8.1 5 1.3 5 2.8v4c0 1.5-2.5 2.8-5.5 2.8-2.2 0-4.1-.7-5-1.7" />
      <path d="M4 11.5V16c0 1.5 2.5 2.8 5.5 2.8" />
    </>,
  ),
  Key: make(
    "Key",
    <>
      <circle cx="8" cy="15.5" r="4" />
      <path d="m11 12.6 8.5-8.5M16 7.2l2.6 2.6M14 9.2l1.8 1.8" />
    </>,
  ),
  Layers: make(
    "Layers",
    <>
      <path d="m12 3.5 8.5 4.5L12 12.5 3.5 8 12 3.5Z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5" />
    </>,
  ),
  Eye: make(
    "Eye",
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>,
  ),
  EyeOff: make(
    "EyeOff",
    <>
      <path d="M4 4l16 16M9.9 5.8A9 9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-2.9 3.7M6.3 7.4A15.5 15.5 0 0 0 2.5 12S6 18.5 12 18.5a8.8 8.8 0 0 0 3.6-.8" />
      <path d="M10.2 10.2a3 3 0 0 0 3.6 3.6" />
    </>,
  ),
  Pencil: make(
    "Pencil",
    <>
      <path d="M4 20v-3.8L15.7 4.5a2.1 2.1 0 0 1 3 0l.8.8a2.1 2.1 0 0 1 0 3L7.8 20H4Z" />
      <path d="m14 6.3 3.7 3.7" />
    </>,
  ),
  Trash: make(
    "Trash",
    <>
      <path d="M4.5 6.5h15M9.5 6.5V4.5h5v2" />
      <path d="m6.3 6.5.8 12.4a1.6 1.6 0 0 0 1.6 1.6h6.6a1.6 1.6 0 0 0 1.6-1.6l.8-12.4M10 10.5v6M14 10.5v6" />
    </>,
  ),
  Sparkles: make(
    "Sparkles",
    <>
      <path d="M10 4.5 11.6 9l4.4 1.6L11.6 12 10 16.5 8.4 12 4 10.6 8.4 9 10 4.5Z" />
      <path d="M18 3.5v3M16.5 5h3M18 15v4M16 17h4" />
    </>,
  ),
  Logout: make(
    "Logout",
    <>
      <path d="M14 4.5h3.5A2 2 0 0 1 19.5 6.5v11a2 2 0 0 1-2 2H14" />
      <path d="M10 8 6 12l4 4M6 12h10" />
    </>,
  ),
  Login: make(
    "Login",
    <>
      <path d="M10 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2H10" />
      <path d="m14 8 4 4-4 4M18 12H8" />
    </>,
  ),
  Sun: make(
    "Sun",
    <>
      <circle cx="12" cy="12" r="3.8" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </>,
  ),
  Moon: make("Moon", <path d="M19.5 14.3A8 8 0 0 1 9.7 4.5a8 8 0 1 0 9.8 9.8Z" />),
  Menu: make("Menu", <path d="M4 7h16M4 12h16M4 17h10" />),
  Rocket: make(
    "Rocket",
    <>
      <path d="M12 3.5c3.5 1.6 5.5 5 5.5 8.5v2.5h-11V12c0-3.5 2-6.9 5.5-8.5Z" />
      <circle cx="12" cy="10" r="1.6" />
      <path d="m6.5 13-2 3.5L8 16M17.5 13l2 3.5L16 16M10 17.5c0 1.5.8 2.8 2 3.5 1.2-.7 2-2 2-3.5" />
    </>,
  ),
  Tag: make(
    "Tag",
    <>
      <path d="M3.8 12.2V5.6a1.8 1.8 0 0 1 1.8-1.8h6.6a1.8 1.8 0 0 1 1.3.5l7.5 7.5a1.8 1.8 0 0 1 0 2.6l-6.6 6.6a1.8 1.8 0 0 1-2.6 0l-7.5-7.5a1.8 1.8 0 0 1-.5-1.3Z" />
      <circle cx="8.3" cy="8.3" r="1.2" />
    </>,
  ),
  Link: make(
    "Link",
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1" />
    </>,
  ),
  Globe: make(
    "Globe",
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9S14.6 18.4 12 21c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3Z" />
    </>,
  ),
  Lifebuoy: make(
    "Lifebuoy",
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="m5.6 5.6 3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9" />
    </>,
  ),
  Filter: make("Filter", <path d="M4 5.5h16l-6.2 7.4v5.2l-3.6 1.9v-7.1L4 5.5Z" />),
  Refresh: make(
    "Refresh",
    <>
      <path d="M19.5 12a7.5 7.5 0 0 1-13 5.1M4.5 12a7.5 7.5 0 0 1 13-5.1" />
      <path d="M17.5 3.5v3.8H13.7M6.5 20.5v-3.8h3.8" />
    </>,
  ),
  Crown: make(
    "Crown",
    <>
      <path d="m3.5 8 4.6 4 3.9-6.5 3.9 6.5 4.6-4-1.6 10.5H5.1L3.5 8Z" />
      <path d="M5.5 20.5h13" />
    </>,
  ),
  Discord: make(
    "Discord",
    <>
      <path d="M8.5 7.5c1.1-.4 2.2-.6 3.5-.6s2.4.2 3.5.6c1.7.6 3 2.5 3.6 5.7.3 1.8-.2 3.2-.7 3.9-.8.3-1.7.6-2.6.8l-.8-1.4M8.5 7.5c-1.7.6-3 2.5-3.6 5.7-.3 1.8.2 3.2.7 3.9.8.3 1.7.6 2.6.8l.8-1.4" />
      <path d="M8.8 15.2c2 .6 4.4.6 6.4 0" />
      <circle cx="9.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="12" r="1" fill="currentColor" stroke="none" />
    </>,
  ),
  Instagram: make(
    "Instagram",
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r=".7" fill="currentColor" stroke="none" />
    </>,
  ),
  Doc: make(
    "Doc",
    <>
      <path d="M6.5 3.5h7.2L18.5 8.3v10.2a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" transform="translate(.5 0)" />
      <path d="M13.5 3.8V8.5h4.7M8.5 13h6M8.5 16.3h4" />
    </>,
  ),
  Card: make(
    "Card",
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="3" />
      <path d="M3 10h18M7 15h3.5" />
    </>,
  ),
  Pix: make(
    "Pix",
    <>
      <path d="m12 3.8 3.4 3.4a2 2 0 0 0 1.4.6h.9M12 3.8 8.6 7.2a2 2 0 0 1-1.4.6h-.9M12 20.2l3.4-3.4a2 2 0 0 1 1.4-.6h.9M12 20.2l-3.4-3.4a2 2 0 0 0-1.4-.6h-.9" />
      <path d="m3.8 12 2.5-2.5h1.2M3.8 12l2.5 2.5h1.2M20.2 12l-2.5-2.5h-1.2M20.2 12l-2.5 2.5h-1.2" />
      <path d="m9.5 12 2-2 2 2-2 2-2-2Z" />
    </>,
  ),
  Download: make(
    "Download",
    <>
      <path d="M12 4.5v11M7.5 11 12 15.5 16.5 11" />
      <path d="M4.5 15.5v2A2.5 2.5 0 0 0 7 20h10a2.5 2.5 0 0 0 2.5-2.5v-2" />
    </>,
  ),
  Settings: make(
    "Settings",
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18" />
    </>,
  ),
  ThumbUp: make(
    "ThumbUp",
    <>
      <path d="M8 10.5V20H5a1 1 0 0 1-1-1v-7.5a1 1 0 0 1 1-1h3Z" />
      <path d="M8 10.5 11.4 4a2 2 0 0 1 2.6 1.9l-.4 3.1H18a2 2 0 0 1 2 2.4l-1 6.3A2.5 2.5 0 0 1 16.5 20H8" />
    </>,
  ),
  ThumbDown: make(
    "ThumbDown",
    <>
      <path d="M8 13.5V4H5a1 1 0 0 0-1 1v7.5a1 1 0 0 0 1 1h3Z" />
      <path d="M8 13.5 11.4 20a2 2 0 0 0 2.6-1.9l-.4-3.1H18a2 2 0 0 0 2-2.4L19 6.3A2.5 2.5 0 0 0 16.5 4H8" />
    </>,
  ),
  Box: make(
    "Box",
    <>
      <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" />
      <path d="m4 8.5 8 4.5 8-4.5M12 13v7" />
    </>,
  ),
  Percent: make(
    "Percent",
    <>
      <path d="m19 5-14 14" />
      <circle cx="7" cy="7" r="2.3" />
      <circle cx="17" cy="17" r="2.3" />
    </>,
  ),
  Wand: make(
    "Wand",
    <>
      <path d="m5 19 9.5-9.5M13 8l3 3" />
      <path d="M17.5 3.5v2.5M16.2 4.8h2.6M20 9v2M19 10h2M8 4v2M7 5h2" />
    </>,
  ),
} as const;

export type IconName = keyof typeof Icon;

/** Ícone por nome (útil em listas dirigidas por dados). */
export function NamedIcon({ name, ...props }: IconProps & { name: IconName }) {
  const C = Icon[name];
  return <C {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Marca                                                                       */
/* -------------------------------------------------------------------------- */

/** Selo da Lynko: dois elos entrelaçados dentro de um losango em degradê. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Lynko">
      <defs>
        <linearGradient id={`${id}-g`} x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="0.5" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#c026d3" />
        </linearGradient>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="12" fill={`url(#${id}-g)`} />
      <rect x="4" y="4" width="40" height="22" rx="12" fill={`url(#${id}-s)`} />
      <path
        d="M19 17.5v11a3 3 0 0 0 3 3h8"
        fill="none"
        stroke="#fff"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="31.5" cy="15.5" r="2.6" fill="#fff" />
    </svg>
  );
}

/** Logo completa: selo + palavra. */
export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-9 w-9 drop-shadow-[0_6px_14px_rgba(124,58,237,0.55)]" />
      <span className="font-display text-[1.35rem] font-extrabold leading-none tracking-tight">
        Lynko<span className="text-gradient">.</span>
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Decorações                                                                  */
/* -------------------------------------------------------------------------- */

/** Faísca de 4 pontas. */
export function Sparkle({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 1.5c.7 5.6 2.9 8.7 10.5 10.5-7.6 1.8-9.8 4.9-10.5 10.5C11.3 16.9 9.1 13.8 1.5 12 9.1 10.2 11.3 7.1 12 1.5Z" fill="currentColor" />
    </svg>
  );
}

/** Esfera 3D em degradê (decorativa). */
export function Orb({ className = "h-24 w-24" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-o`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#e9d5ff" />
          <stop offset="0.35" stopColor="#a855f7" />
          <stop offset="0.8" stopColor="#4c1d95" />
          <stop offset="1" stopColor="#170a33" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#${id}-o)`} />
      <ellipse cx="38" cy="28" rx="16" ry="9" fill="#fff" opacity=".28" transform="rotate(-28 38 28)" />
    </svg>
  );
}

/** Anéis concêntricos tracejados para fundos de cartão. */
export function Rings({ className = "h-64 w-64" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      <circle cx="100" cy="100" r="96" strokeOpacity=".18" />
      <circle cx="100" cy="100" r="72" strokeOpacity=".28" strokeDasharray="3 7" />
      <circle cx="100" cy="100" r="48" strokeOpacity=".38" />
      <circle cx="100" cy="100" r="24" strokeOpacity=".5" strokeDasharray="2 5" />
      <circle cx="196" cy="100" r="3.5" fill="currentColor" stroke="none" opacity=".7" />
      <circle cx="52" cy="58" r="2.5" fill="currentColor" stroke="none" opacity=".6" />
    </svg>
  );
}

/** Onda de transição entre seções. */
export function WaveDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={`block h-12 w-full sm:h-16 ${className}`} aria-hidden="true">
      <path d="M0 40c120 36 240 36 360 12S600 0 720 8s240 56 360 52 240-34 360-30v50H0V40Z" fill="currentColor" />
    </svg>
  );
}

/** Constelação de pontos e linhas (cabeçalho do painel/perfil). */
export function Constellation({ className = "h-40 w-72" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 160" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      <path d="M12 120 70 78l54 28 62-62 54 36 40-22" strokeOpacity=".35" />
      <path d="M70 78 92 20l32 86" strokeOpacity=".2" />
      {[
        [12, 120],
        [70, 78],
        [124, 106],
        [186, 44],
        [240, 80],
        [280, 58],
        [92, 20],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 2 ? 3 : 4.5} fill="currentColor" stroke="none" className="animate-twinkle" style={{ animationDelay: `${i * 0.45}s` }} />
      ))}
    </svg>
  );
}
