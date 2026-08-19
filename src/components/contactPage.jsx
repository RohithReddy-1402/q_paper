import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useToast } from './ToastContext';
import "./TerminalView.css"
const COMMANDS = {
  help: {
    desc: "Show available commands",
    usage: "help",
  },
  ls: {
    desc: "List all available commands",
    usage: "ls",
  },
  whoami: {
    desc: "Display current user info",
    usage: "whoami",
  },
  contact: {
    desc: "Open interactive contact form",
    usage: "contact",
  },
  "cat about.txt": {
    desc: "Display info about us",
    usage: "cat about.txt",
  },
  "cat socials.txt": {
    desc: "Show our social media links",
    usage: "cat socials.txt",
  },
  "cat team.txt": {
    desc: "Meet the team",
    usage: "cat team.txt",
  },
  clear: {
    desc: "Clear the terminal",
    usage: "clear",
  },
  pwd: {
    desc: "Print working directory",
    usage: "pwd",
  },
  date: {
    desc: "Show current date & time",
    usage: "date",
  },
  uname: {
    desc: "Show system information",
    usage: "uname -a",
  },
  ping: {
    desc: "Ping our server",
    usage: "ping contact.server",
  },
  sudo: {
    desc: "Run as superuser (nice try 😄)",
    usage: "sudo [command]",
  },
  history: {
    desc: "Show command history",
    usage: "history",
  },
  exit: {
    desc: "Exit interactive mode",
    usage: "exit",
  },
};

const BOOT_LINES = [
  { text: "[ OK ] Starting Kali Linux Contact Terminal...", delay: 0, color: "#00ff41" },
  { text: "[ OK ] Loading kernel modules...", delay: 100, color: "#00ff41" },
  { text: "[ OK ] Mounting contact filesystem...", delay: 200, color: "#00ff41" },
  { text: "[ OK ] Initializing network interface eth0...", delay: 300, color: "#00ff41" },
  { text: "[ OK ] Starting SSH service...", delay: 400, color: "#00ff41" },
  { text: "[ OK ] Loading security protocols...", delay: 500, color: "#00c8ff" },
  { text: "[ WARN] Unauthorized access will be logged.", delay: 600, color: "#ffd700" },
  { text: "[ OK ] System ready. Type 'help' for available commands.", delay: 700, color: "#00ff41" },
  { text: "", delay: 800, color: "" },
];

