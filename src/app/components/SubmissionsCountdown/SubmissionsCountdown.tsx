"use client";

import { useState, useEffect } from "react";
import styles from "./SubmissionsCountdown.module.scss";

export default function SubmissionsCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [countdownType, setCountdownType] = useState<"opening" | "closing">(
    "opening"
  );

  useEffect(() => {
    const openingDate = new Date("2025-09-01T00:00:00").getTime();
    const closingDate = new Date("2025-10-10T23:59:59").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();

      let targetDate: number;
      let type: "opening" | "closing";

      if (now < openingDate) {
        // Before opening - countdown to opening
        targetDate = openingDate;
        type = "opening";
      } else if (now >= openingDate && now <= closingDate) {
        // Between opening and closing - countdown to closing
        targetDate = closingDate;
        type = "closing";
      } else {
        // After closing - no countdown needed
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setCountdownType("closing");
        return;
      }

      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setCountdownType(type);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setCountdownType(type);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTitle = () => {
    if (countdownType === "opening") {
      return "Реєстрація відкриється через:";
    } else {
      return "Реєстрація закриється через:";
    }
  };

  return (
    <div className={styles.countdown}>
      <h2>{getTitle()}</h2>
      <div className={styles.timer}>
        <div className={styles.timeUnit}>
          <span className={styles.value}>{timeLeft.days}</span>
          <span className={styles.label}>днів</span>
        </div>
        <div className={styles.separator}>:</div>
        <div className={styles.timeUnit}>
          <span className={styles.value}>{timeLeft.hours}</span>
          <span className={styles.label}>годин</span>
        </div>
        <div className={styles.separator}>:</div>
        <div className={styles.timeUnit}>
          <span className={styles.value}>{timeLeft.minutes}</span>
          <span className={styles.label}>хвилин</span>
        </div>
        <div className={styles.separator}>:</div>
        <div className={styles.timeUnit}>
          <span className={styles.value}>{timeLeft.seconds}</span>
          <span className={styles.label}>секунд</span>
        </div>
      </div>
    </div>
  );
}
