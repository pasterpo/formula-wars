const STORAGE_KEY = "formula-wars-profile-v3";
const ARENA_WIDTH = 920;
const ARENA_HEIGHT = 620;
const CENTER = { x: ARENA_WIDTH / 2, y: ARENA_HEIGHT / 2 };
const PLAYER_RADIUS = 16;
const ZONE_START = 265;
const ZONE_END = 110;
const PROXIMITY_LIMIT = 410;
const RETREAT_LIMIT = 4.5;
const PICKUP_RANGE = 74;
const XP_LEVELS = [0, 22, 54, 96, 148, 212, 288, 376];

const formulaCatalog = [
  {
    id: "start",
    label: "1 + 1 = 2",
    aliases: ["1+1=2"],
    level: 1,
    requires: [],
    type: "number",
    tier: "Basic",
    power: 8,
    damage: 8,
    fallback: "start",
    counters: [],
    detail: "The opening state. Reliable, weak, and always available.",
  },
  {
    id: "substitution",
    label: "(2 - 1) + 1 = 2",
    aliases: ["(2-1)+1=2"],
    level: 1,
    requires: ["start"],
    type: "number",
    tier: "Basic",
    power: 10,
    damage: 10,
    fallback: "start",
    counters: [],
    detail: "A first proof of concept: substitution itself becomes progress.",
  },
  {
    id: "zero",
    label: "x * 0 = 0",
    aliases: ["x*0=0"],
    level: 1,
    requires: ["substitution"],
    type: "zero",
    tier: "Utility",
    power: 12,
    damage: 10,
    fallback: "substitution",
    counters: [],
    detail: "Nullifies a nearby hostile projectile or trap, or deals direct damage if nothing is active.",
  },
  {
    id: "basicLarge",
    label: "100 * 50 = 5000",
    aliases: ["100*50=5000"],
    level: 1,
    requires: ["substitution"],
    type: "number",
    tier: "Arithmetic",
    power: 14,
    damage: 14,
    fallback: "substitution",
    counters: [],
    detail: "Big arithmetic wins early fights through simple scale.",
  },
  {
    id: "root",
    label: "sqrt(144) = 12",
    aliases: ["sqrt(144)=12"],
    level: 2,
    requires: ["basicLarge"],
    type: "number",
    tier: "Arithmetic",
    power: 16,
    damage: 16,
    fallback: "basicLarge",
    counters: [],
    detail: "Roots and powers deepen the arithmetic ladder.",
  },
  {
    id: "power",
    label: "2^10 = 1024",
    aliases: ["2^10=1024"],
    level: 2,
    requires: ["root"],
    type: "number",
    tier: "Arithmetic",
    power: 18,
    damage: 18,
    fallback: "basicLarge",
    counters: [],
    detail: "Exponentiation pushes raw-value combat into real threat territory.",
  },
  {
    id: "pi",
    label: "pi * 4",
    aliases: ["pi*4"],
    level: 3,
    requires: ["power"],
    type: "pi",
    tier: "Constant",
    power: 22,
    damage: 10,
    fallback: "power",
    counters: ["diameter"],
    detail: "Launches a circular trap that can hold an opponent inside its boundary.",
  },
  {
    id: "diameter",
    label: "d = 2r",
    aliases: ["d=2r"],
    level: 3,
    requires: ["pi"],
    type: "diameter",
    tier: "Counter",
    power: 16,
    damage: 10,
    fallback: "pi",
    counters: [],
    detail: "Breaks pi traps by reasoning directly about the circle boundary.",
  },
  {
    id: "econst",
    label: "e",
    aliases: [],
    level: 3,
    requires: ["power"],
    type: "constant",
    tier: "Constant",
    power: 20,
    damage: 20,
    fallback: "power",
    counters: [],
    detail: "A stable mid-tier constant shot.",
  },
  {
    id: "phi",
    label: "phi = (1 + sqrt(5))/2",
    aliases: ["phi=(1+sqrt(5))/2"],
    level: 3,
    requires: ["root"],
    type: "constant",
    tier: "Constant",
    power: 21,
    damage: 21,
    fallback: "econst",
    counters: [],
    detail: "Another constant lane that rewards deeper number familiarity.",
  },
  {
    id: "trig",
    label: "sin(pi/2) = 1",
    aliases: ["sin(pi/2)=1"],
    level: 4,
    requires: ["pi"],
    type: "trig",
    tier: "Trigonometry",
    power: 24,
    damage: 24,
    fallback: "econst",
    counters: [],
    detail: "A precise trigonometric strike with solid midgame power.",
  },
  {
    id: "limitIdentity",
    label: "lim x->0 sin(x)/x = 1",
    aliases: ["limx->0sin(x)/x=1"],
    level: 5,
    requires: ["trig"],
    type: "trig",
    tier: "Calculus",
    power: 26,
    damage: 26,
    fallback: "trig",
    counters: [],
    detail: "Bridges trig intuition into limit-based play.",
  },
  {
    id: "derivative",
    label: "d/dx x^3 = 3x^2",
    aliases: ["d/dxx^3=3x^2"],
    level: 5,
    requires: ["power"],
    type: "derivative",
    tier: "Calculus",
    power: 18,
    damage: 12,
    fallback: "trig",
    counters: ["integral", "antiderivative"],
    detail: "Differentiates the opponent's current formula into a weaker fallback.",
  },
  {
    id: "integral",
    label: "int 2x dx = x^2 + C",
    aliases: ["int2xdx=x^2+c"],
    level: 5,
    requires: ["derivative"],
    type: "integral",
    tier: "Calculus",
    power: 22,
    damage: 10,
    fallback: "derivative",
    counters: ["antiderivative"],
    detail: "Builds a bounded cage around the target.",
  },
  {
    id: "antiderivative",
    label: "int f'(x) dx = f(x) + C",
    aliases: ["intf'(x)dx=f(x)+c", "intfprime(x)dx=f(x)+c"],
    level: 5,
    requires: ["derivative"],
    type: "antiderivative",
    tier: "Counter",
    power: 20,
    damage: 14,
    fallback: "integral",
    counters: [],
    detail: "The clean answer to integral cages and derivative pressure.",
  },
  {
    id: "limit",
    label: "lim x->infinity 1/x = 0",
    aliases: ["limx->infinity1/x=0", "limx->inf1/x=0"],
    level: 5,
    requires: ["integral"],
    type: "limit",
    tier: "Calculus",
    power: 28,
    damage: 16,
    fallback: "integral",
    counters: ["infinity", "aleph"],
    detail: "Converts overwhelming scale back toward zero and counters infinity-based attacks.",
  },
  {
    id: "complex",
    label: "i^2 = -1",
    aliases: ["i^2=-1"],
    level: 6,
    requires: ["econst"],
    type: "complex",
    tier: "Complex",
    power: 22,
    damage: 18,
    fallback: "limit",
    counters: ["conjugate"],
    detail: "Fires complex-number energy that must be canceled carefully.",
  },
  {
    id: "conjugate",
    label: "conj(a+bi) = a-bi",
    aliases: ["conj(a+bi)=a-bi"],
    level: 6,
    requires: ["complex"],
    type: "conjugate",
    tier: "Counter",
    power: 18,
    damage: 10,
    fallback: "complex",
    counters: [],
    detail: "Neutralizes complex-number attacks by canceling the imaginary component.",
  },
  {
    id: "infinity",
    label: "infinity",
    aliases: ["inf", "infty"],
    level: 7,
    requires: ["limit"],
    type: "infinity",
    tier: "Infinity",
    power: 34,
    damage: 34,
    fallback: "complex",
    counters: ["limit", "reciprocalZero"],
    detail: "A heavy homing strike that can still be bounded by the right response.",
  },
  {
    id: "reciprocalZero",
    label: "1/infinity = 0",
    aliases: ["1/infinity=0", "1/inf=0"],
    level: 7,
    requires: ["infinity"],
    type: "reciprocal",
    tier: "Counter",
    power: 24,
    damage: 12,
    fallback: "limit",
    counters: [],
    detail: "Another answer to infinity, collapsing it through reciprocal logic.",
  },
  {
    id: "aleph",
    label: "aleph0",
    aliases: ["aleph_0"],
    level: 7,
    requires: ["infinity"],
    type: "aleph",
    tier: "Infinity",
    power: 38,
    damage: 28,
    fallback: "infinity",
    counters: ["limit"],
    detail: "An infinite-cardinality wave that is strong but still logically answerable.",
  },
  {
    id: "euler",
    label: "e^(i*pi) + 1 = 0",
    aliases: ["e^(i*pi)+1=0", "e^(ipi)+1=0"],
    level: 8,
    requires: ["econst", "pi", "complex", "infinity"],
    type: "euler",
    tier: "Ultimate",
    power: 50,
    damage: 48,
    fallback: "infinity",
    counters: [],
    detail: "The apex move. It nukes the defender's active formula back to start.",
  },
];

const progressionLevels = [
  { level: 1, title: "Basic Arithmetic", copy: "Addition, subtraction, multiplication, division, and zero logic." },
  { level: 2, title: "Powers And Roots", copy: "Exponents, roots, and stronger real-number attacks." },
  { level: 3, title: "Constants", copy: "pi, e, phi, circular traps, and constant pressure." },
  { level: 4, title: "Trigonometry", copy: "Identity-based formula play opens new lines." },
  { level: 5, title: "Calculus", copy: "Derivatives, integrals, anti-derivatives, limits, and real counters." },
  { level: 6, title: "Complex Numbers", copy: "Imaginary attacks and conjugate answers unlock." },
  { level: 7, title: "Infinity", copy: "Infinity, aleph-level power, and reciprocal or limit responses." },
  { level: 8, title: "Euler's Identity", copy: "The final signature equation becomes buildable." },
];

const worldCards = [
  {
    title: "Infinite Black Void",
    copy: "The arena is a stripped-down mathematical universe. The clean space makes formulas, variables, and boundaries feel physical.",
  },
  {
    title: "Simultaneous Build + Turn Combat",
    copy: "Formula building is always on, but attacks happen through turns. That tension drives the whole match.",
  },
  {
    title: "Physics Variables",
    copy: "Gravity, velocity, time, and derivative-like precision are resources you can manipulate for movement.",
  },
  {
    title: "Anti-Exploit Rules",
    copy: "The zone shrinks, the retreat timer punishes escape, and one-time variable use prevents infinite abuse.",
  },
  {
    title: "Counter Logic",
    copy: "Counters are based on actual mathematical relationships rather than arbitrary game exceptions.",
  },
  {
    title: "Learning Through Play",
    copy: "Progression teaches real concepts as they become useful in combat, not as disconnected textbook trivia.",
  },
  {
    title: "Steal And Duplicate",
    copy: "Aggressive play is rewarded. Stay close and risk theft, or duplicate arena variables for personal reserves.",
  },
  {
    title: "High-Risk Ultimate",
    copy: "Euler's Identity is devastating when assembled correctly, but failed attempts carry brutal penalties.",
  },
];