function processCommand(cmd, history) {
  const trimmed = cmd.trim().toLowerCase();
  const raw = cmd.trim();

  switch (trimmed) {
    case "ls":
    case "ls -la":
    case "ls --all":
      return {
        type: "ls",
        content: Object.entries(COMMANDS).map(([k, v]) => ({
          name: k,
          desc: v.desc,
          usage: v.usage,
        })),
      };

    case "help":
      return {
        type: "help",
        content: Object.entries(COMMANDS).map(([k, v]) => ({
          name: k,
          desc: v.desc,
          usage: v.usage,
        })),
      };

    case "whoami":
      return {
        type: "text",
        lines: [
          { text: "root", color: "#ff5555" },
          { text: "uid=0(root) gid=0(root) groups=0(root),4(adm),24(cdrom)", color: "#00ff41" },
          { text: "Shell: /bin/zsh  |  Terminal: xterm-256color", color: "#00c8ff" },
        ],
      };

    case "pwd":
      return {
        type: "text",
        lines: [{ text: "/home/kali/contact", color: "#00ff41" }],
      };

    case "date":
      return {
        type: "text",
        lines: [{ text: new Date().toString(), color: "#00c8ff" }],
      };

    case "uname -a":
    case "uname":
      return {
        type: "text",
        lines: [
          {
            text: "Linux kali 6.5.0-kali3-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.5.6-1kali1 x86_64 GNU/Linux",
            color: "#00ff41",
          },
        ],
      };

    case "cat about.txt":
      return {
        type: "text",
        lines: [
          { text: "╔══════════════════════════════════════╗", color: "#00ff41" },
          { text: "║         ABOUT US                     ║", color: "#00ff41" },
          { text: "╠══════════════════════════════════════╣", color: "#00ff41" },
          { text: "║  We are a cybersecurity & dev firm.  ║", color: "#00c8ff" },
          { text: "║  Building tools that matter.         ║", color: "#00c8ff" },
          { text: "║  Est. 2020  |  Remote-first team     ║", color: "#00c8ff" },
          { text: "║  Email: hello@contact-terminal.io    ║", color: "#ffd700" },
          { text: "║  Phone: +1 (800) 000-KALI            ║", color: "#ffd700" },
          { text: "╚══════════════════════════════════════╝", color: "#00ff41" },
        ],
      };

    case "cat socials.txt":
      return {
        type: "text",
        lines: [
          { text: "── Social Links ──────────────────────────", color: "#00ff41" },
          { text: "  GitHub    →  github.com/contact-terminal", color: "#00c8ff" },
          { text: "  Twitter   →  twitter.com/contact-terminal", color: "#00c8ff" },
          { text: "  LinkedIn  →  linkedin.com/company/ct", color: "#00c8ff" },
          { text: "  Discord   →  discord.gg/contact-terminal", color: "#00c8ff" },
          { text: "──────────────────────────────────────────", color: "#00ff41" },
        ],
      };

    case "cat team.txt":
      return {
        type: "text",
        lines: [
          { text: "── Team ──────────────────────────────────", color: "#00ff41" },
          { text: "  root      →  System Admin & Founder", color: "#ff5555" },
          { text: "  ghost     →  Lead Security Researcher", color: "#00c8ff" },
          { text: "  cipher    →  Full Stack Developer", color: "#00c8ff" },
          { text: "  phantom   →  UI/UX & Frontend Engineer", color: "#00c8ff" },
          { text: "──────────────────────────────────────────", color: "#00ff41" },
        ],
      };

    case "ping contact.server":
    case "ping":
      return {
        type: "ping",
        lines: [
          { text: "PING contact.server (93.184.216.34): 56 data bytes", color: "#00ff41" },
          { text: "64 bytes from 93.184.216.34: icmp_seq=0 ttl=56 time=11.2 ms", color: "#00c8ff" },
          { text: "64 bytes from 93.184.216.34: icmp_seq=1 ttl=56 time=9.8 ms", color: "#00c8ff" },
          { text: "64 bytes from 93.184.216.34: icmp_seq=2 ttl=56 time=10.1 ms", color: "#00c8ff" },
          { text: "--- contact.server ping statistics ---", color: "#00ff41" },
          { text: "3 packets transmitted, 3 received, 0% packet loss", color: "#ffd700" },
        ],
      };

    case "contact":
      return { type: "contact_form" };

    case "history":
      return {
        type: "text",
        lines: history.map((h, i) => ({
          text: `  ${String(i + 1).padStart(3)}  ${h}`,
          color: "#00ff41",
        })),
      };

    case "clear":
      return { type: "clear" };

    case "exit":
      return { type: "exit" };

    default:
      if (trimmed.startsWith("sudo ")) {
        return {
          type: "text",
          lines: [
            {
              text: `[sudo] password for kali: `,
              color: "#ffd700",
            },
            {
              text: `Sorry, user kali is not allowed to execute '${raw.slice(5)}' as root.`,
              color: "#ff5555",
            },
          ],
        };
      }
      if (trimmed === "") return { type: "empty" };
      return {
        type: "text",
        lines: [
          {
            text: `zsh: command not found: ${raw}`,
            color: "#ff5555",
          },
          {
            text: `Type 'help' or 'ls' to see available commands.`,
            color: "#00ff4188",
          },
        ],
      };
  }
}

