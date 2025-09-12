"use client";
import styles from "./MainButton.module.scss";

type MainButtonProps = {
  text: string;
  color?: string;
}

export default function MainButton({ text, color }: MainButtonProps) {
  const handlePlay = () => {
    console.log("Play");
  }

  const handleWatch = () => {
    console.log("Watch");
  }
  return <button className={styles.MainButton} onClick={text === "Play" ? handlePlay : handleWatch}>{text}</button>;
}