const techCards = [
  {
    title: "Verification Layer",
    copy: "This browser build simulates formula verification with a controlled formula catalog and dependency tree.",
  },
  {
    title: "Lean 4 Backdrop",
    copy: "The design still points toward Lean 4 as the eventual proof engine behind valid substitutions and identities.",
  },
  {
    title: "Fast Formula Cache",
    copy: "Common formulas are represented as direct browser lookups, echoing the intended cache-first architecture.",
  },
  {
    title: "Realtime Arena Loop",
    copy: "The canvas arena handles movement, traps, projectiles, zone shrink, and win checks every frame.",
  },
  {
    title: "Persistent Browser Profile",
    copy: "Matches played, wins, discoveries, and highest level are saved locally so the site behaves like a real product.",
  },
  {
    title: "CPU Opponent",
    copy: "An optional browser AI takes turns, builds formulas, uses counters, manipulates variables, and moves intelligently.",
  },
];

const formulaById = new Map(formulaCatalog.map((formula) => [formula.id, formula]));
const formulaLookup = new Map();

for (const formula of formulaCatalog) {
  formulaLookup.set(normalizeFormula(formula.label), formula.id);
  for (const alias of formula.aliases) {
    formulaLookup.set(normalizeFormula(alias), formula.id);
  }
}

const dom = {
  canvas: document.querySelector("#game-canvas"),
  ctx: document.querySelector("#game-canvas").getContext("2d"),
  heroStats: document.querySelector("#hero-stats"),
  playerPanels: [
    document.querySelector("#player-a-panel"),
    document.querySelector("#player-b-panel"),
  ],
  turnConsole: document.querySelector("#turn-console"),
  physicsConsole: document.querySelector("#physics-console"),
  systemsConsole: document.querySelector("#systems-console"),
  tacticalConsole: document.querySelector("#tactical-console"),
  eventLog: document.querySelector("#event-log"),
  matchSummary: document.querySelector("#match-summary"),
  quickstartGuide: document.querySelector("#quickstart-guide"),
  formulaCodex: document.querySelector("#formula-codex"),
  chainMap: document.querySelector("#chain-map"),
  systemsShowcase: document.querySelector("#systems-showcase"),
  progressionShowcase: document.querySelector("#progression-showcase"),
  techShowcase: document.querySelector("#tech-showcase"),
  profileShowcase: document.querySelector("#profile-showcase"),
  turnIndicator: document.querySelector("#turn-indicator"),
  turnTimer: document.querySelector("#turn-timer"),
  zoneMeter: document.querySelector("#zone-meter"),
  distanceMeter: document.querySelector("#distance-meter"),
  modeMeter: document.querySelector("#mode-meter"),
  modeSelect: document.querySelector("#mode-select"),
  startLevel: document.querySelector("#start-level"),
  turnDuration: document.querySelector("#turn-duration"),
  zoneSpeed: document.querySelector("#zone-speed"),
  restart: document.querySelector("#restart-match"),
  pause: document.querySelector("#toggle-pause"),
  showTutorial: document.querySelector("#show-tutorial"),
  resetProfile: document.querySelector("#reset-profile"),
  openTutorial: document.querySelector("#open-tutorial"),
  tutorialModal: document.querySelector("#tutorial-modal"),
  closeTutorial: document.querySelector("#close-tutorial"),
  startPlaying: document.querySelector("#start-playing"),
  dismissTutorial: document.querySelector("#dismiss-tutorial"),
};

const state = {
  profile: loadProfile(),
  settings: {
    mode: "hotseat",
    startLevel: 6,
    turnDuration: 14,
    zoneShrink: 0.45,
  },
  players: [],
  activePlayerId: 0,
  zoneRadius: ZONE_START,
  elapsed: 0,
  lastFrame: performance.now(),
  projectiles: [],
  traps: [],
  pickups: [],
  logs: [],
  turnRemaining: 14,
  paused: false,
  winner: null,
  drafts: ["", ""],
  uiDirty: true,
  lastContextKey: "",
  aiDecisionAt: null,
  matchRecorded: false,
  modalOpen: false,
};

const keysDown = new Set();

function normalizeFormula(value) {
  return value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/∞/g, "infinity")
    .replace(/π/g, "pi")
    .replace(/→/g, "->");
}

function defaultProfile() {
  return {
    totalMatches: 0,
    wins: {
      player1: 0,
      player2: 0,
      cpu: 0,
      draws: 0,
    },
    highestLevel: 1,
    discovered: ["start"],
    tutorialSeen: false,
    lastWinner: "None",
  };
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultProfile();
    }
    const parsed = JSON.parse(raw);
    return {
      ...defaultProfile(),
      ...parsed,
      wins: {
        ...defaultProfile().wins,
        ...(parsed.wins || {}),
      },
      discovered: Array.from(new Set(parsed.discovered || ["start"])),
    };
  } catch {
    return defaultProfile();
  }
}

function saveProfile() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.profile));
  } catch {
    return;
  }
}

function discoverFormulaGlobal(formulaId) {
  if (!state.profile.discovered.includes(formulaId)) {
    state.profile.discovered.push(formulaId);
    saveProfile();
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function secondsLeft(targetTime) {
  return Math.max(0, targetTime - state.elapsed).toFixed(1);
}

function markDirty() {
  state.uiDirty = true;
}

function logEvent(title, body) {
  state.logs.unshift({ title, body, id: `${Date.now()}-${Math.random()}` });
  state.logs = state.logs.slice(0, 12);
  markDirty();
}

function readSettingsFromControls() {
  state.settings.mode = dom.modeSelect.value;
  state.settings.startLevel = Number(dom.startLevel.value);
  state.settings.turnDuration = Number(dom.turnDuration.value);
  state.settings.zoneShrink = Number(dom.zoneSpeed.value);
}

function createPlayer(id, name, color, x, y, controls, level, kind) {
  return {
    id,
    name,
    color,
    kind,
    x,
    y,
    vx: 0,
    vy: 0,
    radius: PLAYER_RADIUS,
    controls,
    health: 100,
    xp: XP_LEVELS[level - 1],
    level,
    known: new Set(["start"]),
    activeFormula: "start",
    reserves: { g: 0, v: 0, t: 0, dx: 0 },
    retreatTimer: 0,
    effects: {
      gravityMode: "normal",
      gravityUntil: 0,
      speedMode: "base",
      speedUntil: 0,
      timeMode: "base",
      timeUntil: 0,
      dxMode: "base",
      dxUntil: 0,
      cageUntil: 0,
      circleTrap: null,
    },
    aiState: {
      strafeSign: Math.random() > 0.5 ? 1 : -1,
    },
  };
}

function createPickup(variable, x, y) {
  return {
    variable,
    x,
    y,
    radius: 18,
    available: true,
    duplicatedBy: new Set(),
  };
}

function resetGame() {
  readSettingsFromControls();

  state.players = [
    createPlayer(
      0,
      "Player 1",
      "#66e3ff",
      CENTER.x - 120,
      CENTER.y,
      { up: "w", down: "s", left: "a", right: "d" },
      state.settings.startLevel,
      "human",
    ),
    createPlayer(
      1,
      state.settings.mode === "cpu" ? "CPU" : "Player 2",
      "#ff9d57",
      CENTER.x + 120,
      CENTER.y,
      { up: "arrowup", down: "arrowdown", left: "arrowleft", right: "arrowright" },
      state.settings.startLevel,
      state.settings.mode === "cpu" ? "cpu" : "human",
    ),
  ];

  state.activePlayerId = 0;
  state.zoneRadius = ZONE_START;
  state.elapsed = 0;
  state.turnRemaining = state.settings.turnDuration;
  state.projectiles = [];
  state.traps = [];
  state.pickups = [
    createPickup("g", CENTER.x - 210, CENTER.y - 140),
    createPickup("v", CENTER.x + 210, CENTER.y - 120),
    createPickup("t", CENTER.x - 180, CENTER.y + 160),
    createPickup("dx", CENTER.x + 180, CENTER.y + 150),
  ];
  state.logs = [];
  state.winner = null;
  state.paused = false;
  state.drafts = [formulaById.get("start").label, formulaById.get("start").label];
  state.lastFrame = performance.now();
  state.aiDecisionAt = null;
  state.matchRecorded = false;
  state.lastContextKey = "";

  logEvent("Match reset", `Mode: ${state.settings.mode}. Start level ${state.settings.startLevel}.`);
  logEvent("Controls", "Blue player uses WASD. Orange uses arrows unless CPU mode is active.");
  scheduleTurnContext();
  renderAll();
}

function scheduleTurnContext() {
  const activePlayer = getActivePlayer();
  if (activePlayer.kind === "cpu" && !state.winner) {
    state.aiDecisionAt = state.elapsed + 0.9 + Math.random() * 0.9;
  } else {
    state.aiDecisionAt = null;
  }
  markDirty();
}

function getActivePlayer() {
  return state.players[state.activePlayerId];
}

function getOtherPlayer() {
  return state.players[1 - state.activePlayerId];
}

function getFormula(player) {
  return formulaById.get(player.activeFormula);
}

function getDraft(playerId) {
  return state.drafts[playerId];
}

function setDraft(playerId, value) {
  state.drafts[playerId] = value;
}

function isControlsLocked() {
  return state.paused || Boolean(state.winner) || getActivePlayer().kind === "cpu";
}

function isHumanTurnInteractive() {
  return !isControlsLocked();
}

function hasRequirements(player, formula) {
  return formula.requires.every((requirement) => player.known.has(requirement));
}

function getBuildableFormulas(player) {
  return formulaCatalog.filter(
    (formula) =>
      formula.id !== "start" &&
      player.level >= formula.level &&
      hasRequirements(player, formula) &&
      !player.known.has(formula.id),
  );
}

function getKnownFormulas(player) {
  return Array.from(player.known)
    .map((id) => formulaById.get(id))
    .sort((a, b) => a.level - b.level || a.power - b.power);
}

function getNextLevelXp(player) {
  if (player.level >= 8) {
    return null;
  }
  return XP_LEVELS[player.level];
}

function gainXp(player, amount) {
  player.xp += amount;
  while (player.level < 8 && player.xp >= XP_LEVELS[player.level]) {
    player.level += 1;
    state.profile.highestLevel = Math.max(state.profile.highestLevel, player.level);
    saveProfile();
    logEvent(`${player.name} leveled up`, `${player.name} reached level ${player.level}.`);
  }
}

function submitFormulaForActivePlayer(rawValue) {
  if (state.winner) {
    return false;
  }

  const player = getActivePlayer();
  const normalized = normalizeFormula(rawValue.trim());

  if (!normalized) {
    return false;
  }

  const matchedId = formulaLookup.get(normalized);
  const containsEuler =
    normalized.includes("e^(i*pi)") || normalized.includes("e^(ipi)") || normalized.includes("eipi");

  setDraft(player.id, rawValue);

  if (!matchedId) {
    const penalty = classifyInvalidPenalty(normalized);
    applyFormulaPenalty(player, penalty, rawValue);
    return false;
  }

  const formula = formulaById.get(matchedId);

  if (player.known.has(formula.id)) {
    player.activeFormula = formula.id;
    state.turnRemaining = Math.max(0, state.turnRemaining - 0.35);
    setDraft(player.id, formula.label);
    logEvent(`${player.name} re-equipped`, `${player.name} switched to ${formula.label}.`);
    markDirty();
    return true;
  }

  if (player.level < formula.level || !hasRequirements(player, formula)) {
    applyFormulaPenalty(player, containsEuler ? "euler" : "slight", rawValue, formula);
    return false;
  }

  player.known.add(formula.id);
  player.activeFormula = formula.id;
  state.turnRemaining = Math.max(0, state.turnRemaining - 0.6);
  gainXp(player, 12 + formula.level * 3);
  discoverFormulaGlobal(formula.id);
  setDraft(player.id, formula.label);
  logEvent(`${player.name} verified a formula`, `${formula.label} is now active.`);
  markDirty();
  return true;
}

function applyFormulaPenalty(player, type, rawValue, formula = null) {
  let healthLoss = 0;
  let timeLoss = 0;
  let title = "Invalid formula";
  let body = `${rawValue} was rejected.`;

  if (type === "slight") {
    healthLoss = 4;
    timeLoss = 1.7;
    body = formula
      ? `${formula.label} is close, but requirements are not met yet.`
      : `${rawValue} is mathematically close, but not valid here.`;
  } else if (type === "euler") {
    healthLoss = 18;
    timeLoss = 4;
    title = "Failed Euler attempt";
    body = "The ultimate formula backfired. Massive penalty applied.";
  } else {
    healthLoss = 10;
    timeLoss = 2.6;
    body = `${rawValue} does not match any verified formula in this browser build.`;
  }

  player.health = clamp(player.health - healthLoss, 0, 100);
  state.turnRemaining = Math.max(0, state.turnRemaining - timeLoss);
  logEvent(title, `${player.name}: ${body}`);
  markDirty();
  checkWinner();
}

function classifyInvalidPenalty(normalized) {
  let bestScore = 0;

  for (const key of formulaLookup.keys()) {
    const score = similarity(normalized, key);
    if (score > bestScore) {
      bestScore = score;
    }
  }

  return bestScore >= 0.55 ? "slight" : "wild";
}

function similarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (!maxLen) {
    return 1;
  }
  return 1 - levenshtein(a, b) / maxLen;
}

function levenshtein(a, b) {
  const rows = Array.from({ length: a.length + 1 }, () => []);

  for (let i = 0; i <= a.length; i += 1) {
    rows[i][0] = i;
  }

  for (let j = 0; j <= b.length; j += 1) {
    rows[0][j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + cost,
      );
    }
  }

  return rows[a.length][b.length];
}

