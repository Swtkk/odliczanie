"use client";

import { useEffect, useMemo, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function Home() {
  // Cel: 1 kwietnia (zmień rok jak chcesz)
  const targetDate = useMemo(() => new Date("2026-04-01T00:00:00"), []);
  const [testVideo, setTestVideo] = useState(false);
  // TU WKLEJ SWÓJ LINK (EMBED)
  // przykład: https://www.youtube.com/embed/dQw4w9WgXc?autoplay=1&mute=1
  const VIDEO_EMBED_URL =
      "https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1&rel=0";

  const [today, setToday] = useState("");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    done: false,
  });

  const [heartsOn, setHeartsOn] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      const done = diff <= 0;
      const safe = Math.max(diff, 0);

      const days = Math.floor(safe / (1000 * 60 * 60 * 24));
      const hours = Math.floor((safe / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((safe / (1000 * 60)) % 60);
      const seconds = Math.floor((safe / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, done });

      setToday(
          now.toLocaleDateString("pl-PL", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
      );
    };

    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  // Opcjonalnie: automatycznie serduszka po wybiciu daty (raz)
  useEffect(() => {
    if (!timeLeft.done) return;

    // odpal na chwilę, jak już wybije
    setHeartsOn(true);
    const t = window.setTimeout(() => setHeartsOn(false), 4200);
    return () => window.clearTimeout(t);
  }, [timeLeft.done]);

  const spawnHearts = () => {
    setHeartsOn(true);
    window.setTimeout(() => setHeartsOn(false), 4200);
    if (navigator.vibrate) navigator.vibrate(30);
  };

  return (
      <main className="page">
        <div className="bgGlow" aria-hidden="true" />
        <div className="bgNoise" aria-hidden="true" />

        {heartsOn && <HeartsRain />}

        <section className="card">
          <div className="hero">
            <div className="imageWrap">
              {timeLeft.done || testVideo ? (
                  <video
                      className="heroVideo"
                      src="/techno.mp4"
                      autoPlay
                      controls
                  />
              ) : (
                  <>
                    <img src="/arek.jpg" alt="Moje zdjęcie" className="heroImg" />
                    <div className="imageOverlay" />
                  </>
              )}
            </div>

            <div className="heroText">
              <p className="badge">Odliczanie</p>
              <h1 className="title">Do 1 kwietnia</h1>

              <p className="sub">
                Dziś jest <span className="subStrong">{today}</span>
              </p>

              {timeLeft.done ? (
                  <div className="doneBox">🎉 To już dziś! Miłej zabawy 😄</div>
              ) : (
                  <div className="countdown">
                    <TimeBox label="Dni" value={String(timeLeft.days)}/>
                    <TimeBox label="Godz" value={pad(timeLeft.hours)}/>
                    <TimeBox label="Min" value={pad(timeLeft.minutes)}/>
                    <TimeBox label="Sek" value={pad(timeLeft.seconds)}/>
                  </div>
              )}

              {!timeLeft.done && (
                  <div className="actions">
                    <button className="btn" onClick={spawnHearts}>
                      💙 Puść serduszka
                    </button>
                    <button
                        className="btn"
                        onClick={() => setTestVideo(true)}
                        style={{marginLeft: "10px"}}
                    >
                      🎬 Test filmu
                    </button>
                  </div>

              )}

            </div>
          </div>

          <footer className="footer">
            <span>✨ Miłego dnia</span>
            <span className="dot">•</span>
            <span>⏳ Odliczanie aktualizuje się co sekundę</span>
          </footer>
        </section>
      </main>
  );
}

function TimeBox({ label, value }: { label: string; value: string }) {
  return (
      <div className="timeBox">
        <div className="timeValue">{value}</div>
        <div className="timeLabel">{label}</div>
      </div>
  );
}

function HeartsRain() {
  const hearts = useMemo(() => {
    const count = 36;
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100;
      const delay = Math.random() * 0.6;
      const duration = 2.8 + Math.random() * 1.6;
      const size = 14 + Math.random() * 22;
      const drift = (Math.random() * 2 - 1) * 80;
      const opacity = 0.55 + Math.random() * 0.4;
      const emoji = Math.random() < 0.85 ? "💗" : "💖";
      return { id: i, left, delay, duration, size, drift, opacity, emoji };
    });
  }, []);

  return (
      <div className="heartsLayer" aria-hidden="true">
        {hearts.map((h) => (
            <span
                key={h.id}
                className="heart"
                style={{
                  left: `${h.left}%`,
                  animationDelay: `${h.delay}s`,
                  animationDuration: `${h.duration}s`,
                  fontSize: `${h.size}px`,
                  opacity: h.opacity,
                  ["--drift" as any]: `${h.drift}px`,
                }}
            >
          {h.emoji}
        </span>
        ))}
      </div>
  );
}