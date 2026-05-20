import React, { useState } from "react";

export default function LandingPage({ onNavigate }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [manualHours, setManualHours] = useState(10); // Часы для калькулятора

  // Вычисляем сэкономленные часы и отправленные отклики (фишка)
  const savedTime = Math.round(manualHours * 4.2);
  const autoApplications = manualHours * 15;

  const faqData = [
    {
      q: "Does it require a high-end computer?",
      a: "No. The AI agent operates efficiently in the background with a minimal footprint, consuming fewer resources than a standard Google Chrome tab.",
    },
    {
      q: "Is it safe for my LinkedIn or job board accounts?",
      a: "Completely. The software simulates human-like mouse movements, contextual typing delays, and utilizes premium residential proxies to ensure organic activity.",
    },
    {
      q: "How does the subscription cancellation work?",
      a: "You can cancel your subscription instantly with a single click inside your dashboard. No hidden fees, no questions asked.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#03020A] text-zinc-400 font-sans selection:bg-indigo-500 selection:text-white antialiased overflow-x-hidden relative">
      {/* Aurora Glow Effects (Новая мягкая палитра) */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[15%] right-[-10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[60%] left-[-20%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#03020A]/40 backdrop-blur-xl border-b border-white/[0.04] px-6 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2.5 font-bold text-white tracking-tight text-sm">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-[10px] text-white">
            Ω
          </div>
          OVERRIDE
        </div>
        <nav className="hidden md:flex items-center gap-10 text-xs font-medium tracking-wide text-zinc-500">
          <a
            href="#calculator"
            className="hover:text-blue-400 transition-colors"
          >
            ROI Calculator
          </a>
          <a href="#features" className="hover:text-blue-400 transition-colors">
            Workflow
          </a>
          <a href="#pricing" className="hover:text-blue-400 transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-blue-400 transition-colors">
            FAQ
          </a>
        </nav>
        <div>
          <button
            onClick={() => onNavigate("auth")}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-900/30 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Access Console
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-32 text-center">
        {/* Futuristic Dot Matrix Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/[0.06] rounded-full text-xs text-indigo-300 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />{" "}
            Next-Gen Job Search Automation
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Outsmart the Job Market.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Deploy Your AI Agent.
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400/80 leading-relaxed">
            Skip the endless forms. Our desktop client targets vacancies,
            rewrites your resume vectors for perfect corporate ATS matching, and
            submits tailored applications while you rest.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => onNavigate("auth")}
              className="w-full sm:w-auto bg-white hover:bg-zinc-100 text-black font-semibold text-sm px-8 py-3.5 rounded-xl transition-all shadow-xl"
            >
              Claim Free License
            </button>
            <a
              href="#calculator"
              className="w-full sm:w-auto text-xs font-semibold text-zinc-400 hover:text-blue-400 transition-colors py-3 flex items-center justify-center gap-1.5"
            >
              Calculate your saved time →
            </a>
          </div>
        </div>
      </section>

      {/* NEW FEATURE: INTERACTIVE ROI CALCULATOR */}
      <section
        id="calculator"
        className="py-24 px-6 relative z-10 max-w-4xl mx-auto border-t border-white/[0.04]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white/[0.01] border border-white/[0.04] backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl">
          <div className="space-y-4 text-left">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Interactive Metric
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              See how much time you waste
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Adjust the slider to match your current manual job hunting
              routine. Let the numbers prove why automated search is the
              standard.
            </p>

            <div className="pt-6 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-zinc-300">
                <span>Manual search per week:</span>
                <span className="text-blue-400 font-mono text-sm">
                  {manualHours} Hours
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                value={manualHours}
                onChange={(e) => setManualHours(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/[0.02] border border-white/[0.04] rounded-2xl text-left space-y-1">
              <div className="text-2xl font-bold text-white font-mono bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                +{autoApplications}
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Auto Applications / mo
              </div>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/[0.04] rounded-2xl text-left space-y-1">
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                ~{savedTime}h
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Hours Saved / mo
              </div>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/[0.04] rounded-2xl text-left space-y-1 col-span-2 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">
                  ATS Bypass Rate
                </div>
                <div className="text-[10px] text-zinc-500">
                  Based on v1.0 core metrics
                </div>
              </div>
              <div className="text-xl font-bold font-mono text-purple-400">
                94.2%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW (FEATURES) */}
      <section
        id="features"
        className="py-24 px-6 max-w-5xl mx-auto text-center flex flex-col items-center justify-center border-t border-white/[0.04]"
      >
        <div className="space-y-2 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Architecture
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            The Autopilot Framework
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="p-8 border border-white/[0.03] bg-white/[0.01] rounded-2xl space-y-4 text-left hover:border-blue-500/20 transition-all duration-300">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
              1
            </div>
            <h3 className="text-white font-semibold text-base">Core Setup</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Launch the compact desktop agent on your workstation and
              authenticate instantly using your dashboard license key.
            </p>
          </div>
          <div className="p-8 border border-white/[0.03] bg-white/[0.01] rounded-2xl space-y-4 text-left hover:border-indigo-500/20 transition-all duration-300">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
              2
            </div>
            <h3 className="text-white font-semibold text-base">
              Vector Learning
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Drop your base resume. The embedded model builds a localized
              semantic matrix of your skill trees in seconds.
            </p>
          </div>
          <div className="p-8 border border-white/[0.03] bg-white/[0.01] rounded-2xl space-y-4 text-left hover:border-purple-500/20 transition-all duration-300">
            <div className="w-8 h-8 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">
              3
            </div>
            <h3 className="text-white font-semibold text-base">
              Continuous Push
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              The agent runs silently, applying contextual vocabulary matching
              rules to score maximum relevance on enterprise filters.
            </p>
          </div>
        </div>
      </section>

      {/* COMPATIBILITY BLOCK */}
      <section className="py-24 border-y border-white/[0.04] bg-white/[0.01] text-center flex flex-col items-center justify-center">
        <div className="max-w-2xl mx-auto space-y-4 px-6 text-center flex flex-col items-center">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 w-full text-center">
            Compatibility
          </h2>
          <p className="text-xl md:text-3xl font-bold text-white tracking-tight w-full text-center">
            Optimized for Enterprise Pipelines
          </p>
          <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed text-center">
            Corporate ATS filters drop up to 90% of job requests organically.
            Our stack transforms data layout patterns to guarantee optimal
            delivery indexing.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 opacity-25 font-semibold text-[11px] tracking-widest text-zinc-400 select-none w-full text-center">
            <span>WORKDAY</span>
            <span>GREENHOUSE</span>
            <span>LEVER</span>
            <span>TALEO</span>
            <span>iCIMS</span>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28 px-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Licensing Plan
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Flexible tiers for all candidates
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* FREE TRIAL */}
          <div className="border border-white/[0.04] bg-white/[0.01] rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:border-white/[0.08]">
            <div className="space-y-4 text-left">
              <div className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                Evaluation
              </div>
              <h3 className="text-lg font-bold text-white">Free Trial</h3>
              <div className="text-3xl font-bold text-white font-mono">
                $0{" "}
                <span className="text-xs font-normal text-zinc-600 font-sans">
                  / 30 days
                </span>
              </div>
              <hr className="border-white/[0.04]" />
              <ul className="space-y-3 text-xs text-zinc-500">
                <li className="flex items-center gap-2">
                  <span>•</span> 50 applications per day limit
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span> Contextual email draft logic
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span> Basic platforms deployment
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate("auth")}
              className="w-full mt-8 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs py-3 rounded-xl border border-white/[0.06] transition-colors"
            >
              Start Free Trial
            </button>
          </div>

          {/* PRO UNLIMITED */}
          <div className="border border-blue-500/30 bg-gradient-to-b from-blue-950/10 to-transparent rounded-2xl p-8 flex flex-col justify-between relative transition-all duration-300 shadow-xl shadow-blue-950/20 hover:border-blue-500/50">
            <div className="space-y-4 text-left">
              <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider font-mono">
                Unrestricted Access
              </div>
              <h3 className="text-lg font-bold text-white">Pro Unlimited</h3>
              <div className="text-3xl font-bold text-blue-400 font-mono">
                $15{" "}
                <span className="text-xs font-normal text-zinc-600 font-sans">
                  / month
                </span>
              </div>
              <hr className="border-white/[0.04]" />
              <ul className="space-y-3 text-xs text-zinc-400">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">•</span> Unlimited target
                  entries 24/7
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">•</span> Full multi-layered
                  ATS adaptation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">•</span> Local LLM integration
                  (Ollama support)
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate("auth")}
              className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs py-3 rounded-xl transition-colors shadow-md shadow-blue-950"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 px-6 max-w-2xl mx-auto">
        <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-white/[0.04] bg-white/[0.01] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-5 flex justify-between items-center text-left text-sm font-medium text-white hover:text-blue-400 transition-colors"
              >
                <span>{item.q}</span>
                <span className="text-xs text-zinc-600">
                  {openFaq === index ? "▲" : "▼"}
                </span>
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-xs text-zinc-500 leading-relaxed border-t border-white/[0.02] pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.04] bg-[#03020A] py-12 px-6 text-center text-[11px] text-zinc-600 space-y-1">
        <div>&copy; 2026 OVERRIDE Systems. All rights reserved.</div>
        <div className="text-zinc-700 text-[10px]">
          Automated toolsets for systemic career placement.
        </div>
      </footer>
    </div>
  );
}
