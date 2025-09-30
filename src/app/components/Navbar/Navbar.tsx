"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.scss";
import { AvatarIcon } from "../Icons";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    console.log("Toggle mobile menu:", !isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className={styles.Navbar}>
      {/* Mobile Menu Backdrop */}
      <div
        className={`${styles.Navbar__mobileBackdrop} ${
          isMobileMenuOpen ? styles.Navbar__mobileBackdropOpen : ""
        }`}
        onClick={toggleMobileMenu}
      />

      <div className={styles.Navbar__container}>
        <Link href="/" className={styles.Navbar__logo}>
          <Image
            src="/images/logo.png"
            alt="NextLevel"
            width={120}
            height={43}
            priority
          />
          x
          <Image
            src="/images/idm.PNG"
            alt="IDM"
            width={120}
            height={43}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.Navbar__links}>
          <Link className={styles.Navbar__link} href="/info">
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

        {/* Desktop Auth */}
        <div className={styles.Navbar__auth}>
          {user ? (
            <Link href="/user" className={styles.Navbar__user}>
              <span className={styles.Navbar__username}>{user.name}</span>
              <AvatarIcon />
            </Link>
          ) : (
            <div className={styles.Navbar__authLinks}>
              <Link href="/login" className={styles.Navbar__authLink}>
                Login
              </Link>
              <Link href="/register" className={styles.Navbar__authLink}>
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.Navbar__mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          style={{
            backgroundColor: isMobileMenuOpen
              ? "rgba(255, 79, 216, 0.1)"
              : "transparent",
            borderRadius: "4px",
          }}
        >
          <span className={styles.Navbar__hamburger}></span>
          <span className={styles.Navbar__hamburger}></span>
          <span className={styles.Navbar__hamburger}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`${styles.Navbar__mobileMenu} ${
          isMobileMenuOpen ? styles.Navbar__mobileMenuOpen : ""
        }`}
      >
        <div className={styles.Navbar__mobileLinks}>
          <Link
            className={styles.Navbar__mobileLink}
            href="/info"
            onClick={toggleMobileMenu}
          >
            Інфо
          </Link>
          <Link
            className={styles.Navbar__mobileLink}
            href="/submissions"
            onClick={toggleMobileMenu}
          >
            Заявки
          </Link>
          <Link
            className={styles.Navbar__mobileLink}
            href="/rules"
            onClick={toggleMobileMenu}
          >
            Правила
          </Link>
          <Link
            className={styles.Navbar__mobileLink}
            href="/contact"
            onClick={toggleMobileMenu}
          >
            Зв&apos;язок
          </Link>
          <Link
            className={styles.Navbar__mobileLink}
            href="/orgteam"
            onClick={toggleMobileMenu}
          >
            Організатори
          </Link>
        </div>

        <div className={styles.Navbar__mobileAuth}>
          {user ? (
            <Link
              href="/user"
              className={styles.Navbar__mobileUser}
              onClick={toggleMobileMenu}
            >
              <span className={styles.Navbar__mobileUsername}>{user.name}</span>
              <AvatarIcon />
            </Link>
          ) : (
            <div className={styles.Navbar__mobileAuthLinks}>
              <Link
                href="/login"
                className={styles.Navbar__mobileAuthLink}
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={styles.Navbar__mobileAuthLink}
                onClick={toggleMobileMenu}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
