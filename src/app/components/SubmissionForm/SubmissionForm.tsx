"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./SubmissionForm.module.scss";

interface Participant {
  id: string;
  name: string;
  submissionNumber: string;
  submissionsInfo: string;
}

export default function SubmissionForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [isCheckingSubmissions, setIsCheckingSubmissions] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    phoneNumber: "",
    category: "",
    songName: "",
    songMinutes: "",
    songSeconds: "",
    youtubeLink: "",
    hasBackdancers: false,
    participants: [
      { id: "1", name: "", submissionNumber: "", submissionsInfo: "" },
    ] as Participant[], // Always start with one participant
    hasProps: false,
    usingBackground: false,
    comment: "",
  });

  const categories = [
    { value: "solo", label: "Solo" },
    { value: "duo/trio", label: "Duo/Trio" },
    { value: "team", label: "Team" },
    { value: "unformat", label: "Unformat" },
  ];

  // Fetch user's current submission count
  useEffect(() => {
    const fetchSubmissionCount = async () => {
      if (!user) {
        setIsCheckingSubmissions(false);
        return;
      }

      try {
        const response = await fetch(`/api/submissions?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setSubmissionCount(data.submissions?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching submission count:", error);
      } finally {
        setIsCheckingSubmissions(false);
      }
    };

    fetchSubmissionCount();
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      // Handle category change - adjust participants to meet minimum requirements
      if (name === "category") {
        const getMinParticipants = (category: string) => {
          switch (category) {
            case "solo":
              return 1;
            case "duo/trio":
              return 2;
            case "team":
              return 4;
            case "unformat":
              return 1;
            default:
              return 1;
          }
        };

        const minParticipants = getMinParticipants(value);
        const currentParticipants = formData.participants;

        // If current participants are less than minimum, add more
        if (currentParticipants.length < minParticipants) {
          const participantsToAdd =
            minParticipants - currentParticipants.length;
          const newParticipants = Array.from(
            { length: participantsToAdd },
            (_, index) => ({
              id: Date.now().toString() + index,
              name: "",
              submissionNumber: "",
              submissionsInfo: "",
            })
          );

          setFormData((prev) => ({
            ...prev,
            [name]: value,
            participants: [...currentParticipants, ...newParticipants],
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const addParticipant = () => {
    if (formData.participants.length >= 10) {
      setError("Максимальна кількість учасників - 10");
      return;
    }
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: "",
      submissionNumber: "",
      submissionsInfo: "",
    };
    setFormData((prev) => ({
      ...prev,
      participants: [...prev.participants, newParticipant],
    }));
  };

  const removeParticipant = (id: string) => {
    // Get minimum participants based on category
    const getMinParticipants = (category: string) => {
      switch (category) {
        case "solo":
          return 1;
        case "duo/trio":
          return 2;
        case "team":
          return 4;
        case "unformat":
          return 1;
        default:
          return 1;
      }
    };

    const minParticipants = getMinParticipants(formData.category);

    // Don't allow removing if it would go below minimum
    if (formData.participants.length <= minParticipants) {
      const categoryLabels: { [key: string]: string } = {
        solo: "Solo",
        "duo/trio": "Duo/Trio",
        team: "Team",
        unformat: "Unformat",
      };
      setError(
        `Для категорії "${
          categoryLabels[formData.category]
        }" потрібно мінімум ${minParticipants} учасників`
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((p) => p.id !== id),
    }));
  };

  const updateParticipant = (
    id: string,
    field: "name" | "submissionNumber" | "submissionsInfo",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (!user) {
      setError("You must be logged in to submit");
      setLoading(false);
      return;
    }

    // Check if user already has 4 or more submissions
    if (submissionCount >= 4) {
      setError(
        "Ви вже маєте максимальну кількість заявок (4). Додаткові заявки не дозволені."
      );
      setLoading(false);
      return;
    }

    // Validate required fields
    const requiredFields = [
      "name",
      "nickname",
      "phoneNumber",
      "category",
      "songName",
      "youtubeLink",
    ];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        setError(`${field} is required`);
        setLoading(false);
        return;
      }
    }

    // Validate phone number format (Ukrainian format: 0971856972)
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Номер телефону має бути у форматі 0XXXXXXXXX");
      setLoading(false);
      return;
    }

    // Validate song duration
    const minutes = parseInt(formData.songMinutes);
    const seconds = parseInt(formData.songSeconds);
    if (
      isNaN(minutes) ||
      isNaN(seconds) ||
      minutes < 0 ||
      seconds < 0 ||
      seconds >= 60
    ) {
      setError("Invalid song duration");
      setLoading(false);
      return;
    }

    // Validate participant names and submission numbers (always required, at least one)
    const emptyParticipants = formData.participants.some((p) => !p.name.trim());
    if (emptyParticipants) {
      setError("Всі імена учасників повинні бути заповнені");
      setLoading(false);
      return;
    }

    // Validate minimum participants based on category
    const getMinParticipants = (category: string) => {
      switch (category) {
        case "solo":
          return 1;
        case "duo/trio":
          return 2;
        case "team":
          return 4;
        case "unformat":
          return 1;
        default:
          return 1;
      }
    };

    const minParticipants = getMinParticipants(formData.category);
    if (formData.participants.length < minParticipants) {
      const categoryLabels: { [key: string]: string } = {
        solo: "Solo",
        "duo/trio": "Duo/Trio",
        team: "Team",
        unformat: "Unformat",
      };
      setError(
        `Для категорії "${
          categoryLabels[formData.category]
        }" потрібно мінімум ${minParticipants} учасників`
      );
      setLoading(false);
      return;
    }

    // Validate submission numbers format (should be numbers)
    const invalidSubmissionNumbers = formData.participants.some(
      (p) => p.submissionNumber && !/^\d+$/.test(p.submissionNumber)
    );
    if (invalidSubmissionNumbers) {
      setError("Номери заявок учасників повинні бути числами");
      setLoading(false);
      return;
    }

    // Validate submission numbers don't exceed 4
    const exceedsMaxSubmissions = formData.participants.some(
      (p) => p.submissionNumber && parseInt(p.submissionNumber) > 4
    );
    if (exceedsMaxSubmissions) {
      setError("Кількість номерів учасника не може перевищувати 4");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          songMinutes: minutes,
          songSeconds: seconds,
          participants: formData.participants
            .map((p) => p.name.trim())
            .filter((name) => name),
          participantSubmissionNumbers: formData.participants
            .map((p) => (p.submissionNumber ? parseInt(p.submissionNumber) : 0))
            .filter((num) => num > 0),
          participantSubmissionsInfo: formData.participants
            .map((p) => p.submissionsInfo.trim())
            .filter((info) => info),
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: "",
          nickname: "",
          phoneNumber: "",
          category: "",
          songName: "",
          songMinutes: "",
          songSeconds: "",
          youtubeLink: "",
          hasBackdancers: false,
          participants: [
            { id: "1", name: "", submissionNumber: "", submissionsInfo: "" },
          ], // Reset to one participant
          hasProps: false,
          usingBackground: false,
          comment: "",
        });

        // Scroll to success notification
        setTimeout(() => {
          const successElement = document.querySelector(
            "[data-success-notification]"
          );
          if (successElement) {
            successElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);
      } else {
        setError(data.error || "Submission failed");

        // Scroll to error notification
        setTimeout(() => {
          const errorElement = document.querySelector(
            "[data-error-notification]"
          );
          if (errorElement) {
            errorElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);
      }
    } catch {
      setError("An error occurred. Please try again.");

      // Scroll to error notification
      setTimeout(() => {
        const errorElement = document.querySelector(
          "[data-error-notification]"
        );
        if (errorElement) {
          errorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loginRequired}>
          <h2>Login Required</h2>
          <p>Ви маєте бути авторизованими для подачі заявки.</p>
          <a href="/login" className={styles.loginLink}>
            Авторизуватися тут
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Подати заявку</h1>

      {success && (
        <div className={styles.success} data-success-notification>
          <h3>Заявка успішно подана!</h3>
          <p>
            Чекайте на зміну статусу у вказані терміни. Ми повідомимо вас про
            зміни статусу на вашу електронну адресу.
          </p>
        </div>
      )}

      {error && (
        <div className={styles.error} data-error-notification>
          <h3>Помилка</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Submission count indicator */}
      {!isCheckingSubmissions && (
        <div className={styles.submissionCountInfo}>
          <p>
            Поточні заявки: <strong>{submissionCount}/4</strong>
            {submissionCount >= 4 && (
              <span className={styles.limitReached}> (Максимум досягнуто)</span>
            )}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h2>Персональна інформація</h2>

          <div className={styles.inputGroup}>
            <label htmlFor="name">Повне ім&apos;я *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="Ім'я Прізвище"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="nickname">Нік/Назва команди *</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phoneNumber">Телефон *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="0XXXXXXXXX"
              pattern="0[0-9]{9}"
              title="Номер телефону має бути у форматі 0XXXXXXXXX"
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Деталі виступу</h2>

          <div className={styles.inputGroup}>
            <label htmlFor="category">Категорія *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className={styles.select}
            >
              <option value="">Виберіть категорію</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="songName">Назва пісні *</label>
            <input
              type="text"
              id="songName"
              name="songName"
              value={formData.songName}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="Aespa - Next Level"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Тривалість пісні *</label>
            <div className={styles.durationInputs}>
              <div className={styles.durationField}>
                <input
                  type="number"
                  name="songMinutes"
                  value={formData.songMinutes}
                  onChange={handleInputChange}
                  min="0"
                  max="59"
                  placeholder="Хв"
                  required
                  className={styles.input}
                />
                <span>хвилин</span>
              </div>
              <div className={styles.durationField}>
                <input
                  type="number"
                  name="songSeconds"
                  value={formData.songSeconds}
                  onChange={handleInputChange}
                  min="0"
                  max="59"
                  placeholder="Сек"
                  required
                  className={styles.input}
                />
                <span>секунд</span>
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="youtubeLink">Посилання на YouTube *</label>
            <input
              type="url"
              id="youtubeLink"
              name="youtubeLink"
              value={formData.youtubeLink}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="https://www.youtube.com/watch?v=..."
              title="Введіть посилання на YouTube"
            />
          </div>

          {formData.category === "solo" && (
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="hasBackdancers"
                  checked={formData.hasBackdancers}
                  onChange={handleInputChange}
                  className={styles.checkbox}
                />
                В мене присутня підтанцьовка в номері більше ніж 1хв/половину
                номера
              </label>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Учасники *</label>
            {formData.participants.map((participant, index) => (
              <div key={participant.id} className={styles.participantRow}>
                <div className={styles.participantInfo}>
                  <span className={styles.participantNumber}>
                    Учасник {index + 1}
                  </span>
                  <div className={styles.participantInputs}>
                    <input
                      type="text"
                      value={participant.name}
                      onChange={(e) =>
                        updateParticipant(
                          participant.id,
                          "name",
                          e.target.value
                        )
                      }
                      placeholder="Ім'я Прізвище"
                      className={styles.participantNameInput}
                      required
                    />
                    <input
                      type="number"
                      value={participant.submissionNumber}
                      onChange={(e) =>
                        updateParticipant(
                          participant.id,
                          "submissionNumber",
                          e.target.value
                        )
                      }
                      placeholder="К-ть номерів"
                      className={styles.participantNumberInput}
                      min="0"
                      max="4"
                      title="Загальна кількість номерів учасника (максимум 4)"
                    />
                    <input
                      type="text"
                      value={participant.submissionsInfo}
                      onChange={(e) =>
                        updateParticipant(
                          participant.id,
                          "submissionsInfo",
                          e.target.value
                        )
                      }
                      placeholder="категорія - нік/назва команди"
                      className={styles.participantSubmissionsInfoInput}
                    />
                  </div>
                </div>
                {formData.participants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(participant.id)}
                    className={styles.removeButton}
                  >
                    Вилучити
                  </button>
                )}
              </div>
            ))}
            {formData.participants.length < 10 && (
              <button
                type="button"
                onClick={addParticipant}
                className={styles.addButton}
              >
                Додати учасника ({formData.participants.length}/10)
              </button>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Додаткова інформація</h2>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="hasProps"
                checked={formData.hasProps}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              В номері присутній реквізит
            </label>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="usingBackground"
                checked={formData.usingBackground}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              Я буду використовувати відео/фото для фону
            </label>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="comment">Коментар (Опціонально)</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              className={styles.textarea}
              placeholder="Додаткова інформація про ваш виступ..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || submissionCount >= 4}
          className={styles.submitButton}
        >
          {loading
            ? "Подаємо заявку..."
            : submissionCount >= 4
            ? "Максимум заявок досягнуто"
            : "Подати заявку"}
        </button>
      </form>
    </div>
  );
}
