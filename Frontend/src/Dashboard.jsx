import React, { useState, useEffect } from "react";
import logo from "../images/морф.png";

export default function DashboardPage({ onNavigate }) {
  const [userLicense, setLicenseData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLicenseData = async () => {
      const token = localStorage.getItem("override_token");
      if (!token) {
        setError("No session token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/dashboard/license",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to synchronize license data");
        }

        const data = await response.json();
        setLicenseData(data); // Записываем реальные данные из Postgres
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenseData();
  }, []);

  const handleCopy = () => {
    if (userLicense?.licenseKey) {
      navigator.clipboard.writeText(userLicense.licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading || !userLicense) {
    return (
      <div className="min-h-screen bg-[#03020A] text-zinc-400 flex items-center justify-center font-mono text-xs">
        [CONNECTING] Synchronizing with secure node cluster...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[#03020A] text-red-400 flex flex-col items-center justify-center font-mono text-xs gap-4">
        <div>[ERROR] {error}</div>
        <button
          onClick={() => onNavigate("auth")}
          className="px-3 py-1 bg-white/5 border border-white/10 rounded text-white"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03020A] text-zinc-300 font-sans antialiased overflow-x-hidden relative p-6 md:p-12 pt-24">
      {/* Background Glows */}
      <div className="absolute top-[-30%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[130px] pointer-events-none" />

      {/* DASHBOARD HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#03020A]/40 backdrop-blur-xl border-b border-white/[0.04] px-6 md:px-12 py-4 flex justify-between items-center">
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2.5 font-bold text-white tracking-tight text-sm hover:opacity-80 transition-opacity cursor-pointer"
        >
          <img src={logo} alt="Morph AI" className="w-8 h-8 object-contain" />
          MORPH AI{" "}
          <span className="text-[10px] font-mono text-zinc-600 ml-1 font-normal">
            v1.0.4
          </span>
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-500 hidden sm:inline">
            Session: Secure TLS
          </span>
          <button
            onClick={() => onNavigate("landing")}
            className="px-3 py-1.5 bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white text-xs font-medium rounded-lg border border-white/[0.05] transition-all"
          >
            Disconnect
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* WELCOME BANNER & METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Status */}
          <div className="md:col-span-2 p-6 bg-white/[0.01] border border-white/[0.04] backdrop-blur-md rounded-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-400 font-mono">
                ● AGENT CLOUD LINK ESTABLISHED
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight pt-1">
                Welcome back, Agent Operator
              </h1>
              <p className="text-xs text-zinc-500">
                Your background worker is synchronized. Applications are being
                processed globally.
              </p>
            </div>

            {/* ИНТЕГРАЦИЯ С ДЕСКТОПОМ: Выдача секретного API Ключа */}
            <div className="bg-black/40 border border-white/[0.03] rounded-xl p-4 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                Your Desktop License Key (Secret API Token)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={
                    userLicense && userLicense.licenseKey
                      ? userLicense.licenseKey
                      : "[LOADING_ERROR]"
                  }
                  className="w-full bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2 text-xs font-mono text-indigo-300 outline-none select-all tracking-wide"
                />
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                    copied
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-white text-black hover:bg-zinc-200 border-transparent"
                  }`}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-[10px] text-zinc-600 leading-relaxed">
                * Paste this token inside your desktop app console setup prompt
                to authorize local network nodes.
              </p>
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="p-6 bg-gradient-to-b from-blue-950/10 to-transparent border border-blue-500/20 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
                  License Status
                </div>
                <div className="text-lg font-bold text-white tracking-tight">
                  {userLicense.tier}
                </div>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium font-mono">
                Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-white/[0.04] pt-4">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase">
                  Applied Today
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {userLicense.appliedToday}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase">
                  Daily Capacity
                </div>
                <div className="text-xl font-bold text-white font-mono bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  {userLicense.dailyLimit}
                </div>
              </div>
            </div>

            <div className="text-xs text-zinc-500 font-mono bg-white/[0.02] p-2 rounded-lg text-center border border-white/[0.03]">
              Cycle reset:{" "}
              <span className="text-zinc-300">{userLicense.expiresIn}</span>
            </div>
          </div>
        </div>

        {/* ARTIFACT DOWNLOAD & DEPLOYMENT INSTRUCTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Download Box */}
          <div className="p-6 bg-white/[0.01] border border-white/[0.04] backdrop-blur-md rounded-2xl space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider font-mono">
                Binary Build Distribution
              </div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Download Client Artifact
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Get the lightweight background service runtime engine optimized
                for target network deployment.
              </p>
            </div>

            <div className="space-y-2 pt-4">
              <a
                href="#download-win"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Downloading morph_ai_agent_v1.0.4.exe (Simulated)");
                }}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs rounded-xl border border-white/[0.05] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>🪟</span> Download for Windows (.exe)
              </a>
              <a
                href="#download-mac"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Downloading morph_ai_agent_v1.0.4.dmg (Simulated)");
                }}
                className="w-full py-2.5 bg-white/[0.02] hover:bg-white/[0.05] text-zinc-400 hover:text-white font-medium text-xs rounded-xl border border-white/[0.04] transition-all flex items-center justify-center gap-2"
              >
                <span>🍏</span> Download for macOS (.dmg)
              </a>
            </div>
          </div>

          {/* Quick Guide Steps */}
          <div className="md:col-span-2 p-6 bg-white/[0.01] border border-white/[0.04] backdrop-blur-md rounded-2xl space-y-4">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
              Quick Deployment Protocol
            </div>
            <h3 className="text-base font-semibold text-white tracking-tight">
              3-Step Node Initialization
            </h3>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-5 h-5 rounded-md bg-zinc-900 border border-white/[0.06] flex items-center justify-center text-[10px] font-mono font-bold text-zinc-400 shrink-0">
                  01
                </div>
                <p className="text-zinc-500 leading-normal">
                  Extract the downloaded zip bundle file and run the binary
                  script client executable natively on your system.
                </p>
              </div>
              <div className="flex items-start gap-3 text-xs">
                <div className="w-5 h-5 rounded-md bg-zinc-900 border border-white/[0.06] flex items-center justify-center text-[10px] font-mono font-bold text-zinc-400 shrink-0">
                  02
                </div>
                <p className="text-zinc-500 leading-normal">
                  When prompted by the terminal UI interface, insert your unique{" "}
                  <span className="text-blue-400 font-mono">
                    Secret License Key
                  </span>{" "}
                  from this dashboard view.
                </p>
              </div>
              <div className="flex items-start gap-3 text-xs">
                <div className="w-5 h-5 rounded-md bg-zinc-900 border border-white/[0.06] flex items-center justify-center text-[10px] font-mono font-bold text-zinc-400 shrink-0">
                  03
                </div>
                <p className="text-zinc-500 leading-normal">
                  Minimize the background console wrapper thread. The autonomous
                  model will start intercepting matching career profiles
                  automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