function canCounter(attackFormula, defenderFormula) {
  if (attackFormula.type === "infinity" || attackFormula.type === "aleph") {
    return defenderFormula.type === "limit" || defenderFormula.type === "reciprocal";
  }
  if (attackFormula.type === "pi") {
    return defenderFormula.type === "diameter";
  }
  if (attackFormula.type === "integral") {
    return defenderFormula.type === "antiderivative";
  }
  if (attackFormula.type === "derivative") {
    return defenderFormula.type === "integral" || defenderFormula.type === "antiderivative";
  }
  if (attackFormula.type === "complex") {
    return defenderFormula.type === "conjugate";
  }
  return false;
}

function isLargerRealCounter(attackFormula, defenderFormula) {
  const comparable = ["number", "constant", "trig"];
  return comparable.includes(attackFormula.type) &&
    comparable.includes(defenderFormula.type) &&
    defenderFormula.power > attackFormula.power;
}

function reduceFormula(player) {
  const current = getFormula(player);
  const fallback = formulaById.get(current.fallback || "start");
  player.activeFormula = player.known.has(fallback.id) ? fallback.id : "start";
}

function collapseSpecificFormula(player, allowedTypes) {
  const current = getFormula(player);
  if (!allowedTypes.includes(current.type)) {
    return false;
  }
  reduceFormula(player);
  setDraft(player.id, formulaById.get(player.activeFormula).label);
  return true;
}

function spawnProjectile(attacker, defender, formula, homing = false, colorOverride = null, speedScale = 1) {
  const dx = defender.x - attacker.x;
  const dy = defender.y - attacker.y;
  const angle = Math.atan2(dy, dx);
  const speed = (homing ? 170 : 360) * speedScale;

  state.projectiles.push({
    ownerId: attacker.id,
    targetId: defender.id,
    x: attacker.x,
    y: attacker.y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: homing ? 12 : 7,
    damage: formula.damage,
    type: formula.type,
    homing,
    color: colorOverride || attacker.color,
  });
}

function destroyHostileProjectiles(targetPlayerId, acceptedTypes) {
  let removed = 0;

  state.projectiles = state.projectiles.filter((projectile) => {
    const matches = projectile.targetId === targetPlayerId && acceptedTypes.includes(projectile.type);
    if (matches) {
      removed += 1;
    }
    return !matches;
  });

  return removed;
}

function attackWithActiveFormula() {
  if (state.winner) {
    return;
  }

  const attacker = getActivePlayer();
  const defender = getOtherPlayer();
  const formula = getFormula(attacker);
  const defenderFormula = getFormula(defender);

  if (canCounter(formula, defenderFormula)) {
    defender.health = clamp(defender.health - Math.max(4, Math.round(formula.damage * 0.2)), 0, 100);
    gainXp(defender, 8);
    logEvent(
      `${defender.name} countered`,
      `${defenderFormula.label} answered ${formula.label} and softened the attack.`,
    );
    endTurn("Counter interaction resolved.");
    checkWinner();
    return;
  }

  if (isLargerRealCounter(formula, defenderFormula)) {
    defender.health = clamp(defender.health - Math.max(4, Math.round(formula.damage * 0.35)), 0, 100);
    logEvent(
      "Real-number comparison",
      `${defender.name}'s active formula is larger, so the attack was dampened.`,
    );
    endTurn("Direct comparison favored the defender.");
    checkWinner();
    return;
  }

  switch (formula.type) {
    case "pi":
      state.traps.push({
        type: "piTrap",
        ownerId: attacker.id,
        targetId: defender.id,
        x: defender.x,
        y: defender.y,
        radius: 70 + formula.power * 1.45,
        endsAt: state.elapsed + 4.6,
        dps: 6,
      });
      logEvent("Pi trap deployed", `${defender.name} is trapped inside a circular boundary.`);
      break;

    case "integral":
      defender.effects.cageUntil = Math.max(defender.effects.cageUntil, state.elapsed + 3.6);
      defender.health = clamp(defender.health - formula.damage, 0, 100);
      logEvent("Integral cage", `${defender.name} is caged and loses movement freedom.`);
      break;

    case "diameter":
      if (attacker.effects.circleTrap) {
        const trap = attacker.effects.circleTrap;
        attacker.effects.circleTrap = null;
        state.traps = state.traps.filter((entry) => entry !== trap);
        defender.health = clamp(defender.health - 8, 0, 100);
        logEvent("Diameter escape", `${attacker.name} broke out of a pi trap and retaliated.`);
      } else if (collapseSpecificFormula(defender, ["pi"])) {
        defender.health = clamp(defender.health - 8, 0, 100);
        logEvent("Diameter collapse", `${attacker.name} defined the circle and weakened ${defender.name}'s pi line.`);
      } else {
        spawnProjectile(attacker, defender, formula, false, "#66e3ff", 0.95);
        logEvent("Diameter shot", "Boundary reasoning became a precision projectile.");
      }
      break;

    case "derivative":
      reduceFormula(defender);
      defender.health = clamp(defender.health - formula.damage, 0, 100);
      logEvent("Derivative strike", `${defender.name}'s formula was reduced.`);
      break;

    case "infinity":
      spawnProjectile(attacker, defender, formula, true);
      logEvent("Infinity released", "A homing infinity orb is tracking the defender.");
      break;

    case "aleph":
      spawnProjectile(attacker, defender, formula, true, "#d5ff63", 1.12);
      spawnProjectile(attacker, defender, formula, false, "#d5ff63", 0.92);
      logEvent("Aleph wave", "An infinite-cardinality wave split into multiple attacks.");
      break;

    case "euler":
      defender.health = clamp(defender.health - formula.damage, 0, 100);
      defender.activeFormula = "start";
      setDraft(defender.id, formulaById.get("start").label);
      logEvent("Euler's Identity", `${defender.name}'s current formula was reset to start.`);
      break;

    case "complex":
      spawnProjectile(attacker, defender, formula, false, "#a98fff");
      logEvent("Complex attack", "A complex-number shot entered the arena.");
      break;

    case "antiderivative":
      if (attacker.effects.cageUntil > state.elapsed) {
        attacker.effects.cageUntil = 0;
        defender.health = clamp(defender.health - 10, 0, 100);
        logEvent("Anti-derivative escape", `${attacker.name} dissolved a cage and regained mobility.`);
      } else if (collapseSpecificFormula(defender, ["integral", "derivative"])) {
        defender.health = clamp(defender.health - 10, 0, 100);
        logEvent("Anti-derivative reversal", `${attacker.name} reversed ${defender.name}'s calculus pressure.`);
      } else {
        spawnProjectile(attacker, defender, formula, false, "#ffcf8d", 1);
        logEvent("Anti-derivative cast", "The inverse-calculus response was fired offensively.");
      }
      break;

    case "limit":
      if (destroyHostileProjectiles(attacker.id, ["infinity", "aleph"]) > 0) {
        defender.health = clamp(defender.health - 10, 0, 100);
        logEvent("Limit response", `${attacker.name} collapsed hostile infinity pressure toward zero.`);
      } else if (collapseSpecificFormula(defender, ["infinity", "aleph"])) {
        defender.health = clamp(defender.health - 12, 0, 100);
        logEvent("Limit bound infinity", `${attacker.name} bounded ${defender.name}'s infinite line into a weaker state.`);
      } else {
        spawnProjectile(attacker, defender, formula, false, "#d5ff63", 1);
        logEvent("Limit attack", "A limiting strike was fired directly.");
      }
      break;

    case "reciprocal":
      if (destroyHostileProjectiles(attacker.id, ["infinity", "aleph"]) > 0) {
        defender.health = clamp(defender.health - 8, 0, 100);
        logEvent("Reciprocal collapse", `${attacker.name} inverted incoming infinity into a zero-state answer.`);
      } else if (collapseSpecificFormula(defender, ["infinity", "aleph"])) {
        defender.health = clamp(defender.health - 10, 0, 100);
        logEvent("Reciprocal bound", `${attacker.name} collapsed ${defender.name}'s infinite expression through inversion.`);
      } else {
        spawnProjectile(attacker, defender, formula, false, "#d5ff63", 0.92);
        logEvent("Reciprocal cast", "A reciprocal counter-formula became a direct shot.");
      }
      break;

    case "conjugate":
      if (destroyHostileProjectiles(attacker.id, ["complex"]) > 0) {
        defender.health = clamp(defender.health - 8, 0, 100);
        logEvent("Conjugate cancel", `${attacker.name} erased a complex attack and returned fire.`);
      } else if (collapseSpecificFormula(defender, ["complex"])) {
        defender.health = clamp(defender.health - 10, 0, 100);
        logEvent("Conjugate simplification", `${attacker.name} stripped imaginary pressure out of ${defender.name}'s formula.`);
      } else {
        spawnProjectile(attacker, defender, formula, false, "#a98fff", 0.96);
        logEvent("Conjugate shot", "Imaginary components were canceled into a stable response.");
      }
      break;

    case "zero":
      if (!nullifyHostileObjects(attacker.id)) {
        defender.health = clamp(defender.health - formula.damage, 0, 100);
      }
      logEvent("Zero operation", "The attack attempted to reduce something to zero.");
      break;

    default:
      spawnProjectile(attacker, defender, formula);
      logEvent("Attack fired", `${attacker.name} fired ${formula.label}.`);
      break;
  }

  gainXp(attacker, 8 + formula.level * 2);
  endTurn("Attack committed.");
  checkWinner();
}

