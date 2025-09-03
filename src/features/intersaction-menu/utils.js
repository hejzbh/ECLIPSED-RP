// utils.js
/** deg -> rad */
export const deg2rad = (deg) => (deg * Math.PI) / 180;

/** polar -> cartesian */
export const polarToCartesian = (cx, cy, r, angle) => ({
  x: cx + r * Math.cos(angle),
  y: cy + r * Math.sin(angle),
});

/** describe a donut wedge SVG path (outer arc and inner arc) */
export function describeDonutWedge(
  cx,
  cy,
  innerR,
  outerR,
  startAngle,
  endAngle
) {
  const largeOuter = endAngle - startAngle > Math.PI ? 1 : 0;
  const largeInner = endAngle - startAngle > Math.PI ? 1 : 0;

  const p1 = polarToCartesian(cx, cy, outerR, startAngle);
  const p2 = polarToCartesian(cx, cy, outerR, endAngle);
  const p3 = polarToCartesian(cx, cy, innerR, endAngle);
  const p4 = polarToCartesian(cx, cy, innerR, startAngle);

  const d = [
    `M ${p1.x.toFixed(3)} ${p1.y.toFixed(3)}`,
    `A ${outerR.toFixed(3)} ${outerR.toFixed(
      3
    )} 0 ${largeOuter} 1 ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`,
    `L ${p3.x.toFixed(3)} ${p3.y.toFixed(3)}`,
    `A ${innerR.toFixed(3)} ${innerR.toFixed(
      3
    )} 0 ${largeInner} 0 ${p4.x.toFixed(3)} ${p4.y.toFixed(3)}`,
    `Z`,
  ].join(" ");
  return d;
}
