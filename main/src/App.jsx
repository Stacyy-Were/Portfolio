import { useState, useEffect, useRef } from "react";
import {
  Mail, Download, Menu, X, TerminalSquare, Radar, ChevronRight, ShieldCheck,
  GitFork, Link, Video, MessageCircle, ArrowUp, ExternalLink, Send, Shuffle,
  Server, Skull, Monitor, Bug, Code2, Database, Braces, Cpu, Terminal,
  BookOpen, Plane, Tv, Gauge, Music, Flag, ChevronDown,
} from "lucide-react";
import heroImage from "./assets/1141405.jpg";

// lucide-react v1 dropped the Github/Linkedin brand icons — map to close equivalents
const Github = GitFork;
const Linkedin = Link;

/* =========================================================
  CONFIG — set these in .env.local or Vercel Environment Variables.
  Project Settings -> API -> Project URL / anon public key
  ========================================================= */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const RESUME_FILE_PATH = "resume.pdf";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_DOMAIN_TYPOS = {
  "gmai.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmail.co": "gmail.com",
  "yaho.com": "yahoo.com",
  "outlok.com": "outlook.com",
  "hotmial.com": "hotmail.com",
};

function isValidEmail(value) {
  const normalized = value.trim();
  if (normalized.length > 254 || !EMAIL_PATTERN.test(normalized)) return false;
  const domain = normalized.split("@").pop().toLowerCase();
  return !EMAIL_DOMAIN_TYPOS[domain];
}

const COLORS = {
  c1: "#c991a8",
  c2: "#b45a7a",
  c3: "#9f3565",
  c4: "#691261",
  c5: "#35023e",
  ink: "#0c0110",
  paper: "#f6e9ee",
  line: "rgba(201,145,168,0.18)",
};

const ROLES = [
  "Jr. SOC Analyst",
  "Threat Hunter",
  "I.T Specialist",
  "Incident Responder",
];

/* ---------- Simple Icons CDN helper ----------
   https://simpleicons.org — free brand SVG icons served as <img>
   We tint them light (paper colour) via the hex param.
   For icons not on Simple Icons we fall back to a Lucide icon.
   ------------------------------------------------ */
