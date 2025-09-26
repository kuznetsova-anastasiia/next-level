"use client";

import { useState } from "react";
import styles from "./email-debug.module.scss";

export default function EmailDebug() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testEmail = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/test-email");
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        error: "Failed to test email service",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Email Service Debug</h1>
        <p className={styles.subtitle}>
          This page helps debug email sending issues in production.
        </p>

        <button
          onClick={testEmail}
          disabled={loading}
          className={styles.button}
        >
          {loading ? "Testing..." : "Test Email Service"}
        </button>

        {result && (
          <div className={styles.result}>
            <h3>Test Results:</h3>
            <pre className={styles.code}>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        <div className={styles.instructions}>
          <h3>Common Issues:</h3>
          <ul>
            <li>
              <strong>Environment Variables:</strong> Make sure SMTP_HOST,
              SMTP_PORT, SMTP_USER, and SMTP_PASS are set in Vercel
            </li>
            <li>
              <strong>Gmail:</strong> Use App Password, not regular password
            </li>
            <li>
              <strong>Port:</strong> Use 587 for TLS, 465 for SSL
            </li>
            <li>
              <strong>Security:</strong> Set SMTP_SECURE=false for port 587,
              true for port 465
            </li>
          </ul>

          <h3>Environment Variables Needed:</h3>
          <div className={styles.envVars}>
            <code>SMTP_HOST=smtp.gmail.com</code>
            <code>SMTP_PORT=587</code>
            <code>SMTP_SECURE=false</code>
            <code>SMTP_USER=your-email@gmail.com</code>
            <code>SMTP_PASS=your-app-password</code>
          </div>
        </div>
      </div>
    </main>
  );
}