function nullifyHostileObjects(attackerId) {
  const removedProjectileIndex = state.projectiles.findIndex((projectile) => projectile.ownerId !== attackerId);
  if (removedProjectileIndex >= 0) {
    state.projectiles.splice(removedProjectileIndex, 1);
    return true;
  }

  const removedTrapIndex = state.traps.findIndex((trap) => trap.ownerId !== attackerId);
  if (removedTrapIndex >= 0) {
    const removed = state.traps.splice(removedTrapIndex, 1)[0];
    const target = state.players[removed.targetId];
    if (target.effects.circleTrap === removed) {
      target.effects.circleTrap = null;
    }
    return true;
  }

  return false;
}

function runAction(auto = false) {
  if (state.winner) {
    return;
  }

  const player = getActivePlayer();
  player.effects.speedMode = "run";
  player.effects.speedUntil = Math.max(player.effects.speedUntil, state.elapsed + 2.2);
  gainXp(player, auto ? 4 : 8);
  logEvent(auto ? "Auto-run" : "Run + build", `${player.name} repositioned instead of attacking.`);
  endTurn("Run action chosen.");
}

function endTurn(reason) {
  state.activePlayerId = 1 - state.activePlayerId;
  state.turnRemaining = state.settings.turnDuration;
  setDraft(getActivePlayer().id, getDraft(getActivePlayer().id) || formulaById.get(getActivePlayer().activeFormula).label);
  logEvent("Turn changed", `${getActivePlayer().name} is active. ${reason}`);
  scheduleTurnContext();
}

function getNearbyPickup(player) {
  return state.pickups.find((pickup) => pickup.available && distance(player, pickup) <= PICKUP_RANGE) || null;
}

function duplicateNearestPickup() {
  if (state.winner) {
    return;
  }

  const player = getActivePlayer();
  const pickup = getNearbyPickup(player);

  if (!pickup) {
    logEvent("Duplicate failed", "Move closer to an unused physics variable first.");
    return;
  }

  if (pickup.duplicatedBy.has(player.id)) {
    logEvent("Duplicate failed", `${player.name} already duplicated that variable once.`);
    return;
  }

  pickup.duplicatedBy.add(player.id);
  player.reserves[pickup.variable] += 1;
  gainXp(player, 6);
  logEvent("Variable duplicated", `${player.name} copied ${pickup.variable} into reserve.`);
  markDirty();
}

function stealFromOpponent() {
  if (state.winner) {
    return;
  }

  const thief = getActivePlayer();
  const victim = getOtherPlayer();
  const separation = distance(thief, victim);
  const chance = getStealChance(separation);
  const stealable = Object.entries(victim.reserves).filter(([, count]) => count > 0);

  if (!stealable.length) {
    logEvent("Steal failed", `${victim.name} has no reserved variables to steal.`);
    return;
  }

  if (Math.random() > chance) {
    logEvent("Steal failed", `${thief.name} missed the theft window.`);
    return;
  }

  const [variable] = stealable[Math.floor(Math.random() * stealable.length)];
  victim.reserves[variable] -= 1;
  thief.reserves[variable] += 1;
  gainXp(thief, 10);
  logEvent("Steal success", `${thief.name} stole ${variable} from ${victim.name}.`);
  markDirty();
}

function getStealChance(separation) {
  if (separation <= 80) {
    return 0.7;
  }
  if (separation <= 160) {
    return 0.45;
  }
  if (separation <= 270) {
    return 0.2;
  }
  return 0.05;
}

function usePhysics(variable, mode, source) {
  if (state.winner) {
    return;
  }

  const player = getActivePlayer();

  if (source === "pickup") {
    const nearby = getNearbyPickup(player);
    if (!nearby || nearby.variable !== variable) {
      logEvent("Physics failed", "That variable is not in pickup range.");
      return;
    }
    nearby.available = false;
  } else {
    if (player.reserves[variable] <= 0) {
      logEvent("Physics failed", `No reserved ${variable} is available.`);
      return;
    }
    player.reserves[variable] -= 1;
  }

  applyPhysicsEffect(player, variable, mode);
  gainXp(player, 6);
  logEvent("Physics modified", `${player.name} used ${variable} -> ${mode}.`);
  markDirty();
}

function applyPhysicsEffect(player, variable, mode) {
  if (variable === "g") {
    player.effects.gravityMode = mode;
    player.effects.gravityUntil = state.elapsed + (mode === "reverse" ? 5 : 6);
  }

  if (variable === "v") {
    player.effects.speedMode = mode;
    player.effects.speedUntil = state.elapsed + (mode === "burst" ? 3.4 : 6);
  }

  if (variable === "t") {
    player.effects.timeMode = mode;
    player.effects.timeUntil = state.elapsed + 6;
    if (mode === "extend") {
      state.turnRemaining = Math.min(state.settings.turnDuration + 2, state.turnRemaining + 2);
    }
  }

  if (variable === "dx") {
    player.effects.dxMode = mode;
    player.effects.dxUntil = state.elapsed + 6;
    if (mode === "dash") {
      const opponent = state.players[1 - player.id];
      const angle = Math.atan2(opponent.y - player.y, opponent.x - player.x);
      player.vx += Math.cos(angle) * 170;
      player.vy += Math.sin(angle) * 170;
    }
  }
}

function updateEffects(player) {
  if (state.elapsed >= player.effects.gravityUntil) {
    player.effects.gravityMode = "normal";
  }
  if (state.elapsed >= player.effects.speedUntil) {
    player.effects.speedMode = "base";
  }
  if (state.elapsed >= player.effects.timeUntil) {
    player.effects.timeMode = "base";
  }
  if (state.elapsed >= player.effects.dxUntil) {
    player.effects.dxMode = "base";
  }
  if (player.effects.circleTrap && state.elapsed >= player.effects.circleTrap.endsAt) {
    player.effects.circleTrap = null;
  }
}

function getGravity(player) {
  if (player.effects.gravityMode === "low") {
    return 34;
  }
  if (player.effects.gravityMode === "reverse") {
    return -108;
  }
  return 102;
}

function getSpeedCap(player) {
  if (player.effects.speedMode === "burst") {
    return 300;
  }
  if (player.effects.speedMode === "sprint") {
    return 230;
  }
  if (player.effects.speedMode === "run") {
    return 245;
  }
  return 180;
}

function getAcceleration(player) {
  if (player.effects.timeMode === "surge") {
    return 410;
  }
  if (player.effects.timeMode === "extend") {
    return 340;
  }
  return 270;
}

function getDrag(player) {
  if (player.effects.dxMode === "precision" || player.effects.dxMode === "dash") {
    return 0.84;
  }
  return 0.9;
}

function getCpuInput(player) {
  const opponent = state.players[1 - player.id];
  const nearestPickup = getClosestAvailablePickup(player);
  let targetX = opponent.x;
  let targetY = opponent.y;
  let desiredDistance = 120;

  const centerDistance = distance(player, CENTER);
  if (centerDistance > state.zoneRadius - 70) {
    targetX = CENTER.x;
    targetY = CENTER.y;
    desiredDistance = 0;
  } else if (nearestPickup && player.reserves[nearestPickup.variable] === 0 && centerDistance < state.zoneRadius - 50) {
    targetX = nearestPickup.x;
    targetY = nearestPickup.y;
    desiredDistance = 0;
  } else if (distance(player, opponent) < 110) {
    targetX = opponent.x + player.aiState.strafeSign * 70;
    targetY = opponent.y - player.aiState.strafeSign * 70;
    desiredDistance = 0;
  }

  const dx = targetX - player.x;
  const dy = targetY - player.y;
  const dist = Math.hypot(dx, dy) || 1;
  const normalizedX = dx / dist;
  const normalizedY = dy / dist;

  if (dist < desiredDistance) {
    return { x: -normalizedX, y: -normalizedY };
  }

  return { x: normalizedX, y: normalizedY };
}

function getClosestAvailablePickup(player) {
  const available = state.pickups.filter((pickup) => pickup.available);
  if (!available.length) {
    return null;
  }
  return available.sort((a, b) => distance(player, a) - distance(player, b))[0];
}

