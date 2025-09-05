import { AnimatePresence, motion } from "framer-motion";
import { useAudioEffects } from "../../../hooks/use-audio-effects";
import clickSound from "../../../assets/audio/click.wav";
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
  const { playEffect } = useAudioEffects();
  return (
    <button
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => {
        onClick(category);
        playEffect(clickSound);
      }}
      className="absolute flex items-center justify-center rounded-full transition-transform transform focus:outline-none"
      style={{
        left,
        top,
        minWidth: itemSize,
        minHeight: itemSize,
        cursor: "pointer",
        zIndex: isOpen ? 50 : 30,
        boxShadow: isHovered
          ? "0 10px 30px rgba(0,0,0,0.5)"
          : "0 6px 14px rgba(0,0,0,0.35)",
        border: isHovered
          ? "2px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(255,255,255,0.04)",
        background:
          "radial-gradient(circle, rgba(36,5,97,0.75) 0%, rgba(18,4,45,0.85) 83%)",

        color: "#fff",

        transform: isHovered ? "scale(1.08)" : "scale(1)",
      }}
      title={category.name}
      aria-label={category.name}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="mb-2 px-2 py-1 absolute z-100 rounded-md text-white text-sm whitespace-nowrap"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: -55 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            style={{ pointerEvents: "none", background: "#12042DD4" }}
          >
            {category.name}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Replace emoji with your svg icon */}
      <category.Icon className="text-3xl" />
    </button>
  );
}
