import styles from "./MainInfo.module.scss";
import GoogleMap from "../GoogleMap";

export default function MainInfo() {
  return (
    <div className={styles.MainInfo}>
      <div className={`${styles.MainInfo__basicInfo} ${styles.MainInfo__part}`}>
        <div className={styles.MainInfo__info}>
          <p>Дата: 30.11.2025</p>
          <p>
            Локація: Palladium,
            <br />
            Італійський бульвар 4 (м.Одеса)
          </p>
        </div>

        <div className={styles.MainInfo__mapContainer}>
          <GoogleMap
            center={{
              lat: 46.46799872516157, // Odesa coordinates
              lng: 30.746242025586668,
            }}
            zoom={16}
            address="Італійський бульвар, 4"
          />
        </div>
      </div>

      <div className={styles.MainInfo__divider} />

      <div
        className={`${styles.MainInfo__nominations} ${styles.MainInfo__part}`}
      >
        <h2 className={styles.MainInfo__nominationsTitle}>Номінації</h2>

        <div className={styles.MainInfo__nominationsList}>
          <div className={styles.MainInfo__nomination}>
            <h3 className={styles.MainInfo__nominationTitle}>Команди</h3>
            <p>PRO: 1🏆 2🏆 3🏆</p>
            <p>MIDDLE: 1🏆 2🏆 3🏆</p>
            <p>NEW: 1🏆 2🏆 3🏆</p>
          </div>
          <div className={styles.MainInfo__nomination}>
            <h3 className={styles.MainInfo__nominationTitle}>Соло</h3>
            <p>PRO: 1🏆 2🏆 3🏆</p>
            <p>MIDDLE: 1🏆 2🏆 3🏆</p>
            <p>NEW: 1🏆 2🏆 3🏆</p>
          </div>
          <div className={styles.MainInfo__nomination}>
            <h3 className={styles.MainInfo__nominationTitle}>Дуети</h3>
            <p>PRO: 1🏆 2🏆 3🏆</p>
            <p>MIDDLE: 1🏆 2🏆 3🏆</p>
            <p>NEW: 1🏆 2🏆 3🏆</p>
          </div>

          <div className={styles.MainInfo__nomination}>
            <h3 className={styles.MainInfo__nominationTitle}>Неформат</h3>
            <p>Team: 1🏆 2🏆 3🏆</p>
            <p>Duo: 1🏆 2🏆 3🏆</p>
            <p>Solo: 1🏆 2🏆 3🏆</p>
          </div>
          <div className={styles.MainInfo__nomination}>
            <h3 className={styles.MainInfo__nominationTitle}>Соло+</h3>
            <p>1🏆 2🏆 3🏆</p>
          </div>
        </div>
      </div>
    </div>
  );
}
