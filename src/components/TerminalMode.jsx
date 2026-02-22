import { React, useEffect, useState, useRef, useCallback } from "react";
import "./TerminalView.css";
const fileSystem = {
  home: {
    kali: {
      login: {
        "login.py": null,
      },
      signup: {
        "signup.py": null,
      },
      contact: {
        "contact.py": null,
      },
    },
  },
};
let cwd = ["home", "kali"];
function tokenize(path) {
  return path.split("/").filter(Boolean);
}
function resolvePath(inputPath) {
  let newPath = inputPath.startsWith("/") ? [] : [...cwd];

  const tokens = tokenize(inputPath);

  for (let token of tokens) {
    if (token === ".") continue;

    if (token === "..") {
      newPath.pop();
    } else {
      newPath.push(token);
    }
  }

  return newPath;
}
function pathExists(pathArray) {
  let node = fileSystem;

  for (let folder of pathArray) {
    if (!node[folder] || node[folder] === null) return null;

    node = node[folder];
  }

  return node;
}
function collectFiles(node, result = []){
  for(let key in node){
    if(node[key] === null){
        result.push(key); 
    }
    else{
        collectFiles(node[key], result); 
    }

  }
  return result;
}
const cd = (path) => {
  const resolved = resolvePath(path);

  if (pathExists(resolved)!==null) {
    cwd = resolved;
    return "";
  } else {
    console.log("Hey");
    return `cd: no such file or directory: ${path}`;
  }
};
function pwd() {
  return "" + cwd.join("/");
}
function getNode(pathArray) {
  let node = fileSystem;

  for (let folder of pathArray) {
    node = node[folder];
  }

  return node;
}
function ls() {
  const dir = pathExists(cwd);
   if(!dir)
    return "ls: no such directory";
// console.log(dir);
return dir;
}
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

