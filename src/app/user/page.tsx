"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "./user.module.scss";

interface Submission {
  id: string;
  submissionNumber: number;
  name: string;
  nickname: string;
  phoneNumber: string;
  category: string;
  songName: string;
  songMinutes: number;
  songSeconds: number;
  youtubeLink: string;
  hasBackdancers: boolean;
  participants: string[];
  participantSubmissionNumbers: number[];
  hasProps: boolean;
  usingBackground: boolean;
  comment: string | null;
  status: string;
  level: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UserPage() {
  const { user, logout } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
  };

  const fetchSubmissions = useCallback(async () => {
    try {
      const response = await fetch(`/api/submissions?userId=${user?.id}`);
      const data = await response.json();

      if (response.ok) {
        setSubmissions(data.submissions);
      } else {
        setError(data.error || "Failed to fetch submissions");
      }
    } catch {
      setError("An error occurred while fetching submissions");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user, fetchSubmissions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return styles.statusApproved;
      case "payment":
        return styles.statusPayment;
      case "rejected":
        return styles.statusRejected;
      case "pending":
        return styles.statusPending;
      default:
        return styles.statusPending;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Прийнято";
      case "payment":
        return "Очікує оплати";
      case "rejected":
        return "Відхилено";
      case "pending":
        return "На розгляді";
      default:
        return "На розгляді";
    }
  };

  const getLevelText = (level: string | null) => {
    if (!level) return "Not set";
    return level;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "pro":
        return styles.levelPro;
      case "middle":
        return styles.levelMiddle;
      case "new":
        return styles.levelNew;
      default:
        return styles.levelNew;
    }
  };

  const formatCategory = (category: string, hasBackdancers: boolean) => {
    const categoryMap: { [key: string]: string } = {
      solo: "Solo",
      "duo/trio": "Duo/Trio",
      team: "Team",
      unformat: "Unformat",
    };

    const baseCategory = categoryMap[category] || category;
    return category === "solo" && hasBackdancers
      ? `${baseCategory}+`
      : baseCategory;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loginRequired}>
          <h2>Авторизація необхідна</h2>
          <p>Ви маєте бути авторизованими для перегляду цієї сторінки.</p>
          <a href="/login" className={styles.loginLink}>
            Авторизуватися тут
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <h2>Завантаження...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <h1>Мій профіль</h1>

        <div className={styles.userCard}>
          <h2>Особиста інформація</h2>
          <div className={styles.userDetails}>
            <div className={styles.userField}>
              <span className={styles.label}>Ім&apos;я:</span>
              <span className={styles.value}>{user.name}</span>
            </div>
            <div className={styles.userField}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{user.email}</span>
            </div>
          </div>
        </div>

        <div className={styles.logoutSection}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Вийти з акаунту
          </button>
        </div>
      </div>

      <div className={styles.submissionsSection}>
        <h2>Мої заявки</h2>

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        {submissions.length === 0 ? (
          <div className={styles.noSubmissions}>
            <p>У вас поки немає поданих заявок.</p>
            <a href="/submissions" className={styles.submitLink}>
              Подати заявку
            </a>
          </div>
        ) : (
          <div className={styles.submissionsList}>
            {submissions.map((submission) => (
              <div key={submission.id} className={styles.submissionCard}>
                <div className={styles.submissionHeader}>
                  <div className={styles.submissionNumber}>
                    #{submission.submissionNumber}
                  </div>
                  <div className={styles.badges}>
                    <div
                      className={`${styles.status} ${getStatusColor(
                        submission.status
                      )}`}
                    >
                      {getStatusText(submission.status)}
                    </div>
                    {submission.level && (
                      <div
                        className={`${styles.level} ${getLevelColor(
                          submission.level
                        )}`}
                      >
                        {getLevelText(submission.level)}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.submissionDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Категорія:</span>
                    <span className={styles.detailValue}>
                      {formatCategory(
                        submission.category,
                        submission.hasBackdancers
                      )}
                    </span>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Пісня:</span>
                    <span className={styles.detailValue}>
                      {submission.songName}
                    </span>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Тривалість:</span>
                    <span className={styles.detailValue}>
                      {submission.songMinutes}хв {submission.songSeconds}сек
                    </span>
                  </div>

                  <div
                    className={`${styles.detailRow} ${styles.participantsRow}`}
                  >
                    <span className={styles.detailLabel}>Учасники:</span>
                    <div className={styles.detailValue}>
                      {submission.participants.map((participant, index) => (
                        <span key={index} className={styles.participantItem}>
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>YouTube:</span>
                    <a
                      href={submission.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.driveLink}
                    >
                      Переглянути відео
                    </a>
                  </div>

                  {submission.comment && (
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Коментар:</span>
                      <span className={styles.detailValue}>
                        {submission.comment}
                      </span>
                    </div>
                  )}

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Дата подачі:</span>
                    <span className={styles.detailValue}>
                      {formatDate(submission.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
