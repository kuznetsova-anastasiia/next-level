import styles from "./Footer.module.scss";
import { InstaIcon } from "../Icons";

export default function Footer() {
  return (
    <div className={styles.Footer}>@ 2025 Next Level
      <a href="https://www.instagram.com/next.level.party.ua/" target="_blank" rel="noopener noreferrer">
        <InstaIcon />
      </a>
    </div>
  );
}