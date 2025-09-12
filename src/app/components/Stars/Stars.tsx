"use client";

import { useEffect, useState } from "react";
import styles from "./Stars.module.scss";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  layer: number;
}

export default function Stars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate random stars
    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = 50; // Reduced from grid pattern

      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1, // 1-4px
          opacity: Math.random() * 0.8 + 0.2, // 0.2-1.0
          layer: Math.floor(Math.random() * 3) + 1, // 1-3 layers
        });
      }

      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className={styles.stars}>
      {stars.map((star) => (
        <div
          key={star.id}
          className={styles.star}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}
