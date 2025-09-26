"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import styles from "./submission-details.module.scss";

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

export default function SubmissionDetailsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const submissionId = params.id as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [updating, setUpdating] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/user");
    }
  }, [user, router]);

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}`);
      const data = await response.json();

      if (response.ok) {
        setSubmission(data.submission);
      } else {
        setError(data.error || "Failed to fetch submission");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin" && submissionId) {
      fetchSubmission();
    }
  }, [user, submissionId]);

  const updateSubmission = async (updates: {
    status?: string;
    level?: string | null;
  }) => {
    if (!user) return;
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...updates, adminId: user.id }),
      });

      const data = await response.json();
      if (response.ok) {
        setSubmission((prev) => (prev ? { ...prev, ...updates } : null));
      } else {
        setError(data.error || "Failed to update submission");
      }
    } catch (err) {
      console.error("Error updating submission:", err);
      setError("Failed to update submission");
    } finally {
      setUpdating(false);
    }
  };

  const addComment = async () => {
    if (!submission || !newComment.trim() || !user) return;
    setUpdating(true);
    try {
      const response = await fetch("/api/admin/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId: submission.id,
          content: newComment,
          adminId: user.id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setNewComment("");
        setSubmission((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            adminComments: [...prev.adminComments, data.comment],
          };
        });
      } else {
        setError(data.error || "Failed to add comment");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment");
    } finally {
      setUpdating(false);
    }
  };

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

  if (error || !submission) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Помилка</h2>
          <p>{error || "Заявка не знайдена"}</p>
          <button onClick={() => router.push("/admin")}>
            ← Назад до списку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Заявка #{submission.submissionNumber}</h1>
        <button
          className={styles.backButton}
          onClick={() => router.push("/admin")}
        >
          ← Назад до списку
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.detailsCard}>
          <div className={styles.detailsHeader}>
            <div className={styles.submissionTitle}>
              <h2>{submission.name}</h2>
              <div className={styles.statusBadges}>
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
            </div>
          </div>

          <div className={styles.detailsContent}>
            <div className={styles.detailsSection}>
              <h3>Інформація про учасника</h3>
              <div className={styles.detailRow}>
                <span className={styles.label}>Ім'я:</span>
                <span className={styles.value}>{submission.name}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Нікнейм:</span>
                <span className={styles.value}>{submission.nickname}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Телефон:</span>
                <span className={styles.value}>{submission.phoneNumber}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{submission.user.email}</span>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <h3>Деталі виступу</h3>
              <div className={styles.detailRow}>
                <span className={styles.label}>Категорія:</span>
                <span className={styles.value}>{submission.category}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Пісня:</span>
                <span className={styles.value}>{submission.songName}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Тривалість:</span>
                <span className={styles.value}>
                  {submission.songMinutes}:
                  {submission.songSeconds.toString().padStart(2, "0")}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>YouTube:</span>
                <a
                  href={submission.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.youtubeLink}
                >
                  Переглянути відео
                </a>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Бекдансери:</span>
                <span className={styles.value}>
                  {submission.hasBackdancers ? "Так" : "Ні"}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Реквізит:</span>
                <span className={styles.value}>
                  {submission.hasProps ? "Так" : "Ні"}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Фон:</span>
                <span className={styles.value}>
                  {submission.usingBackground ? "Так" : "Ні"}
                </span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Коментар користувача:</span>
                <span className={styles.value}>
                  {submission.comment || "Немає"}
                </span>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <h3>Учасники</h3>
              <div className={styles.participantsList}>
                {submission.participants.map((participant, index) => (
                  <div key={index} className={styles.participant}>
                    <span className={styles.participantName}>
                      {participant}
                    </span>
                    {submission.participantSubmissionNumbers[index] && (
                      <span className={styles.submissionCount}>
                        ({submission.participantSubmissionNumbers[index]}{" "}
                        заявок)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.detailsSection}>
              <h3>Керування статусом</h3>
              <div className={styles.controls}>
                <div className={styles.controlGroup}>
                  <label>Статус:</label>
                  <select
                    value={submission.status}
                    onChange={(e) =>
                      updateSubmission({ status: e.target.value })
                    }
                    disabled={updating}
                    className={styles.statusSelect}
                  >
                    <option value="pending">На розгляді</option>
                    <option value="payment">Очікує оплати</option>
                    <option value="accepted">Прийнято</option>
                    <option value="rejected">Відхилено</option>
                  </select>
                </div>
                <div className={styles.controlGroup}>
                  <label>Рівень:</label>
                  <select
                    value={submission.level || ""}
                    onChange={(e) =>
                      updateSubmission({ level: e.target.value || null })
                    }
                    disabled={updating}
                    className={styles.levelSelect}
                  >
                    <option value="">Не встановлено</option>
                    <option value="new">new</option>
                    <option value="middle">middle</option>
                    <option value="pro">pro</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <h3>Коментарі адміністратора</h3>

              <div className={styles.commentsList}>
                {submission.adminComments.map((comment) => (
                  <div key={comment.id} className={styles.comment}>
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

              <div className={styles.addComment}>
                <textarea
                  placeholder="Додати новий коментар..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={updating}
                  className={styles.commentInput}
                  rows={3}
                />
                <button
                  onClick={addComment}
                  disabled={updating || !newComment.trim()}
                  className={styles.addCommentButton}
                >
                  {updating ? "Додавання..." : "Додати коментар"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