function processCommand(cmd, history, Mode) {
  const trimmed = cmd.trim().toLowerCase();
  const raw = cmd.trim();
  switch (true) {
    case trimmed.startsWith("cd"):
      const parts = trimmed.split(" ");
      const target = parts[1] || "~";

      const result = cd(target);
      if (result)
        return {
          type: "text",
          lines: [{text:result, color: "#ff5555"}],
        };
      return {
        type: "empty",
      };
    case trimmed.startsWith("python3"):
        const tokens=trimmed.split(" ").filter(Boolean);
        const file=tokens[1];
        
    case trimmed==="ls":
    case trimmed==="ls -la":
    case trimmed==="ls --all":
      return {
        type: "ls",
        content: Object.entries(ls()).map(([k, v]) => ({
          name: k
        })),
      };

    case trimmed==="help":
      return {
        type: "help",
        content: Object.entries(COMMANDS).map(([k, v]) => ({
          name: k,
          desc: v.desc,
          usage: v.usage,
        })),
      };

    case trimmed==="whoami":
      return {
        type: "text",
        lines: [
          { text: "root", color: "#ff5555" },
          {
            text: "uid=0(root) gid=0(root) groups=0(root),4(adm),24(cdrom)",
            color: "#00ff41",
          },
          {
            text: "Shell: /bin/zsh  |  Terminal: xterm-256color",
            color: "#00c8ff",
          },
        ],
      };

    case trimmed==="pwd":
      return {
        type: "text",
        lines: [{ text: "/" + cwd.join("/"), color: "#00ff41" }],
      };

    case trimmed==="date":
      return {
        type: "text",
        lines: [{ text: new Date().toString(), color: "#00c8ff" }],
      };

    case trimmed==="uname -a":
    case trimmed==="uname":
      return {
        type: "text",
        lines: [
          {
            text: "Linux kali 6.5.0-kali3-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.5.6-1kali1 x86_64 GNU/Linux",
            color: "#00ff41",
          },
        ],
      };

    case trimmed==="cat about.txt":
      return {
        type: "text",
        lines: [
          {
            text: "╔══════════════════════════════════════╗",
            color: "#00ff41",
          },
          {
            text: "║         ABOUT US                     ║",
            color: "#00ff41",
          },
          {
            text: "╠══════════════════════════════════════╣",
            color: "#00ff41",
          },
          {
            text: "║  We are a cybersecurity & dev firm.  ║",
            color: "#00c8ff",
          },
          {
            text: "║  Building tools that matter.         ║",
            color: "#00c8ff",
          },
          {
            text: "║  Est. 2020  |  Remote-first team     ║",
            color: "#00c8ff",
          },
          {
            text: "║  Email: hello@contact-terminal.io    ║",
            color: "#ffd700",
          },
          {
            text: "║  Phone: +1 (800) 000-KALI            ║",
            color: "#ffd700",
          },
          {
            text: "╚══════════════════════════════════════╝",
            color: "#00ff41",
          },
        ],
      };

    case trimmed==="cat socials.txt":
      return {
        type: "text",
        lines: [
          {
            text: "── Social Links ──────────────────────────",
            color: "#00ff41",
          },
          {
            text: "  GitHub    →  github.com/contact-terminal",
            color: "#00c8ff",
          },
          {
            text: "  Twitter   →  twitter.com/contact-terminal",
            color: "#00c8ff",
          },
          { text: "  LinkedIn  →  linkedin.com/company/ct", color: "#00c8ff" },
          {
            text: "  Discord   →  discord.gg/contact-terminal",
            color: "#00c8ff",
          },
          {
            text: "──────────────────────────────────────────",
            color: "#00ff41",
          },
        ],
      };

    case trimmed==="cat team.txt":
      return {
        type: "text",
        lines: [
          {
            text: "── Team ──────────────────────────────────",
            color: "#00ff41",
          },
          { text: "  root      →  System Admin & Founder", color: "#ff5555" },
          { text: "  ghost     →  Lead Security Researcher", color: "#00c8ff" },
          { text: "  cipher    →  Full Stack Developer", color: "#00c8ff" },
          {
            text: "  phantom   →  UI/UX & Frontend Engineer",
            color: "#00c8ff",
          },
          {
            text: "──────────────────────────────────────────",
            color: "#00ff41",
          },
        ],
      };

    case trimmed==="ping contact.server":
    case trimmed==="ping":
      return {
        type: "ping",
        lines: [
          {
            text: "PING contact.server (93.184.216.34): 56 data bytes",
            color: "#00ff41",
          },
          {
            text: "64 bytes from 93.184.216.34: icmp_seq=0 ttl=56 time=11.2 ms",
            color: "#00c8ff",
          },
          {
            text: "64 bytes from 93.184.216.34: icmp_seq=1 ttl=56 time=9.8 ms",
            color: "#00c8ff",
          },
          {
            text: "64 bytes from 93.184.216.34: icmp_seq=2 ttl=56 time=10.1 ms",
            color: "#00c8ff",
          },
          { text: "--- contact.server ping statistics ---", color: "#00ff41" },
          {
            text: "3 packets transmitted, 3 received, 0% packet loss",
            color: "#ffd700",
          },
        ],
      };

    case trimmed==="contact":
      return { type: "contact_form" };

    case trimmed==="history":
      return {
        type: "text",
        lines: history.map((h, i) => ({
          text: `  ${String(i + 1).padStart(3)}  ${h}`,
          color: "#00ff41",
        })),
      };

    case trimmed==="clear":
      return { type: "clear" };

    case trimmed==="exit":
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
function TerminalMode({ onExit, Mode }) {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const [dir,setDir]=useState(null);
  useEffect(()=>{
    setDir(pwd());
  },[cwd]);
  const BOOT_LINES = [
    {
      text: `[ OK ] Starting Kali Linux ${Mode} Terminal...`,
      delay: 0,
      color: "#00ff41",
    },
    { text: "[ OK ] Loading kernel modules...", delay: 100, color: "#00ff41" },
    {
      text: "[ OK ] Mounting contact filesystem...",
      delay: 200,
      color: "#00ff41",
    },
    {
      text: "[ OK ] Initializing network interface eth0...",
      delay: 300,
      color: "#00ff41",
    },
    { text: "[ OK ] Starting SSH service...", delay: 400, color: "#00ff41" },
    {
      text: "[ OK ] Loading security protocols...",
      delay: 500,
      color: "#00c8ff",
    },
    {
      text: "[ WARN] Unauthorized access will be logged.",
      delay: 600,
      color: "#ffd700",
    },
    {
      text: "[ OK ] System ready. Type 'help' for available commands.",
      delay: 700,
      color: "#00ff41",
    },
    { text: "", delay: 800, color: "" },
  ];
  useEffect(() => {
    let timeout;
    BOOT_LINES.forEach((line) => {
      timeout = setTimeout(() => {
        setLines((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            type: "boot",
            text: line.text,
            color: line.color,
          },
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
    setLines((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), ...content },
    ]);
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

    const result = processCommand(trimmed, [...cmdHistory, trimmed], Mode);
    if (result.type == null) {
      setLines([]);
      return;
    }
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
      setInput(
        newIdx === -1 ? "" : cmdHistory[cmdHistory.length - 1 - newIdx] || "",
      );
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = Object.keys(COMMANDS).filter((k) =>
        k.startsWith(input.toLowerCase()),
      );
      if (matches.length === 1) setInput(matches[0]);
    }
  };

  const renderResult = (result) => {
    if (result.type === "ls") {
      return (
        <div style={{ marginTop: 6, marginBottom: 6 }}>
          <div
            style={{
              color: "#00ff4166",
              fontSize: 11,
              marginBottom: 8,
              letterSpacing: 2,
            }}
          >
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
                <span style={{ color: "#00c8ff", fontSize: 13, minWidth: 120 }}>
                  {item.name}
                </span>
                <span
                  style={{ color: "#00ff4166", fontSize: 11, lineHeight: 1.6 }}
                >
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
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 4,
                fontSize: 13,
              }}
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
          {result.lines?.map((line, i) => (
            <div
              key={i}
              style={{ color: line.color, fontSize: 13, lineHeight: 1.8 }}
            >
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
          {Mode}-terminal — zsh — 80×24
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
          <span style={{ color: "#00ff4155", fontSize: 11 }}>
            SSH encrypted
          </span>
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
          {Mode === "contact" &&
            `  ██████╗ ██████╗ ███╗   ██╗████████╗ █████╗  ██████╗████████╗
 ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝
 ██║     ██║   ██║██╔██╗ ██║   ██║   ███████║██║        ██║   
 ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██║██║        ██║   
 ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╗   ██║   
  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝  `}
          {Mode === "login" &&
            `██╗      ██████╗  ██████╗ ██╗███╗   ██╗
██║     ██╔═══██╗██╔════╝ ██║████╗  ██║
██║     ██║   ██║██║  ███╗██║██╔██╗ ██║
██║     ██║   ██║██║   ██║██║██║╚██╗██║
███████╗╚██████╔╝╚██████╔╝██║██║ ╚████║
╚══════╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝
                                       `}
          {Mode === "signup" &&
            `███████╗██╗ ██████╗ ███╗   ██╗    ██╗   ██╗██████╗ 
██╔════╝██║██╔════╝ ████╗  ██║    ██║   ██║██╔══██╗
███████╗██║██║  ███╗██╔██╗ ██║    ██║   ██║██████╔╝
╚════██║██║██║   ██║██║╚██╗██║    ██║   ██║██╔═══╝ 
███████║██║╚██████╔╝██║ ╚████║    ╚██████╔╝██║     
╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═══╝     ╚═════╝ ╚═╝     
                                                   `}
          {Mode === null &&
            `██╗     ██╗███╗   ██╗██╗   ██╗██╗  ██╗
██║     ██║████╗  ██║██║   ██║╚██╗██╔╝
██║     ██║██╔██╗ ██║██║   ██║ ╚███╔╝ 
██║     ██║██║╚██╗██║██║   ██║ ██╔██╗ 
███████╗██║██║ ╚████║╚██████╔╝██╔╝ ██╗
╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝
                                      `}
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
          Kali Linux {Mode} Terminal 2024.4 │ Type 'help' or 'ls' to get started
        </div>

        {lines.map((line) => {
          if (line.type === "boot") {
            return (
              <div
                key={line.id}
                style={{ color: line.color, fontSize: 13, lineHeight: 1.8 }}
              >
                {line.text}
              </div>
            );
          }
          if (line.type === "prompt") {
            return (
              <div
                key={line.id}
                style={{ display: "flex", gap: 6, marginTop: 8, fontSize: 13 }}
              >
                <span style={{ color: "#ff5555", fontWeight: 600 }}>root</span>
                <span style={{ color: "#00ff4166" }}>@</span>
                <span style={{ color: "#00c8ff" }}>kali</span>
                <span style={{ color: "#00ff4166" }}>:</span>
                <span style={{ color: "#ffd700" }}>~/{Mode ? Mode : null}</span>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 8,
            }}
          >
            <span style={{ color: "#ff5555", fontSize: 13, fontWeight: 600 }}>
              root
            </span>
            <span style={{ color: "#00ff4166", fontSize: 13 }}>@</span>
            <span style={{ color: "#00c8ff", fontSize: 13 }}>kali</span>
            <span style={{ color: "#00ff4166", fontSize: 13 }}>:</span>
            <span style={{ color: "#ffd700", fontSize: 13 }}>
              ~/{dir}
            </span>
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
function Field({
  label,
  fieldKey,
  type,
  rows,
  formData,
  setFormData,
  focused,
  setFocused,
}) {
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
          onChange={(e) =>
            setFormData((p) => ({ ...p, [fieldKey]: e.target.value }))
          }
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
          onChange={(e) =>
            setFormData((p) => ({ ...p, [fieldKey]: e.target.value }))
          }
          onFocus={() => setFocused(fieldKey)}
          onBlur={() => setFocused(null)}
          placeholder={`# enter ${label.toLowerCase()}...`}
        />
      )}
    </div>
  );
}

export default function TerminalPage({ Mode }) {
  const [mode, setMode] = useState("terminal");

  return (
    <>
      {mode === "terminal" && (
        <TerminalMode onExit={() => setMode(null)} Mode={Mode} />
      )}
      {mode === "normal" && (
        <NormalMode
          onExit={() => setMode(null)}
          terminalMode={() => setMode("terminal")}
        />
      )}
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
