// SubArc.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { polarToCartesian, describeDonutWedge, deg2rad } from "../utils";

/**
 * Props:
 *  - category: object (with subcategories)
 *  - size, half, innerRadius, outerRadius, itemSize, subArcSpan (optional fallback), colors
 *  - getPositionById: function
 *  - gapBetween: number (px) -> gap between category button and the arc (default 12)
 *  - iconSpacing: number (px) -> horizontal spacing between sub-icons (default 8)
 *  - minSpanDeg: number -> minimum arc span in degrees (default 12)
 *  - maxSpanDeg: number -> maximum arc span in degrees (default 160)
 */
export default function SubArc({
  category,
  size,
  half,
  innerRadius,
  outerRadius,
  itemSize,
  // optional fallback prop (not used if dynamic)
  subArcSpan,
  colors,
  getPositionById,
  gapBetween = 40,
  iconSpacing = 28,
  minSpanDeg = 12,
  maxSpanDeg = 160,
}) {
  // 1) pos (safe hook): compute once, even if category is null
  const pos = useMemo(() => {
    try {
      return category ? getPositionById(category.id) : null;
    } catch (e) {
      // defensive: if getPositionById isn't safe with null, just return null
      return null;
    }
  }, [category, getPositionById]);

  // 2) compute arc radii and mid radius (safe even when pos is null)
  const { arcInner, arcOuter, midRForIcons } = useMemo(() => {
    // arcInner should start outside the category buttons by gapBetween
    const computedArcInner = outerRadius + gapBetween;
    const computedArcOuter = computedArcInner + Math.max(itemSize * 1.2, 48);
    const computedMid = (computedArcInner + computedArcOuter) / 2;
    return {
      arcInner: computedArcInner,
      arcOuter: computedArcOuter,
      midRForIcons: computedMid,
    };
  }, [outerRadius, gapBetween, itemSize]);

  // 3) count of subs (safe)
  const subs = category?.subcategories || [];
  const n = Math.max(subs.length, 1);

  // 4) compute dynamic angular span (unconditional hook)
  const spanRad = useMemo(() => {
    // fallback if midRForIcons <= 0
    const R = Math.max(1, midRForIcons);

    if (n <= 1) {
      return deg2rad(Math.max(10, minSpanDeg));
    }

    const requiredArcLength = (n - 1) * (itemSize + iconSpacing);
    let theta = requiredArcLength / R;

    // small angular padding
    const padRad = deg2rad(12);
    theta += padRad;

    const minRad = deg2rad(minSpanDeg);
    const maxRad = deg2rad(maxSpanDeg);
    if (theta < minRad) theta = minRad;
    if (theta > maxRad) theta = maxRad;

    return theta;
  }, [n, itemSize, iconSpacing, midRForIcons, minSpanDeg, maxSpanDeg]);

  // 5) centerAngle (safe default if pos null)
  const centerAngle = pos ? pos.angle : 0;

  // 6) compute start/end angles and path (unconditional)
  const { startAngle, endAngle, pathD } = useMemo(() => {
    const sA = centerAngle - spanRad / 2;
    const eA = centerAngle + spanRad / 2;
    const path = describeDonutWedge(half, half, arcInner, arcOuter, sA, eA);
    return { startAngle: sA, endAngle: eA, pathD: path };
  }, [centerAngle, spanRad, half, arcInner, arcOuter]);

  // 7) compute iconAngles fallback-safe (unconditional)
  const iconAngles = useMemo(() => {
    if (n === 1) return [centerAngle];
    return Array.from({ length: n }, (_, i) => {
      const t = i / (n - 1);
      return startAngle + t * (endAngle - startAngle);
    });
  }, [n, startAngle, endAngle, centerAngle]);

  // Now it's safe to early-return if there's no category or no position
  if (!category || !pos) return null;

  // variants for fade-up animation
  const arcVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.06,
        ease: "easeOut",
        duration: 0.16,
      },
    },
    exit: { opacity: 0, y: 10, transition: { duration: 0.16 } },
  };

  const pathVariants = {
    hidden: { opacity: 0, pathLength: 0.98, y: 8 },
    visible: {
      opacity: 1,
      pathLength: 1,
      y: 0,
      transition: { duration: 0.18, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      pathLength: 0.98,
      y: 8,
      transition: { duration: 0.14 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.22, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.12 } },
  };

  return (
    <motion.div
      className="absolute inset-0"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={arcVariants}
      style={{ pointerEvents: "none" }}
    >
      {/* SVG arc background */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute top-0 left-0"
        style={{ overflow: "visible", pointerEvents: "none" }}
      >
        <motion.path
          d={pathD}
          variants={pathVariants}
          fill={colors.arcFill}
          style={{ pointerEvents: "none" }}
        />
      </svg>

      {/* subcategory icons placed on mid radius */}
      {subs.map((sc, idx) => {
        const a = iconAngles[idx];
        const { x, y } = polarToCartesian(half, half, midRForIcons, a);
        const left = x - itemSize / 2;
        const top = y - itemSize / 2;

        return (
          <motion.button
            key={sc.id}
            className="absolute flex items-center justify-center rounded-full shadow-md focus:outline-none"
            style={{
              left,
              top,
              width: itemSize,
              height: itemSize,
              background:
                "linear-gradient(180deg, rgba(99,102,241,1), rgba(49,46,129,1))",
              boxShadow: `0 6px 18px ${colors.itemShadow}`,
              border: "2px solid rgba(255,255,255,0.06)",
              color: "#fff",
              zIndex: 60,

              pointerEvents: "auto",
            }}
            onClick={() => console.log("Subcategory clicked:", sc.id)}
            title={sc.name}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={itemVariants}
            aria-label={sc.name}
          >
            <span className="text-sm select-none">🏠</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
