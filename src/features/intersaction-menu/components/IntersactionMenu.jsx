// InteractionMenu.jsx
import React, { useState, useMemo } from "react";
import CategoryButton from "./CategoryButton";
import SubArc from "./SubArc";
import { deg2rad, polarToCartesian } from "../utils";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Props:
 *  - categories: array
 *  - size, itemSize, ringThickness, subArcSpan, className, onHover, onSelect, colors
 */
export default function InteractionMenu({
  categories = [],
  size = 420,
  itemSize = 56,
  ringThickness = 40,
  subArcSpan = 60,
  className = "",
  onHover,
  onSelect,
  colors = {
    bg: "radial-gradient(circle at center, #9c9bb3 0%, #9c9bb3 12%, #7c7885 83%)",
    itemBg: "linear-gradient(180deg, rgba(79,70,229,1), rgba(59,48,98,1))",
    itemShadow: "rgba(0,0,0,0.35)",
    centerBg:
      "radial-gradient(circle at center, #3a376e 0%, #3a376e 12%, #272138 53%)",
    arcFill: "rgba(99,102,241,0.08)",
    text: "#ffffff",
  },
}) {
  const [openId, setOpenId] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState();

  const half = size / 2;
  const outerRadius = size / 2 + itemSize / 100;
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
      className={`relative font-akrobat rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        background: colors.bg,
      }}
    >
      {/* center */}
      <div
        className="absolute rounded-full flex items-center justify-center text-center"
        style={{
          left: "17%",
          right: "17%",
          top: "17%",
          bottom: "17%",
          background: colors.centerBg,
          color: colors.text,
        }}
      >
        <AnimatePresence mode="wait">
          {hoveredCategory ? (
            <motion.div
              key={hoveredCategory.id}
              className="flex flex-col justify-center items-center text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {hoveredCategory?.Icon && (
                <hoveredCategory.Icon
                  className="text-4xl"
                  style={{ color: colors.text }}
                />
              )}
              <h1 className="text-3xl font-bold my-1">
                {hoveredCategory?.name}
              </h1>
              {hoveredCategory?.description && (
                <p
                  style={{
                    maxWidth: "100%",
                    lineHeight: 1.1,
                    color: colors.text,
                    opacity: 0.5,
                  }}
                  className="text-lg font-thin tracking-wider"
                >
                  {hoveredCategory?.subcategories &&
                    `${hoveredCategory?.subcategories?.length} subcategories`}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.h1
              key="menu-title"
              className="text-3xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Menu
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      {/* category buttons */}
      {categoryPositions.map((pos) => {
        const { x, y, id, category } = pos;
        const left = x - itemSize / 2;
        const top = y - itemSize / 2;
        const isHovered = hoveredCategory?.id === id;
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
              setHoveredCategory(pos.category);
              if (onHover) onHover(id);
            }}
            onMouseLeave={() => {
              setHoveredCategory(null);
              if (onHover) onHover(null);
            }}
            onClick={() => {
              if (!category.subcategories?.length) return;
              setOpenId((prev) => (prev === id ? null : id));
              if (onSelect) onSelect(openId === id ? null : id);
            }}
            colors={colors}
          />
        );
      })}

      {/* sub arc */}
      <AnimatePresence>
        {openId ? (
          <SubArc
            key={openId}
            category={categories.find((c) => c.id === openId)}
            size={size}
            half={half}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            onHover={(sc) => setHoveredCategory(sc)}
            onMouseOut={() => setHoveredCategory(null)}
            onClick={() => {}}
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
