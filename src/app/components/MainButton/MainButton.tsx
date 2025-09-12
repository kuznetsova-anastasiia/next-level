"use client";
import styles from "./MainButton.module.scss";

type MainButtonProps = {
  text: string;
  color?: string;
  type?: 'player' | 'watcher';
}

export default function MainButton({ text, color, type }: MainButtonProps) {
  const handlePlay = () => {
    console.log("Play");
  }

  const handleWatch = () => {
    console.log("Watch");
  }
  return <button className={`${styles.MainButton} ${type === 'player' ? styles.MainButton__player : styles.MainButton__watcher}`} onClick={type === "player" ? handlePlay : handleWatch}>{text}</button>;
}