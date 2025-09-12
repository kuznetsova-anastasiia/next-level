import Poster from "./components/Poster";
import MainInfo from "./components/MainInfo";
import styles from "./styles/home.module.scss";
export default function Home() {
  return (
    <main className={styles.Home}>
      <Poster />
      <MainInfo />
    </main>
  );
}
