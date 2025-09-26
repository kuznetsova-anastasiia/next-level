"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./admin.module.scss";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
  participantSubmissionsInfo: string[];
  hasProps: boolean;
  usingBackground: boolean;
  comment: string | null;
  status: string;
  level: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  adminComments: AdminComment[];
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/user");
    }
  }, [user, router]);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/submissions");
      const data = await response.json();

      if (response.ok) {
        setSubmissions(data.submissions);
      } else {
        setError(data.error || "Failed to fetch submissions");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchSubmissions();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return styles.statusAccepted;
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

  const getLevelColor = (level: string | null) => {
    if (!level) return styles.levelNotSet;
    switch (level) {
      case "pro":
        return styles.levelPro;
      case "middle":
        return styles.levelMiddle;
      case "new":
        return styles.levelNew;
      default:
        return styles.levelNotSet;
    }
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

  if (!user || user.role !== "admin") {
    return (
      <div className={styles.container}>
        <div className={styles.accessDenied}>
          <h2>Доступ заборонено</h2>
          <p>Тільки адміністратори можуть переглядати цю сторінку.</p>
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
      <div className={styles.header}>
        <h1>🔧 Панель адміністратора</h1>
        <button
          className={styles.backButton}
          onClick={() => router.push("/user")}
        >
          ← Назад до профілю
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.submissionsList}>
          <h2>Всі заявки ({submissions.length})</h2>

          <div className={styles.submissionsGrid}>
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className={styles.submissionCard}
                onClick={() =>
                  router.push(`/admin/submission/${submission.id}`)
                }
              >
                <div className={styles.submissionHeader}>
                  <span className={styles.submissionNumber}>
                    #{submission.submissionNumber}
                  </span>
                  <span className={styles.submissionDate}>
                    {formatDate(submission.createdAt, true)}
                  </span>
                </div>

                <div className={styles.submissionInfo}>
                  <h3>{submission.name}</h3>
                  <p className={styles.category}>
                    {submission.category === "solo" && submission.hasBackdancers
                      ? "Solo+"
                      : submission.category.charAt(0).toUpperCase() +
                        submission.category.slice(1)}
                  </p>
                  <p className={styles.song}>{submission.songName}</p>

                  <div className={styles.submissionDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Тривалість:</span>
                      <span className={styles.detailValue}>
                        {submission.songMinutes}:
                        {submission.songSeconds.toString().padStart(2, "0")}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Учасники:</span>
                      <span className={styles.detailValue}>
                        {submission.participants.length} осіб
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Email:</span>
                      <span className={styles.detailValue}>
                        {submission.user.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.submissionStatus}>
                  <span
                    className={`${styles.statusBadge} ${getStatusColor(
                      submission.status
                    )}`}
                  >
                    {getStatusText(submission.status)}
                  </span>
                  {submission.level && (
                    <span
                      className={`${styles.levelBadge} ${getLevelColor(
                        submission.level
                      )}`}
                    >
                      {submission.level}
                    </span>
                  )}
                </div>

                {submission.adminComments.length > 0 && (
                  <div className={styles.commentsIndicator}>
                    💬 {submission.adminComments.length} коментарів
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
