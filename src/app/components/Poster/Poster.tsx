import styles from "./Poster.module.scss";
import Countdown from "../Countdown";
import MainButton from "../MainButton/MainButton";

export default function Poster() {
  return (
    <div className={styles.Poster}>
      <div className={styles.Poster__content}>
        <Countdown />

        <div className={styles.Poster__buttons}>
          <MainButton text="Гравець" color="red" />
          <MainButton text="Глядач" color="blue" />
        </div>
      </div>
    </div>
  );
}