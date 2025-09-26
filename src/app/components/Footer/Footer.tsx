import styles from "./Footer.module.scss";
import { InstaIcon, TelegramIcon } from "../Icons";

export default function Footer() {
  return (
    <div className={styles.Footer}>@ 2025 Next Level
      <div className={styles.Footer__icons}>
        <a href="https://www.instagram.com/next.level.party.ua/" target="_blank" rel="noopener noreferrer">
          <InstaIcon />
        </a>
        <a href="https://t.me/besties_party_kpop" target="_blank" rel="noopener noreferrer" className={styles.telegramIcon}>
          <TelegramIcon />
        </a>
      </div>
    </div>
  );
}