function updatePlayerMovement(player, dt) {
  updateEffects(player);

  const canMove = state.elapsed >= player.effects.cageUntil;
  let inputX = 0;
  let inputY = 0;

  if (player.kind === "cpu") {
    const cpuInput = getCpuInput(player);
    inputX = cpuInput.x;
    inputY = cpuInput.y;
  } else {
    const controls = player.controls;
    inputX = (keysDown.has(controls.right) ? 1 : 0) - (keysDown.has(controls.left) ? 1 : 0);
    inputY = (keysDown.has(controls.down) ? 1 : 0) - (keysDown.has(controls.up) ? 1 : 0);
  }

  const gravity = getGravity(player);
  const speedCap = getSpeedCap(player);
  const acceleration = getAcceleration(player);
  const drag = getDrag(player);

  if (canMove) {
    player.vx += inputX * acceleration * dt;
    player.vy += inputY * acceleration * dt;
  } else {
    player.vx *= 0.82;
    player.vy *= 0.82;
  }

  player.vy += gravity * dt;
  player.vx *= drag;
  player.vy *= drag;

  const speed = Math.hypot(player.vx, player.vy);
  if (speed > speedCap) {
    const scale = speedCap / speed;
    player.vx *= scale;
    player.vy *= scale;
  }

  player.x = clamp(player.x + player.vx * dt, 20, ARENA_WIDTH - 20);
  player.y = clamp(player.y + player.vy * dt, 20, ARENA_HEIGHT - 20);

  if (player.effects.circleTrap) {
    const trap = player.effects.circleTrap;
    const dx = player.x - trap.x;
    const dy = player.y - trap.y;
    const dist = Math.hypot(dx, dy);
    const maxRadius = trap.radius - player.radius;

    if (dist > maxRadius) {
      const angle = Math.atan2(dy, dx);
      player.x = trap.x + Math.cos(angle) * maxRadius;
      player.y = trap.y + Math.sin(angle) * maxRadius;
      player.vx *= 0.4;
      player.vy *= 0.4;
    }

    player.health = clamp(player.health - trap.dps * dt, 0, 100);
  }
}

function updateProjectiles(dt) {
  for (let index = state.projectiles.length - 1; index >= 0; index -= 1) {
    const projectile = state.projectiles[index];
    const target = state.players[projectile.targetId];

    if (projectile.homing) {
      const angle = Math.atan2(target.y - projectile.y, target.x - projectile.x);
      projectile.vx += Math.cos(angle) * 60 * dt;
      projectile.vy += Math.sin(angle) * 60 * dt;
      const speed = Math.hypot(projectile.vx, projectile.vy);
      if (speed > 220) {
        const scale = 220 / speed;
        projectile.vx *= scale;
        projectile.vy *= scale;
      }
    }

    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;

    if (
      projectile.x < -40 ||
      projectile.x > ARENA_WIDTH + 40 ||
      projectile.y < -40 ||
      projectile.y > ARENA_HEIGHT + 40
    ) {
      state.projectiles.splice(index, 1);
      continue;
    }

    if (distance(projectile, target) <= target.radius + projectile.radius) {
      resolveProjectileHit(projectile, target);
      state.projectiles.splice(index, 1);
    }
  }
}

function resolveProjectileHit(projectile, target) {
  target.health = clamp(target.health - projectile.damage, 0, 100);

  if (projectile.type === "infinity" || projectile.type === "aleph") {
    const stealable = Object.entries(target.reserves).filter(([, count]) => count > 0);
    if (stealable.length) {
      const [variable] = stealable[Math.floor(Math.random() * stealable.length)];
      target.reserves[variable] -= 1;
      logEvent("Infinity consumed a variable", `${target.name} lost reserve ${variable}.`);
    }
  }

  checkWinner();
  markDirty();
}

function updateTraps(dt) {
  for (let index = state.traps.length - 1; index >= 0; index -= 1) {
    const trap = state.traps[index];
    const target = state.players[trap.targetId];

    if (state.elapsed >= trap.endsAt) {
      state.traps.splice(index, 1);
      if (target.effects.circleTrap === trap) {
        target.effects.circleTrap = null;
      }
      continue;
    }

    if (trap.type === "piTrap") {
      target.effects.circleTrap = trap;
      target.health = clamp(target.health - trap.dps * dt * 0.35, 0, 100);
    }
  }
}

function updateZoneAndProximity(dt) {
  state.zoneRadius = Math.max(ZONE_END, state.zoneRadius - state.settings.zoneShrink * dt);

  for (const player of state.players) {
    const distFromCenter = distance(player, CENTER);
    if (distFromCenter > state.zoneRadius - player.radius) {
      player.health = clamp(player.health - 7 * dt, 0, 100);
    }
  }

  const a = state.players[0];
  const b = state.players[1];
  const playerDistance = distance(a, b);

  if (playerDistance > PROXIMITY_LIMIT) {
    const aCenter = distance(a, CENTER);
    const bCenter = distance(b, CENTER);

    if (aCenter > bCenter) {
      a.retreatTimer += dt;
      b.retreatTimer = Math.max(0, b.retreatTimer - dt * 1.8);
    } else {
      b.retreatTimer += dt;
      a.retreatTimer = Math.max(0, a.retreatTimer - dt * 1.8);
    }
  } else {
    a.retreatTimer = Math.max(0, a.retreatTimer - dt * 1.6);
    b.retreatTimer = Math.max(0, b.retreatTimer - dt * 1.6);
  }

  if (a.retreatTimer >= RETREAT_LIMIT) {
    a.health = 0;
  }
  if (b.retreatTimer >= RETREAT_LIMIT) {
    b.health = 0;
  }
}

function finalizeMatchRecord() {
  if (state.matchRecorded) {
    return;
  }
  state.matchRecorded = true;
  state.profile.totalMatches += 1;
  state.profile.highestLevel = Math.max(
    state.profile.highestLevel,
    state.players[0].level,
    state.players[1].level,
  );

  if (!state.winner || state.winner.name === "Draw") {
    state.profile.wins.draws += 1;
    state.profile.lastWinner = "Draw";
  } else if (state.winner.id === 0) {
    state.profile.wins.player1 += 1;
    state.profile.lastWinner = state.winner.name;
  } else if (state.settings.mode === "cpu") {
    state.profile.wins.cpu += 1;
    state.profile.lastWinner = "CPU";
  } else {
    state.profile.wins.player2 += 1;
    state.profile.lastWinner = state.winner.name;
  }

  saveProfile();
}

function checkWinner() {
  if (state.winner) {
    return;
  }

  const losers = state.players.filter((player) => player.health <= 0);
  if (!losers.length) {
    return;
  }

  if (losers.length === 2) {
    state.winner = { id: null, name: "Draw" };
    logEvent("Match ended", "Both players were eliminated.");
  } else {
    const winner = state.players.find((player) => player.health > 0);
    state.winner = { id: winner.id, name: winner.name };
    logEvent("Match ended", `${winner.name} wins the duel.`);
  }

  state.paused = true;
  finalizeMatchRecord();
  markDirty();
}

function getCounterFormulaIdForAttack(attackType) {
  if (attackType === "infinity" || attackType === "aleph") {
    return ["limit", "reciprocalZero"];
  }
  if (attackType === "pi") {
    return ["diameter"];
  }
  if (attackType === "integral") {
    return ["antiderivative"];
  }
  if (attackType === "derivative") {
    return ["integral", "antiderivative"];
  }
  if (attackType === "complex") {
    return ["conjugate"];
  }
  return [];
}

function isCpuTurn() {
  return !state.paused && !state.winner && getActivePlayer().kind === "cpu";
}

function cpuTakeTurn() {
  if (!isCpuTurn()) {
    return;
  }

  const cpu = getActivePlayer();
  const opponent = getOtherPlayer();
  const opponentFormula = getFormula(opponent);
  const cpuFormula = getFormula(cpu);
  const buildable = getBuildableFormulas(cpu).sort((a, b) => b.power - a.power);
  const preferredCounters = getCounterFormulaIdForAttack(opponentFormula.type);
  const knownCounter = preferredCounters.find((formulaId) => cpu.known.has(formulaId));
  const buildableCounter = buildable.find((formula) => preferredCounters.includes(formula.id));
  const nearbyPickup = getNearbyPickup(cpu);

  if (buildableCounter) {
    submitFormulaForActivePlayer(buildableCounter.label);
  } else if (knownCounter) {
    cpu.activeFormula = knownCounter;
    setDraft(cpu.id, formulaById.get(knownCounter).label);
    logEvent("CPU adapted", `${cpu.name} equipped a counter formula.`);
    markDirty();
  } else if (buildable.length && cpuFormula.power < buildable[0].power && Math.random() > 0.25) {
    submitFormulaForActivePlayer(buildable[0].label);
  }

  if (nearbyPickup && Math.random() > 0.45) {
    if (cpu.reserves[nearbyPickup.variable] === 0 && Math.random() > 0.4) {
      duplicateNearestPickup();
    } else {
      const preferredMode =
        nearbyPickup.variable === "g"
          ? "low"
          : nearbyPickup.variable === "v"
            ? "burst"
            : nearbyPickup.variable === "t"
              ? "extend"
              : "dash";
      usePhysics(nearbyPickup.variable, preferredMode, "pickup");
    }
  }

  if (distance(cpu, opponent) < 120 && Math.random() > 0.55) {
    stealFromOpponent();
  }

  const activeFormula = getFormula(cpu);
  const canWin = opponent.health <= activeFormula.damage + 4;
  const counterPressure = canCounter(opponentFormula, activeFormula);
  const hasStrongerLine = buildable.length > 0 && buildable[0].power > activeFormula.power;

  if (canWin || activeFormula.type === "euler" || activeFormula.type === "infinity") {
    attackWithActiveFormula();
    return;
  }

  if (!counterPressure && (activeFormula.power >= getFormula(opponent).power || Math.random() > 0.48)) {
    attackWithActiveFormula();
    return;
  }

  if (hasStrongerLine && state.turnRemaining > 4.5) {
    runAction(false);
    return;
  }

  attackWithActiveFormula();
}

function renderHeroStats() {
  const discoveredCount = state.profile.discovered.length;
  const winTotal =
    state.profile.wins.player1 +
    state.profile.wins.player2 +
    state.profile.wins.cpu +
    state.profile.wins.draws;

  dom.heroStats.innerHTML = `
    <article class="hero-stat">
      <strong>${formulaCatalog.length}</strong>
      <span>Playable formulas in the browser codex</span>
    </article>
    <article class="hero-stat">
      <strong>${state.profile.highestLevel}</strong>
      <span>Highest saved level reached locally</span>
    </article>
    <article class="hero-stat">
      <strong>${state.profile.totalMatches}</strong>
      <span>Total saved matches played on this browser</span>
    </article>
    <article class="hero-stat">
      <strong>${discoveredCount}/${formulaCatalog.length}</strong>
      <span>Global formula discoveries saved</span>
    </article>
    <article class="hero-stat">
      <strong>${state.settings.mode === "cpu" ? "CPU" : "Hotseat"}</strong>
      <span>Current configured match mode</span>
    </article>
    <article class="hero-stat">
      <strong>${winTotal}</strong>
      <span>Total recorded results across wins and draws</span>
    </article>
  `;
}

