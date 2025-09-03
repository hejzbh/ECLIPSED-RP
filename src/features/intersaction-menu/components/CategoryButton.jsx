// CategoryButton.jsx
import React from "react";

/**
 * Props:
 *  - left, top: number (px)
 *  - itemSize: number
 *  - category: { id, name, subcategories }
 *  - isHovered: bool
 *  - isOpen: bool
 *  - onMouseEnter/onMouseLeave/onClick
 *  - colors: object
 */
export default function CategoryButton({
  left,
  top,
  itemSize,
  category,
  isHovered,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClick,
  colors,
}) {
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="absolute flex items-center justify-center rounded-full transition-transform transform focus:outline-none"
      style={{
        left,
        top,
        width: itemSize,
        height: itemSize,
        cursor: "pointer",
        zIndex: isOpen ? 50 : 30,
        boxShadow: isHovered
          ? "0 10px 30px rgba(0,0,0,0.5)"
          : "0 6px 14px rgba(0,0,0,0.35)",
        border: isHovered
          ? "2px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(255,255,255,0.04)",
        background: colors.itemBg,
        color: "#fff",
        transform: isHovered ? "scale(1.08)" : "scale(1)",
      }}
      title={category.name}
      aria-label={category.name}
    >
      {/* Replace emoji with your svg icon */}
      <span className="text-xs select-none">🔵</span>
    </button>
  );
}
