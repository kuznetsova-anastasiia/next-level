"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./reset-password.module.scss";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [validating, setValidating] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Недійсне або відсутнє посилання для скидання пароля.");
      setValidating(false);
    } else {
      // Validate token
      validateToken();
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(
        `/api/auth/validate-reset-token?token=${token}`
      );
      const data = await response.json();

      if (response.ok) {
        setValidating(false);
      } else {
        setError(
          data.error || "Недійсне або застаріле посилання для скидання пароля."
        );
        setValidating(false);
      }
    } catch (error) {
      setError("Сталася помилка при перевірці посилання.");
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Паролі не співпадають");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Пароль повинен містити принаймні 6 символів");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Пароль успішно змінено! Ви будете перенаправлені на сторінку входу."
        );
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Сталася помилка при зміні пароля.");
      }
    } catch (error) {
      setError("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <h2>Перевіряємо посилання...</h2>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Встановити новий пароль</h1>
        <p className={styles.subtitle}>
          Введіть новий пароль для вашого акаунту.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Новий пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="Мінімум 6 символів"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Підтвердити пароль</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="Повторіть новий пароль"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.success}>{message}</div>}

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Змінюємо пароль..." : "Змінити пароль"}
          </button>
        </form>

        <div className={styles.links}>
          <a href="/login" className={styles.link}>
            ← Назад до входу
          </a>
        </div>
      </div>
    </main>
  );
}

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.loading}>
              <h2>Завантаження...</h2>
            </div>
          </div>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
