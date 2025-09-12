import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.scss";
import { AvatarIcon } from "../Icons";

export default function Navbar() {
  return (
    <nav className={styles.Navbar}>
      <div className={styles.Navbar__container}>
        <Link href="/" className={styles.Navbar__logo}>
          <img
            src="/images/logo.png"
            alt="NextLevel"
            width={120}
            height={43}
            style={{ width: "120px", height: "43px" }}
          />
        </Link>
        <div className={styles.Navbar__links}>
          <Link className={styles.Navbar__link} href="/about">
            Інфо
          </Link>
          <Link className={styles.Navbar__link} href="/submissions">
            Заявки
          </Link>
          <Link className={styles.Navbar__link} href="/rules">
            Правила
          </Link>
          <Link className={styles.Navbar__link} href="/contact">
            Зв&apos;язок
          </Link>
          <Link className={styles.Navbar__link} href="/orgteam">
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
