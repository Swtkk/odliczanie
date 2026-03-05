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
  // Ustaw cel: 1 kwietnia (tu wpisane 2026, możesz zmienić rok)
  const targetDate = useMemo(() => new Date("2026-04-01T00:00:00"), []);

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

  const spawnHearts = () => {
    // Odpal animację na ~4 sekundy
    setHeartsOn(true);
    window.setTimeout(() => setHeartsOn(false), 4200);

    // (Opcjonalnie) delikatny „rumble” przy kliknięciu na mobile:
    if (navigator.vibrate) navigator.vibrate(30);
  };

  return (
      <main className="page">
        {/* tło */}
        <div className="bgGlow" aria-hidden="true" />
        <div className="bgNoise" aria-hidden="true" />

        {/* serduszka */}
        {heartsOn && <HeartsRain />}

        <section className="card">
          <div className="hero">

            <div className="imageWrap">
              <img
                  src="/arek.jpg"
                  alt="Moje zdjęcie"
                  className="heroImg"
              />
              <div className="imageOverlay"/>
            </div>

            <div className="heroText">
              <p className="badge">Odliczanie</p>
              <h1 className="title">Arek czekamy...</h1>

              <p className="sub">
                Dziś jest <span className="subStrong">{today}</span>
              </p>

              <div className="countdown">
                <TimeBox label="Dni" value={String(timeLeft.days)}/>
                <TimeBox label="Godz" value={pad(timeLeft.hours)}/>
                <TimeBox label="Min" value={pad(timeLeft.minutes)}/>
                <TimeBox label="Sek" value={pad(timeLeft.seconds)}/>
              </div>

              <div className="actions">
                <button className="btn" onClick={spawnHearts}>
                  💖 Puść serduszka dla Arka
                </button>
              </div>
            </div>

          </div>

          <footer className="footer">
            <span>✨ Miłego dnia</span>
          </footer>
        </section>
      </main>
  );
}

function TimeBox({label, value}: { label: string; value: string }) {
  return (
      <div className="timeBox">
        <div className="timeValue">{value}</div>
        <div className="timeLabel">{label}</div>
      </div>
  );
}

function HeartsRain() {
  // generujemy np. 36 serduszek z losowymi parametrami
  const hearts = useMemo(() => {
    const count = 36;
    return Array.from({length: count}).map((_, i) => {
      const left = Math.random() * 100; // %
      const delay = Math.random() * 0.6; // s
      const duration = 2.8 + Math.random() * 1.6; // s
      const size = 14 + Math.random() * 22; // px
      const drift = (Math.random() * 2 - 1) * 80; // px
      const opacity = 0.55 + Math.random() * 0.4;

      const emoji = Math.random() < 0.85 ? "💗" : "💖";

      return {id: i, left, delay, duration, size, drift, opacity, emoji };
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
                  // przekazujemy drift jako CSS variable:
                  ["--drift" as any]: `${h.drift}px`,
                }}
            >
          {h.emoji}
        </span>
        ))}
      </div>
  );
}