function renderStatusPanels() {
  state.players.forEach((player, index) => {
    const nextXp = getNextLevelXp(player);
    const formula = getFormula(player);
    const effectTags = getEffectTags(player);
    const isActive = state.activePlayerId === player.id && !state.winner;
    const playerLabel = player.kind === "cpu" ? "CPU" : player.name;

    dom.playerPanels[index].innerHTML = `
      <div class="panel-head">
        <div>
          <p class="eyebrow">${isActive ? "Active turn" : player.kind === "cpu" ? "CPU side" : "Waiting"}</p>
          <h3>${playerLabel}</h3>
          <p class="status-copy">${isActive ? "Can attack or run right now." : "Keep moving, collecting variables, and preparing counters."}</p>
        </div>
        <span class="badge ${player.id === 0 ? "badge-cyan" : "badge-orange"}">${player.id === 0 ? "Blue" : "Orange"}</span>
      </div>

      <div class="meter">
        <div class="meter-head">
          <span class="meter-label">Health</span>
          <strong>${Math.ceil(player.health)}</strong>
        </div>
        <div class="meter-track">
          <div class="meter-fill meter-health" style="width: ${player.health}%"></div>
        </div>
      </div>

      <div class="meter">
        <div class="meter-head">
          <span class="meter-label">Retreat risk</span>
          <strong>${player.retreatTimer.toFixed(1)} / ${RETREAT_LIMIT.toFixed(1)}</strong>
        </div>
        <div class="meter-track">
          <div class="meter-fill meter-retreat" style="width: ${(player.retreatTimer / RETREAT_LIMIT) * 100}%"></div>
        </div>
      </div>

      <div class="metric-card">
        <span class="metric-label">Level and xp</span>
        <p>${player.level}${nextXp ? ` | ${player.xp}/${nextXp} xp` : " | maxed"}</p>
      </div>

      <div class="metric-card">
        <span class="metric-label">Current formula</span>
        <p><strong>${formula.label}</strong><br />${formula.detail}</p>
      </div>

      <div class="info-card">
        <h4>Reserved variables</h4>
        <div class="token-list">${renderReserveTokens(player)}</div>
      </div>

      <div class="info-card">
        <h4>Known formulas</h4>
        <div class="token-list">
          ${getKnownFormulas(player)
            .map(
              (knownFormula) =>
                `<span class="token"><strong>${knownFormula.id === player.activeFormula ? "[active]" : knownFormula.tier}</strong>&nbsp;${knownFormula.label}</span>`,
            )
            .join("")}
        </div>
      </div>

      <div class="effect-card">
        <h4>Status effects</h4>
        <div class="effect-list">
          ${
            effectTags.length
              ? effectTags.map((tag) => `<span class="effect-pill">${tag}</span>`).join("")
              : "<span class='effect-pill'>No active effects</span>"
          }
        </div>
      </div>
    `;
  });
}

function renderReserveTokens(player) {
  return ["g", "v", "t", "dx"]
    .map((variable) => `<span class="token"><strong>${variable}</strong>&nbsp;x${player.reserves[variable]}</span>`)
    .join("");
}

function getEffectTags(player) {
  const tags = [];

  if (state.elapsed < player.effects.gravityUntil) {
    tags.push(`g:${player.effects.gravityMode} ${secondsLeft(player.effects.gravityUntil)}s`);
  }
  if (state.elapsed < player.effects.speedUntil) {
    tags.push(`v:${player.effects.speedMode} ${secondsLeft(player.effects.speedUntil)}s`);
  }
  if (state.elapsed < player.effects.timeUntil) {
    tags.push(`t:${player.effects.timeMode} ${secondsLeft(player.effects.timeUntil)}s`);
  }
  if (state.elapsed < player.effects.dxUntil) {
    tags.push(`d/dx:${player.effects.dxMode} ${secondsLeft(player.effects.dxUntil)}s`);
  }
  if (state.elapsed < player.effects.cageUntil) {
    tags.push(`Caged ${secondsLeft(player.effects.cageUntil)}s`);
  }
  if (player.effects.circleTrap) {
    tags.push(`Pi trap ${secondsLeft(player.effects.circleTrap.endsAt)}s`);
  }

  return tags;
}

