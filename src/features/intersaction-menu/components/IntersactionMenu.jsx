// InteractionMenu.jsx
import React, { useState, useMemo } from "react";
import CategoryButton from "./CategoryButton";
import SubArc from "./SubArc";
import { deg2rad, polarToCartesian } from "../utils";
import { AnimatePresence } from "framer-motion";

/**
 * Props:
 *  - categories: array
 *  - size, centerSize, itemSize, ringThickness, subArcSpan, className, onHover, onSelect, colors
 */
export default function InteractionMenu({
  categories = [],
  size = 420,
  centerSize = 140,
  itemSize = 56,
  ringThickness = 40,
  subArcSpan = 60,
  className = "",
  onHover,
  onSelect,
  colors = {
    bg: "#1f2937",
    itemBg: "linear-gradient(180deg, rgba(79,70,229,1), rgba(59,48,98,1))",
    itemShadow: "rgba(0,0,0,0.35)",
    centerBg: "linear-gradient(180deg, rgba(30,41,59,1), rgba(17,24,39,1))",
    arcFill: "rgba(99,102,241,0.08)",
  },
}) {
  const [hoverId, setHoverId] = useState(null);
  const [openId, setOpenId] = useState(null);

  const half = size / 2;
  const outerRadius = size / 2 - itemSize / 2 - 6;
  const innerRadius = outerRadius - ringThickness;

  const categoryPositions = useMemo(() => {
    const n = categories.length || 1;
    return categories.map((cat, i) => {
      const startOffset = deg2rad(-90);
      const angle = startOffset + i * ((2 * Math.PI) / n);
      const { x, y } = polarToCartesian(half, half, outerRadius, angle);
      return { id: cat.id, angle, x, y, category: cat };
    });
  }, [categories, outerRadius, half]);

  const getPosById = (id) => categoryPositions.find((p) => p.id === id);

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {/* center */}
      <div
        className="absolute rounded-full flex items-center justify-center text-center text-white"
        style={{
          width: centerSize,
          height: centerSize,
          left: `calc(50% - ${centerSize / 2}px)`,
          top: `calc(50% - ${centerSize / 2}px)`,
          boxShadow: "inset 0 8px 40px rgba(0,0,0,0.6)",
          background: colors.centerBg,
        }}
      >
        <div className="px-3">
          <div className="text-sm opacity-60">
            {hoverId ? "Category" : "Main"}
          </div>
          <div className="text-lg font-semibold mt-1">
            {hoverId ? categories.find((d) => d.id === hoverId)?.name : "Menu"}
          </div>
          <div className="text-xs opacity-60 mt-1">
            {hoverId
              ? `${
                  (
                    categories.find((d) => d.id === hoverId)?.subcategories ||
                    []
                  ).length
                } subcategories`
              : ""}
          </div>
        </div>
      </div>

      {/* decorative ring */}
      <div
        className="absolute rounded-full"
        style={{
          left: `calc(50% - ${outerRadius}px)`,
          top: `calc(50% - ${outerRadius}px)`,
          width: outerRadius * 2,
          height: outerRadius * 2,
          borderRadius: "9999px",
          background: `radial-gradient(circle at center, rgba(99,102,241,0.06), transparent 55%)`,
        }}
      />

      {/* category buttons */}
      {categoryPositions.map((pos) => {
        const { x, y, id, category } = pos;
        const left = x - itemSize / 2;
        const top = y - itemSize / 2;
        const isHovered = hoverId === id;
        const isOpen = openId === id;

        return (
          <CategoryButton
            key={id}
            left={left}
            top={top}
            itemSize={itemSize}
            category={category}
            isHovered={isHovered}
            isOpen={isOpen}
            onMouseEnter={() => {
              setHoverId(id);
              if (onHover) onHover(id);
            }}
            onMouseLeave={() => {
              setHoverId((prev) => (prev === id ? null : prev));
              if (onHover) onHover(null);
            }}
            onClick={() => {
              setOpenId((prev) => (prev === id ? null : id));
              if (onSelect) onSelect(openId === id ? null : id);
            }}
            colors={colors}
          />
        );
      })}

      {/* sub arc (placed above) */}
      <AnimatePresence>
        {openId ? (
          <SubArc
            key={openId}
            category={categories.find((c) => c.id === openId)}
            size={size}
            half={half}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            itemSize={itemSize}
            subArcSpan={subArcSpan}
            colors={colors}
            getPositionById={getPosById}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