function ModeModal({ onSelect }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        className="modal-enter"
        style={{
          background: "#0a0a0a",
          border: "1px solid #00ff4155",
          padding: "40px 48px",
          maxWidth: 520,
          width: "90%",
          boxShadow: "0 0 60px #00ff4122, 0 0 0 1px #00ff4133",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {["topleft", "topright", "bottomleft", "bottomright"].map((pos) => (
          <div
            key={pos}
            style={{
              position: "absolute",
              width: 12,
              height: 12,
              borderColor: "#00ff41",
              borderStyle: "solid",
              ...(pos === "topleft" && { top: 8, left: 8, borderWidth: "2px 0 0 2px" }),
              ...(pos === "topright" && { top: 8, right: 8, borderWidth: "2px 2px 0 0" }),
              ...(pos === "bottomleft" && { bottom: 8, left: 8, borderWidth: "0 0 2px 2px" }),
              ...(pos === "bottomright" && { bottom: 8, right: 8, borderWidth: "0 2px 2px 0" }),
            }}
          />
        ))}
        <div style={{ marginBottom: 8, color: "#00ff4166", fontSize: 11, letterSpacing: 3 }}>
          SYSTEM PROMPT
        </div>
        <div
          style={{
            color: "#00ff41",
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 6,
            textShadow: "0 0 12px #00ff41",
          }}
        >
          Contact Terminal v2.4.1
        </div>
        <div style={{ color: "#00ff4188", fontSize: 12, marginBottom: 28, lineHeight: 1.6 }}>
          ┌─ Select your preferred interface mode ─────────────────┐
          <br />
          │ How would you like to interact with us today?          │
          <br />
          └────────────────────────────────────────────────────────┘
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <button
            className="mode-btn"
            onClick={() => onSelect("terminal")}
            style={{
              border: "1px solid #00ff41",
              color: "#00ff41",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#00ff4115";
              e.currentTarget.style.boxShadow = "0 0 20px #00ff4133";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              [1] Interactive Terminal Mode
            </div>
            <div style={{ fontSize: 11, color: "#00ff4177", letterSpacing: 0.5 }}>
              Full Kali Linux terminal experience. Type commands. Use ls, help, contact...
            </div>
          </button>

          <button
            className="mode-btn"
            onClick={() => onSelect("normal")}
            style={{
              border: "1px solid #00c8ff55",
              color: "#00c8ff",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#00c8ff15";
              e.currentTarget.style.boxShadow = "0 0 20px #00c8ff22";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              [2] Standard Contact Page
            </div>
            <div style={{ fontSize: 11, color: "#00c8ff77", letterSpacing: 0.5 }}>
              Clean terminal-styled form. No commands — just fill and send.
            </div>
          </button>
        </div>

        <div
          style={{
            marginTop: 24,
            color: "#00ff4144",
            fontSize: 10,
            letterSpacing: 1.5,
            borderTop: "1px solid #00ff4122",
            paddingTop: 16,
          }}
        >
          Press [1] or [2] to continue ▌
        </div>
      </div>
    </div>
  );
}

function ContactFormTerminal({ onDone }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef(null);

  const fields = [
    { key: "name", prompt: "Enter your name:", placeholder: "John Doe" },
    { key: "email", prompt: "Enter your email:", placeholder: "you@example.com" },
    { key: "subject", prompt: "Enter subject:", placeholder: "Security Audit Request" },
    { key: "message", prompt: "Enter your message:", placeholder: "Hello, I wanted to..." },
  ];

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const handleKey = (e) => {
    if (e.key === "Enter") {
      if (step < fields.length) {
        setFormData((prev) => ({ ...prev, [fields[step].key]: input }));
        setInput("");
        if (step + 1 >= fields.length) {
          setSubmitted(true);
        }
        setStep((s) => s + 1);
      }
    }
  };

  if (submitted) {
    return (
      <div style={{ marginTop: 8 }}>
        {[
          { text: "[ OK ] Encrypting payload...", color: "#00ff41" },
          { text: "[ OK ] Establishing secure connection...", color: "#00ff41" },
          { text: "[ OK ] Message dispatched successfully!", color: "#00ff41" },
          { text: "", color: "" },
          { text: `  To:       ${formData.email}`, color: "#00c8ff" },
          { text: `  From:     ${formData.name}`, color: "#00c8ff" },
          { text: `  Subject:  ${formData.subject}`, color: "#00c8ff" },
          { text: "", color: "" },
          { text: "  We'll get back to you within 24 hours.", color: "#ffd700" },
          { text: "", color: "" },
        ].map((l, i) => (
          <div key={i} style={{ color: l.color, fontSize: 13, lineHeight: 1.8 }}>
            {l.text}
          </div>
        ))}
        <div
          style={{ color: "#00ff4177", fontSize: 12, cursor: "pointer", marginTop: 4 }}
          onClick={onDone}
        >
          [Type any command to continue]
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ color: "#00ff4188", fontSize: 12, marginBottom: 8 }}>
        ── Contact Form ── (fill fields, press Enter to continue)
      </div>
      {fields.slice(0, step).map((f, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4, fontSize: 13 }}>
          <span style={{ color: "#00ff4166" }}>{f.prompt}</span>
          <span style={{ color: "#00c8ff" }}>{formData[f.key]}</span>
        </div>
      ))}
      {step < fields.length && (
        <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
          <span style={{ color: "#00ff41" }}>{fields[step].prompt}</span>
          <span style={{ color: "#00ff4166", fontSize: 11 }}>({fields[step].placeholder})</span>
        </div>
      )}
      {step < fields.length && (
        <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
          <span style={{ color: "#00ff41", marginRight: 6 }}>❯</span>
          <input
            ref={inputRef}
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            style={{ fontSize: 13, flex: 1 }}
          />
          <span className="blink" style={{ color: "#00ff41", marginLeft: 1 }}>
            █
          </span>
        </div>
      )}
    </div>
  );
}

function TerminalMode({ onExit }) {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    let timeout;
    BOOT_LINES.forEach((line) => {
      timeout = setTimeout(() => {
        setLines((prev) => [
          ...prev,
          { id: Date.now() + Math.random(), type: "boot", text: line.text, color: line.color },
        ]);
      }, line.delay);
    });
    setTimeout(() => setBooted(true), 900);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, showForm]);

  useEffect(() => {
    if (booted) inputRef.current?.focus();
  }, [booted]);

  const addLine = useCallback((content) => {
    setLines((prev) => [...prev, { id: Date.now() + Math.random(), ...content }]);
  }, []);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (trimmed === "") return;

    setCmdHistory((prev) => [...prev, trimmed]);
    setHistIdx(-1);

    setLines((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        type: "prompt",
        cmd: trimmed,
      },
    ]);

    const result = processCommand(trimmed, [...cmdHistory, trimmed]);

    if (result.type === "clear") {
      setLines([]);
      setShowForm(false);
      return;
    }

    if (result.type === "exit") {
      onExit();
      return;
    }

    if (result.type === "contact_form") {
      setShowForm(true);
      return;
    }

    if (result.type === "empty") return;

    setLines((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), type: "result", result },
    ]);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      if (showForm) return;
      handleCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIdx = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(newIdx);
      setInput(cmdHistory[cmdHistory.length - 1 - newIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIdx = Math.max(histIdx - 1, -1);
      setHistIdx(newIdx);
      setInput(newIdx === -1 ? "" : cmdHistory[cmdHistory.length - 1 - newIdx] || "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = Object.keys(COMMANDS).filter((k) =>
        k.startsWith(input.toLowerCase())
      );
      if (matches.length === 1) setInput(matches[0]);
    }
  };

  const renderResult = (result) => {
    if (result.type === "ls") {
      return (
        <div style={{ marginTop: 6, marginBottom: 6 }}>
          <div style={{ color: "#00ff4166", fontSize: 11, marginBottom: 8, letterSpacing: 2 }}>
            total {result.content.length} commands
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 4,
            }}
          >
            {result.content.map((item) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  padding: "4px 8px",
                  border: "1px solid #00ff4118",
                }}
              >
                <span style={{ color: "#00c8ff", fontSize: 13, minWidth: 120 }}>{item.usage}</span>
                <span style={{ color: "#00ff4166", fontSize: 11, lineHeight: 1.6 }}>
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (result.type === "help") {
      return (
        <div style={{ marginTop: 6, marginBottom: 6 }}>
          <div style={{ color: "#ffd700", fontSize: 12, marginBottom: 8 }}>
            ── Available Commands ──────────────────────────────────────────
          </div>
          {result.content.map((item) => (
            <div
              key={item.name}
              style={{ display: "flex", gap: 12, marginBottom: 4, fontSize: 13 }}
            >
              <span
                style={{ color: "#00c8ff", minWidth: 180, fontWeight: 500 }}
              >
                {item.usage}
              </span>
              <span style={{ color: "#00ff41aa" }}>{item.desc}</span>
            </div>
          ))}
          <div
            style={{
              color: "#00ff4144",
              fontSize: 11,
              marginTop: 8,
              borderTop: "1px solid #00ff4122",
              paddingTop: 8,
            }}
          >
            Use Tab for autocomplete │ ↑↓ for history
          </div>
        </div>
      );
    }

    if (result.type === "text" || result.type === "ping") {
      return (
        <div style={{ marginTop: 4, marginBottom: 4 }}>
          {result.lines.map((line, i) => (
            <div key={i} style={{ color: line.color, fontSize: 13, lineHeight: 1.8 }}>
              {line.text}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="scanlines" />

      <div
        style={{
          background: "#0f0f0f",
          borderBottom: "1px solid #00ff4133",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5555", "#ffd700", "#00ff41"].map((c, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c,
                boxShadow: `0 0 6px ${c}88`,
              }}
            />
          ))}
        </div>
        <span style={{ color: "#00ff4188", fontSize: 12, letterSpacing: 2 }}>
          contact-terminal — zsh — 80×24
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
          <span style={{ color: "#00ff4155", fontSize: 11 }}>SSH encrypted</span>
          <button
            onClick={onExit}
            style={{
              background: "transparent",
              border: "1px solid #ff555544",
              color: "#ff5555",
              fontSize: 11,
              padding: "2px 10px",
              cursor: "pointer",
              fontFamily: "Fira Code, monospace",
              letterSpacing: 1,
            }}
          >
            × exit
          </button>
        </div>
      </div>

      <div
        className="terminal-scrollbar crt-flicker"
        style={{
          flex: 1,
          padding: "20px 24px",
          overflowY: "auto",
          maxHeight: "calc(100vh - 48px)",
        }}
      >
        <pre
          style={{
            color: "#00ff41",
            fontSize: 11,
            lineHeight: 1.3,
            marginBottom: 16,
            textShadow: "0 0 8px #00ff4166",
            userSelect: "none",
          }}
        >
{`  ██████╗ ██████╗ ███╗   ██╗████████╗ █████╗  ██████╗████████╗
 ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝
 ██║     ██║   ██║██╔██╗ ██║   ██║   ███████║██║        ██║   
 ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██║██║        ██║   
 ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╗   ██║   
  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝  `}
        </pre>
        <div
          style={{
            color: "#00ff4155",
            fontSize: 11,
            marginBottom: 20,
            borderBottom: "1px solid #00ff4122",
            paddingBottom: 12,
          }}
        >
          Kali Linux Contact Terminal 2024.4 │ Type 'help' or 'ls' to get started
        </div>

        {lines.map((line) => {
          if (line.type === "boot") {
            return (
              <div key={line.id} style={{ color: line.color, fontSize: 13, lineHeight: 1.8 }}>
                {line.text}
              </div>
            );
          }
          if (line.type === "prompt") {
            return (
              <div key={line.id} style={{ display: "flex", gap: 6, marginTop: 8, fontSize: 13 }}>
                <span style={{ color: "#ff5555", fontWeight: 600 }}>root</span>
                <span style={{ color: "#00ff4166" }}>@</span>
                <span style={{ color: "#00c8ff" }}>kali</span>
                <span style={{ color: "#00ff4166" }}>:</span>
                <span style={{ color: "#ffd700" }}>~/contact</span>
                <span style={{ color: "#00ff41" }}>❯</span>
                <span style={{ color: "#ffffff" }}>{line.cmd}</span>
              </div>
            );
          }
          if (line.type === "result") {
            return <div key={line.id}>{renderResult(line.result)}</div>;
          }
          return null;
        })}

        {showForm && (
          <ContactFormTerminal
            onDone={() => {
              setShowForm(false);
            }}
          />
        )}

        {booted && !showForm && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            <span style={{ color: "#ff5555", fontSize: 13, fontWeight: 600 }}>root</span>
            <span style={{ color: "#00ff4166", fontSize: 13 }}>@</span>
            <span style={{ color: "#00c8ff", fontSize: 13 }}>kali</span>
            <span style={{ color: "#00ff4166", fontSize: 13 }}>:</span>
            <span style={{ color: "#ffd700", fontSize: 13 }}>~/contact</span>
            <span style={{ color: "#00ff41", fontSize: 13 }}>❯</span>
            <input
              ref={inputRef}
              className="terminal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            <span className="blink" style={{ color: "#00ff41" }}>
              █
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
function Field({ label, fieldKey, type, rows, formData, setFormData, focused, setFocused }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          color: focused === fieldKey ? "#00ff41" : "#00ff4177",
          fontSize: 11,
          letterSpacing: 2,
          marginBottom: 6,
          transition: "color 0.2s",
        }}
      >
        {label}
        {["name", "email", "message"].includes(fieldKey) && (
          <span style={{ color: "#ff5555" }}> *</span>
        )}
      </div>
      {rows ? (
        <textarea
          className="normal-input"
          rows={rows}
          value={formData[fieldKey]}
          onChange={(e) => setFormData((p) => ({ ...p, [fieldKey]: e.target.value }))}
          onFocus={() => setFocused(fieldKey)}
          onBlur={() => setFocused(null)}
          placeholder={`# enter ${label.toLowerCase()}...`}
          style={{ resize: "vertical", lineHeight: 1.6 }}
        />
      ) : (
        <input
          className="normal-input"
          type={type || "text"}
          value={formData[fieldKey]}
          onChange={(e) => setFormData((p) => ({ ...p, [fieldKey]: e.target.value }))}
          onFocus={() => setFocused(fieldKey)}
          onBlur={() => setFocused(null)}
          placeholder={`# enter ${label.toLowerCase()}...`}
        />
      )}
    </div>
  );
}

function NormalMode({ onExit,terminalMode,onSelect}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const {addToast}=useToast();
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(null);

  const handleSubmit =async () => {
    if (formData.name && formData.email && formData.message) {
      const payload = { ...formData };
      const res=await fetch("http://localhost:3001/api/contact",{
        body:JSON.stringify(payload),
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        }
        
      })
      if(res.ok){setSent(true);}
      else {
        addToast("Failed to send message. Please try again later.", "error");
        onSelect("normal");
      }
    }
  };

  const fieldProps = { formData, setFormData, focused, setFocused };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "40px 20px",
      }}
      className="fade-in"
    >
      <div
        style={{
          width: "100%",
          maxWidth: 680,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 40,
          borderBottom: "1px solid #00ff4122",
          paddingBottom: 16,
        }}
      >
        <div>
          <div style={{ color: "#00ff41", fontSize: 18, fontWeight: 600, letterSpacing: 2 }}>
            contact.sh
          </div>
          <div style={{ color: "#00ff4155", fontSize: 11, letterSpacing: 1, marginTop: 2 }}>
            /usr/bin/contact — Standard Mode
          </div>
        </div>
        <button
          className="submit-btn"
          onClick={terminalMode}
          style={{ fontSize: 11, padding: "6px 16px", borderColor: "#00ff4144", color: "#00ff4177" }}
        >
          ← Terminal Mode
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: 680 }}>
        <div
          style={{
            border: "1px solid #00ff4133",
            padding: "16px 20px",
            marginBottom: 32,
            background: "#00ff410a",
          }}
          className="slide-up"
        >
          <div style={{ color: "#00ff41", fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
            ── Contact Info ──────────────────────────────────
          </div>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            {[
              ["Email", "nitkkrpreviouspapers.vercel.app"],
              
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ color: "#00ff4166", fontSize: 10, letterSpacing: 2, marginBottom: 2 }}>
                  {k}
                </div>
                <div style={{ color: "#00c8ff", fontSize: 13 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {!sent ? (
          <>
            <Field label="YOUR NAME" fieldKey="name" {...fieldProps} />
            <Field label="EMAIL ADDRESS" fieldKey="email" type="email" {...fieldProps} />
            <Field label="SUBJECT" fieldKey="subject" {...fieldProps} />
            <Field label="MESSAGE" fieldKey="message" rows={5} {...fieldProps} />

            <div
              style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}
              className="slide-up"
            >
              <button className="submit-btn" onClick={handleSubmit}>
                ./send_message
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              border: "1px solid #00ff41",
              padding: "32px 28px",
              textAlign: "center",
            }}
            className="slide-up"
          >
            <div
              style={{
                color: "#00ff41",
                fontSize: 32,
                marginBottom: 12,
                textShadow: "0 0 20px #00ff41",
              }}
            >
              ✓
            </div>
            <div style={{ color: "#00ff41", fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
              Message Sent Successfully
            </div>
            <div style={{ color: "#00ff4177", fontSize: 12 }}>
              We'll respond to {formData.email} within 24 hours.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [mode, setMode] = useState(null);

  return (
    <>
      <Helmet>
        <title>Contact Us | NIT KKR PYQs</title>
        <meta
          name="description"
          content="Get in touch with the NIT KKR PYQs team for questions, feedback, or help contributing question papers and syllabus resources."
        />
      </Helmet>
      {mode === null && <ModeModal onSelect={setMode} />}
      {mode === "terminal" && <TerminalMode onExit={() => setMode(null)}/>}
      {mode === "normal" && <NormalMode onSelect={setMode} onExit={() => setMode(null)}terminalMode={()=>setMode("terminal")}  />}
      {mode === null && (
        <div
          style={{
            minHeight: "100vh",
            background: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="blink" style={{ color: "#00ff41", fontSize: 14 }}>
            █
          </div>
        </div>
      )}
    </>
  );
}