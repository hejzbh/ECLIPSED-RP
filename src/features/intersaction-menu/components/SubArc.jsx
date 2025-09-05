// SubArc.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { polarToCartesian, describeDonutWedge, deg2rad } from "../utils";
import { AnimatePresence } from "framer-motion";
export default function SubArc({
  category,
  size,
  half,

  outerRadius,
  itemSize,

  getPositionById,
  gapBetween = 35,
  iconSpacing = 15,
  minSpanDeg = 12,
  onClick = () => {},
  maxSpanDeg = 160,
  onHover = () => {},
  onMouseOut = () => {},
}) {
  const [hovered, setHovered] = useState(null); // add this per item

  const pos = useMemo(() => {
    try {
      return category ? getPositionById(category.id) : null;
    } catch (e) {
      return null;
    }
  }, [category, getPositionById]);

  iconSpacing =
    category?.subcategory?.length > 2 ? iconSpacing - 10 : iconSpacing;

  const { arcInner, arcOuter, midRForIcons } = useMemo(() => {
    const computedArcInner = outerRadius + gapBetween;
    const computedArcOuter = computedArcInner + Math.max(itemSize * 1.2, 48);
    const computedMid = (computedArcInner + computedArcOuter) / 2;
    return {
      arcInner: computedArcInner,
      arcOuter: computedArcOuter,
      midRForIcons: computedMid,
    };
  }, [outerRadius, gapBetween, itemSize]);

  const subs = category?.subcategories || [];
  const n = Math.max(subs.length, 1);

  const spanRad = useMemo(() => {
    const R = Math.max(1, midRForIcons);
    if (n <= 1) return deg2rad(Math.max(10, minSpanDeg));
    const requiredArcLength = (n - 1) * (itemSize + iconSpacing);
    let theta = requiredArcLength / R;
    const padRad = deg2rad(12);
    theta += padRad;
    const minRad = deg2rad(minSpanDeg);
    const maxRad = deg2rad(maxSpanDeg);
    if (theta < minRad) theta = minRad;
    if (theta > maxRad) theta = maxRad;
    return theta;
  }, [n, itemSize, iconSpacing, midRForIcons, minSpanDeg, maxSpanDeg]);

  const centerAngle = pos ? pos.angle : 0;

  const { startAngle, endAngle, pathD } = useMemo(() => {
    const sA = centerAngle - spanRad / 2;
    const eA = centerAngle + spanRad / 2;
    const path = describeDonutWedge(half, half, arcInner, arcOuter, sA, eA);
    return { startAngle: sA, endAngle: eA, pathD: path };
  }, [centerAngle, spanRad, half, arcInner, arcOuter]);

  const iconAngles = useMemo(() => {
    if (n === 1) return [centerAngle];
    return Array.from({ length: n }, (_, i) => {
      const t = i / (n - 1);
      return startAngle + t * (endAngle - startAngle);
    });
  }, [n, startAngle, endAngle, centerAngle]);

  if (!category || !pos) return null;

  // animation tuning: ONLY opacity + scale for appearance
  const pathDuration = 0.18; // arc reveal duration
  const pathBuffer = 0; // extra wait before icons start (already included in delay calc)
  const itemStagger = 0.04; // per-icon stagger
  const popDuration = 0.14; // icon pop duration
  const pathEasing = [0.22, 1, 0.36, 1];

  // unique ids
  const gid = `arcGrad-${category.id}`;
  const shadowFilter = `softShadow-${category.id}`;

  const gradStart = polarToCartesian(half, half, arcInner, centerAngle); // unutrašnja ivica
  const gradEnd = polarToCartesian(half, half, arcOuter, centerAngle); // vanjska ivica

  return (
    <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute top-0 left-0"
        style={{ overflow: "visible", pointerEvents: "none" }}
      >
        <defs>
          <linearGradient
            id={gid}
            gradientUnits="userSpaceOnUse"
            x1={gradStart.x}
            y1={gradStart.y}
            x2={gradEnd.x}
            y2={gradEnd.y}
          >
            {/* slab crni na unutrašnjoj ivici -> jači prema vanjskoj */}
            <stop offset="0%" stopColor="#676370" stopOpacity="0.05" />
            <stop offset="55%" stopColor="#676370" stopOpacity="0.40" />
            <stop offset="100%" stopColor="#676370" stopOpacity="0.72" />
          </linearGradient>

          <filter
            id={shadowFilter}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="12"
              floodColor="#0b0716"
              floodOpacity="0.45"
            />
          </filter>
        </defs>

        {/* ARC: only animates opacity + scale */}
        <motion.path
          d={pathD}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: pathDuration, ease: pathEasing }}
          fill={`url(#${gid})`}
          style={{
            pointerEvents: "none",
            filter: `url(#${shadowFilter})`,
            transformOrigin: `${half}px ${half}px`,
          }}
        />

        {/* subtle overlay band for depth (static opacity + scale matched to arc) */}
        <motion.path
          d={pathD}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 0.42, scale: 1.01 }}
          transition={{ duration: pathDuration, ease: pathEasing }}
          fill="rgba(255,255,255,0.12)"
          style={{
            pointerEvents: "none",
            mixBlendMode: "screen",
            transformOrigin: `${half}px ${half}px`,
          }}
        />
      </svg>

      {/* ICONS: appear after arc using only opacity + scale */}
      {subs.map((sc, idx) => {
        const rForIcons = arcOuter + itemSize * 0.05;
        const a = iconAngles[idx];
        const { x, y } = polarToCartesian(half, half, rForIcons, a);
        const left = x - itemSize / 2;
        const top = y - itemSize / 2;
        const delay = pathDuration + pathBuffer + idx * itemStagger;

        return (
          <div
            onClick={() => onClick(sc)}
            key={sc.id}
            className="absolute flex flex-col items-center"
            style={{ left, top }}
            onMouseEnter={() => {
              setHovered(sc.id);
              onHover(sc);
            }}
            onMouseLeave={() => {
              setHovered(null);
              onMouseOut();
            }}
          >
            {/* Tooltip only when hovered */}
            <AnimatePresence>
              {hovered === sc.id && (
                <motion.div
                  className="mb-2 px-2 py-1 absolute z-100 rounded-md text-white text-sm whitespace-nowrap"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: -35 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  style={{ pointerEvents: "none", background: "#12042DD4" }}
                >
                  {sc.name}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subcategory button */}
            <motion.button
              className="flex items-center justify-center rounded-full focus:outline-none"
              style={{
                width: itemSize - 10,
                height: itemSize - 10,
                background:
                  "radial-gradient(circle, rgba(36,5,97,0.7) 0%, rgba(18,4,45,0.85) 83%)",
                boxShadow: `0 10px 30px rgba(11,7,22,0.55), inset 0 1px 0 rgba(255,255,255,0.04)`,
                border: "2px solid rgba(255,255,255,0.06)",
                color: "#fff",
                zIndex: 60,
                pointerEvents: "auto",
              }}
              onClick={() => console.log("Subcategory clicked:", sc.id)}
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
              transition={{
                duration: popDuration,
                ease: "easeOut",
                delay,
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
            >
              {sc.Icon ? (
                <sc.Icon className="text-2xl" />
              ) : (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z"
                    fill="white"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        );
      })}
    </div>
  );
}
