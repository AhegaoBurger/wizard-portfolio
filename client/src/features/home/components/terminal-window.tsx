import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";

interface TerminalWindowProps {
  mobile?: boolean;
}

const PROMPT = "wizard@portfolio ~ $ ";

const COMMANDS: Record<string, string | ((args: string[]) => string)> = {
  help: `Available commands:
  help        Show this help message
  about       About the wizard
  skills      List skills
  projects    List projects
  contact     Contact info
  hire-me     Why you should hire me
  whoami      Who are you?
  ls          List directory
  open        Open a page (grimoire, spells, potions, trash)
  clear       Clear the terminal
  sudo        Superuser commands`,

  about: `Artur Shirokov — Software Engineer
Based in Lisbon, PT
Specializing in ML, Robotics, and Systems Engineering.
Building things that matter with code and caffeine.`,

  skills: `[■■■■■] Frontend     [■■■■■] Backend
[■■■■□] ML/AI        [■■■■■] Systems
[■■■□□] Robotics     [■■■■■] Security`,

  projects: `1. Trading Dashboard  — Real-time trading platform
2. Canister Cloud     — E2E encrypted storage
3. Portfolio Analytics — Cross-exchange analytics
Type "open grimoire" to see all projects.`,

  contact: `Email: artur.wiseman@proton.me
GitHub: github.com/AhegaoBurger
Location: Lisbon, PT`,

  "hire-me": `> Hire this wizard? Here's why:
  - Ships production code, not prototypes
  - ML + Systems + Web = rare combination
  - Turns caffeine into features at alarming rates
  - Will debug your code at 3 AM (actually enjoys it)

  → artur.wiseman@proton.me`,

  whoami: "You are a curious visitor exploring the wizard's terminal. Welcome.",

  ls: `grimoire/  spells/  potions/  trash/  README.md  .secrets`,
};

const EASTER_EGGS: Record<string, string> = {
  "sudo rm -rf /": "Nice try. Permission denied. 🛡️",
  "sudo rm -rf": "Nice try. Permission denied. 🛡️",
  "rm -rf /": "Permission denied. Only wizards can destroy the filesystem.",
  "cat .secrets": "You found: just kidding, the real secrets are in the code.",
  "vim": "Why would you open vim? You'd never escape.",
  "exit": "There is no escape from the wizard's terminal.",
  "cd ..": "You cannot leave. The wizard's realm is infinite.",
  "pwd": "/home/wizard/portfolio",
  "echo hello": "hello",
  "ping google.com": "Pinging the mortal realm... 64 bytes from google.com: time=42ms",
  "date": new Date().toLocaleString(),
  "neofetch": `    ✦ Wizard OS v3.2.1
    ──────────────────
    OS:     WizardOS 3.2.1
    Host:   Portfolio Server
    Kernel: Bun + Hono
    Shell:  wizard-sh
    Theme:  Retro Mac [Dark]
    Font:   ChicagoFLF`,
};

const OPEN_ROUTES: Record<string, string> = {
  grimoire: "/grimoire",
  spells: "/spells",
  potions: "/potions",
  trash: "/trash",
};

export default function TerminalWindow({ mobile }: TerminalWindowProps) {
  const navigate = useNavigate();
  const [history, setHistory] = useState<{ input: string; output: string }[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      if (!trimmed) return;

      const fullCmd = trimmed.toLowerCase();
      let output = "";

      // Check easter eggs first (full match)
      if (EASTER_EGGS[fullCmd]) {
        output = EASTER_EGGS[fullCmd];
      } else if (fullCmd === "clear") {
        setHistory([]);
        setInput("");
        setCommandHistory((prev) => [...prev, trimmed]);
        setHistoryIndex(-1);
        return;
      } else if (fullCmd.startsWith("open ")) {
        const target = fullCmd.slice(5).trim();
        const route = OPEN_ROUTES[target];
        if (route) {
          output = `Opening ${target}...`;
          setHistory((prev) => [...prev, { input: trimmed, output }]);
          setInput("");
          setCommandHistory((prev) => [...prev, trimmed]);
          setHistoryIndex(-1);
          setTimeout(() => navigate({ to: route }), 500);
          return;
        }
        output = `Unknown page: "${target}". Try: grimoire, spells, potions, trash`;
      } else if (fullCmd.startsWith("sudo ")) {
        output = EASTER_EGGS[fullCmd] ?? "Permission denied. You are not a wizard... yet.";
      } else if (fullCmd.startsWith("echo ")) {
        output = trimmed.slice(5);
      } else {
        const baseCmd = fullCmd.split(" ")[0];
        const handler = COMMANDS[baseCmd];
        if (typeof handler === "function") {
          output = handler(fullCmd.split(" ").slice(1));
        } else if (typeof handler === "string") {
          output = handler;
        } else {
          output = `command not found: ${baseCmd}. Type "help" for available commands.`;
        }
      }

      setHistory((prev) => [...prev, { input: trimmed, output }]);
      setInput("");
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
    },
    [navigate]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  return (
    <div
      className={`bg-black text-white font-mono text-xs ${
        mobile ? "h-full" : "h-64"
      } flex flex-col`}
      onClick={focusInput}
    >
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 space-y-1"
      >
        <div className="text-white/40 mb-2">
          Wizard Terminal v1.0 — Type "help" for commands
        </div>

        {history.map((entry, i) => (
          <div key={i}>
            <div className="flex">
              <span className="text-white/60 shrink-0">{PROMPT}</span>
              <span className="text-white">{entry.input}</span>
            </div>
            {entry.output && (
              <pre className="text-white/80 whitespace-pre-wrap pl-2 mt-0.5">
                {entry.output}
              </pre>
            )}
          </div>
        ))}

        <div className="flex items-center">
          <span className="text-white/60 shrink-0">{PROMPT}</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-white outline-none w-full caret-transparent font-mono text-xs"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
            <span
              className="absolute top-0 left-0 pointer-events-none font-mono text-xs"
              aria-hidden
            >
              <span className="invisible">{input}</span>
              <span className="animate-flicker text-white">▌</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
