"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import styles from "./MainButton.module.scss";
import ViewerModal from "../ViewerModal/ViewerModal";

type MainButtonProps = {
  text: string;
  type?: "player" | "watcher";
};

export default function MainButton({ text, type }: MainButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);

  const handlePlayer = () => {
    if (user) {
      // User is logged in, redirect to submissions
      router.push("/submissions");
    } else {
      // User not logged in, redirect to login
      router.push("/login");
    }
  };

  const handleWatcher = () => {
    setIsViewerModalOpen(true);
  };

  return (
    <>
      <button
        className={`${styles.MainButton} ${
          type === "player"
            ? styles.MainButton__player
            : styles.MainButton__watcher
        }`}
        onClick={type === "player" ? handlePlayer : handleWatcher}
      >
        {text}
      </button>

      <ViewerModal
        isOpen={isViewerModalOpen}
        onClose={() => setIsViewerModalOpen(false)}
      />
    </>
  );
}
