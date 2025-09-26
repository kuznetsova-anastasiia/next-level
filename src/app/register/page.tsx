"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.scss";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate username format
    const usernameRegex = /^[a-z0-9]+$/;
    if (!usernameRegex.test(name)) {
      setError(
        "Ім&apos;я користувача повинно містити тільки малі літери та цифри, без пробілів та спеціальних символів"
      );
      setLoading(false);
      return;
    }

    if (name.length < 3) {
      setError("Ім&apos;я користувача повинно містити принаймні 3 символи");
      setLoading(false);
      return;
    }

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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        router.push("/");
      } else {
        setError(data.error || "Помилка реєстрації");
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
        <h1 className={styles.title}>Реєстрація</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Ім&apos;я користувача</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value.toLowerCase())}
              placeholder="тільки малі літери та цифри"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
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
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Створюємо акаунт..." : "Зареєструватися"}
          </button>
        </form>
        <p className={styles.link}>
          Вже маєте акаунт?{" "}
          <a href="/login" className={styles.linkText}>
            Увійти тут
          </a>
        </p>
      </div>
    </main>
  );
}
