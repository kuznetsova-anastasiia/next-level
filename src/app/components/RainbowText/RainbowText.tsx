"use client";

import { useState, useEffect } from "react";
import styles from "./RainbowText.module.scss";

interface RainbowTextProps {
  text: string;
  className?: string;
}

export default function RainbowText({
  text,
  className = "",
}: RainbowTextProps) {
  const [colors, setColors] = useState<{ bg: string; text: string }[]>([]);

  useEffect(() => {
    // Generate random pastel colors for each character
    const generateColors = () => {
      const newColors = text.split("").map(() => ({
        bg: `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`,
        text: `hsl(${Math.floor(Math.random() * 360)}, 90%, 70%)`,
      }));
      setColors(newColors);
    };

    generateColors();
  }, [text]);

  return (
    <span className={`${styles.rainbowText} ${className}`}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={`${styles.rainbowLetter} ${
            char === " " ? styles.space : ""
          }`}
          style={
            {
              backgroundColor:
                char === " " ? "transparent" : colors[index]?.bg || "#000",
              color: colors[index]?.text || "#fff",
              "--letter-index": index,
            } as React.CSSProperties
          }
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
