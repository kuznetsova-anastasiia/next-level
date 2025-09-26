import nodemailer from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface SubmissionEmailData {
  userEmail: string;
  userName: string;
  submissionNumber: number;
  category: string;
  songName: string;
  participants: string[];
}

interface StatusUpdateEmailData {
  userEmail: string;
  userName: string;
  submissionNumber: number;
  oldStatus: string;
  newStatus: string;
  oldLevel: string | null;
  newLevel: string | null;
}

interface CommentEmailData {
  userEmail: string;
  userName: string;
  submissionNumber: number;
  commentContent: string;
  adminName: string;
}

interface PasswordResetEmailData {
  userEmail: string;
  userName: string;
  resetToken: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async sendSubmissionConfirmation(data: SubmissionEmailData): Promise<void> {
    const {
      userEmail,
      userName,
      submissionNumber,
      category,
      songName,
      participants,
    } = data;

    const mailOptions = {
      from: `"BESTies Party" <nextlevel.party.ua@gmail.com>`,
      to: userEmail,
      subject: `🎉 Підтвердження заявки #${submissionNumber} - BESTies Party`,
      html: this.generateSubmissionConfirmationHTML({
        userName,
        submissionNumber,
        category,
        songName,
        participants,
      }),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(
        `Confirmation email sent to ${userEmail} for submission #${submissionNumber}`
      );
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      throw new Error("Failed to send confirmation email");
    }
  }

  async sendStatusUpdateNotification(
    data: StatusUpdateEmailData
  ): Promise<void> {
    const {
      userEmail,
      userName,
      submissionNumber,
      oldStatus,
      newStatus,
      oldLevel,
      newLevel,
    } = data;

    const mailOptions = {
      from: `"BESTies Party" <nextlevel.party.ua@gmail.com>`,
      to: userEmail,
      subject: `📢 Оновлення статусу заявки #${submissionNumber} - BESTies Party`,
      html: this.generateStatusUpdateHTML({
        userName,
        submissionNumber,
        oldStatus,
        newStatus,
        oldLevel,
        newLevel,
      }),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(
        `Status update email sent to ${userEmail} for submission #${submissionNumber}`
      );
    } catch (error) {
      console.error("Error sending status update email:", error);
      throw new Error("Failed to send status update email");
    }
  }

  async sendCommentNotification(data: CommentEmailData): Promise<void> {
    const { userEmail, userName, submissionNumber, commentContent, adminName } =
      data;

    const mailOptions = {
      from: `"BESTies Party" <nextlevel.party.ua@gmail.com>`,
      to: userEmail,
      subject: `💬 Новий коментар до заявки #${submissionNumber} - BESTies Party`,
      html: this.generateCommentNotificationHTML({
        userName,
        submissionNumber,
        commentContent,
        adminName,
      }),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(
        `Comment notification email sent to ${userEmail} for submission #${submissionNumber}`
      );
    } catch (error) {
      console.error("Error sending comment notification email:", error);
      throw new Error("Failed to send comment notification email");
    }
  }

  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
    const { userEmail, userName, resetToken } = data;

