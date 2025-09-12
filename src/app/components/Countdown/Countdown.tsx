"use client";

import { useEffect, useState } from "react";
import styles from "./Countdown.module.scss";

export default function Countdown() {
  const targetDate = new Date("2025-11-30T11:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className={styles.Countdown}>
      <div className={styles.Countdown__unit}>
        {timeLeft.days}
        <span>Днів</span>
      </div>
      <span className={styles.Countdown__separator}>:</span>
      <div className={styles.Countdown__unit}>
        {timeLeft.hours}
        <span>Год</span>
      </div>
      <span className={styles.Countdown__separator}>:</span>
      <div className={styles.Countdown__unit}>
        {timeLeft.minutes}
        <span>Хв</span>
      </div>
      <span className={styles.Countdown__separator}>:</span>
      <div className={styles.Countdown__unit}>
        {timeLeft.seconds}
        <span>Сек</span>
      </div>
    </div>
  );
}
