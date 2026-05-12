import { useState, useEffect } from "react";

/**
 * ErrorBanner — a top-of-screen dismissible error strip.
 * No libraries. Import and call showError() from anywhere via the hook.
 *
 * Usage:
 *   const { ErrorBanner, showError } = useErrorBanner();
 *   ...
 *   showError("Something went wrong");
 *   ...
 *   <ErrorBanner />
 */
export function useErrorBanner() {
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [timer, setTimer] = useState(null);

  const showError = (msg) => {
    if (timer) clearTimeout(timer);
    setMessage(msg);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 5000);
    setTimer(t);
  };

  const dismiss = () => {
    setVisible(false);
    if (timer) clearTimeout(timer);
  };

  useEffect(() => () => { if (timer) clearTimeout(timer); }, [timer]);

  function ErrorBanner() {
    if (!message) return null;
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          transform: visible ? "translateY(0)" : "translateY(-110%)",
          transition: "transform .3s cubic-bezier(.4,0,.2,1)",
          background: "#1a0a0a",
          borderBottom: "1px solid #7f1d1d",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#ef4444", fontSize: 14 }}>⚠</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: "#fca5a5",
            letterSpacing: ".02em",
          }}>
            {message}
          </span>
        </div>
        <button
          onClick={dismiss}
          style={{
            background: "none",
            border: "none",
            color: "#6b7280",
            cursor: "pointer",
            fontSize: 16,
            lineHeight: 1,
            padding: "0 4px",
          }}
        >
          ×
        </button>
      </div>
    );
  }

  return { ErrorBanner, showError };
}