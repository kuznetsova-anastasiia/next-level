import Link from "next/link";
import styles from "./Navbar.module.scss";
import { AvatarIcon } from "../Icons";

export default function Navbar() {
  return (
    <nav className={styles.Navbar}>
      <div className={styles.Navbar__container}>
        <div className={styles.Navbar__logo}>Next Level</div>
        <div className={styles.Navbar__links}>
          <Link className={styles.Navbar__link} href="/about">
            Інфо
          </Link>
          <Link className={styles.Navbar__link} href="/contact">
            Заявки
          </Link>
          <Link className={styles.Navbar__link} href="/contact">
            Правила
          </Link>
          <Link className={styles.Navbar__link} href="/contact">
            Зв&apos;язок
          </Link>
          <Link className={styles.Navbar__link} href="/contact">
            Організатори
          </Link>
        </div>
        <div className={styles.Navbar__avatar}>
          <AvatarIcon />
        </div>
      </div>
    </nav>
  );
}
