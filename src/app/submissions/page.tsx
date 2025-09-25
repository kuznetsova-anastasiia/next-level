"use client";

import { useState, useEffect } from "react";
import SubmissionForm from "../components/SubmissionForm/SubmissionForm";
import SubmissionsCountdown from "../components/SubmissionsCountdown/SubmissionsCountdown";
import styles from "./submissions.module.scss";

export default function Submissions() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  useEffect(() => {
    const checkRegistrationStatus = () => {
      const now = new Date();
      const registrationDate = new Date("2025-09-01T00:00:00");
      setIsRegistrationOpen(now >= registrationDate);
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
            <li>- Подача заявок триває з 01.10.2025 по 10.11.2025</li>
            <li>
              - При подачі заявки всі обов&apos;язкові поля мають бути заповнені
            </li>
            <li>
              - Результати будуть оголошені напротязі тижня з моменту закриття
              подачі заявок
            </li>
            <li>- Один учасник може подати до 4 заявок</li>
            <li>- Заявка подається на кожну номінацію окремо</li>
            <li>
              - Музика та/або фон мають бути завантажені у папку на Google Drive
              та посилання на них має бути вказано в полі &quot;Посилання на
              Google Drive&quot;
            </li>
          </ul>
        </div>
      </div>

      {!isRegistrationOpen ? <SubmissionsCountdown /> : <SubmissionForm />}
    </div>
  );
}
