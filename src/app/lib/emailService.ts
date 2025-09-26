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
}

export const emailService = new EmailService();
