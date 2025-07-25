import React, { useState, useEffect } from "react";
import saltclock from "../images/téléchargement.gif";
import Loader from "./Loader";

const ComingSoon = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => setProgress(progress + 1), 40);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 24,
        textAlign: "center",
      }}
    >
      <div >
                      <Loader/>
                    </div>

      {/* <div style={{ fontSize: 32, marginBottom: 8 }}>👍</div> */}
      <div style={{ color: "#888", fontWeight: 500, letterSpacing: 2, fontSize: 14, marginBottom: 8, fontFamily: 'inherit' }}>
        WE'RE STILL
      </div>
      <h1 style={{ color: "#014268", fontWeight: 800, fontSize: 36, margin: "0 0 12px 0", fontFamily: 'inherit' }}>
        Cooking Our Website.
      </h1>
      <div style={{ color: "#555", fontSize: 18, marginBottom: 24, fontFamily: 'inherit' }}>
        We are going to launch our website Very Soon.<br />
        Stay Tuned.
      </div>
      {/* <button
        style={{
          background: "#111827",
          color: "#fff",
          border: "none",
          borderRadius: 24,
          padding: "12px 32px",
          fontSize: 18,
          fontWeight: 600,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: 24,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: 'inherit',
        }}
      >
        <span role="img" aria-label="mail">📧</span> Notify Me
      </button> */}
      {/* Progress bar */}
      <div style={{ width: "80%", maxWidth: 400, margin: "0 auto", marginTop: 8 }}>
        <div
          style={{
            height: 8,
            background: "#e5e7eb",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              // background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
              background: "linear-gradient(90deg, #014268 0%, #f59e0b 100%)",
              transition: "width 0.3s",
            }}
          />
        </div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 4, fontFamily: 'inherit' }}>
          {progress < 100 ? `Progress: ${progress}%` : "Almost ready!"}
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
