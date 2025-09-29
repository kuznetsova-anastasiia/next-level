"use client";

import styles from "./rules.module.scss";

export default function Rules() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>ПРАВИЛА УЧАСТІ</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            1. Відбір учасників та подача заявки
          </h2>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>1.1</span>
            <p className={styles.ruleText}>
              Попередньо проводиться відео-відбір для розподілу за категоріями.
              У разі великої кількості заявок можливий відбір на виліт. Відбір
              проводиться виключно організаторами.
            </p>
          </div>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>1.2</span>
            <p className={styles.ruleText}>
              Людина, що подає заявку, автоматично стає її куратором. Уся
              подальша комунікація та зміни здійснюються тільки через куратора.
            </p>
          </div>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>1.3</span>
            <p className={styles.ruleText}>
              Уважно вказуйте всі номери, в яких берете участь. Це впливає на
              правильність формування списків.
            </p>
          </div>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>1.4</span>
            <p className={styles.ruleText}>
              При заповненні форми для подачі заявки, куратор зобов&apos;язаний
              вказати кількість номерів всіх учасників заявки.
            </p>
          </div>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>1.5</span>
            <p className={styles.ruleText}>
              Списки учасників будуть оприлюднені протягом 3 днів після закриття
              прийому заявок.
            </p>
          </div>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>1.6</span>
            <p className={styles.ruleText}>
              Подача заявки буде відбуватись через форму на сайті заходу. Усі
              посилання та інструкції будуть опубліковані ближче до дати
              відкриття заявок.
            </p>
          </div>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>1.7</span>
            <p className={styles.ruleText}>
              <strong>
                Подача заявок буде відкрита з 01.10.2025-10.11.2025
              </strong>
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Деталі виступів</h2>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>2.1</span>
            <p className={styles.ruleText}>
              Одна людина може взяти участь не більше ніж у 4 номерах (включно з
              позаконкурсними)
            </p>
          </div>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>2.2</span>
            <p className={styles.ruleText}>
              Максимальна кількість учасників у виступі — 10 осіб.
            </p>
          </div>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>2.3</span>
            <p className={styles.ruleText}>
              Використання додаткових спецефектів допускається лише за
              погодженням з організаторами.
            </p>
          </div>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>2.4</span>
            <p className={styles.ruleText}>
              Усі аудіо та відеофайли необхідно подати до завершення прийому
              заявок. Після закриття прийому заявок буде неможливо внести
              будь-які зміни.
            </p>
          </div>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>2.5</span>
            <p className={styles.ruleText}>
              Один і той самий трек може використовуватися не більше 4 разів.
            </p>
          </div>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>2.6</span>
            <p className={styles.ruleText}>
              Соло виступи у яких підтанець буде знаходитись на сцені менше
              половини виступу або половину виступу автоматично переходять у
              категорію соло. Повний виступ з підтанцем або половина виступу
              переходять до категорії соло+
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Оплата участі</h2>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>3.1</span>
            <p className={styles.ruleText}>
              Повна оплата здійснюється протягом 7 днів після публікації
              списків. Якщо оплата не надійшла у визначений термін — заявка
              анулюється.
            </p>
          </div>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>3.2</span>
            <p className={styles.ruleText}>
              При відміні заявки більш ніж за 2 тижні до заходу кошти
              повертаються повністю. При відміні менш ніж за 2 тижні —
              повертається 50%
            </p>
          </div>

          <div className={styles.rule}>
            <span className={styles.ruleNumber}>3.3</span>
            <p className={styles.ruleText}>
              Скріни про оплату обовʼязково повинні бути надіслані сюди{" "}
              <a
                href="https://t.me/nextlevel_party"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                @nextlevel_party
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
