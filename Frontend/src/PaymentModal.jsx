import React, { useState } from "react";

export default function PaymentModal({ isOpen, onClose, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    try {
      // Здесь будет интеграция с реальным платежным провайдером
      // Пока симулируем процесс оплаты
      const token = localStorage.getItem("override_token");

      const response = await fetch("http://localhost:8080/payment/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tier: "PRO",
          paymentMethod: paymentMethod,
          amount: 30,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment processing failed");
      }

      const data = await response.json();

      // В реальной реализации здесь будет редирект на платежный шлюз
      // Для демо - просто показываем успех через 2 секунды
      setTimeout(() => {
        if (onPaymentSuccess) {
          onPaymentSuccess(data);
        }
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#03020A] border border-white/[0.08] rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.02] hover:bg-white/[0.06] text-zinc-500 hover:text-white transition-all"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold text-lg mb-2 shadow-lg shadow-blue-900/20">
            Ω
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Upgrade to Pro Unlimited
          </h2>
          <p className="text-sm text-zinc-500">
            Unlock unlimited applications and advanced features
          </p>
        </div>

        {/* Price Display */}
        <div className="p-6 bg-gradient-to-b from-blue-950/20 to-transparent border border-blue-500/20 rounded-xl text-center space-y-2">
          <div className="text-5xl font-bold text-blue-400 font-mono">$30</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider">
            Per Month / Cancel Anytime
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-xs text-red-400 text-center font-medium">
            {error}
          </div>
        )}

        {/* Payment Method Selection */}
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Select Payment Method
            </label>

            <div className="space-y-2">
              {/* Stripe Option */}
              <label className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/30 rounded-xl cursor-pointer transition-all">
                <input
                  type="radio"
                  name="payment"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 accent-blue-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white">
                    Credit Card (Stripe)
                  </div>
                  <div className="text-xs text-zinc-500">
                    Visa, Mastercard, Amex
                  </div>
                </div>
                <div className="text-xs font-mono text-zinc-600">💳</div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-900/50 text-zinc-400 font-medium text-sm rounded-xl border border-white/[0.06] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-950/30"
            >
              {isProcessing ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="pt-4 border-t border-white/[0.04] text-center">
          <p className="text-[10px] text-zinc-600 leading-relaxed">
            🔒 Secure SSL encrypted payment processing
            <br />
            All transactions are protected and PCI DSS compliant
          </p>
        </div>
      </div>
    </div>
  );
}