    const mailOptions = {
      from: `"BESTies Party" <nextlevel.party.ua@gmail.com>`,
      to: userEmail,
      subject: `🔐 Скидання пароля - BESTies Party`,
      html: this.generatePasswordResetHTML({
        userName,
        resetToken,
      }),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${userEmail}`);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  }

  private generateSubmissionConfirmationHTML(data: {
    userName: string;
    submissionNumber: number;
    category: string;
    songName: string;
    participants: string[];
  }): string {
    const { userName, submissionNumber, category, songName, participants } =
      data;

    return `
    <!DOCTYPE html>
    <html lang="uk">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Підтвердження заявки - BESTies Party</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
            }
            .container {
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                border: 3px solid #ff4081;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .title {
                color: #ff4081;
                font-size: 28px;
                font-weight: bold;
                margin: 0 0 10px 0;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
            }
            .subtitle {
                color: #666;
                font-size: 16px;
                margin: 0;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #333;
            }
            .confirmation-box {
                background: linear-gradient(135deg, #ff4081, #ff6b9d);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
            }
            .submission-number {
                font-size: 24px;
                font-weight: bold;
                margin: 10px 0;
            }
            .details {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border-left: 4px solid #ff4081;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                padding: 5px 0;
                border-bottom: 1px solid #eee;
            }
            .detail-label {
                font-weight: bold;
                color: #ff4081;
            }
            .detail-value {
                color: #333;
            }
            .participants-list {
                margin: 10px 0;
            }
            .participant {
                background: #ff4081;
                color: white;
                padding: 5px 10px;
                border-radius: 15px;
                display: inline-block;
                margin: 2px;
                font-size: 14px;
            }
            .next-steps {
                background: #e8f5e8;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border-left: 4px solid #4caf50;
            }
            .next-steps h3 {
                color: #4caf50;
                margin-top: 0;
            }
            .contact-info {
                text-align: center;
                margin: 30px 0;
                padding: 20px;
                background: #f0f0f0;
                border-radius: 10px;
            }
            .social-links {
                margin: 15px 0;
            }
            .social-link {
                display: inline-block;
                margin: 0 10px;
                padding: 10px 20px;
                background: #ff4081;
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            .social-link:hover {
                background: #ff6b9d;
                transform: translateY(-2px);
            }
            .signature {
                text-align: right;
                margin-top: 30px;
                font-style: italic;
                color: #ff4081;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="title">🎉 BESTies Party</h1>
                <p class="subtitle">Підтвердження заявки</p>
            </div>

            <div class="greeting">
                Привіт, ${userName}! 👋
            </div>

            <div class="confirmation-box">
                <h2>Ваша заявка успішно прийнята до розгляду!</h2>
                <div class="submission-number">№ ${submissionNumber}</div>
                <p>Ми отримали вашу заявку на участь у BESTies Party</p>
            </div>

            <div class="details">
                <h3>Деталі заявки:</h3>
                <div class="detail-row">
                    <span class="detail-label">Категорія:</span>
                    <span class="detail-value">${category}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Назва пісні:</span>
                    <span class="detail-value">${songName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Учасники:</span>
                    <div class="detail-value">
                        <div class="participants-list">
                            ${participants
                              .map(
                                (p) => `<span class="participant">${p}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                </div>
            </div>

            <div class="next-steps">
                <h3>📋 Що далі?</h3>
                <ul>
                    <li>Наша команда розгляне вашу заявку</li>
                    <li>Ви отримаєте повідомлення про статус заявки</li>
                    <li>Слідкуйте за оновленнями в наших соціальних мережах</li>
                </ul>
            </div>

            <div class="contact-info">
                <h3>📱 Зв'яжіться з нами</h3>
                <p>Маєте питання? Звертайтесь до нас!</p>
                <div class="social-links">
                    <a href="https://www.instagram.com/next.level.party.ua/" class="social-link" target="_blank">
                        📷 Instagram
                    </a>
                    <a href="https://t.me/nextlevel_party" class="social-link" target="_blank">
                        ✈️ Telegram
                    </a>
                </div>
            </div>

            <div class="signature">
                З любов'ю,<br>
                Your bestie 💕<br>
                BESTies Party Team
            </div>

            <div class="footer">
                <p><strong>⚠️ Це автоматично згенероване повідомлення</strong></p>
                <p>Будь ласка, не відповідайте на цей email. Для зв'язку використовуйте наші соціальні мережі вище.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generateStatusUpdateHTML(data: {
    userName: string;
    submissionNumber: number;
    oldStatus: string;
    newStatus: string;
    oldLevel: string | null;
    newLevel: string | null;
  }): string {
    const {
      userName,
      submissionNumber,
      oldStatus,
      newStatus,
      oldLevel,
      newLevel,
    } = data;

    const getStatusText = (status: string) => {
      switch (status) {
        case "accepted":
          return "Прийнято";
        case "payment":
          return "Очікує оплати";
        case "rejected":
          return "Відхилено";
        case "pending":
          return "На розгляді";
        default:
          return status;
      }
    };

    const getLevelText = (level: string | null) => {
      if (!level) return "Не встановлено";
      return level;
    };

    return `
    <!DOCTYPE html>
    <html lang="uk">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Оновлення статусу - BESTies Party</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
            }
            .container {
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                border: 3px solid #ff4081;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .title {
                color: #ff4081;
                font-size: 28px;
                font-weight: bold;
                margin: 0 0 10px 0;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #333;
            }
            .update-box {
                background: linear-gradient(135deg, #ff4081, #ff6b9d);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
            }
            .submission-number {
                font-size: 24px;
                font-weight: bold;
                margin: 10px 0;
            }
            .changes {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border-left: 4px solid #ff4081;
            }
            .change-row {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                padding: 10px;
                background: white;
                border-radius: 8px;
                border: 1px solid #eee;
            }
            .change-label {
                font-weight: bold;
                color: #ff4081;
            }
            .old-value {
                color: #f44336;
                text-decoration: line-through;
            }
            .new-value {
                color: #4caf50;
                font-weight: bold;
            }
            .contact-info {
                text-align: center;
                margin: 30px 0;
                padding: 20px;
                background: #f0f0f0;
                border-radius: 10px;
            }
            .social-links {
                margin: 15px 0;
            }
            .social-link {
                display: inline-block;
                margin: 0 10px;
                padding: 10px 20px;
                background: #ff4081;
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
            }
            .signature {
                text-align: right;
                margin-top: 30px;
                font-style: italic;
                color: #ff4081;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="title">📢 BESTies Party</h1>
                <p>Оновлення статусу заявки</p>
            </div>

            <div class="greeting">
                Привіт, ${userName}! 👋
            </div>

            <div class="update-box">
                <h2>Статус вашої заявки оновлено!</h2>
                <div class="submission-number">№ ${submissionNumber}</div>
                <p>Ми оновили інформацію про вашу заявку</p>
            </div>

            <div class="changes">
                <h3>Зміни:</h3>
                ${
                  oldStatus !== newStatus
                    ? `
                <div class="change-row">
                    <span class="change-label">Статус:</span>
                    <div>
                        <span class="old-value">${getStatusText(
                          oldStatus
                        )}</span>
                        <span> → </span>
                        <span class="new-value">${getStatusText(
                          newStatus
                        )}</span>
                    </div>
                </div>
                `
                    : ""
                }
                ${
                  oldLevel !== newLevel
                    ? `
                <div class="change-row">
                    <span class="change-label">Рівень:</span>
                    <div>
                        <span class="old-value">${getLevelText(oldLevel)}</span>
                        <span> → </span>
                        <span class="new-value">${getLevelText(newLevel)}</span>
                    </div>
                </div>
                `
                    : ""
                }
            </div>

            <div class="contact-info">
                <h3>📱 Маєте питання?</h3>
                <p>Звертайтесь до нас у соціальних мережах!</p>
                <div class="social-links">
                    <a href="https://www.instagram.com/next.level.party.ua/" class="social-link" target="_blank">
                        📷 Instagram
                    </a>
                    <a href="https://t.me/nextlevel_party" class="social-link" target="_blank">
                        ✈️ Telegram
                    </a>
                </div>
            </div>

            <div class="signature">
                З любов'ю,<br>
                Your bestie 💕<br>
                BESTies Party Team
            </div>

            <div class="footer">
                <p><strong>⚠️ Це автоматично згенероване повідомлення</strong></p>
                <p>Будь ласка, не відповідайте на цей email. Для зв'язку використовуйте наші соціальні мережі вище.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generateCommentNotificationHTML(data: {
    userName: string;
    submissionNumber: number;
    commentContent: string;
    adminName: string;
  }): string {
    const { userName, submissionNumber, commentContent, adminName } = data;

    return `
    <!DOCTYPE html>
    <html lang="uk">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Новий коментар - BESTies Party</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
            }
            .container {
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                border: 3px solid #ff4081;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .title {
                color: #ff4081;
                font-size: 28px;
                font-weight: bold;
                margin: 0 0 10px 0;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #333;
            }
            .comment-box {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                border-left: 4px solid #ff4081;
            }
            .comment-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            .comment-author {
                color: #ff4081;
                font-weight: bold;
            }
            .comment-content {
                background: white;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #eee;
                font-style: italic;
                line-height: 1.5;
            }
            .contact-info {
                text-align: center;
                margin: 30px 0;
                padding: 20px;
                background: #f0f0f0;
                border-radius: 10px;
            }
            .social-links {
                margin: 15px 0;
            }
            .social-link {
                display: inline-block;
                margin: 0 10px;
                padding: 10px 20px;
                background: #ff4081;
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
            }
            .signature {
                text-align: right;
                margin-top: 30px;
                font-style: italic;
                color: #ff4081;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="title">💬 BESTies Party</h1>
                <p>Новий коментар до вашої заявки</p>
            </div>

            <div class="greeting">
                Привіт, ${userName}! 👋
            </div>

            <div class="comment-box">
                <div class="comment-header">
                    <span class="comment-author">${adminName}</span>
                    <span style="color: #666; font-size: 14px;">Заявка #${submissionNumber}</span>
                </div>
                <div class="comment-content">
                    "${commentContent}"
                </div>
            </div>

            <div class="contact-info">
                <h3>📱 Маєте питання?</h3>
                <p>Звертайтесь до нас у соціальних мережах!</p>
                <div class="social-links">
                    <a href="https://www.instagram.com/next.level.party.ua/" class="social-link" target="_blank">
                        📷 Instagram
                    </a>
                    <a href="https://t.me/nextlevel_party" class="social-link" target="_blank">
                        ✈️ Telegram
                    </a>
                </div>
            </div>

            <div class="signature">
                З любов'ю,<br>
                Your bestie 💕<br>
                BESTies Party Team
            </div>

            <div class="footer">
                <p><strong>⚠️ Це автоматично згенероване повідомлення</strong></p>
                <p>Будь ласка, не відповідайте на цей email. Для зв'язку використовуйте наші соціальні мережі вище.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generatePasswordResetHTML(data: {
    userName: string;
    resetToken: string;
  }): string {
    const { userName, resetToken } = data;
    const resetUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;

    return `
    <!DOCTYPE html>
    <html lang="uk">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Скидання пароля - BESTies Party</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
            }
            .container {
                background: white;
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                border: 3px solid #ff4081;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .title {
                color: #ff4081;
                font-size: 28px;
                font-weight: bold;
                margin: 0 0 10px 0;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
            }
            .subtitle {
                color: #666;
                font-size: 16px;
                margin: 0;
            }
            .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #333;
            }
            .reset-box {
                background: linear-gradient(135deg, #ff4081, #ff6b9d);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
            }
            .reset-button {
                display: inline-block;
                background: white;
                color: #ff4081;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                font-size: 16px;
                margin: 15px 0;
                transition: all 0.3s ease;
            }
            .reset-button:hover {
                background: #f0f0f0;
                transform: translateY(-2px);
            }
            .warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                color: #856404;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .warning h3 {
                margin-top: 0;
                color: #856404;
            }
            .contact-info {
                text-align: center;
                margin: 30px 0;
                padding: 20px;
                background: #f0f0f0;
                border-radius: 10px;
            }
            .social-links {
                margin: 15px 0;
            }
            .social-link {
                display: inline-block;
                margin: 0 10px;
                padding: 10px 20px;
                background: #ff4081;
                color: white;
                text-decoration: none;
                border-radius: 25px;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            .social-link:hover {
                background: #ff6b9d;
                transform: translateY(-2px);
            }
            .signature {
                text-align: right;
                margin-top: 30px;
                font-style: italic;
                color: #ff4081;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="title">🔐 BESTies Party</h1>
                <p class="subtitle">Скидання пароля</p>
            </div>

            <div class="greeting">
                Привіт, ${userName}! 👋
            </div>

            <div class="reset-box">
                <h2>Запит на скидання пароля</h2>
                <p>Ми отримали запит на скидання пароля для вашого акаунту BESTies Party</p>
                <a href="${resetUrl}" class="reset-button">
                    Скинути пароль
                </a>
            </div>

            <div class="warning">
                <h3>⚠️ Важливо:</h3>
                <ul>
                    <li>Це посилання дійсне протягом 1 години</li>
                    <li>Посилання можна використати тільки один раз</li>
                    <li>Якщо ви не запитували скидання пароля, проігноруйте це повідомлення</li>
                </ul>
            </div>

            <div class="contact-info">
                <h3>📱 Маєте питання?</h3>
                <p>Звертайтесь до нас у соціальних мережах!</p>
                <div class="social-links">
                    <a href="https://www.instagram.com/next.level.party.ua/" class="social-link" target="_blank">
                        📷 Instagram
                    </a>
                    <a href="https://t.me/nextlevel_party" class="social-link" target="_blank">
                        ✈️ Telegram
                    </a>
                </div>
            </div>

            <div class="signature">
                З любов'ю,<br>
                Your bestie 💕<br>
                BESTies Party Team
            </div>

            <div class="footer">
                <p><strong>⚠️ Це автоматично згенероване повідомлення</strong></p>
                <p>Будь ласка, не відповідайте на цей email. Для зв'язку використовуйте наші соціальні мережі вище.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

export const emailService = new EmailService();
