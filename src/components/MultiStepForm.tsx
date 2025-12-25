"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, ChevronRight, Shield, Car, HeartPulse, TrendingDown, Sparkles, Loader2, Heart } from "lucide-react";
import clsx from "clsx";

const partners = [
  "/insurance/Allianz.svg",
  "/insurance/Basler_Versicherungen_logo.svg",
  "/insurance/Helvetia_(Versicherung)_logo.svg",
  "/insurance/Logo_smile.direct.svg",
  "/insurance/Schweizerische_Mobiliar_logo.svg",
  "/insurance/Vaudoise_Logo.svg",
];

function SimpliLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <text x="60" y="30" textAnchor="middle" fontFamily="sans-serif" fontSize="32" fontWeight="800" fill="currentColor" letterSpacing="-1">simpli.</text>
    </svg>
  );
}

type FormData = {
  insuranceType: string;
  amount: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  policyNumber: string;
  currentInsurance: string;
};

export default function MultiStepForm() {
  const t = useTranslations("Index");
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    insuranceType: "",
    amount: "",
    birthYear: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    policyNumber: "",
    currentInsurance: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (step === 4 && isCalculating) {
      const timer = setTimeout(() => {
        setIsCalculating(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, isCalculating]);

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 3) {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = t("errors.amount");
        isValid = false;
      }
      const currentYear = new Date().getFullYear();
      const birthYear = parseInt(formData.birthYear);
      if (!formData.birthYear || birthYear < 1900 || birthYear > currentYear) {
        newErrors.birthYear = t("errors.birthYear");
        isValid = false;
      }
    }

    if (currentStep === 5) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = t("errors.firstName");
        isValid = false;
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = t("errors.lastName");
        isValid = false;
      }
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        newErrors.email = t("errors.email");
        isValid = false;
      }
      // Basic Swiss phone validation (e.g., 079 123 45 67 or +41 79 123 45 67)
      // Removes spaces and checks for length and prefix
      const cleanPhone = formData.phone.replace(/\s/g, "");
      const isSwissMobile = /^(\+41|0041|0)(7[5-9])\d{7}$/.test(cleanPhone);
      
      if (!isSwissMobile) {
        newErrors.phone = t("errors.phone");
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    
    // Limit to 10 digits
    val = val.slice(0, 10);
    
    let formatted = val;
    if (val.length > 3) {
      formatted = val.slice(0, 3) + " " + val.slice(3);
    }
    if (val.length > 6) {
      formatted = formatted.slice(0, 7) + " " + formatted.slice(7);
    }
    if (val.length > 8) {
      formatted = formatted.slice(0, 10) + " " + formatted.slice(10);
    }
    
    updateData("phone", formatted);
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    
    if (step === 3) {
      setIsCalculating(true);
    }

    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const updateData = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const submitContact = async () => {
    if (!validateStep(step)) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      nextStep();
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      alert("Thank you!"); // Replace with better UI
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-md mx-auto h-[100dvh] overflow-hidden bg-white shadow-xl relative flex flex-col">
      <div className="w-full h-1 bg-gray-200 shrink-0">
        <div
          className="h-full bg-slate-900 transition-all duration-500"
          style={{ width: `${(step / 6) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-center py-6 shrink-0 bg-white z-10">
        <SimpliLogo className="h-10 w-auto text-gray-900" />
      </div>

      <div className="flex-1 relative w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full h-full flex flex-col p-6 overflow-y-auto"
          >
            {step === 1 && (
              <div className="flex flex-col h-full text-center">
                <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                  <Shield className="w-24 h-24 text-slate-900" />
                  <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
                  <button
                    onClick={nextStep}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    {t("checkNow")} <ChevronRight />
                  </button>
                </div>

                <div className="pt-8 pb-2 w-full overflow-hidden">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">{t("ourPartners")}</p>
                  <div className="w-full overflow-hidden relative">
                    <div className="flex items-center gap-8 animate-marquee w-max">
                      {[...partners, ...partners].map((src, i) => (
                        <div key={i} className="relative h-8 w-24 shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                          <Image src={src} alt="Partner" fill className="object-contain" />
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10"></div>
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10"></div>
                  </div>
                </div>
              </div>
            )}

          {step === 2 && (
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold mb-8 text-gray-900">{t("insuranceType")}</h2>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    updateData("insuranceType", "health");
                    nextStep();
                  }}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl flex items-center gap-4 hover:border-slate-900 hover:bg-slate-50 transition-all group"
                >
                  <HeartPulse className="w-8 h-8 text-gray-400 group-hover:text-slate-900" />
                  <span className="text-xl font-medium text-gray-700 group-hover:text-slate-900">
                    {t("healthInsurance")}
                  </span>
                </button>
                <button
                  onClick={() => {
                    updateData("insuranceType", "car");
                    nextStep();
                  }}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl flex items-center gap-4 hover:border-slate-900 hover:bg-slate-50 transition-all group"
                >
                  <Car className="w-8 h-8 text-gray-400 group-hover:text-slate-900" />
                  <span className="text-xl font-medium text-gray-700 group-hover:text-slate-900">
                    {t("carInsurance")}
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold mb-8 text-gray-900">{t("amountYear")}</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("amountYear")}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => updateData("amount", e.target.value)}
                      className={clsx(
                        "w-full p-4 border rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-lg text-slate-900 placeholder:text-gray-400",
                        errors.amount ? "border-red-500" : "border-gray-300"
                      )}
                      placeholder="1200"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">CHF</span>
                  </div>
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("birthYear")}
                  </label>
                  <input
                    type="number"
                    value={formData.birthYear}
                    onChange={(e) => updateData("birthYear", e.target.value)}
                    className={clsx(
                      "w-full p-4 border rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none text-lg text-slate-900 placeholder:text-gray-400",
                      errors.birthYear ? "border-red-500" : "border-gray-300"
                    )}
                    placeholder="1990"
                  />
                  {errors.birthYear && <p className="text-red-500 text-sm mt-1">{errors.birthYear}</p>}
                </div>
                <button
                  onClick={nextStep}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-slate-800 transition-colors"
                >
                  {t("checkNow")}
                </button>

                <div className="mt-8 relative">
                  <div className="bg-slate-50 p-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm relative">
                    <p className="text-gray-600 italic text-sm">"{t("testimonial")}"</p>
                    <div className="absolute -bottom-2 left-0 w-4 h-4 bg-slate-50 border-b border-l border-slate-100 transform rotate-45"></div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-sm">
                      SM
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-gray-900">{t("testimonialAuthor")}</p>
                      <div className="flex text-yellow-400 text-xs">
                        {"★★★★★"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            isCalculating ? (
              <div className="flex flex-col items-center justify-center h-full space-y-8 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                  <Loader2 className="w-16 h-16 text-slate-900 animate-spin relative z-10" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 max-w-xs mx-auto leading-relaxed">
                  {t("calculatingSavings")}
                </h3>
              </div>
            ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
              <div className="w-full space-y-2">
                <h3 className="text-lg font-medium text-gray-500">{t("currentContribution")}</h3>
                <p className="text-3xl font-bold text-gray-400 line-through">
                  {formData.amount} CHF
                </p>
              </div>

              <div className="flex flex-col items-center justify-center py-2">
                 <div className="bg-green-100 text-green-700 px-6 py-2 rounded-full flex items-center gap-2 font-bold text-xl shadow-sm">
                    <TrendingDown className="w-6 h-6" />
                    -30%
                 </div>
              </div>

              <div className="w-full space-y-2">
                <h3 className="text-xl font-bold text-slate-900">{t("possibleNewContribution")}</h3>
                <p className="text-5xl font-extrabold text-slate-900">
                  {(parseFloat(formData.amount || "0") * 0.7).toFixed(0)} CHF
                </p>
              </div>
              
              <div className="space-y-1 pt-2 pb-4">
                 <div className="flex items-center justify-center gap-2 text-orange-500 font-bold animate-pulse">
                    <Sparkles className="w-5 h-5" />
                    <span>{t("almostDone")}</span>
                 </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-slate-800 transition-colors"
              >
                {t("contact")}
              </button>
            </div>
            )
          )}

          {step === 5 && (
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">{t("contact")}</h2>
              <div className="space-y-4 flex-1 overflow-y-auto">
                <div>
                  <input
                    type="text"
                    placeholder={t("firstName")}
                    value={formData.firstName}
                    onChange={(e) => updateData("firstName", e.target.value)}
                    className={clsx(
                      "w-full p-4 border rounded-xl focus:ring-2 focus:ring-slate-900 outline-none text-slate-900 placeholder:text-gray-400",
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    )}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder={t("lastName")}
                    value={formData.lastName}
                    onChange={(e) => updateData("lastName", e.target.value)}
                    className={clsx(
                      "w-full p-4 border rounded-xl focus:ring-2 focus:ring-slate-900 outline-none text-slate-900 placeholder:text-gray-400",
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    )}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder={t("email")}
                    value={formData.email}
                    onChange={(e) => updateData("email", e.target.value)}
                    className={clsx(
                      "w-full p-4 border rounded-xl focus:ring-2 focus:ring-slate-900 outline-none text-slate-900 placeholder:text-gray-400",
                      errors.email ? "border-red-500" : "border-gray-300"
                    )}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder={t("phone")}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={clsx(
                      "w-full p-4 border rounded-xl focus:ring-2 focus:ring-slate-900 outline-none text-slate-900 placeholder:text-gray-400",
                      errors.phone ? "border-red-500" : "border-gray-300"
                    )}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    {t("fasterProcessing")}
                  </p>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder={t("currentInsurance")}
                      value={formData.currentInsurance}
                      onChange={(e) => updateData("currentInsurance", e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none text-slate-900 placeholder:text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder={t("policyNumber")}
                      value={formData.policyNumber}
                      onChange={(e) => updateData("policyNumber", e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none text-slate-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  {t("successMessage")}
                </p>
              </div>
              <button
                onClick={submitContact}
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-slate-800 transition-colors disabled:opacity-50 mt-4"
              >
                {isSubmitting ? "..." : t("submit")}
              </button>
            </div>
          )}

          {step === 6 && (
            <div className="flex flex-col h-full items-center justify-center text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Heart className="w-10 h-10 text-red-500" fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900">{t("finalSuccessTitle")}</h2>
              <p className="text-gray-600 text-lg">{t("finalSuccessMessage")}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
  );
}