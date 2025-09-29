import styles from "./Poster.module.scss";
import Countdown from "../Countdown";
import MainButton from "../MainButton/MainButton";

export default function Poster() {
  return (
    <div className={styles.Poster}>
      <div className={styles.Poster__content}>
        {/* <h1 className={styles.Poster__title}>BESTies Party</h1>

        <p className={styles.Poster__idm}>
          with <img src="/images/idm.PNG" alt="IDM" />
        </p>
        <Countdown />

        <div className={styles.Poster__buttons}>
          <MainButton text="Гравець" color="red" type="player" />
          <MainButton text="Глядач" color="blue" type="watcher" />
        </div> */}
      </div>
    </div>
  );
}