function renderTurnConsole() {
  const player = getActivePlayer();
  const opponent = getOtherPlayer();
  const activeFormula = getFormula(player);
  const buildable = getBuildableFormulas(player);
  const known = getKnownFormulas(player);
  const stealChance = Math.round(getStealChance(distance(player, opponent)) * 100);
  const controlsLocked = isControlsLocked();
  const statusTitle = state.winner
    ? "<span class='winner-banner'>Match complete</span>"
    : player.kind === "cpu"
      ? "CPU is thinking"
      : `${player.name} is live`;

  dom.turnConsole.innerHTML = `
    <div class="section-head">
      <div>
        <p class="eyebrow">Turn console</p>
        <h3>${statusTitle}</h3>
      </div>
      <span class="badge">${activeFormula.tier}</span>
    </div>

    <p class="status-line">
      <strong>Current attack:</strong> ${activeFormula.label}<br />
      <strong>Opponent active formula:</strong> ${getFormula(opponent).label}
    </p>

    <div class="action-grid">
      <button class="control-button" data-theme="attack" data-action="attack" ${controlsLocked ? "disabled" : ""} type="button">
        Attack with ${activeFormula.tier}
      </button>
      <button class="control-button" data-theme="run" data-action="run" ${controlsLocked ? "disabled" : ""} type="button">
        Run + Build
      </button>
      <button class="control-button" data-theme="utility" data-action="duplicate" ${controlsLocked ? "disabled" : ""} type="button">
        Duplicate nearest variable
      </button>
      <button class="control-button" data-theme="utility" data-action="steal" ${controlsLocked ? "disabled" : ""} type="button">
        Steal reserve (${stealChance}%)
      </button>
    </div>

    <form id="formula-form" class="formula-form">
      <label for="formula-input" class="metric-label">Type a formula attempt</label>
      <div class="formula-row">
        <input
          id="formula-input"
          class="formula-input"
          name="formula"
          autocomplete="off"
          value="${escapeHtml(getDraft(player.id))}"
          placeholder="Try: lim x->infinity 1/x = 0"
          ${controlsLocked ? "disabled" : ""}
        />
        <button class="button button-primary" type="submit" ${controlsLocked ? "disabled" : ""}>Verify</button>
      </div>
    </form>

    <div class="info-card">
      <h4>Buildable now</h4>
      <div class="chip-list">
        ${
          buildable.length
            ? buildable
                .map(
                  (formula) => `
                    <button class="chip chip-buildable" data-action="build" data-formula="${formula.id}" ${controlsLocked ? "disabled" : ""} type="button">
                      ${formula.label}
                    </button>
                  `,
                )
                .join("")
            : "<p class='console-empty'>Nothing new is buildable right now. Level up or complete the chain first.</p>"
        }
      </div>
    </div>

    <div class="info-card">
      <h4>Known arsenal</h4>
      <div class="chip-list">
        ${known
          .map(
            (formula) => `
              <button class="chip chip-known" data-action="equip" data-formula="${formula.id}" ${controlsLocked ? "disabled" : ""} type="button">
                ${formula.id === player.activeFormula ? "[active] " : ""}${formula.label}
              </button>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderPhysicsConsole() {
  const player = getActivePlayer();
  const nearbyPickup = getNearbyPickup(player);
  const controlsLocked = isControlsLocked();
  const reserveBlocks = ["g", "v", "t", "dx"]
    .map((variable) => renderPhysicsBlock(variable, "reserve", player.reserves[variable] > 0 && !controlsLocked))
    .join("");

  dom.physicsConsole.innerHTML = `
    <div class="section-head">
      <div>
        <p class="eyebrow">Physics console</p>
        <h3>Manipulate the battlefield</h3>
      </div>
      <span class="badge">${nearbyPickup ? `Nearby ${nearbyPickup.variable}` : "No pickup nearby"}</span>
    </div>

    <p class="support-copy">
      Variables in the arena are one-time use. Duplicate them to reserve first, or consume them directly.
    </p>

    <div class="dual-grid">
      <div class="info-card">
        <h4>Arena pickup</h4>
        ${
          nearbyPickup
            ? `
              <p><strong>${nearbyPickup.variable}</strong> is within range.</p>
              ${renderPhysicsBlock(nearbyPickup.variable, "pickup", !controlsLocked)}
            `
            : "<p>No unused variable is close enough right now.</p>"
        }
      </div>

      <div class="info-card">
        <h4>Reserve use</h4>
        <p>Saved copies can be activated from anywhere.</p>
        <div class="formula-codex">${reserveBlocks}</div>
      </div>
    </div>
  `;
}

function renderPhysicsBlock(variable, source, enabled) {
  const modeMap = {
    g: [
      { id: "low", label: "Low g", detail: "Float more easily for 6 seconds." },
      { id: "reverse", label: "Reverse g", detail: "Gravity flips for 5 seconds." },
    ],
    v: [
      { id: "sprint", label: "Sprint", detail: "Higher speed cap for 6 seconds." },
      { id: "burst", label: "Burst", detail: "Huge speed spike for 3.4 seconds." },
    ],
    t: [
      { id: "surge", label: "Surge", detail: "More acceleration for 6 seconds." },
      { id: "extend", label: "Extend", detail: "Acceleration plus extra turn time." },
    ],
    dx: [
      { id: "precision", label: "Precision", detail: "Sharper handling for 6 seconds." },
      { id: "dash", label: "Dash", detail: "Immediate directional dash." },
    ],
  };

  return `
    <div class="formula-card">
      <div class="formula-meta">
        <span class="tag tag-cyan">${variable}</span>
        <span class="tag">${source === "pickup" ? "arena" : "reserve"}</span>
      </div>
      <div class="chip-list">
        ${modeMap[variable]
          .map(
            (mode) => `
              <button
                class="chip"
                data-action="physics"
                data-variable="${variable}"
                data-mode="${mode.id}"
                data-source="${source}"
                ${enabled && !state.winner ? "" : "disabled"}
                type="button"
              >
                ${mode.label}
              </button>
            `,
          )
          .join("")}
      </div>
      <p class="library-note">${modeMap[variable].map((mode) => `${mode.label}: ${mode.detail}`).join(" ")}</p>
    </div>
  `;
}

function renderSystemsConsole() {
  const player = getActivePlayer();
  const locked = formulaCatalog.filter(
    (formula) =>
      formula.id !== "start" &&
      (!player.known.has(formula.id) && (player.level < formula.level || !hasRequirements(player, formula))),
  ).slice(0, 8);

  dom.systemsConsole.innerHTML = `
    <div class="section-head">
      <div>
        <p class="eyebrow">Systems reference</p>
        <h3>Counter rules and progression lanes</h3>
      </div>
      <span class="badge">Level ${player.level}</span>
    </div>

    <div class="log-list">
      <article class="log-item">
        <strong>Infinity</strong>
        <p>Counter with limit formulas or reciprocal collapse.</p>
      </article>
      <article class="log-item">
        <strong>Pi trap</strong>
        <p>Break the boundary with diameter reasoning.</p>
      </article>
      <article class="log-item">
        <strong>Integral cage</strong>
        <p>Escape with anti-derivative logic.</p>
      </article>
      <article class="log-item">
        <strong>Derivative pressure</strong>
        <p>Recover with integral-based answers.</p>
      </article>
      <article class="log-item">
        <strong>Complex numbers</strong>
        <p>Use the conjugate to cancel the imaginary component.</p>
      </article>
      <article class="log-item">
        <strong>Retreat punish</strong>
        <p>Stay close enough to avoid automatic loss by disengagement.</p>
      </article>
    </div>

    <div class="info-card">
      <h4>Next formulas to chase</h4>
      <div class="chip-list">
        ${
          locked.length
            ? locked
                .map(
                  (formula) => `<span class="chip chip-locked">${formula.label} (L${formula.level})</span>`,
                )
                .join("")
            : "<span class='chip'>Everything in this prototype is unlocked.</span>"
        }
      </div>
    </div>
  `;
}

function renderTacticalConsole() {
  const active = getActivePlayer();
  const opponent = getOtherPlayer();
  const activeFormula = getFormula(active);
  const opponentFormula = getFormula(opponent);
  const buildable = getBuildableFormulas(active);
  const nearbyPickup = getNearbyPickup(active);
  const notes = [];

  if (canCounter(activeFormula, opponentFormula)) {
    notes.push({
      title: "Current attack is risky",
      body: `${opponentFormula.label} can counter ${activeFormula.label}.`,
    });
  }

  if (canCounter(opponentFormula, activeFormula)) {
    notes.push({
      title: "You are holding a counter",
      body: `${activeFormula.label} answers ${opponentFormula.label} if they attack first.`,
    });
  }

  if (buildable.length) {
    notes.push({
      title: "Better line available",
      body: `You can build ${buildable[0].label} right now for more power or utility.`,
    });
  }

  if (nearbyPickup) {
    notes.push({
      title: "Variable in reach",
      body: `${nearbyPickup.variable} is in pickup range. Duplicate it or consume it now.`,
    });
  }

  if (active.retreatTimer > RETREAT_LIMIT * 0.6) {
    notes.push({
      title: "Retreat danger",
      body: "Return to the fight quickly or the retreat timer will end the match.",
    });
  }

  if (distance(active, CENTER) > state.zoneRadius - 60) {
    notes.push({
      title: "Zone pressure",
      body: "You are close to the shrinking boundary and will start losing health.",
    });
  }

  if (state.turnRemaining < 4) {
    notes.push({
      title: "Timer warning",
      body: "You are close to auto-run. Commit to an attack or reposition soon.",
    });
  }

  if (!notes.length) {
    notes.push({
      title: "Stable board state",
      body: "Keep building or attack if your current formula has enough value.",
    });
  }

  dom.tacticalConsole.innerHTML = `
    <div class="section-head">
      <div>
        <p class="eyebrow">Tactical guidance</p>
        <h3>What matters right now</h3>
      </div>
      <span class="badge">${active.kind === "cpu" ? "AI live" : "Human turn"}</span>
    </div>
    <div class="tactical-list">
      ${notes
        .map(
          (note) => `
            <article class="log-item">
              <strong>${note.title}</strong>
              <p>${note.body}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderLogs() {
  dom.eventLog.innerHTML = state.logs
    .map(
      (entry) => `
        <article class="log-item">
          <strong>${entry.title}</strong>
          <p>${entry.body}</p>
        </article>
      `,
    )
    .join("");
}

function renderMatchSummary() {
  const summaryWinner = state.winner ? state.winner.name : "Live match";
  dom.matchSummary.innerHTML = `
    <div class="section-head">
      <div>
        <p class="eyebrow">Match summary</p>
        <h3>Live configuration and score</h3>
      </div>
    </div>

    <div class="match-summary">
      <div class="profile-item">
        <h4>Current winner state</h4>
        <p>${summaryWinner}</p>
      </div>
      <div class="profile-item">
        <h4>Mode</h4>
        <p>${state.settings.mode === "cpu" ? "Versus CPU" : "Hotseat"}</p>
      </div>
      <div class="profile-item">
        <h4>Turn duration</h4>
        <p>${state.settings.turnDuration} seconds</p>
      </div>
      <div class="profile-item">
        <h4>Zone shrink</h4>
        <p>${state.settings.zoneShrink.toFixed(2)} per second</p>
      </div>
      <div class="profile-item">
        <h4>Saved results</h4>
        <p>P1 wins: ${state.profile.wins.player1} | P2 wins: ${state.profile.wins.player2} | CPU wins: ${state.profile.wins.cpu} | Draws: ${state.profile.wins.draws}</p>
      </div>
    </div>
  `;
}

function renderQuickstartGuide() {
  const active = getActivePlayer();
  const nearbyPickup = getNearbyPickup(active);
  dom.quickstartGuide.innerHTML = `
    <div class="section-head">
      <div>
        <p class="eyebrow">Guide</p>
        <h3>Recommended next steps</h3>
      </div>
    </div>

    <div class="guide-card">
      <ol class="guide-list">
        <li>Move both players in the arena and feel the shrinking-zone pressure.</li>
        <li>Verify a buildable formula from the turn console to grow your arsenal.</li>
        <li>${nearbyPickup ? `Use or duplicate the nearby ${nearbyPickup.variable} variable.` : "Move near a floating variable and duplicate it for reserves."}</li>
        <li>Try a counter matchup such as limit versus infinity or diameter versus pi.</li>
        <li>Switch to CPU mode if you want a solo test of the game loop.</li>
      </ol>
    </div>
  `;
}

function renderFormulaCodex() {
  const active = getActivePlayer();
  dom.formulaCodex.innerHTML = formulaCatalog
    .map((formula) => {
      const currentKnown = active.known.has(formula.id);
      const discovered = state.profile.discovered.includes(formula.id);
      const buildable = !currentKnown && active.level >= formula.level && hasRequirements(active, formula);
      const requirementsLabel = formula.requires.length
        ? formula.requires.map((id) => formulaById.get(id)?.label || id).join(", ")
        : "none";

      return `
        <article class="formula-card">
          <div class="formula-meta">
            <span class="tag tag-cyan">L${formula.level}</span>
            <span class="tag">${formula.tier}</span>
            <span class="tag ${currentKnown ? "tag-lime" : discovered ? "tag-orange" : "tag-violet"}">
              ${currentKnown ? "known now" : discovered ? "discovered" : "undiscovered"}
            </span>
          </div>
          <h4>${formula.label}</h4>
          <p>${formula.detail}</p>
          <p><strong>Power:</strong> ${formula.power} | <strong>Damage:</strong> ${formula.damage}</p>
          <p><strong>Requires:</strong> ${requirementsLabel}</p>
          <p><strong>Status:</strong> ${currentKnown ? "Known in current match" : buildable ? "Buildable in current match" : "Locked by level or chain"}</p>
        </article>
      `;
    })
    .join("");
}

function renderChainMap() {
  dom.chainMap.innerHTML = progressionLevels
    .map((entry) => {
      const formulas = formulaCatalog.filter((formula) => formula.level === entry.level);
      return `
        <article class="chain-item">
          <div class="chain-meta">
            <span class="tag tag-lime">Level ${entry.level}</span>
          </div>
          <h4>${entry.title}</h4>
          <p>${entry.copy}</p>
          <p><strong>Formulas:</strong> ${formulas.map((formula) => formula.label).join(", ")}</p>
        </article>
      `;
    })
    .join("");
}

function renderSystemsShowcase() {
  dom.systemsShowcase.innerHTML = worldCards
    .map(
      (card) => `
        <article class="showcase-card">
          <h4>${card.title}</h4>
          <p>${card.copy}</p>
        </article>
      `,
    )
    .join("");
}

function renderProgressionShowcase() {
  dom.progressionShowcase.innerHTML = progressionLevels
    .map(
      (entry) => `
        <article class="progress-item">
          <div class="profile-meta">
            <span class="tag tag-cyan">Level ${entry.level}</span>
            <span class="tag ${state.profile.highestLevel >= entry.level ? "tag-lime" : "tag-violet"}">
              ${state.profile.highestLevel >= entry.level ? "reached in profile" : "not yet reached"}
            </span>
          </div>
          <h4>${entry.title}</h4>
          <p>${entry.copy}</p>
        </article>
      `,
    )
    .join("");
}

function renderTechShowcase() {
  dom.techShowcase.innerHTML = techCards
    .map(
      (card) => `
        <article class="tech-item">
          <h4>${card.title}</h4>
          <p>${card.copy}</p>
        </article>
      `,
    )
    .join("");
}

function renderProfileShowcase() {
  dom.profileShowcase.innerHTML = `
    <article class="profile-item">
      <h4>Total matches</h4>
      <p>${state.profile.totalMatches}</p>
    </article>
    <article class="profile-item">
      <h4>Highest level</h4>
      <p>${state.profile.highestLevel}</p>
    </article>
    <article class="profile-item">
      <h4>Discoveries</h4>
      <p>${state.profile.discovered.length} / ${formulaCatalog.length}</p>
    </article>
    <article class="profile-item">
      <h4>Last winner</h4>
      <p>${state.profile.lastWinner}</p>
    </article>
    <article class="profile-item">
      <h4>Player 1 wins</h4>
      <p>${state.profile.wins.player1}</p>
    </article>
    <article class="profile-item">
      <h4>Player 2 wins</h4>
      <p>${state.profile.wins.player2}</p>
    </article>
    <article class="profile-item">
      <h4>CPU wins</h4>
      <p>${state.profile.wins.cpu}</p>
    </article>
    <article class="profile-item">
      <h4>Draws</h4>
      <p>${state.profile.wins.draws}</p>
    </article>
  `;
}

function renderArenaMetrics() {
  const activePlayer = getActivePlayer();
  const playerDistance = distance(state.players[0], state.players[1]);

  if (state.winner) {
    dom.turnIndicator.textContent = state.winner.name === "Draw" ? "Draw" : `${state.winner.name} wins`;
  } else if (state.paused) {
    dom.turnIndicator.textContent = `${activePlayer.name} turn (paused)`;
  } else {
    dom.turnIndicator.textContent = `${activePlayer.name} turn`;
  }

  dom.turnTimer.textContent = `${state.turnRemaining.toFixed(1)}s`;
  dom.zoneMeter.textContent = `${Math.round(state.zoneRadius)}`;
  dom.distanceMeter.textContent = `${Math.round(playerDistance)}`;
  dom.modeMeter.textContent = state.settings.mode === "cpu" ? "CPU" : "Hotseat";
  dom.pause.textContent = state.paused ? "Resume" : "Pause";
}

function renderAll() {
  renderHeroStats();
  renderStatusPanels();
  renderTurnConsole();
  renderPhysicsConsole();
  renderSystemsConsole();
  renderTacticalConsole();
  renderLogs();
  renderMatchSummary();
  renderQuickstartGuide();
  renderFormulaCodex();
  renderChainMap();
  renderSystemsShowcase();
  renderProgressionShowcase();
  renderTechShowcase();
  renderProfileShowcase();
  renderArenaMetrics();
  state.uiDirty = false;
}

function getContextKey() {
  const activePlayer = getActivePlayer();
  const opponent = getOtherPlayer();
  const nearbyPickup = getNearbyPickup(activePlayer);
  const stealChance = Math.round(getStealChance(distance(activePlayer, opponent)) * 100);

  return [
    state.activePlayerId,
    activePlayer.activeFormula,
    activePlayer.level,
    activePlayer.health.toFixed(0),
    opponent.activeFormula,
    nearbyPickup ? nearbyPickup.variable : "none",
    stealChance,
    state.winner ? state.winner.name : "live",
    state.settings.mode,
  ].join("|");
}

function updateLoop(now) {
  const dt = Math.min(0.033, (now - state.lastFrame) / 1000);
  state.lastFrame = now;

  if (!state.paused && !state.winner) {
    state.elapsed += dt;
    state.turnRemaining = Math.max(0, state.turnRemaining - dt);

    for (const player of state.players) {
      updatePlayerMovement(player, dt);
    }

    updateTraps(dt);
    updateProjectiles(dt);
    updateZoneAndProximity(dt);
    checkWinner();

    if (!state.winner && state.turnRemaining <= 0) {
      runAction(true);
    }

    if (isCpuTurn() && state.aiDecisionAt !== null && state.elapsed >= state.aiDecisionAt) {
      cpuTakeTurn();
    }
  }

  renderArena();
  renderArenaMetrics();
  renderStatusPanels();

  const contextKey = getContextKey();
  if (contextKey !== state.lastContextKey) {
    state.lastContextKey = contextKey;
    markDirty();
  }

  if (state.uiDirty) {
    renderAll();
  }

  requestAnimationFrame(updateLoop);
}

function renderArena() {
  const { ctx } = dom;
  ctx.clearRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);
  drawZone(ctx);
  drawPickups(ctx);
  drawTraps(ctx);
  drawProjectiles(ctx);
  drawPlayers(ctx);
}

function drawZone(ctx) {
  ctx.save();
  ctx.fillStyle = "rgba(3, 5, 8, 0.96)";
  ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

  ctx.beginPath();
  ctx.arc(CENTER.x, CENTER.y, state.zoneRadius, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(7, 14, 23, 0.96)";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255, 157, 87, 0.65)";
  ctx.stroke();
  ctx.restore();
}

function drawPickups(ctx) {
  for (const pickup of state.pickups) {
    ctx.save();
    ctx.globalAlpha = pickup.available ? 1 : 0.24;
    ctx.beginPath();
    ctx.arc(pickup.x, pickup.y, pickup.radius, 0, Math.PI * 2);
    ctx.fillStyle = pickup.available ? "rgba(213, 255, 99, 0.14)" : "rgba(255,255,255,0.04)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = pickup.available ? "rgba(213, 255, 99, 0.74)" : "rgba(255,255,255,0.18)";
    ctx.stroke();
    ctx.fillStyle = "#f5f7f9";
    ctx.font = "14px Bahnschrift";
    ctx.textAlign = "center";
    ctx.fillText(pickup.variable, pickup.x, pickup.y + 4);
    ctx.restore();
  }
}

function drawTraps(ctx) {
  for (const trap of state.traps) {
    if (trap.type === "piTrap") {
      ctx.save();
      ctx.beginPath();
      ctx.arc(trap.x, trap.y, trap.radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(102, 227, 255, 0.72)";
      ctx.lineWidth = 4;
      ctx.setLineDash([10, 10]);
      ctx.stroke();
      ctx.restore();
    }
  }

  for (const player of state.players) {
    if (state.elapsed < player.effects.cageUntil) {
      ctx.save();
      ctx.strokeStyle = "rgba(255, 157, 87, 0.84)";
      ctx.lineWidth = 3;
      ctx.strokeRect(player.x - 30, player.y - 30, 60, 60);
      ctx.restore();
    }
  }
}

function drawProjectiles(ctx) {
  for (const projectile of state.projectiles) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
    ctx.fillStyle = projectile.color;
    ctx.shadowBlur = 18;
    ctx.shadowColor = projectile.color;
    ctx.fill();
    ctx.restore();
  }
}

function drawPlayers(ctx) {
  for (const player of state.players) {
    const active = state.activePlayerId === player.id && !state.winner;

    ctx.save();
    ctx.strokeStyle = active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.25)";
    ctx.lineWidth = active ? 3 : 1.5;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius + (active ? 7 : 4), 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.shadowBlur = 18;
    ctx.shadowColor = player.color;
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Bahnschrift";
    ctx.textAlign = "center";
    ctx.fillText(player.id === 0 ? "P1" : player.kind === "cpu" ? "CPU" : "P2", player.x, player.y - 26);

    const formula = getFormula(player);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillText(formula.id === "start" ? "1+1" : formula.tier, player.x, player.y + 36);
    ctx.restore();
  }
}

function openTutorialModal() {
  state.modalOpen = true;
  dom.tutorialModal.classList.add("is-open");
  dom.tutorialModal.setAttribute("aria-hidden", "false");
}

function closeTutorialModal(persist = false) {
  if (persist) {
    state.profile.tutorialSeen = true;
    saveProfile();
  }
  state.modalOpen = false;
  dom.tutorialModal.classList.remove("is-open");
  dom.tutorialModal.setAttribute("aria-hidden", "true");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

document.addEventListener("keydown", (event) => {
  keysDown.add(event.key.toLowerCase());

  if (event.key === "Escape" && state.modalOpen) {
    closeTutorialModal(false);
  }
});

document.addEventListener("keyup", (event) => {
  keysDown.delete(event.key.toLowerCase());
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button || button.disabled) {
    return;
  }

  if (isControlsLocked()) {
    return;
  }

  const action = button.dataset.action;

  if (action === "attack") {
    attackWithActiveFormula();
  }
  if (action === "run") {
    runAction(false);
  }
  if (action === "duplicate") {
    duplicateNearestPickup();
  }
  if (action === "steal") {
    stealFromOpponent();
  }
  if (action === "build") {
    const formula = formulaById.get(button.dataset.formula);
    submitFormulaForActivePlayer(formula.label);
  }
  if (action === "equip") {
    const player = getActivePlayer();
    player.activeFormula = button.dataset.formula;
    setDraft(player.id, formulaById.get(button.dataset.formula).label);
    logEvent("Formula selected", `${player.name} equipped ${getDraft(player.id)}.`);
    markDirty();
  }
  if (action === "physics") {
    usePhysics(button.dataset.variable, button.dataset.mode, button.dataset.source);
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id !== "formula-form") {
    return;
  }
  event.preventDefault();
  if (!isHumanTurnInteractive()) {
    return;
  }
  const input = event.target.querySelector("#formula-input");
  submitFormulaForActivePlayer(input.value);
});

document.addEventListener("input", (event) => {
  if (event.target.id === "formula-input") {
    if (!isHumanTurnInteractive()) {
      return;
    }
    setDraft(getActivePlayer().id, event.target.value);
  }
});

dom.restart.addEventListener("click", () => {
  resetGame();
});

dom.pause.addEventListener("click", () => {
  if (state.winner) {
    return;
  }
  state.paused = !state.paused;
  markDirty();
});

function notifyConfigChange() {
  readSettingsFromControls();
  logEvent(
    "Configuration updated",
    `Restart to apply: ${state.settings.mode}, level ${state.settings.startLevel}, ${state.settings.turnDuration}s turns.`,
  );
  markDirty();
}

dom.modeSelect.addEventListener("change", notifyConfigChange);
dom.startLevel.addEventListener("change", notifyConfigChange);
dom.turnDuration.addEventListener("change", notifyConfigChange);
dom.zoneSpeed.addEventListener("change", notifyConfigChange);

dom.showTutorial.addEventListener("click", () => {
  openTutorialModal();
});

dom.openTutorial.addEventListener("click", () => {
  openTutorialModal();
});

dom.closeTutorial.addEventListener("click", () => {
  closeTutorialModal(false);
});

dom.startPlaying.addEventListener("click", () => {
  closeTutorialModal(false);
});

dom.dismissTutorial.addEventListener("click", () => {
  closeTutorialModal(true);
});

dom.resetProfile.addEventListener("click", () => {
  const confirmed = window.confirm("Reset all locally saved Formula Wars progress in this browser?");
  if (!confirmed) {
    return;
  }

  state.profile = defaultProfile();
  saveProfile();
  logEvent("Profile reset", "Local browser progression was reset.");
  renderAll();
});

function createStarfield() {
  const canvas = document.querySelector(".starfield");
  const context = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: Math.min(200, Math.floor(window.innerWidth / 8)) }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.4 + 0.2,
      alpha: Math.random() * 0.8 + 0.15,
      speed: Math.random() * 0.18 + 0.04,
    }));
  }

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const star of stars) {
      context.beginPath();
      context.fillStyle = `rgba(255,255,255,${star.alpha})`;
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = -4;
        star.x = Math.random() * canvas.width;
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
}

createStarfield();
resetGame();
renderSystemsShowcase();
renderTechShowcase();
renderProgressionShowcase();
renderProfileShowcase();
renderChainMap();

if (!state.profile.tutorialSeen) {
  openTutorialModal();
}

requestAnimationFrame(updateLoop);
