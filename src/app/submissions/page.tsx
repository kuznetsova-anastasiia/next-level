"use client";

import { useState, useEffect } from "react";
import SubmissionForm from "../components/SubmissionForm/SubmissionForm";
import SubmissionsCountdown from "../components/SubmissionsCountdown/SubmissionsCountdown";
import styles from "./submissions.module.scss";

export default function Submissions() {
  const [registrationStatus, setRegistrationStatus] = useState<
    "before" | "open" | "closed"
  >("before");

  useEffect(() => {
    const checkRegistrationStatus = () => {
      const now = new Date();
      const registrationStartDate = new Date("2025-10-01T00:00:00");
      const registrationEndDate = new Date("2025-10-10T23:59:59");

      if (now < registrationStartDate) {
        setRegistrationStatus("before");
      } else if (now >= registrationStartDate && now <= registrationEndDate) {
        setRegistrationStatus("open");
      } else {
        setRegistrationStatus("closed");
      }
    };

    checkRegistrationStatus();
    const interval = setInterval(checkRegistrationStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <h1>Подача заявки</h1>

        <div className={styles.rules}>
          <h2>Правила подачі заявок</h2>
          <ul>
            <li>- Прийом заявок відкритий з 01.10.2025 по 10.11.2025.</li>
            <li>
              - Людина, що подає заявку, автоматично стає її куратором. Уся
              подальша комунікація та зміни здійснюються лише через нього.
            </li>
            <li>- Усі обов&apos;язкові поля заявки мають бути заповнені.</li>
            <li>
              - Куратор зобов&apos;язаний вказати кількість номерів усіх
              учасників заявки.
            </li>
            <li>
              - Списки учасників публікуються протягом 3 днів після закриття
              прийому заявок.
            </li>
            <li>
              - Одна людина може брати участь не більш ніж у 4 номерах (разом із
              позаконкурсним).
            </li>
            <li>- Максимальна кількість учасників у виступі — 10 осіб.</li>
            <li>
              - Використання спецефектів та реквізиту можливе лише за
              погодженням з організаторами.
            </li>
            <li>
              - Усі аудіо- та відеофайли потрібно подати до завершення прийому
              заявок. Після цього внести зміни буде неможливо.
            </li>
          </ul>

          <div className={styles.timings}>
            <h3>Таймінги:</h3>
            <ul>
              <li>- Solo - 2:30</li>
              <li>- Solo+ - 3:30</li>
              <li>- Duo/Trio - 2:45</li>
              <li>- Team - 4:00</li>
            </ul>
          </div>
        </div>
      </div>

      {registrationStatus === "before" && <SubmissionsCountdown />}
      {registrationStatus === "open" && <SubmissionForm />}
      {registrationStatus === "closed" && (
        <div className={styles.closedMessage}>
          <h2>Реєстрація закрита</h2>
          <p>Прийом заявок завершено. Дякуємо за участь!</p>
        </div>
      )}
    </div>
  );
}
