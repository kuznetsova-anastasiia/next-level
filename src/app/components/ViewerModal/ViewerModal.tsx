"use client";
import { useEffect } from "react";
import styles from "./ViewerModal.module.scss";

interface ViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewerModal({ isOpen, onClose }: ViewerModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        <div className={styles.handwrittenNote}>
          <div className={styles.noteContent}>
            <h2 className={styles.noteTitle}>Привіт бесті! 👋</h2>

            <p className={styles.noteText}>
              Щоб отримати ваш квиток для BESTies Party, зверніться до наших
              соціальних мереж!
            </p>

            <div className={styles.price}>
              <span className={styles.priceLabel}>Ціна:</span>
              <span className={styles.priceValue}>300 UAH</span>
            </div>

            <div className={styles.contactButtons}>
              <a
                href="https://www.instagram.com/next.level.party.ua/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactButton}
              >
                <span className={styles.instagramIcon}>📷</span>
                Instagram
              </a>

              <a
                href="https://t.me/nextlevel_party"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactButton}
              >
                <span className={styles.telegramIcon}>✈️</span>
                Telegram
              </a>
            </div>

            <div className={styles.signature}>
              <span className={styles.signatureText}>Your bestie 💕</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
