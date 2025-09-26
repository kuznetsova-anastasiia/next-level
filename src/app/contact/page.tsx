"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "./contact.module.scss";

export default function ContactPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setError("Всі поля є обов&apos;язковими");
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Будь ласка, введіть правильний email адрес");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          subject: "",
          message: "",
        });
      } else {
        setError(data.error || "Помилка надсилання повідомлення");
      }
    } catch {
      setError("Сталася помилка. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Зв'яжіться з нами</h1>
        <p className={styles.description}>
          Маєте питання або пропозиції? Ми завжди раді почути від вас!
        </p>

        {success && (
          <div className={styles.success}>
            <h3>Повідомлення надіслано!</h3>
            <p>Дякуємо за ваш відгук. Ми відповімо вам найближчим часом.</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <h3>Помилка</h3>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Ім&apos;я *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="Ваше ім'я"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="your@email.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="subject">Тема *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="Тема повідомлення"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="message">Повідомлення *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={6}
              className={styles.textarea}
              placeholder="Ваше повідомлення..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? "Надсилаємо..." : "Надіслати повідомлення"}
          </button>
        </form>

        <div className={styles.contactInfo}>
          <h3>Альтернативні способи зв'язку</h3>
          <div className={styles.socialLinks}>
            <a
              href="https://www.instagram.com/next.level.party.ua/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              📷 Instagram
            </a>
            <a
              href="https://t.me/nextlevel_party"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              ✈️ Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
