"use client";

import styles from "./info.module.scss";

export default function Info() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Про нас</h1>

        <div className={styles.intro}>
          <p className={styles.introText}>
            Привіт! Next Level та IDM — нові івент-команди родом з Одеси!
          </p>
          <p className={styles.introText}>
            Наш перший проєкт BESTIES, не лише про танці та конкурси, але й про
            дружню підтримку та любов один до одного.
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Номінації</h2>
          <p className={styles.sectionText}>
            На нашій паті представлено дві номінації:
          </p>
          <ul className={styles.sectionList}>
            <li className={styles.listItem}>
              <strong className={styles.strongText}>Format</strong> — категорія,
              де ви обираєте будь-яку хореографію та пісню азійського виконавця,
              та робите на неї кавер.
            </li>
            <li className={styles.listItem}>
              <strong className={styles.strongText}>Unformat</strong> — відкрита
              категорія на якій можна виконати кавер на вже існуючу хореографію,
              або виканати авторську постановку.
            </li>
          </ul>
          <p className={styles.sectionText}>
            Та йде розподіл на такі категорії:
          </p>
          <p className={styles.sectionText}>
            <strong className={styles.strongText}>
              Solo | Duo | Team | Solo+ (лише для Format)
            </strong>
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Оплата за участь</h2>

          <h3 className={styles.subsectionTitle}>Вартість для учасників</h3>
          <ul className={styles.sectionList}>
            <li className={styles.listItem}>1 номер – 300 грн</li>
            <li className={styles.listItem}>Кожний наступний – +150 грн</li>
          </ul>

          <h3 className={styles.subsectionTitle}>
            Перевищення таймінгу (за кожні 30 сек):
          </h3>
          <ul className={styles.sectionList}>
            <li className={styles.listItem}>Solo/Duo/Trio – +50 грн</li>
            <li className={styles.listItem}>Solo+/Team – +100 грн</li>
          </ul>

          <h3 className={styles.subsectionTitle}>
            Підтанець у Solo (НЕ Solo+):
          </h3>
          <ul className={styles.sectionList}>
            <li className={styles.listItem}>100 грн (якщо є інші номери)</li>
            <li className={styles.listItem}>300 грн (якщо це єдиний номер)</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Вартість глядацького квитка</h2>
          <ul className={styles.sectionList}>
            <li className={styles.listItem}>Квиток за передплатою – 300 грн</li>
            <li className={styles.listItem}>У день заходу – 400 грн</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Повернення коштів за квитки</h2>
          <ul className={styles.sectionList}>
            <li className={styles.listItem}>
              Відміна більш ніж за 2 тижні – 100% від вартості повертається
            </li>
            <li className={styles.listItem}>
              Відміна менш ніж за 2 тижні – 50% від вартості повертається
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Місце проведення</h2>
          <div className={styles.venue}>
            <h3 className={styles.venueTitle}>Клуб PALLADIUM</h3>
            <p className={styles.venueAddress}>
              Адреса: Італійський бульвар, 4, Одеса
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Зворотній звʼязок</h2>
          <p className={styles.sectionText}>
            Якщо виникає будь-яке питання – пишіть його на одну з цих сторінок:
          </p>
          <div className={styles.contacts}>
            <a
              href="https://t.me/idm_gang"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              https://t.me/idm_gang
            </a>
            <a
              href="https://t.me/nextlevel_party"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              https://t.me/nextlevel_party
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
