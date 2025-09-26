"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./forgot-password.module.scss";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Якщо акаунт з таким email існує, ми надіслали вам посилання для скидання пароля."
        );
      } else {
        setError(data.error || "Сталася помилка. Спробуйте ще раз.");
      }
    } catch (error) {
      setError("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Забули пароль?</h1>
        <p className={styles.subtitle}>
          Введіть ваш email адрес, і ми надішлемо вам посилання для скидання
          пароля.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="your@email.com"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.success}>{message}</div>}

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Надсилаємо..." : "Надіслати посилання"}
          </button>
        </form>

        <div className={styles.links}>
          <a href="/login" className={styles.link}>
            ← Назад до входу
          </a>
          <a href="/register" className={styles.link}>
            Немає акаунту? Зареєструватися
          </a>
        </div>
      </div>
    </main>
  );
}
