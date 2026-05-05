import { Variants } from "motion/react";

export const slideInFromRight: Variants = {
  initial: { x: 100, opacity: 0 },
  hover: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: "spring" as const, 
      stiffness: 100, 
      damping: 20,
      delay: 0.1 
    }
  }
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const scaleHover: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.1 }
};