const SI_COLOR = "c991a8"; // COLORS.c1 without #
function SiIcon({ slug, size = 22, alt = slug }) {
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/${SI_COLOR}`}
      alt={alt}
      width={size}
      height={size}
      style={{ display: "inline-block", verticalAlign: "middle" }}
      loading="lazy"
    />
  );
}

function LanguageIcon({ slug, label }) {
  if (slug === "powershell") {
    return (
      <span
        aria-label={label}
        title={label}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, border: `1px solid ${COLORS.c1}`, borderRadius: 3, color: COLORS.c1, fontFamily: "ui-monospace, monospace", fontSize: 11, fontWeight: 700, lineHeight: 1 }}
      >
        &gt;_
      </span>
    );
  }
  return <SiIcon slug={slug} size={18} alt={label} />;
}

/* ---------- tech stack: lab + languages ---------- */
const STACK = [
  {
    id: "ubuntu", cat: "os", role: "Host OS", name: "Ubuntu",
    siSlug: "ubuntu", LucideIcon: Server,
    short: "The daily-driver host the whole lab runs on.",
    detail: "Every VM and tool below runs on top of this Ubuntu host — it's home base.",
  },
  {
    id: "kali", cat: "attack", role: "Attack platform", name: "Kali Linux",
    siSlug: "kalilinux", LucideIcon: Skull,
    short: "Primary VM for scanning, enumeration and exploitation practice.",
    detail: "Used daily for running Nmap scans, Metasploit modules and enumerating services against the lab's target machines.",
  },
  {
    id: "parrot", cat: "attack", role: "Attack platform", name: "Parrot OS",
    siSlug: "parrotsecurity", LucideIcon: Radar,
    short: "Secondary offensive-security distro for recon and traffic analysis.",
    detail: "A second attack box for comparing tooling and workflows, and for capturing and inspecting traffic alongside Kali.",
  },
  {
    id: "win10", cat: "target", role: "Target", name: "Windows 10",
    siSlug: "windows", LucideIcon: Monitor,
    short: "Target machine for studying Windows logs, services and attack surfaces.",
    detail: "Used to get comfortable with Event Viewer logs, Windows services and how attacks look from the defender's side.",
  },
  {
    id: "meta2", cat: "target", role: "Target", name: "Metasploitable 2",
    siSlug: null, LucideIcon: Bug,
    short: "Deliberately vulnerable Linux target for exploitation fundamentals.",
    detail: "A classic beginner-friendly vulnerable box for practicing exploitation basics safely, in an isolated lab.",
  },
  {
    id: "meta3", cat: "target", role: "Target", name: "Metasploitable 3",
    siSlug: null, LucideIcon: Bug,
    short: "Next-step vulnerable target for advanced scanning and exploitation drills.",
    detail: "A step up from Metasploitable 2 - more realistic services and misconfigurations to dig into.",
  },
  {
    id: "python", cat: "lang", role: "Language", name: "Python",
    siSlug: "python", LucideIcon: Code2,
    short: "Automation, log parsing and building custom security tools.",
    detail: "The language reached for first; scripting recon, parsing logs, and gluing tools together.",
  },
  {
    id: "bash", cat: "lang", role: "Scripting", name: "Bash / Shell",
    siSlug: "gnubash", LucideIcon: TerminalSquare,
    short: "Navigating Linux and chaining commands from the terminal.",
    detail: "Lives inside Kali and Parrot day to day — automating recon straight from the shell.",
  },
  {
    id: "powershell", cat: "lang", role: "Scripting", name: "PowerShell",
    siSlug: "powershell", LucideIcon: Terminal,
    short: "Working inside Windows environments — enumeration and automation.",
    detail: "Used against the Windows 10 target VM to understand AD-style enumeration and attacker tradecraft.",
  },
  {
    id: "sql", cat: "lang", role: "Language", name: "SQL",
    siSlug: "postgresql", LucideIcon: Database,
    short: "Understanding databases well enough to test for injection flaws.",
    detail: "Practicing enough SQL to recognize and test for injection issues in labs and CTF rooms.",
  },
  {
    id: "javascript", cat: "lang", role: "Language", name: "JavaScript",
    siSlug: "javascript", LucideIcon: Braces,
    short: "Reading client-side code for web app testing.",
    detail: "Reading and poking at front-end code — useful for web app testing and understanding XSS.",
  },
  {
    id: "c", cat: "lang", role: "Language", name: "C / C++",
    siSlug: "cplusplus", LucideIcon: Cpu,
    short: "Building intuition for memory and low-level exploits.",
    detail: "Still early here — building the low-level intuition behind memory and how exploits work under the hood.",
  },
];

const STACK_FILTERS = [
  ["all", "All"],
  ["os", "OS & Host"],
  ["attack", "Attack Platforms"],
  ["target", "Target Machines"],
  ["lang", "Languages & Scripting"],
];

/* ---------- practice platforms with favicons ---------- */
const PLATFORMS = [
  { name: "TryHackMe",      domain: "tryhackme.com",      url: "https://tryhackme.com",      desc: "Guided rooms across offensive and defensive security paths." },
  { name: "HackerDNA",      domain: "hackerdna.com",      url: "https://hackerdna.com",      desc: "Hands-on challenges to sharpen practical skills." },
  { name: "Hackviser",      domain: "hackviser.com",      url: "https://hackviser.com",      desc: "Realistic labs for offensive-security practice." },
  { name: "OverTheWire",    domain: "overthewire.org",    url: "https://overthewire.org",    desc: "Classic wargames for Linux and security fundamentals." },
  { name: "Hacker101",      domain: "hacker101.com",      url: "https://www.hacker101.com",  desc: "HackerOne's free platform for learning web-app hacking." },
  { name: "CyberDefenders", domain: "cyberdefenders.org", url: "https://cyberdefenders.org", desc: "Blue-team focused DFIR and SOC challenges." },
  { name: "KC7 Cyber",      domain: "kc7cyber.com",       url: "https://kc7cyber.com",       desc: "A threat-hunting game built on real network telemetry." },
];

function PlatformIcon({ domain, name, size = 28 }) {
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt={name}
      width={size}
      height={size}
      style={{ borderRadius: 6, display: "block" }}
      loading="lazy"
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
  );
}

const TOOLS = [
  { name: "Subverted.io",  url: "https://subverted.io" },
  { name: "Hackviser",     url: "https://hackviser.com" },
  { name: "TryHackMe",     url: "https://tryhackme.com" },
  { name: "HackTheBox",    url: "https://www.hackthebox.com" },
  { name: "Wireshark",     url: "https://www.wireshark.org" },
  { name: "Burp Suite",    url: "https://portswigger.net/burp" },
  { name: "Cisco",         url: "https://www.netacad.com" },
  { name: "SIEM",          url: null },
];

const PROJECTS = [
  { name: "HackerDNA-CTF",     url: null,                                          desc: "Write-ups and solutions from HackerDNA CTF challenges." },
  { name: "CVE Lab",           url: "https://github.com/Stacyy-Were/CVE-Lab",      desc: "A hands-on lab exploring and documenting real-world CVEs." },
  { name: "Device Fingerprint", url: "https://github.com/Stacyy-Were/Device_Fingerprint", desc: "A project exploring device fingerprinting techniques." },
  { name: "CampusCompas",      url: "https://github.com/Stacyy-Were/CampusCompas", desc: "CampusCompas — a campus-focused build." },
];

/* ---------- interests: edit these lists as you go ---------- */
const ANIME_WATCHED = ["Attack on Titan","Death Note", "Jujutsu Kaisen", "Demon Slayer", "Naruto", "Bleach", "Dragon Ball Z", "Hunter x Hunter", "Nana", "Doctor Stone", "Dan Da Dan", "Gudetama", "Solo Leveling"];
const ANIMATIONS = ["Rise of the Guardians", "Meet the Robinsons", "Rick and Morty", "The Lorax", "Ratatouille", "Kung Fu Panda", "Big Hero 6"];
const CTF_INTERESTS = ["Web exploitation", "Digital forensics", "Linux privilege escalation"];
const SPOTIFY_URL = "https://open.spotify.com/";
const MCLAREN_URL = "https://www.mclaren.com/racing/formula-1/";

/* ---------- languages & scripting for About ---------- */
const ABOUT_LANGS = [
  { slug: "python",     label: "Python" },
  { slug: "gnubash",    label: "Bash / Shell" },
  { slug: "powershell", label: "PowerShell" },
  { slug: "linux", label: "Linux" },
  { slug: "javascript", label: "JavaScript" },
  { slug: "postgresql", label: "SQL" },
  { slug: "cplusplus",  label: "C / C++" },
];

const JOURNEY = [
  { tag: "[2025 - Ongoing]", title: "[Practical Learning]", desc: "[Built a home lab (Kali, Parrot, Metasploitable) and started CTFs on TryHackMe, HackerDNA, and others — turning curiosity into deliberate practice.]" },
  { tag: "[2025]", title: "[Internship]", desc: "[IT Support Internship at Bush & Beyond Ltd. Troubleshooting, systems support, documentation.]" },
  { tag: "[2023 - 2024]", title: "[Pull towards security]", desc: "[Began Bachelor's in IT at JKUAT, and got an interest in cybersecurity (logs, networks, how attacks happen).]" },
  { tag: "[2020]", title: "[Where it started]", desc: "[Started Diploma in IT at JKUAT. Built the fundamentals — how systems, networks, and software actually work]" },
];

const SOCIALS = [
  { label: "GitHub",   icon: Github,        url: "https://github.com/Stacyy-Were" },
  { label: "Email",    icon: Mail,          url: "mailto:stacyywere@gmail.com" },
  { label: "LinkedIn", icon: Linkedin,      url: "https://linkedin.com/in/stacy-were" },
  { label: "Teams",    icon: Video,         url: "https://teams.microsoft.com/l/chat/0/0?users=stacyywere@gmail.com" },
  { label: "WhatsApp", icon: MessageCircle, url: "https://wa.me/+254115018697" },
];

const NAV = [
  { id: "about",    label: "About" },
  { id: "journey",  label: "Journey" },
  { id: "stack",    label: "Stack" },
  { id: "practice", label: "Practice" },
  { id: "learning", label: "Tools" },
  { id: "projects", label: "Projects" },
  { id: "contact",  label: "Let's Talk" },
];

/* ---------- reveal on scroll ---------- */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}
function Reveal({ children }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
      {children}
    </div>
  );
}

/* ---------- tiny outline device icons for the hero background ---------- */
const iconProps = { viewBox: "0 0 64 64", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
const LaptopIcon  = () => (<svg {...iconProps}><rect x="14" y="14" width="36" height="23" rx="2" /><path d="M8 45h48l-5 6H13z" /></svg>);
const DesktopIcon = () => (<svg {...iconProps}><rect x="16" y="10" width="32" height="22" rx="2" /><line x1="26" y1="32" x2="26" y2="40" /><line x1="38" y1="32" x2="38" y2="40" /><rect x="18" y="40" width="28" height="4" rx="1" /><rect x="20" y="48" width="24" height="4" rx="1" /></svg>);
const ServerBgIcon = () => (<svg {...iconProps}><rect x="14" y="10" width="36" height="11" rx="2" /><rect x="14" y="26" width="36" height="11" rx="2" /><rect x="14" y="42" width="36" height="11" rx="2" /><circle cx="20" cy="15.5" r="1.4" fill="currentColor" stroke="none" /><circle cx="20" cy="31.5" r="1.4" fill="currentColor" stroke="none" /><circle cx="20" cy="47.5" r="1.4" fill="currentColor" stroke="none" /></svg>);
const TerminalBgIcon = () => (<svg {...iconProps}><rect x="8" y="12" width="48" height="36" rx="3" /><path d="m17 24 7 6-7 6" /><line x1="30" y1="36" x2="43" y2="36" /></svg>);
const RouterIcon  = () => (<svg {...iconProps}><rect x="10" y="30" width="44" height="16" rx="3" /><line x1="20" y1="30" x2="16" y2="14" /><line x1="34" y1="30" x2="34" y2="12" /><line x1="46" y1="30" x2="50" y2="16" /><circle cx="44" cy="38" r="1.4" fill="currentColor" stroke="none" /></svg>);
const SwitchIcon  = () => (<svg {...iconProps}><rect x="8" y="24" width="48" height="16" rx="2" />{Array.from({ length: 8 }).map((_, i) => <rect key={i} x={12 + i * 5.5} y="30" width="3" height="4" fill="currentColor" stroke="none" />)}</svg>);
const CableIcon   = () => (<svg {...iconProps}><path d="M6 32c6 0 6-10 12-10s6 10 12 10 6-10 12-10 6 10 12 10" /><rect x="44" y="26" width="12" height="12" rx="1.5" /></svg>);
const SurveyCorpsIcon = () => (<svg {...iconProps}><path d="M32 8 40 20 54 22 44 32 47 47 32 40 17 47 20 32 10 22 24 20z" /><path d="M32 19v22M21 26h22M23 37h18" /></svg>);
const GarrisonIcon = () => (<svg {...iconProps}><path d="M12 16h40M16 16v31M48 16v31M12 47h40M20 16v31M44 16v31" /><path d="M25 47V30h14v17M25 24h14" /></svg>);
const MilitaryPoliceIcon = () => (<svg {...iconProps}><path d="M32 8 51 16v14c0 12-8 20-19 26-11-6-19-14-19-26V16z" /><path d="m23 29 6 6 12-13M22 45h20" /></svg>);

function FloatingIcon({ children, top, left, size, duration, delay, opacity }) {
  return (
    <div style={{ position: "absolute", top, left, width: size, height: size, color: COLORS.c1, opacity, filter: `drop-shadow(0 0 10px ${COLORS.c3})`, animation: `floaty ${duration}s ease-in-out ${delay}s infinite` }}>
      {children}
    </div>
  );
}

/* ---------- stack card icon: brand if available, lucide fallback ---------- */
function StackIcon({ s, size = 28 }) {
  if (s.siSlug) return <SiIcon slug={s.siSlug} size={size} alt={s.name} />;
  const Icon = s.LucideIcon;
  return <Icon size={size} color={COLORS.c1} />;
}

export default function Portfolio() {
  const [scroll, setScroll] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const isMobile = width < 760;

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollHostRef = useRef(null);

  useEffect(() => {
    const host = scrollHostRef.current;
    if (!host) return;
    const onScroll = () => {
      const max = host.scrollHeight - host.clientHeight;
      setScroll(max > 0 ? (host.scrollTop / max) * 100 : 0);
    };
    host.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => host.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setNavOpen(false);
    const host = scrollHostRef.current;
    const el = host?.querySelector(`#${id}`);
    if (el && host) host.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });
  };

  /* ---------- typed roles ---------- */
  const [roleText, setRoleText] = useState("");
  useEffect(() => {
    let ri = 0, ci = 0, deleting = false, timer;
    const tick = () => {
      const current = ROLES[ri];
      if (!deleting) {
        ci++;
        if (ci > current.length) { deleting = true; timer = setTimeout(tick, 1200); return; }
      } else {
        ci--;
        if (ci === 0) { deleting = false; ri = (ri + 1) % ROLES.length; }
      }
      setRoleText(current.substring(0, ci));
      timer = setTimeout(tick, deleting ? 35 : 65);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  /* ---------- interactive terminal ---------- */
  const [termLines, setTermLines] = useState([]);
  const [termInput, setTermInput] = useState("");
  const bootedRef = useRef(false);
  const termEndRef = useRef(null);
  const pushLine = (type, text) => setTermLines((prev) => [...prev, { type, text, key: Math.random() }]);

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    const boot = [
      { cmd: "whoami", out: " jr. soc-analyst / threat-hunter" },
      { cmd: "cat focus.txt", out: "log-analysis · threat-hunting · monitoring · automation" },
    ];
    let i = 0;
    const runNext = () => {
      if (i >= boot.length) { pushLine("out", "type 'help' to see available commands"); return; }
      const { cmd, out } = boot[i];
      pushLine("cmd", cmd);
      setTimeout(() => { pushLine("out", out); i++; setTimeout(runNext, 350); }, 500);
    };
    runNext();
  }, []);

  useEffect(() => { termEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [termLines]);

  const runScanDemo = () => {
    pushLine("cmd", "nmap -sV 192.168.122.0/24");
    const lines = [
      "starting scan on lab subnet...",
      "host 192.168.122.120 is up (kali-lab)",
      "host 192.168.122.74 is up (win10-target)",
      "host 192.168.122.179 is up (metasploitable2)",
      "host 192.168.122.172 is up (metasploitable3)",
      "host 192.168.122.98 is up (parrot-lab)",
      "22/tcp  open  ssh",
      "80/tcp  open  http",
      "445/tcp open  microsoft-ds",
      "scan complete — 5 hosts up, 3 ports open (simulated home-lab demo)",
    ];
    lines.forEach((l, idx) => setTimeout(() => pushLine("out", l), 450 * (idx + 1)));
  };

  const handleTermSubmit = (e) => {
    e.preventDefault();
    const raw = termInput.trim();
    if (!raw) return;
    const cmd = raw.toLowerCase();
    pushLine("cmd", raw);
    setTermInput("");
    switch (cmd) {
      case "help":     pushLine("out", "commands: whoami · stack · practice · tools · projects · contact · scan · clear"); break;
      case "whoami":   pushLine("out", "Stacy Were — Jr. SOC Analyst / Threat Hunter / I.T Specialist / Incident Responder"); break;
      case "stack":    pushLine("out", STACK.map((s) => s.name).join(", ")); break;
      case "practice": pushLine("out", PLATFORMS.map((p) => p.name).join(", ")); break;
      case "tools":    pushLine("out", TOOLS.map((t) => t.name).join(", ")); break;
      case "projects": pushLine("out", PROJECTS.map((p) => p.name).join(", ")); break;
      case "contact":  pushLine("out", "stacyywere@gmail.com - open to junior SOC roles & internships"); break;
      case "scan":     runScanDemo(); break;
      case "clear":    setTermLines([]); break;
      default:         pushLine("out", `command not found: '${raw}' — type 'help' to see available commands`);
    }
  };

  /* ---------- tech stack filter ---------- */
  const [stackFilter, setStackFilter] = useState("all");
  const [activeStack, setActiveStack] = useState(null);
  const filteredStack = STACK.filter((s) => stackFilter === "all" || s.cat === stackFilter);

  /* ---------- interactive interests ---------- */
  const [activeInterest, setActiveInterest] = useState(null);

  /* ---------- practice: fun random pick ---------- */
  const [pickedPlatform, setPickedPlatform] = useState(null);
  const pickRandom = () => {
    const idx = Math.floor(Math.random() * PLATFORMS.length);
    setPickedPlatform(PLATFORMS[idx].name);
  };

  /* ---------- résumé modal ---------- */
  const [resumeOpen, setResumeOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailConsent, setEmailConsent] = useState(false);
  const [deviceConsent, setDeviceConsent] = useState(false);
  const [resumeStatus, setResumeStatus] = useState("idle");
  const [resumeMsg, setResumeMsg] = useState("");
  const openResume = () => { setResumeOpen(true); setResumeStatus("idle"); setResumeMsg(""); setEmailConsent(false); setDeviceConsent(false); };

  const handleResumeSubmit = async (e) => {
    e.preventDefault();
    if (!emailConsent) {
      setResumeStatus("err");
      setResumeMsg("Please accept email collection to download the résumé.");
      return;
    }
    if (!isValidEmail(email)) {
      setResumeStatus("err");
      setResumeMsg("Please enter a valid email address.");
      return;
    }
    setResumeStatus("ok");
    setResumeMsg("Thanks! Starting your download...");
    const link = document.createElement("a");
    link.href = RESUME_FILE_PATH;
    link.download = "Stacy-Were-Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setResumeOpen(false), 1400);
    setEmail("");
  };

  /* ---------- contact message form ---------- */
  const [cName, setCName]     = useState("");
  const [cEmail, setCEmail]   = useState("");
  const [cMsg, setCMsg]       = useState("");
  const [contactStatus, setContactStatus] = useState("idle");
  const [contactMsg, setContactMsg]       = useState("");
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmail = async () => {
    await navigator.clipboard.writeText("stacyywere@gmail.com");
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 1800);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!cName.trim() || !cEmail.trim() || !cMsg.trim()) return;
    if (!isValidEmail(cEmail)) {
      setContactStatus("err");
      setContactMsg("Please enter a valid email address.");
      return;
    }
    setContactStatus("sending");
    if (!SUPABASE_CONFIGURED) {
      setContactStatus("err");
      setContactMsg("Messaging isn't connected to a database yet — add your Supabase URL/key in the code.");
      return;
    }
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
        method: "POST",
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ name: cName.trim(), email: cEmail.trim(), message: cMsg.trim() }),
      });
      if (!res.ok) throw new Error("request failed");
      setContactStatus("ok");
      setContactMsg("Thanks! I'll get back to you soon.");
      setCName(""); setCEmail(""); setCMsg("");
    } catch {
      setContactStatus("err");
      setContactMsg("Something went wrong sending that. Please try again.");
    }
  };

  return (
    <div style={{ fontFamily: "'Aptos', 'Aptos Display', 'Segoe UI', ui-sans-serif, system-ui, sans-serif", background: COLORS.ink, color: COLORS.paper, height: "100vh", maxWidth: "100vw", position: "relative", overflow: "hidden", boxSizing: "border-box" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');
        *{ box-sizing:border-box; }
        .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .scrollhost { height:100%; overflow-y:auto; overflow-x:hidden; scroll-behavior:smooth; }
        .scrollhost::-webkit-scrollbar{ width:8px; }
        .scrollhost::-webkit-scrollbar-thumb{ background:${COLORS.c3}; border-radius:8px; }
        .portfolio-content { text-align:center; }
        .portfolio-content p { margin-inline:auto; }
        .practice-grid { max-width:1120px; margin-inline:auto; }
        .practice-grid .card > div:first-child { margin-inline:auto; width:fit-content; }
        .about-interest-list { display:flex; flex-direction:column; gap:12px; text-align:left; }
        .about-interest { border-bottom:1px solid ${COLORS.line}; padding:0 0 12px; color:${COLORS.paper}; text-align:left; }
        .about-interest:last-child { border-bottom:0; padding-bottom:0; }
        .about-interest-toggle { border:0; padding:0; background:none; color:${COLORS.paper}; cursor:pointer; text-align:left; font:inherit; width:100%; }
        .about-interest-summary { display:flex; align-items:center; justify-content:space-between; gap:12px; width:100%; }
        .about-interest-detail { padding:12px 0 0 28px; color:rgba(246,233,238,0.7); font-size:14px; line-height:1.6; }
        .about-interests-column { border-left:1px solid ${COLORS.line}; padding-left:40px; }
        .copy-email { border:0; padding:0; background:none; color:${COLORS.c1}; cursor:pointer; font:inherit; text-decoration:none; }
        .social-link { text-decoration:none; }
        .journey-tree { max-width:760px; margin:0 auto; text-align:left; position:relative; }
        .journey-tree::before { content:""; position:absolute; left:10px; top:10px; bottom:10px; width:2px; background:${COLORS.c3}; }
        .journey-node { position:relative; padding:0 0 32px 42px; }
        .journey-node:last-child { padding-bottom:0; }
        .journey-node::before { content:""; position:absolute; left:3px; top:5px; width:16px; height:16px; border:3px solid ${COLORS.c3}; border-radius:50%; background:${COLORS.ink}; box-shadow:0 0 0 4px ${COLORS.ink}; }
        .journey-node h3 { margin:4px 0 8px; font-size:19px; }
        .journey-node p { margin:0; color:rgba(246,233,238,0.62); font-size:15px; }
        .journey-node .mono { color:${COLORS.c1}; font-size:12.5px; }
        .hero-scroll-cue { position:absolute; left:50%; bottom:22px; z-index:3; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:6px; border:0; background:none; color:${COLORS.c1}; cursor:pointer; font:11px 'JetBrains Mono', ui-monospace, monospace; letter-spacing:.08em; text-transform:uppercase; opacity:.85; }
        .hero-scroll-cue:hover { color:${COLORS.paper}; opacity:1; }
        .hero-scroll-line { width:1px; height:24px; background:linear-gradient(${COLORS.c1}, transparent); animation:scrollCue 1.8s ease-in-out infinite; }
        .hero-scroll-chevron { width:8px; height:8px; border-right:1px solid currentColor; border-bottom:1px solid currentColor; transform:rotate(45deg); margin-top:-7px; }
        @keyframes scrollCue { 0%,100% { opacity:.35; transform:translateY(0); } 50% { opacity:1; transform:translateY(5px); } }
        @media (max-width:759px) {
          .practice-grid { grid-template-columns:1fr !important; }
          .about-interests-column { border-left:0; padding-left:0; }
        }
        ::selection { background:${COLORS.c4}; color:${COLORS.paper}; }
        ::-moz-selection { background:${COLORS.c4}; color:${COLORS.paper}; }
        .navlink { position:relative; opacity:0.75; cursor:pointer; transition:opacity .2s ease, color .2s ease; }
        .navlink:hover{ opacity:1; color:${COLORS.c1}; }
        .navlink::after{ content:""; position:absolute; left:0; bottom:-3px; height:1px; width:0; background:${COLORS.c3}; transition:width .25s ease; }
        .navlink:hover::after{ width:100%; }
        .btn { font-family:'Aptos','Segoe UI',sans-serif; font-size:13.5px; cursor:pointer; padding:12px 22px; border-radius:8px; border:1px solid ${COLORS.line}; background:none; color:${COLORS.paper}; display:inline-flex; align-items:center; gap:8px; transition:transform .2s ease, border-color .2s ease; }
        .btn:hover{ transform:translateY(-2px); border-color:${COLORS.c3}; }
        .btn-primary{ background:linear-gradient(135deg, ${COLORS.c3}, ${COLORS.c4}); border-color:transparent; color:#fff; box-shadow:0 8px 24px rgba(159,53,101,0.35); }
        .card { border:1px solid ${COLORS.line}; border-radius:12px; background:rgba(255,255,255,0.02); transition:transform .2s ease, border-color .2s ease, background .2s ease; }
        .card:hover{ border-color:${COLORS.c3}; background:rgba(159,53,101,0.08); }
        .pill { font-family:'Aptos','Segoe UI',sans-serif; font-size:13.5px !important; padding:6px 14px; border-radius:100px; border:1px solid ${COLORS.line}; cursor:pointer; transition: all .2s ease; text-decoration:none; color:${COLORS.paper}; display:inline-flex; align-items:center; gap:6px; }
        .pill.active{ background:${COLORS.c3}; border-color:${COLORS.c3}; color:#fff; }
        .pill:hover{ border-color:${COLORS.c1}; }
        .cursorblink{ display:inline-block; width:9px; background:${COLORS.c3}; margin-left:2px; animation: blink 1s step-end infinite; }
        @keyframes blink{ 50%{ opacity:0; } }
        .dotpulse{ animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse{ 0%,100%{opacity:1;} 50%{opacity:.35;} }
        @keyframes floaty{ 0%,100%{ transform:translateY(0) rotate(0deg); } 50%{ transform:translateY(-18px) rotate(4deg); } }
        input:focus, textarea:focus{ outline:2px solid ${COLORS.c3}; outline-offset:1px; }
        p{ font-size:16.5px; line-height:1.65; }
        textarea{ resize:vertical; font-family:inherit; }
      `}</style>

      <div style={{ position: "absolute", top: 0, left: 0, height: 3, width: `${scroll}%`, background: `linear-gradient(90deg, ${COLORS.c3}, ${COLORS.c1})`, boxShadow: `0 0 12px ${COLORS.c3}`, zIndex: 50, transition: "width .08s linear" }} />

      {/* header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 40, background: "rgba(12,1,16,0.6)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${COLORS.line}` }}>
        <div style={{ maxWidth: 1600, margin: "0 auto", padding: isMobile ? "14px 16px" : "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div className="mono" style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: COLORS.c1, fontSize: isMobile ? 12 : 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer" }} onClick={() => scrollTo("hero")}>
            <span className="dotpulse" style={{ flexShrink: 0, width: 8, height: 8, borderRadius: "50%", background: COLORS.c3, boxShadow: `0 0 8px ${COLORS.c3}` }} />
            {isMobile ? "stacy@sec:~$" : "stacy@security:~$"}
          </div>

          {!isMobile && (
            <div style={{ display: "flex", gap: 22, fontSize: 14 }}>
              {NAV.map((n) => (<span key={n.id} className="navlink" onClick={() => scrollTo(n.id)}>{n.label}</span>))}
            </div>
          )}

          {isMobile && (
            <button onClick={() => setNavOpen((v) => !v)} aria-label="Toggle navigation" style={{ background: "none", border: `1px solid ${COLORS.line}`, borderRadius: 6, width: 36, height: 36, color: COLORS.paper, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {navOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          )}
        </div>

        {isMobile && navOpen && (
          <div style={{ display: "flex", flexDirection: "column", background: COLORS.ink, borderTop: `1px solid ${COLORS.line}`, padding: "10px 16px 16px" }}>
            {NAV.map((n) => (<span key={n.id} className="navlink" style={{ padding: "10px 0", borderBottom: `1px solid ${COLORS.line}` }} onClick={() => scrollTo(n.id)}>{n.label}</span>))}
          </div>
        )}
      </div>

      <div ref={scrollHostRef} className="scrollhost">
        <div className="portfolio-content" style={{ maxWidth: 1600, margin: "0 auto", padding: isMobile ? "0 16px" : "0 32px", width: "100%" }}>

          {/* ── HERO ── */}
          <section id="hero" style={{ position: "relative", width: "100vw", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", paddingTop: 120, paddingBottom: 60, marginLeft: "calc(50% - 50vw)", paddingInline: isMobile ? 16 : 32, overflow: "hidden" }}>
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: `linear-gradient(180deg, rgba(12,1,16,0.72), rgba(12,1,16,0.9)), url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.82 }} />
            {!isMobile && (
              <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
                <FloatingIcon top="13%" left="7%"  size={78} duration={9}    delay={0}   opacity={0.34}><ServerBgIcon /></FloatingIcon>
                <FloatingIcon top="27%" left="17%" size={68} duration={11}   delay={1.2} opacity={0.3}><TerminalBgIcon /></FloatingIcon>
                <FloatingIcon top="43%" left="12%" size={62} duration={11}   delay={1.2} opacity={0.25}><LaptopIcon /></FloatingIcon>
                <FloatingIcon top="12%" left="86%" size={72} duration={10}   delay={0.6} opacity={0.34}><RouterIcon /></FloatingIcon>
                <FloatingIcon top="29%" left="76%" size={76} duration={12}   delay={0.3} opacity={0.3}><DesktopIcon /></FloatingIcon>
                <FloatingIcon top="39%" left="5%"  size={60} duration={8}    delay={0.9} opacity={0.27}><CableIcon /></FloatingIcon>
                <FloatingIcon top="42%" left="91%" size={66} duration={10.5} delay={1.5} opacity={0.27}><SwitchIcon /></FloatingIcon>
                <FloatingIcon top="8%" left="27%" size={62} duration={10} delay={0.8} opacity={0.28}><SurveyCorpsIcon /></FloatingIcon>
                <FloatingIcon top="17%" left="69%" size={58} duration={9} delay={1.4} opacity={0.26}><GarrisonIcon /></FloatingIcon>
                <FloatingIcon top="52%" left="84%" size={64} duration={11} delay={0.4} opacity={0.25}><MilitaryPoliceIcon /></FloatingIcon>
              </div>
            )}

            <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
              <h1 style={{ fontWeight: 800, fontSize: "clamp(46px,7vw,80px)", margin: "0 0 18px", lineHeight: 1.05 }}>
                Stacy Were<span style={{ color: COLORS.c3 }}>.</span>
              </h1>
              <div style={{ fontSize: "clamp(17px,2.4vw,22px)", color: COLORS.c1, marginBottom: 24, minHeight: "1.4em" }}>
                {roleText}<span className="cursorblink">&nbsp;</span>
              </div>
              <p style={{ maxWidth: 640, fontSize: 19, color: "rgba(246,233,238,0.82)", marginBottom: 36, marginLeft: "auto", marginRight: "auto" }}>
                IT graduate and cybersecurity enthusiast specializing in log analysis, threat hunting, monitoring and building security automation tools. Turning curiosity into a career in cybersecurity.
              </p>

              {/* terminal */}
              <div style={{ maxWidth: 600, width: "100%", margin: "0 auto", textAlign: "left", border: `1px solid ${COLORS.line}`, borderRadius: 10, background: "rgba(53,2,62,0.45)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderBottom: `1px solid ${COLORS.line}` }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[0, 1, 2].map((i) => <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />)}
                  </div>
                  <div className="mono" style={{ fontSize: 12, color: "rgba(246,233,238,0.4)", display: "flex", alignItems: "center", gap: 6 }}>
                    <TerminalSquare size={13} /> try typing 'help'
                  </div>
                </div>
                <div className="mono" style={{ padding: "18px 20px", fontSize: 14.5, maxHeight: 240, overflowY: "auto" }}>
                  {termLines.map((l) => (
                    <div key={l.key} style={{ marginBottom: 6, color: l.type === "cmd" ? COLORS.c1 : "rgba(246,233,238,0.7)" }}>
                      {l.type === "cmd" ? <span><span style={{ color: COLORS.c3 }}>stacy@ubuntu:~$ </span>{l.text}</span> : l.text}
                    </div>
                  ))}
                  <div ref={termEndRef} />
                  <form onSubmit={handleTermSubmit} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <span style={{ color: COLORS.c3 }}>stacy@ubuntu:~$</span>
                    <input value={termInput} onChange={(e) => setTermInput(e.target.value)} placeholder="type a command..." className="mono" style={{ flex: 1, background: "none", border: "none", color: COLORS.paper, fontSize: 14.5 }} />
                  </form>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 34, justifyContent: "center" }}>
                <button className="btn btn-primary" onClick={() => scrollTo("contact")}>Let's talk <ChevronRight size={15} /></button>
                <button className="btn" onClick={openResume}><Download size={15} /> Download résumé</button>
                <button className="btn" onClick={runScanDemo}><Radar size={15} /> Run scan demo</button>
              </div>
            </div>
            <button className="hero-scroll-cue" onClick={() => scrollTo("about")} aria-label="Scroll to About section">
              <span>scroll</span>
              <span className="hero-scroll-line" />
              <span className="hero-scroll-chevron" />
            </button>
          </section>

          {/* ── ABOUT ── */}
          <section id="about" style={{ padding: "80px 0" }}>
            <Reveal>
              <p style={{ fontSize: 14, color: COLORS.c2, marginBottom: 12 }}>// whoami</p>
              <h2 style={{ fontSize: "clamp(30px,4.4vw,44px)", margin: "0 0 26px" }}>About</h2>

              {/* bio + quote */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: isMobile ? 24 : 40, marginBottom: 32 }}>
                <div>
                  <blockquote style={{ fontSize: "clamp(18px,2.4vw,24px)", lineHeight: 1.55, borderLeft: `2px solid ${COLORS.c3}`, paddingLeft: 20, margin: "0 0 20px" }}>
                    "Turning curiosity into a career in cybersecurity, one log, one packet, one lab at a time."
                  </blockquote>
                  <p style={{ margin: 0, color: "rgba(246,233,238,0.78)" }}>
                    IT graduate building a path into cybersecurity.
                    
                    
                  </p>
                  <p style={{ margin: 0, color: "rgba(246,233,238,0.78)" }}>
                    I spend my time in the home lab, hunting threats on CTF platforms and studying how attacks actually work so I can learn to stop them.
                  </p>

                  {/* languages & scripting */}
                  <div style={{ padding: "24px 0 0", marginTop: 24, borderTop: `1px solid ${COLORS.line}` }}>
                    <h3 style={{ marginTop: 0, marginBottom: 6, fontSize: 17 }}>Languages &amp; scripting</h3>
                    <p style={{ marginTop: 0, marginBottom: 18, color: "rgba(246,233,238,0.65)", fontSize: 14 }}>
                      The tech I write and work with.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
                      {ABOUT_LANGS.map(({ slug, label }) => (
                        <span key={slug} className="pill" style={{ cursor: "default", gap: 8 }}>
                          <LanguageIcon slug={slug} label={label} />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* interactive interests */}
                <div className="about-interests-column" style={{ alignSelf: "start" }}>
                  <h3 style={{ margin: "0 0 14px", fontSize: 17 }}>Outside the terminal</h3>
                  <div className="about-interest-list">
                    {[
                      { id: "anime", icon: Tv, label: "Anime", detail: <span>{ANIME_WATCHED.join(" · ")}</span> },
                      { id: "animations", icon: Tv, label: "Animations", detail: <span>{ANIMATIONS.join(" · ")}</span> },
                      { id: "ctf", icon: Flag, label: "CTFs", detail: <span>{CTF_INTERESTS.join(" · ")}</span> },
                      { id: "formula1", icon: Gauge, label: "Formula 1", detail: <a href={MCLAREN_URL} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.c1, textDecoration: "none" }}>Visit McLaren F1 <ExternalLink size={13} /></a> },
                      { id: "music", icon: Music, label: "Music", detail: <a href={SPOTIFY_URL} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.c1 }}>Open Spotify <ExternalLink size={13} /></a> },
                      { id: "reading", icon: BookOpen, label: "Reading", detail: <span>Notes, essays and ideas that keep the curiosity switched on.</span> },
                      { id: "travel", icon: Plane, label: "Travelling", detail: <span>Collecting places, stories and new perspectives.</span> },
                    ].map(({ id, icon: Icon, label, detail }) => (
                      <div key={id} className="about-interest">
                        <button className="about-interest-toggle" onClick={() => setActiveInterest(activeInterest === id ? null : id)} aria-expanded={activeInterest === id}>
                          <span className="about-interest-summary"><span style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon size={16} color={COLORS.c1} />{label}</span><ChevronDown size={16} style={{ transform: activeInterest === id ? "rotate(180deg)" : "none", transition: "transform .2s ease" }} /></span>
                        </button>
                        {activeInterest === id && <span className="about-interest-detail">{detail}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </Reveal>
          </section>

          {/* ── JOURNEY ── */}
          <section id="journey" style={{ padding: "80px 0" }}>
            <Reveal>
              <p style={{ fontSize: 14, color: COLORS.c2, marginBottom: 12 }}>// how I got here</p>
              <h2 style={{ fontSize: "clamp(30px,4.4vw,44px)", margin: "0 0 26px" }}>My journey</h2>
              <div className="journey-tree">
                {JOURNEY.map((j, idx) => (
                  <div key={idx} className="journey-node">
                    <div className="mono" style={{ fontSize: 12.5, color: COLORS.c1, marginBottom: 10 }}>{j.tag}</div>
                    <h3 style={{ fontSize: 17, margin: "0 0 8px" }}>
                      <a href={j.url} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.c1, textDecoration: "none" }}>
                        {j.title} <ExternalLink size={14} />
                      </a>
                    </h3>
                    <p style={{ fontSize: 14, margin: 0, color: "rgba(246,233,238,0.55)" }}>
                      <a href={j.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>{j.desc}</a>
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>

          {/* ── TECH STACK ── */}
          <section id="stack" style={{ padding: "80px 0" }}>
            <Reveal>
              <p style={{ fontSize: 14, color: COLORS.c2, marginBottom: 12 }}>// what I build and break with</p>
              <h2 style={{ fontSize: "clamp(30px,4.4vw,44px)", margin: "0 0 16px" }}>My tech stack</h2>
              <p style={{ marginBottom: 22, maxWidth: 680 }}>The home lab and the languages I practice with it — filter by category, and click any card for more detail.</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
                {STACK_FILTERS.map(([k, l]) => (
                  <span key={k} className={`pill${stackFilter === k ? " active" : ""}`} onClick={() => setStackFilter(k)}>{l}</span>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
                {filteredStack.map((s) => (
                  <div key={s.id} className="card" style={{ padding: 20, cursor: "pointer" }} onClick={() => setActiveStack(activeStack === s.id ? null : s.id)}>
                    {/* brand / lucide icon */}
                    <div style={{ marginBottom: 10 }}>
                      <StackIcon s={s} size={28} />
                    </div>
                    <div className="mono" style={{ fontSize: 12, color: COLORS.c2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.role}</div>
                    <h3 style={{ fontSize: 19, margin: "6px 0 6px" }}>{s.name}</h3>
                    <p style={{ fontSize: 15, margin: 0, color: "rgba(246,233,238,0.65)" }}>{s.short}</p>
                    {activeStack === s.id && (
                      <p className="mono" style={{ fontSize: 13, marginTop: 10, color: COLORS.c1, borderTop: `1px solid ${COLORS.line}`, paddingTop: 10 }}>{s.detail}</p>
                    )}
                    <div className="mono" style={{ fontSize: 12.5, color: "rgba(246,233,238,0.35)", marginTop: 8 }}>{activeStack === s.id ? "click to collapse" : "click for detail"}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 32, padding: 20, borderRadius: 12, background: "rgba(105,18,97,0.15)", border: `1px solid ${COLORS.line}` }}>
                <p style={{ margin: 0, color: "rgba(246,233,238,0.85)" }}>This stack is where I observe network traffic and practice scanning and reconnaissance - the same fundamentals a SOC analyst uses to recognize what "normal" looks like before spotting what isn't.</p>
              </div>
            </Reveal>
          </section>

          {/* ── PRACTICE ── */}
          <section id="practice" style={{ padding: "80px 0" }}>
            <Reveal>
              <p style={{ fontSize: 14, color: COLORS.c2, marginBottom: 12 }}>// getting my hands dirty</p>
              <h2 style={{ fontSize: "clamp(28px,4vw,40px)", margin: "0 0 20px" }}>Where I practice</h2>
              <p style={{ marginBottom: 20 }}>I just started doing CTFs - building the habit of breaking things on purpose so I understand how to defend them.</p>
              <p style={{ marginBottom: 24 }}>Can't decide where to start? Let fate pick.</p>
              <button className="btn btn-primary" onClick={pickRandom} style={{ marginBottom: 24 }}><Shuffle size={15} /> Pick one</button>
              <div className="practice-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,minmax(0,1fr))", gap: 14 }}>
                {PLATFORMS.map((p) => {
                  const picked = pickedPlatform === p.name;
                  return (
                    <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="card" style={{ display: "block", padding: 18, borderColor: picked ? COLORS.c3 : COLORS.line, background: picked ? "rgba(159,53,101,0.15)" : undefined, transform: picked ? "translateY(-3px)" : undefined, color: "inherit", textDecoration: "none" }}>
                      {/* real favicon instead of random emoji */}
                      <div style={{ marginBottom: 8 }}>
                        <PlatformIcon domain={p.domain} name={p.name} size={28} />
                      </div>
                      <h3 style={{ fontSize: 17, margin: "0 0 6px" }}>{p.name}</h3>
                      <p style={{ fontSize: 14, margin: 0, color: "rgba(246,233,238,0.6)" }}>{p.desc}</p>
                      {picked && <div className="mono" style={{ fontSize: 12, color: COLORS.c1, marginTop: 8 }}>🎲 Your pick!</div>}
                    </a>
                  );
                })}
              </div>
            </Reveal>
          </section>

          {/* ── TOOLS ── */}
          <section id="learning" style={{ padding: "80px 0" }}>
            <Reveal>
              <p style={{ fontSize: 14, color: COLORS.c2, marginBottom: 12 }}>// currently learning with</p>
              <h2 style={{ fontSize: "clamp(28px,4vw,40px)", margin: "0 0 16px" }}>Tools &amp; platforms in daily use</h2>
              <p style={{ marginBottom: 20 }}>Building fluency with the tools that turn theory into evidence — from packet captures to intercepted requests.</p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
                {TOOLS.map((t) => t.url ? (
                  <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" className="pill">{t.name} <ExternalLink size={12} /></a>
                ) : (
                  <span key={t.name} className="pill" style={{ cursor: "default", opacity: 0.75 }}>{t.name}</span>
                ))}
              </div>
            </Reveal>
          </section>

          {/* ── PROJECTS ── */}
          <section id="projects" style={{ padding: "80px 0" }}>
            <Reveal>
              <p style={{ fontSize: 14, color: COLORS.c2, marginBottom: 12 }}>// github</p>
              <h2 style={{ fontSize: "clamp(28px,4vw,40px)", margin: "0 0 16px" }}>Projects &amp; repos</h2>
              <p style={{ marginBottom: 22 }}>A few things I've built and broken, all up on GitHub.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
                {PROJECTS.map((p) => (
                  <a key={p.name} href={p.url || "https://github.com/Stacyy-Were"} target="_blank" rel="noopener noreferrer" className="card" style={{ padding: 20, textDecoration: "none", color: "inherit", display: "block" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <h3 style={{ fontSize: 17, margin: 0 }}>{p.name}</h3>
                      <Github size={16} color={COLORS.c1} />
                    </div>
                    <p style={{ fontSize: 14, margin: 0, color: "rgba(246,233,238,0.6)" }}>{p.desc}</p>
                    {!p.url && <div className="mono" style={{ fontSize: 11.5, color: "rgba(246,233,238,0.35)", marginTop: 8 }}>link coming soon</div>}
                  </a>
                ))}
              </div>
            </Reveal>
          </section>

          {/* ── CONTACT ── */}
          <section id="contact" style={{ padding: "80px 0 60px" }}>
            <Reveal>
              <p style={{ fontSize: 14, color: COLORS.c2, marginBottom: 12 }}>// let's talk</p>
              <h2 style={{ fontSize: "clamp(28px,4vw,40px)", margin: "0 0 16px" }}>Open to opportunities</h2>
              <p style={{ marginBottom: 24, maxWidth: 680 }}>Open to junior SOC roles and internships — or just talking shop about logs, labs and everything cybersecurity.</p>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
                <div className="card" style={{ padding: 28, order: isMobile ? 1 : 2 }}>
                  <h3 style={{ marginTop: 0 }}>Send me a message</h3>
                  <form onSubmit={handleContactSubmit}>
                    <input type="text" required value={cName} onChange={(e) => setCName(e.target.value)} placeholder="Your name" style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${COLORS.line}`, background: "rgba(255,255,255,0.04)", color: COLORS.paper, fontSize: 14, marginBottom: 12 }} />
                    <input type="email" required value={cEmail} onChange={(e) => setCEmail(e.target.value)} placeholder="Your email" style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${COLORS.line}`, background: "rgba(255,255,255,0.04)", color: COLORS.paper, fontSize: 14, marginBottom: 12 }} />
                    <textarea required value={cMsg} onChange={(e) => setCMsg(e.target.value)} placeholder="What's on your mind?" rows={4} style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${COLORS.line}`, background: "rgba(255,255,255,0.04)", color: COLORS.paper, fontSize: 14, marginBottom: 14 }} />
                    <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={contactStatus === "sending"}>
                      {contactStatus === "sending" ? "Sending..." : <>Send message <Send size={15} /></>}
                    </button>
                    {contactMsg && <div className="mono" style={{ fontSize: 12.5, marginTop: 10, color: contactStatus === "ok" ? "#8fe3b0" : "#f0a3a3" }}>{contactMsg}</div>}
                  </form>
                  <p style={{ fontSize: 13, marginTop: 14, marginBottom: 0, color: "rgba(246,233,238,0.5)" }}>
                    <button type="button" className="copy-email" onClick={copyEmail}>{emailCopied ? "Email copied" : "Email Directly: Click to copy email address"}</button>
                  </p>
                </div>

                <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", order: isMobile ? 2 : 1 }}>
                  <h3 style={{ marginTop: 0 }}>Want the full picture?</h3>
                  <p style={{ fontSize: 15, marginBottom: 18 }}>Get a copy of my résumé - I'll just need an email to send it to.</p>
                  <button className="btn btn-primary" onClick={openResume} style={{ width: "fit-content", marginInline: "auto" }}><Download size={15} /> Download résumé</button>
                </div>
              </div>
            </Reveal>

            {/* social bar */}
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 14, marginTop: 56 }}>
              {SOCIALS.map(({ label, icon: Icon, url }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="btn social-link">
                  <Icon size={15} /> {label}
                </a>
              ))}
            </div>
          </section>
        </div>

        <div style={{ maxWidth: 1600, margin: "0 auto", padding: isMobile ? "20px 16px 40px" : "20px 32px 50px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${COLORS.line}`, flexWrap: "wrap", gap: 12 }}>
          <div className="mono" style={{ fontSize: 12, color: "rgba(246,233,238,0.4)" }}>
            © {new Date().getFullYear()} Stacy Were — made with React, JavaScript &amp; CSS.
          </div>
          <button className="btn" onClick={() => scrollTo("hero")} style={{ padding: "8px 14px", fontSize: 12 }}>
            <ArrowUp size={13} /> Back to top
          </button>
        </div>
      </div>

      {/* résumé modal */}
      {resumeOpen && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(6,0,8,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 20 }} onClick={(e) => { if (e.target === e.currentTarget) setResumeOpen(false); }}>
          <div style={{ background: COLORS.c5, border: `1px solid ${COLORS.line}`, borderRadius: 16, padding: 28, maxWidth: 380, width: "100%", position: "relative", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
            <button onClick={() => setResumeOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "rgba(246,233,238,0.5)", cursor: "pointer" }}><X size={18} /></button>
            <h3 style={{ margin: "0 0 8px", display: "flex", alignItems: "center", gap: 8 }}><ShieldCheck size={18} color={COLORS.c1} /> Download résumé</h3>
            <p style={{ fontSize: 13, color: "rgba(246,233,238,0.65)", margin: "0 0 18px" }}>Enter your email to download my résumé.</p>
            <form onSubmit={handleResumeSubmit}>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="stacyywere@gmail.com" style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${COLORS.line}`, background: "rgba(255,255,255,0.04)", color: COLORS.paper, fontSize: 14, marginBottom: 14 }} />
              <div style={{ textAlign: "left", marginBottom: 14, color: "rgba(246,233,238,0.72)", fontSize: 12.5, lineHeight: 1.5 }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10, cursor: "pointer" }}>
                  <input type="checkbox" required checked={emailConsent} onChange={(e) => setEmailConsent(e.target.checked)} style={{ marginTop: 3, accentColor: COLORS.c3 }} />
                  <span>I agree to share my email address for this résumé request.</span>
                </label>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={deviceConsent} onChange={(e) => setDeviceConsent(e.target.checked)} style={{ marginTop: 3, accentColor: COLORS.c3 }} />
                  <span>I agree to device fingerprinting for abuse prevention. This is optional; leave unchecked to decline. Device fingerprinting is not currently active.</span>
                </label>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={resumeStatus === "sending"}>
                Download résumé <Download size={15} />
              </button>
              {resumeMsg && <div className="mono" style={{ fontSize: 12, marginTop: 10, color: resumeStatus === "ok" ? "#8fe3b0" : "#f0a3a3" }}>{resumeMsg}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
