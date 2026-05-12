import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function CopyProfileLink() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

const profileUrl = `${window.location.origin}/u/${user?.username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
    } catch {
      const el = document.createElement("textarea");
      el.value = profileUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user?.username) return null;

  return (
    <>
      <style>{STYLES}</style>
      <div className="copy-profile-wrapper">
        <span className="copy-profile-url">{profileUrl}</span>

        <button
          className={`copy-profile-btn ${copied ? "copied" : ""}`}
          onClick={handleCopy}
          title="Copy public profile link"
        >
          {copied ? (
            <>
              <CheckIcon />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon />
              Copy link
            </>
          )}
        </button>

        <Link
          className="view-profile-link"
          to={`/u/${user.username}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View ↗
        </Link>
      </div>
    </>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const STYLES = `
  .copy-profile-wrapper {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #111118;
    border: 1px solid #1f1f35;
    border-radius: 10px;
    padding: 8px 14px;
  }
  .copy-profile-url {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #4b5563;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 240px;
  }
  .copy-profile-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(99,102,241,.12);
    border: 1px solid rgba(99,102,241,.25);
    color: #818cf8;
    border-radius: 7px;
    padding: 5px 11px;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    cursor: pointer;
    transition: background .15s, color .15s, border-color .15s;
    white-space: nowrap;
  }
  .copy-profile-btn:hover {
    background: rgba(99,102,241,.22);
    color: #a5b4fc;
  }
  .copy-profile-btn.copied {
    background: rgba(16,185,129,.12);
    border-color: rgba(16,185,129,.25);
    color: #34d399;
  }
  .view-profile-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #4b5563;
    text-decoration: none;
    transition: color .15s;
    white-space: nowrap;
  }
  .view-profile-link:hover { color: #818cf8; }

  @media (max-width: 480px) {
    .copy-profile-url { display: none; }
  }
`;