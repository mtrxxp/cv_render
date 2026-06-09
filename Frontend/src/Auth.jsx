import React, { useState, useEffect } from "react";
import * as FingerprintJS from "@fingerprintjs/fingerprintjs";
import logo from "../images/морф.png";

// Чёрный список доменов временных/одноразовых почт (Disposable Email Blocklist)
const BANNED_DOMAINS = [
  "tempmail.com",
  "10minutemail.com",
  "sharklasers.com",
  "guerrillamail.com",
  "mailinator.com",
  "yopmail.com",
  "dispostable.com",
  "getairmail.com",
  "trashmail.com",
  "maildrop.cc",
  "throwaway.email",
  "getnada.com",
  "temp-mail.org",
  "fakeinbox.com",
  "mintemail.com",
  "mohmal.com",
  "emailondeck.com",
  "throwawaymail.com",
  "tempinbox.com",
  "mytemp.email",
  "tempmailer.com",
  "fakemail.net",
  "disposablemail.com",
  "burnermail.io",
  "tempr.email",
  "mailnesia.com",
  "spamgourmet.com",
  "inboxkitten.com",
  "crazymailing.com",
  "mailexpire.com",
  "tempail.com",
  "tmpmail.net",
  "anonymousemail.me",
  "emailsensei.com",
  "fakeemailgenerator.com",
  "inboxbear.com",
  "discard.email",
  "fakermail.com",
  "temp-mail.io",
  "temp-mails.com",
  "tmailor.com",
  "incognitomail.com",
];

export default function AuthPage({ onNavigate, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visitorId, setVisitorId] = useState("Analyzing hardware...");

  // Состояния для валидации и UI
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Инициализация FingerprintJS при монтировании страницы
  useEffect(() => {
    let isMounted = true;

    async function initFingerprint() {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        if (isMounted) {
          setVisitorId(result.visitorId);
        }
      } catch (err) {
        console.warn(
          "FingerprintJS blocked or failed. Rolling back to native canvas hash synthesis.",
          err,
        );
        // Фоллбек: Симулируем генерацию хэша на основе доступных параметров железа
        if (isMounted) {
          const hardwareString = `${navigator.userAgent}-${navigator.hardwareConcurrency}-${screen.colorDepth}-${screen.width}x${screen.height}`;
          // Простейший быстрый хэшер строки в hex
          let hash = 0;
          for (let i = 0; i < hardwareString.length; i++) {
            hash = (hash << 5) - hash + hardwareString.charCodeAt(i);
            hash |= 0;
          }
          setVisitorId(`fp_fallback_${Math.abs(hash).toString(16)}`);
        }
      }
    }

    initFingerprint();
    return () => {
      isMounted = false;
    };
  }, []);

  // Основной обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(false);

    // 1. Валидация на временные почты
    const emailDomain = email.split("@")[1]?.toLowerCase();
    if (BANNED_DOMAINS.includes(emailDomain)) {
      setError(
        "Registration denied. Disposable email addresses are prohibited.",
      );
      return;
    }

    setIsLoading(true);

    try {
      // 2. Реальный POST-запрос к нашему Spring Boot контроллеру
      const endpoint = isSignUp ? "register" : "login";

      const response = await fetch(`http://localhost:8080/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          deviceFingerprint: visitorId, // Для логина бэкенд проигнорирует, но передать можно
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (!isSignUp && data.message) {
        localStorage.setItem("override_token", data.message);
      }

      // 3. В случае успеха передаем данные наверх и роутим в Dashboard
      if (onAuthSuccess) {
        onAuthSuccess(data);
      }
    } catch (err) {
      // Выводим ошибку бэкенда в нашу красную плашку на форме
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#03020A] text-zinc-300 font-sans antialiased flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Aurora Glow Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Кнопка "Назад на Главную" */}
      <button
        onClick={() => onNavigate("landing")}
        className="absolute top-6 left-6 text-xs font-semibold text-zinc-500 hover:text-blue-400 transition-colors flex items-center gap-1.5 z-20"
      >
        ← Back to home
      </button>

      {/* Карточка авторизации */}
      <div className="relative z-10 w-full max-w-md bg-white/[0.01] border border-white/[0.04] backdrop-blur-xl rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Хедер формы */}
        <div className="text-center space-y-1.5">
          <img src={logo} alt="Morph AI" className="w-10 h-10 mx-auto mb-2 object-contain" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            {isSignUp ? "Create your license" : "Access your console"}
          </h2>
          <p className="text-xs text-zinc-500">
            {isSignUp
              ? "Get your 30-day trial token key"
              : "Enter your credentials to manage your agent"}
          </p>
        </div>

        {/* Вывод ошибок валидации */}
        {error && (
          <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-xs text-red-400 text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Email Address
            </label>
            <input
              type="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.05] focus:border-blue-500/50 focus:bg-white/[0.04] rounded-xl text-sm text-white placeholder-zinc-600 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Secret Token (Password)
            </label>
            <input
              type="password"
              required
              disabled={isLoading}
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.05] focus:border-blue-500/50 focus:bg-white/[0.04] rounded-xl text-sm text-white placeholder-zinc-600 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-2 flex items-center justify-center"
          >
            {isLoading
              ? "Processing Pipeline..."
              : isSignUp
                ? "Generate Trial"
                : "Establish Connection"}
          </button>
        </form>

        {/* Переключатель Логин / Регистрация */}
        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-xs text-zinc-500 hover:text-blue-400 transition-colors"
          >
            {isSignUp
              ? "Already have a license? Sign In"
              : "Don't have a license? Claim free trial"}
          </button>
        </div>

        <hr className="border-white/[0.04]" />

        {/* ТЕХНИЧЕСКИЙ ИНДИКАТОР: Вывод отпечатка (Фишка против фрода) */}
        <div className="bg-black/30 rounded-xl p-3 border border-white/[0.02] flex items-center justify-between text-[10px] font-mono">
          <span className="text-zinc-600 uppercase tracking-wider">
            Device Fingerprint:
          </span>
          <span
            className="text-blue-400/80 truncate max-w-[180px]"
            title={visitorId}
          >
            {visitorId}
          </span>
        </div>
      </div>
    </div>
  );
}
