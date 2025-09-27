"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./user.module.scss";

interface Submission {
  id: string;
  submissionNumber: number;
  name: string;
  nickname: string;
  telegramContact: string;
  category: string;
  songName: string;
  songMinutes: number;
  songSeconds: number;
  youtubeLink: string;
  hasBackdancers: boolean;
  backdancersTiming: string | null;
  participants: string[];
  participantSubmissionNumbers: number[];
  participantSubmissionsInfo: string[];
  participantBirthDates: string[];
  participantTelegramUsernames: string[];
  hasProps: boolean;
  propsComment: string | null;
  usingBackground: boolean;
  materialsSent: boolean;
  comment: string | null;
  status: string;
  level: string | null;
  createdAt: string;
  updatedAt: string;
  adminComments: AdminComment[];
}

interface AdminComment {
  id: string;
  content: string;
  createdAt: string;
  admin: {
    id: string;
    name: string;
  };
}

export default function UserPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log(user);

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

  const formatCategory = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      solo: "Solo",
      "duo/trio": "Duo/Trio",
      team: "Team",
      unformat: "Unformat",
    };

    return categoryMap[category] || category;
  };

  const formatDate = (dateString: string, exact: boolean = false) => {
    const date = new Date(dateString);

    if (exact) {
      return date.toLocaleDateString("uk-UA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return "щойно";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} хв. тому`;
    } else if (diffInHours < 24) {
      return `${diffInHours} год. тому`;
    } else if (diffInDays === 1) {
      return "вчора";
    } else if (diffInDays < 7) {
      return `${diffInDays} дн. тому`;
    } else {
      return date.toLocaleDateString("uk-UA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
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

          {user.role === "admin" && (
            <div className={styles.adminSection}>
              <button
                className={styles.adminButton}
                onClick={() => router.push("/admin")}
              >
                🔧 Панель адміністратора
              </button>
            </div>
          )}
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
                    <span className={styles.detailLabel}>Нікнейм/Назва:</span>
                    <span className={styles.detailValue}>
                      {submission.nickname}
                    </span>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Категорія:</span>
                    <span className={styles.detailValue}>
                      {formatCategory(submission.category)}
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
                      {formatDate(submission.createdAt, true)}
                    </span>
                  </div>

                  {submission.adminComments &&
                    submission.adminComments.length > 0 && (
                      <div className={styles.adminCommentsSection}>
                        <span className={styles.detailLabel}>
                          Коментарі адміністратора:
                        </span>
                        <div className={styles.adminCommentsList}>
                          {submission.adminComments.map((comment) => (
                            <div
                              key={comment.id}
                              className={styles.adminComment}
                            >
                              <div className={styles.commentHeader}>
                                <span className={styles.commentAuthor}>
                                  {comment.admin.name}
                                </span>
                                <span className={styles.commentDate}>
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <div className={styles.commentContent}>
                                {comment.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
