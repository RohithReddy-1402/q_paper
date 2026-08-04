import React, { useState } from "react";
import axios from "axios";
import { useToast } from "./ToastContext";

import {
  Download,
  Zap,
  FileStack,
  Search,
  Wrench,
  Library,
  ShieldCheck,
  GraduationCap,
  Users,
  Lock,
  Eye,
  CheckCircle2,
  ChevronDown,
  IndianRupee,
  Heart,
  Server,
  Database,
  HardDrive,
  Code2,
  Globe2,
  MoreHorizontal,
} from "lucide-react";

const Tokens = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

    .nkp-root {
      --ink: #17213A;
      --ink-2: #24325A;
      --paper: #EFEADC;
      --paper-soft: #F6F2E6;
      --paper-line: #D9D0B8;
      --seal: #8C2F2B;
      --seal-soft: #F0DAD3;
      --brass: #B08D46;
      --success: #3F6B4F;
      --ink-text: #2A2A22;
      --muted: #746E5E;
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      color: var(--ink-text);
    }
    .nkp-root .font-display { font-family: 'Fraunces', 'Georgia', serif; }
    .nkp-root .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }

    @keyframes nkp-rise {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .nkp-rise { animation: nkp-rise 0.6s cubic-bezier(0.16,1,0.3,1) both; }

    @keyframes nkp-stamp-in {
      0% { opacity: 0; transform: rotate(-14deg) scale(0.7); }
      60% { opacity: 1; transform: rotate(-10deg) scale(1.08); }
      100% { opacity: 1; transform: rotate(-9deg) scale(1); }
    }
    .nkp-stamp { animation: nkp-stamp-in 0.7s cubic-bezier(0.16,1,0.3,1) both; }

    .nkp-ticket {
      position: relative;
      background: var(--paper);
      border: 1px solid var(--paper-line);
    }
    .nkp-ticket::before,
    .nkp-ticket::after {
      content: "";
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 26px;
      height: 26px;
      background: var(--ink);
      border-radius: 9999px;
    }
    .nkp-ticket::before { top: -13px; }
    .nkp-ticket::after { bottom: -13px; }
    @media (min-width: 768px) {
      .nkp-ticket::before, .nkp-ticket::after { display: none; }
      .nkp-ticket-md::before, .nkp-ticket-md::after {
        content: "";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 26px;
        height: 26px;
        background: var(--ink);
        border-radius: 9999px;
      }
      .nkp-ticket-md::before { left: -13px; }
      .nkp-ticket-md::after { right: -13px; }
    }

    .nkp-perf {
      border-top: 2px dashed var(--paper-line);
    }

    .leader-row {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }
    .leader-dots {
      flex: 1;
      border-bottom: 2px dotted var(--paper-line);
      margin-bottom: 5px;
      min-width: 12px;
    }

    .nkp-focus:focus-visible {
      outline: 2px solid var(--brass);
      outline-offset: 3px;
    }

    @media (prefers-reduced-motion: reduce) {
      .nkp-rise, .nkp-stamp { animation: none; }
    }
  `}</style>
);


const SectionLabel = ({ children }) => (
  <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--brass)] mb-3">
    {children}
  </p>
);




const Hero = ({ onDonateClick }) => (
  <section
    className="relative overflow-hidden px-6 md:px-12 pt-20 pb-28 md:pt-28 md:pb-36"
    style={{
      background: "linear-gradient(160deg, var(--ink) 0%, var(--ink-2) 55%, #1c2a4d 100%)",
    }}
  >
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 28px)",
      }}
    />
    <div className="relative max-w-5xl mx-auto">
      <div className="nkp-rise inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-8">
        <GraduationCap className="w-4 h-4 text-[var(--brass)]" strokeWidth={1.75} />
        <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/70">
          nitkkrpyqs.in
        </span>
      </div>

      <h1
        className="nkp-rise font-display text-white text-4xl sm:text-5xl md:text-6xl leading-[1.08] max-w-3xl"
        style={{ animationDelay: "0.08s" }}
      >
        Support NIT KKR PYQS 
      </h1>

      <p
        className="nkp-rise text-white/70 text-base md:text-lg max-w-xl mt-6 leading-relaxed"
        style={{ animationDelay: "0.16s" }}
      >
        NIT KKR Previous Papers is run for students, by a student. It stays free
        for everyone, always. If it has saved you a late night searching for a
        paper, donation helps for maintaince and growth of the site .
      </p>

      <div
        className="nkp-rise flex flex-col sm:flex-row gap-4 mt-10"
        style={{ animationDelay: "0.24s" }}
      >
        <button
          onClick={onDonateClick}
          className="nkp-focus inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
          style={{ backgroundColor: "var(--seal)" }}
        >
          <Heart className="w-4 h-4" strokeWidth={2} />
          Donate now
        </button>
        
      </div>

     
    </div>
  </section>
);


const whyDonateItems = [
  { icon: Download, title: "Downloads stay free", body: "Every paper and every syllabus stays free to download, for every student, no matter what." },
  { icon: Zap, title: "Faster servers", body: "Less waiting around during exam season, when the site gets busiest and speed matters most." },
  { icon: FileStack, title: "More papers added", body: "Time spent collecting and formatting papers from more branches, semesters, and years." },
  { icon: Library, title: "More study resources", body: "Syllabus breakdowns, formula sheets, and other material beyond just question papers." },
  { icon: Search, title: "Better search", body: "Finding the right paper for the right subject and year, without digging through folders." },
  { icon: Wrench, title: "Ongoing upkeep", body: "Bug fixes, small features, and the quiet maintenance that keeps a website running smoothly." },
];

const WhyDonate = () => (
  <section className="px-6 md:px-12 py-20 md:py-28 max-w-6xl mx-auto">
    <SectionLabel>Why donate</SectionLabel>
    <h2 className="font-display text-3xl md:text-4xl max-w-xl" style={{ color: "var(--ink)" }}>
      What your support makes possible
    </h2>
    <p className="text-[var(--muted)] max-w-lg mt-4">
      None of this is required to use the site. It's simply where a donation goes,
      if you choose to make one.
    </p>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
      {whyDonateItems.map(({ icon: Icon, title, body }) => (
        <div
          key={title}
          className="group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
          style={{ backgroundColor: "var(--paper-soft)", borderColor: "var(--paper-line)" }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 transition-colors duration-300"
            style={{ backgroundColor: "var(--seal-soft)" }}
          >
            <Icon className="w-5 h-5" style={{ color: "var(--seal)" }} strokeWidth={1.75} />
          </div>
          <h3 className="font-display text-lg mb-2" style={{ color: "var(--ink)" }}>
            {title}
          </h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
        </div>
      ))}
    </div>
  </section>
);


const allocation = [
  { label: "Server & hosting", pct: 40, icon: Server },
  { label: "Database", pct: 20, icon: Database },
  { label: "Storage", pct: 15, icon: HardDrive },
  { label: "Development", pct: 10, icon: Code2 },
  { label: "Domain & security", pct: 10, icon: Globe2 },
  { label: "Miscellaneous", pct: 5, icon: MoreHorizontal },
];

const Allocation = () => (
  <section className="px-6 md:px-12 py-20 md:py-28" style={{ backgroundColor: "var(--paper-soft)" }}>
    <div className="max-w-3xl mx-auto">
      <SectionLabel>Where your donation goes</SectionLabel>
      <h2 className="font-display text-3xl md:text-4xl" style={{ color: "var(--ink)" }}>
        A rough breakdown of the running costs
      </h2>
      <p className="text-[var(--muted)] mt-4 max-w-lg">
        These are approximate allocations, not fixed commitments — costs shift
        month to month as the archive grows.
      </p>

      <div
        className="mt-12 rounded-2xl p-7 md:p-10 border"
        style={{ backgroundColor: "var(--paper)", borderColor: "var(--paper-line)" }}
      >
        <div className="space-y-6">
          {allocation.map(({ label, pct, icon: Icon }) => (
            <div key={label}>
              <div className="leader-row">
                <Icon className="w-4 h-4 shrink-0" style={{ color: "var(--seal)" }} strokeWidth={1.75} />
                <span className="text-sm md:text-base whitespace-nowrap" style={{ color: "var(--ink-text)" }}>
                  {label}
                </span>
                <span className="leader-dots" />
                <span className="font-mono text-sm md:text-base font-medium" style={{ color: "var(--ink)" }}>
                  {pct}%
                </span>
              </div>
              <div className="h-1.5 rounded-full mt-2.5 overflow-hidden" style={{ backgroundColor: "var(--paper-line)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: "var(--seal)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);


const impactItems = [
  { amount: 100, note: "Helps cover website hosting costs." },
  { amount: 250, note: "Supports storage for more papers." },
  { amount: 500, note: "Helps build new academic features." },
  { amount: 1000, note: "Supports long-term platform development.", plus: true },
];

const Impact = () => (
  <section className="px-6 md:px-12 py-20 md:py-28 max-w-4xl mx-auto">
    <SectionLabel>Donation impact</SectionLabel>
    <h2 className="font-display text-3xl md:text-4xl max-w-xl" style={{ color: "var(--ink)" }}>
      What different amounts can do
    </h2>
    <p className="text-[var(--muted)] mt-4 max-w-lg">
      Rough examples, not requirements. Any amount, given whenever you're able, helps.
    </p>

    <div
      className="mt-12 rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "var(--paper-soft)", borderColor: "var(--paper-line)" }}
    >
      {impactItems.map((item, i) => (
        <div
          key={item.amount}
          className={`flex items-center gap-5 px-6 md:px-8 py-6 ${i !== 0 ? "nkp-perf" : ""}`}
        >
          <div className="font-mono text-xl md:text-2xl font-medium shrink-0" style={{ color: "var(--seal)" }}>
            ₹{item.amount}
            {item.plus ? "+" : ""}
          </div>
          <div className="h-8 w-px bg-[var(--paper-line)] shrink-0" />
          <p className="text-sm md:text-base" style={{ color: "var(--ink-text)" }}>
            {item.note}
          </p>
        </div>
      ))}
    </div>
  </section>
);


const trustItems = [
  { icon: CheckCircle2, title: "Completely free", body: "No paywalls, no premium tier, ever." },
  { icon: GraduationCap, title: "Student focused", body: "Built for NIT KKR students, by one." },
  { icon: Lock, title: "No premium lock", body: "Donating unlocks nothing you didn't already have." },
  { icon: Users, title: "Community driven", body: "Papers are contributed by students like you." },
  { icon: ShieldCheck, title: "Secure payments", body: "Handled by Razorpay, a trusted payment gateway." },
  { icon: Eye, title: "Transparent purpose", body: "Every rupee goes toward keeping the site running." },
];

const Trust = () => (
  <section className="px-6 md:px-12 py-20 md:py-28" style={{ backgroundColor: "var(--ink)" }}>
    <div className="max-w-6xl mx-auto">
      <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--brass)] mb-3">
        Why trust this platform
      </p>
      <h2 className="font-display text-3xl md:text-4xl text-white max-w-xl">
        Built in the open, for students only
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
        {trustItems.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 flex items-start gap-3.5 transition-colors duration-300 hover:bg-white/[0.07]"
          >
            <Icon className="w-5 h-5 mt-0.5 shrink-0 text-[var(--brass)]" strokeWidth={1.75} />
            <div>
              <h3 className="text-white font-medium text-sm mb-1">{title}</h3>
              <p className="text-white/55 text-sm leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);


const DeveloperNote = () => (
  <section className="px-6 md:px-12 py-20 md:py-28 max-w-3xl mx-auto">
    <SectionLabel>A note from the developer</SectionLabel>
    <div
      className="rounded-2xl border p-8 md:p-12 relative"
      style={{ backgroundColor: "var(--paper)", borderColor: "var(--paper-line)" }}
    >
      <p className="font-display italic text-xl md:text-2xl leading-relaxed" style={{ color: "var(--ink)" }}>
        "I built this because I remember what it was like to hunt for a previous
        year's paper the night before an exam — scattered PDFs, dead links, and
        seniors who'd already left the group."
      </p>
      <div className="h-px w-16 my-7" style={{ backgroundColor: "var(--paper-line)" }} />
      <div className="space-y-4 text-sm md:text-base leading-relaxed" style={{ color: "var(--ink-text)" }}>
        <p>
          NIT KKR Previous Papers started as a small folder of scanned papers I'd
          collected for my own semester exams. Once I saw how much time it saved,
          it made sense to organize it properly and put it online for the rest of
          the college.
        </p>
        <p>
          It's still run the same way — one person, in whatever time is left
          after classes and coursework. The goal has never changed: help juniors
          spend less time searching and more time actually preparing.
        </p>
        <p>
          Hosting, storage, and a domain all cost something to keep running.
          Donations don't fund a business — they fund the next semester of
          uptime. If this site has helped you, and you're able to spare
          something, it genuinely helps. If not, that's completely fine too —
          use it, share it with your batchmates, and good luck with your exams.
        </p>
      </div>
      <p className="font-display text-lg mt-8" style={{ color: "var(--ink)" }}>
        — The developer, NIT KKR Previous Papers
      </p>
    </div>
  </section>
);


const faqItems = [
  {
    q: "Why donate if the site is free?",
    a: "The site will always be free to use. Donations are entirely optional and simply help cover the running costs — hosting, storage, and domain renewal — so the archive can keep growing.",
  },
  {
    q: "Will the website remain free?",
    a: "Yes. Every paper, syllabus, and resource stays free whether you donate or not. Donating never unlocks anything that wasn't already available to everyone.",
  },
  {
    q: "Are donations refundable?",
    a: "Donations are voluntary contributions toward running costs, so they aren't refundable. If you have a specific concern about a payment, you're welcome to reach out.",
  },
  {
    q: "Is payment secure?",
    a: "Yes. Payments are processed through Razorpay, a widely used and secure payment gateway. Card and bank details are handled directly by Razorpay, not stored on this site.",
  },
  {
    q: "Where does the money go?",
    a: "Mainly toward server and database hosting, storage for papers, the domain, and small development costs — the breakdown above shows an approximate split.",
  },
  {
    q: "Can I donate any amount?",
    a: "Yes. You can choose one of the suggested amounts or enter a custom one. There's no minimum, and every amount is genuinely appreciated.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);
  return (
    <section className="px-6 md:px-12 py-20 md:py-28" style={{ backgroundColor: "var(--paper-soft)" }}>
      <div className="max-w-3xl mx-auto">
        <SectionLabel>Frequently asked</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl" style={{ color: "var(--ink)" }}>
          Common questions
        </h2>

        <div className="mt-10 rounded-2xl border overflow-hidden" style={{ borderColor: "var(--paper-line)", backgroundColor: "var(--paper)" }}>
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={i !== 0 ? "nkp-perf" : ""}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="nkp-focus w-full flex items-center justify-between gap-4 text-left px-6 md:px-7 py-5"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-sm md:text-base" style={{ color: "var(--ink)" }}>
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: "var(--seal)" }}
                  />
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 md:px-7 pb-5 text-sm leading-relaxed text-[var(--muted)]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const presetAmounts = [50, 100, 250, 500, 1000];

const DonationCard = ({ sectionRef }) => {
  const [selected, setSelected] = useState(250);
  const [custom, setCustom] = useState("");
  const [useCustom, setUseCustom] = useState(false);
    const { addToast } = useToast();
  
  const activeAmount = useCustom ? Number(custom) || 0 : selected;
        const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };
    const handleDonate = async (amount) => {
        try {
            const loaded = await loadRazorpay();

            if (!loaded) {
                addToast("Failed to load Razorpay.", "error");
                return;
            }


            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,

                amount: activeAmount *100,

                currency: "INR",

                name: "NIT KKR Previous Papers",

                description: "Support the platform",

                image: "/icon.png",

                // order_id: data.orderId,
                handler: function (response) {
                    addToast(`Thank you for your support! Amount: ${activeAmount} received`, "success");
                }
            };

            const paymentObject = new window.Razorpay(options);

            paymentObject.open();
        } catch (err) {
            console.error(err);
            addToast("Something went wrong.", "error");
        }
    };
  return (
    <section
      ref={sectionRef}
      id="donate"
      className="px-6 md:px-12 py-24 md:py-32"
      style={{
        background: "linear-gradient(160deg, var(--ink) 0%, var(--ink-2) 100%)",
      }}
    >
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <SectionLabel>Make a contribution</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl text-white">Your donation ticket</h2>
        </div>

        <div className="nkp-ticket nkp-ticket-md relative rounded-2xl shadow-2xl shadow-black/30 mx-3">
          <div className="flex items-center justify-between px-7 pt-7">
            <div>
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: "var(--muted)" }}>
                NIT KKR Previous Papers
              </p>
              <p className="font-display text-lg mt-0.5" style={{ color: "var(--ink)" }}>
                Support Ticket
              </p>
            </div>
            <img src="/icon.png" width="80" height="80" alt="Icon" loading="lazy" />
          </div>

          <div className="px-7 pt-6">
            <p className="font-mono text-[11px] tracking-[0.1em] uppercase mb-3" style={{ color: "var(--muted)" }}>
              Choose an amount
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {presetAmounts.map((amt) => {
                const isActive = !useCustom && selected === amt;
                const isHighlighted = amt === 250;
                return (
                  <button
                    key={amt}
                    onClick={() => {
                      setSelected(amt);
                      setUseCustom(false);
                    }}
                    className={`nkp-focus relative rounded-lg py-3 font-mono text-sm font-medium border transition-all duration-200 ${
                      isActive ? "text-white" : ""
                    }`}
                    style={{
                      backgroundColor: isActive ? "var(--seal)" : "transparent",
                      borderColor: isActive ? "var(--seal)" : "var(--paper-line)",
                      color: isActive ? "#fff" : "var(--ink-text)",
                    }}
                  >
                    ₹{amt}
                    {isHighlighted && !isActive && (
                      <span
                        className="absolute -top-2 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-wide uppercase px-1.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: "var(--brass)" }}
                      >
                        popular
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => setUseCustom(true)}
                className="nkp-focus rounded-lg py-3 font-mono text-xs font-medium border transition-all duration-200"
                style={{
                  backgroundColor: useCustom ? "var(--seal)" : "transparent",
                  borderColor: useCustom ? "var(--seal)" : "var(--paper-line)",
                  color: useCustom ? "#fff" : "var(--ink-text)",
                }}
              >
                Custom
              </button>
            </div>

            {useCustom && (
              <div
                className="mt-3 flex items-center gap-2 rounded-lg border px-3.5"
                style={{ borderColor: "var(--brass)", backgroundColor: "var(--paper-soft)" }}
              >
                <IndianRupee className="w-4 h-4 shrink-0" style={{ color: "var(--muted)" }} />
                <input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  placeholder="Enter amount"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  className="nkp-focus w-full bg-transparent py-2.5 text-sm font-mono outline-none placeholder:text-[var(--muted)]"
                  style={{ color: "var(--ink-text)" }}
                />
              </div>
            )}
          </div>

          <div className="nkp-perf mx-7 mt-7" />

          <div className="px-7 py-6">
            <p className="text-xs text-center leading-relaxed" style={{ color: "var(--muted)" }}>
              Every contribution, no matter the amount, helps us continue
              improving this platform.
            </p>

            <button
              onClick={() => handleDonate(activeAmount)}
              disabled={!activeAmount}
              className="nkp-focus w-full mt-5 rounded-lg py-3.5 font-medium text-white flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              style={{ backgroundColor: "var(--seal)" }}
            >
              <Heart className="w-4 h-4" strokeWidth={2} />
              Donate ₹{activeAmount || 0}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-4">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: "var(--muted)" }} />
              <span className="font-mono text-[10px] tracking-wide" style={{ color: "var(--muted)" }}>
                SECURED BY RAZORPAY
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="px-6 md:px-12 py-14" style={{ backgroundColor: "var(--ink)" }}>
    <div className="max-w-3xl mx-auto text-center">
      <GraduationCap className="w-6 h-6 mx-auto mb-4 text-[var(--brass)]" strokeWidth={1.5} />
      <p className="font-display text-lg text-white/90">
        Thank you for your support.
      </p>
      
      <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/30 mt-8">
        nitkkrpyqs.in
      </p>
    </div>
  </footer>
);

export default function DonationPage() {
  const donateRef = React.useRef(null);

  const scrollToDonate = () => {
    donateRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="nkp-root min-h-screen w-full" style={{ backgroundColor: "var(--paper)" }}>
      <Tokens />
      <Hero onDonateClick={scrollToDonate} />
      {/* <WhyDonate /> */}
      <DonationCard sectionRef={donateRef} />
      <Allocation />
      {/* <Impact /> */}
      {/* <Trust /> */}
      <DeveloperNote />
      <FAQ />
      <Footer />
    </div>
  );
}