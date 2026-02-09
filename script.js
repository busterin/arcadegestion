document.addEventListener("DOMContentLoaded", () => {
  function setAppHeightVar() {
    const h = window.innerHeight;
    document.documentElement.style.setProperty("--appH", `${h}px`);
  }
  setAppHeightVar();
  window.addEventListener("resize", setAppHeightVar);
  window.addEventListener("orientationchange", setAppHeightVar);

  const GAME_DURATION_MS = 5 * 60 * 1000;
  const MAX_ACTIVE_POINTS = 12;
  const MISSION_LIFETIME_MS = 2 * 60 * 1000;
  const EXECUTION_TIME_MS = 10 * 1000;
  const SPAWN_MIN_DELAY_MS = 900;
  const SPAWN_MAX_DELAY_MS = 3800;
  const SCORE_WIN = 1;
  const SCORE_LOSE = 0;

  const ARCADE_WIN_TARGET = 8;

  const VERSUS_WIN_TARGET = 8;
  const VERSUS_WS_PATH = "/versus";
  const DEFAULT_VERSUS_WS_URL = "wss://arcadegestion.onrender.com/versus";
  const RECRUIT_STORAGE_KEY = "arcadegestion_recruits_v1";
  const RECRUIT_LAST_STORAGE_KEY = "arcadegestion_last_recruit_v1";
  const USER_PROFILE_AVATAR_KEY = "arcadegestion_user_profile_avatar_v1";
  const USER_PROFILE_NAME_KEY = "arcadegestion_user_profile_name_v1";
  const COINS_STORAGE_KEY = "arcadegestion_coins_v1";
  const DEFAULT_PROFILE_AVATAR_SRC = "images/Evelyn2.PNG";
  const DEFAULT_PROFILE_NAME = "Usuario";
  const DEFAULT_COINS = 50;
  const RECRUIT_PACK_COST = 5;

  const MISSIONS = [
    { id: "m1", title: "Rescatar prisioneros", internalTags: ["sigilo", "lider"], img: "images/mision.png", text: "Las hordas del General Orion han secuestrado civiles para extorsionar a las naciones vecinas. Envia un equipo capaz de infiltrarse y rescatarlos bajo presion." },
    { id: "m2", title: "Asalto al convoy", internalTags: ["adistancia", "exploracion"], img: "images/mision.png", text: "Un convoy enemigo cruza un paso estrecho. Interceptalo con precision y sin alertar a toda la guarnicion." },
    { id: "m3", title: "Defensa del bastion", internalTags: ["cuerpoacuerpo", "lider"], img: "images/mision.png", text: "El bastion aliado esta siendo asediado. Organiza defensa en primera linea y mantén la posicion." },
    { id: "m4", title: "Ritual arcano", internalTags: ["magia", "curacion"], img: "images/mision.png", text: "Una runa inestable amenaza con romper el sello. Se necesita control magico y soporte de sanacion." },
    { id: "m5", title: "Explorar ruinas", internalTags: ["exploracion", "sigilo"], img: "images/mision.png", text: "Un mapa antiguo marca ruinas prohibidas. Recupera informacion clave sin activar trampas." },
    { id: "m6", title: "Evacuacion nocturna", internalTags: ["lider", "curacion"], img: "images/mision.png", text: "Una aldea aliada debe evacuar antes del amanecer. Coordina rutas y atiende heridos durante la retirada." },
    { id: "m7", title: "Caceria aerea", internalTags: ["volar", "adistancia"], img: "images/mision.png", text: "Bestias voladoras bloquean el paso comercial. Derribalas antes de que destruyan los suministros." },
    { id: "m8", title: "Emboscada en bosque", internalTags: ["sigilo", "cuerpoacuerpo"], img: "images/mision.png", text: "Un destacamento enemigo patrulla el bosque. Ejecuta una emboscada rapida y desaparece sin dejar rastro." },
    { id: "m9", title: "Escolta real", internalTags: ["lider", "adistancia"], img: "images/mision.png", text: "Un emisario real cruza territorio hostil. Protege su ruta y neutraliza amenazas a media distancia." },
    { id: "m10", title: "Contencion de plaga", internalTags: ["curacion", "magia"], img: "images/mision.png", text: "Una enfermedad magica se expande por la frontera. Conten el brote y estabiliza a los afectados." },
    { id: "m11", title: "Sabotaje de puente", internalTags: ["exploracion", "adistancia"], img: "images/mision.png", text: "El enemigo depende de un puente estrategico. Localiza puntos debiles y ejecuta sabotaje controlado." },
    { id: "m12", title: "Duelo de campeones", internalTags: ["cuerpoacuerpo", "magia"], img: "images/mision.png", text: "El campeon rival desafia a tus tropas para romper la moral. Responde con fuerza y tecnica." },
    { id: "m13", title: "Refuerzo de frontera", internalTags: ["lider", "cuerpoacuerpo"], img: "images/mision.png", text: "La frontera norte necesita refuerzos urgentes. Reorganiza escuadras y frena el avance enemigo." },
    { id: "m14", title: "Rescate en acantilado", internalTags: ["volar", "curacion"], img: "images/mision.png", text: "Un peloton ha quedado aislado en un acantilado. Extraelos con rapidez y atiende a los heridos." },
    { id: "m15", title: "Reconocimiento profundo", internalTags: ["exploracion", "sigilo"], img: "images/mision.png", text: "Se sospecha una ofensiva sorpresa tras las montanas. Infiltrate y confirma movimientos sin ser detectado." }
  ];

  const CHARACTERS = [
    { id: "c1", name: "Winchester", tags: ["magia", "adistancia", "cuerpoacuerpo"] },
    { id: "c2", name: "Eliot", tags: ["magia", "curacion"] },
    { id: "c3", name: "Camus", tags: ["magia", "adistancia"] },
    { id: "c7", name: "Jane", tags: ["adistancia", "exploracion", "sigilo"] },
    { id: "c8", name: "Lisa", tags: ["magia", "curacion"] },
    { id: "c9", name: "Willard", tags: ["adistancia", "cuerpoacuerpo"] }
  ];

  const RECRUITABLE_CHARACTERS = [
    { id: "c4", name: "Friday", tags: ["volar", "adistancia"] },
    { id: "c5", name: "Risko", tags: ["adistancia", "lider"] },
    { id: "c6", name: "Pendergast", tags: ["lider", "exploracion"] },
    { id: "c10", name: "Landom", tags: ["magia", "lider"] }
  ];

  const CARDS = [
    { id: "card_castri", name: "Winchester", img: "images/Winchester.PNG", text: "Carta de apoyo: coordinacion y ejecucion con criterio." },
    { id: "card_maider", name: "Eliot", img: "images/Eliot.PNG", text: "Carta de apoyo: mirada de sala y ajuste fino." },
    { id: "card_celia", name: "Camus", img: "images/Camus.PNG", text: "Carta de apoyo: resuelve operativa con rapidez." },
    { id: "card_lorena", name: "Jane", img: "images/Jane.PNG?v=20260209", text: "Carta de apoyo: mejora presentacion, orden y estetica." },
    { id: "card_alba", name: "Lisa", img: "images/Lisa.PNG", text: "Carta de apoyo: ejecucion rapida y organizada." },
    { id: "card_mariam", name: "Willard", img: "images/Willard.PNG", text: "Carta de apoyo: coordina y aterriza lo pendiente." }
  ];

  const RECRUITABLE_CARDS = [
    { id: "card_friday", charId: "c4", name: "Friday", img: "images/Friday.PNG", text: "Carta de apoyo: programacion precisa y resolutiva." },
    { id: "card_risko", charId: "c5", name: "Risko", img: "images/Risko.png", text: "Carta de apoyo: depura problemas tecnicos con calma." },
    { id: "card_pendergast", charId: "c6", name: "Pendergast", img: "images/Pendergast.PNG", text: "Carta de apoyo: dinamiza equipos y formacion." }
  ];

  const AVATARS = [
    { key: "evelyn", name: "Evelyn", src: "images/Evelyn.png", accountSrc: "images/Evelyn2.PNG", alt: "Evelyn" },
    { key: "landom", name: "Landom", src: "images/Landom.png?v=20260210-3", accountSrc: "images/Landom2.png", alt: "Landom", unlockRecruitCharId: "c10" },
  ].sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));

  const introScreen = document.getElementById("introScreen");
  const introPrevBtn = document.getElementById("introPrevBtn");
  const introNextBtn = document.getElementById("introNextBtn");
  const introMenuBtn = document.getElementById("introMenuBtn");
  const introMenuImg = document.getElementById("introMenuImg");
  const introMenuFallback = document.getElementById("introMenuFallback");
  const introProfile = document.getElementById("introProfile");
  const introProfileImg = document.getElementById("introProfileImg");
  const introProfileName = document.getElementById("introProfileName");
  const introCoinsValue = document.getElementById("introCoinsValue");
  const storyScreen = document.getElementById("storyScreen");
  const storyLeftChar = document.getElementById("storyLeftChar");
  const storyRightChar = document.getElementById("storyRightChar");
  const storySpeaker = document.getElementById("storySpeaker");
  const storyText = document.getElementById("storyText");
  const storyNextBtn = document.getElementById("storyNextBtn");
  const storySkipBtn = document.getElementById("storySkipBtn");

  const recruitScreen = document.getElementById("recruitScreen");
  const recruitPackBtn = document.getElementById("recruitPackBtn");
  const recruitResultText = document.getElementById("recruitResultText");
  const recruitUnlockedText = document.getElementById("recruitUnlockedText");
  const recruitBackBtn = document.getElementById("recruitBackBtn");
  const recruitReveal = document.getElementById("recruitReveal");
  const recruitRevealImg = document.getElementById("recruitRevealImg");
  const recruitRevealName = document.getElementById("recruitRevealName");
  const recruitOddsBtn = document.getElementById("recruitOddsBtn");
  const recruitOddsPanel = document.getElementById("recruitOddsPanel");
  const recruitOddsList = document.getElementById("recruitOddsList");
  const recruitCoinsValue = document.getElementById("recruitCoinsValue");
  const recruitPriceHint = document.getElementById("recruitPriceHint");

  const userScreen = document.getElementById("userScreen");
  const userProfileImg = document.getElementById("userProfileImg");
  const userProfileTitle = document.getElementById("userProfileTitle");
  const userCoinsValue = document.getElementById("userCoinsValue");
  const userAvatarToggleBtn = document.getElementById("userAvatarToggleBtn");
  const userAvatarPicker = document.getElementById("userAvatarPicker");
  const userNameInput = document.getElementById("userNameInput");
  const userMainGrid = document.getElementById("userMainGrid");
  const userSecondaryGrid = document.getElementById("userSecondaryGrid");
  const userBackBtn = document.getElementById("userBackBtn");

  const startScreen = document.getElementById("startScreen");
  const startBtn = document.getElementById("startBtn");
  const startBackBtn = document.getElementById("startBackBtn");

  const prevAvatarBtn = document.getElementById("prevAvatarBtn");
  const nextAvatarBtn = document.getElementById("nextAvatarBtn");
  const avatarPreviewImg = document.getElementById("avatarPreviewImg");
  const avatarPreviewName = document.getElementById("avatarPreviewName");
  const dot0 = document.getElementById("dot0");
  const dot1 = document.getElementById("dot1");

  const teamScreen = document.getElementById("teamScreen");
  const teamGrid = document.getElementById("teamGrid");
  const teamCountEl = document.getElementById("teamCount");
  const teamHint = document.getElementById("teamHint");
  const teamConfirmBtn = document.getElementById("teamConfirmBtn");
  const teamBackBtn = document.getElementById("teamBackBtn");

  const gameRoot = document.getElementById("gameRoot");
  const mapEl = document.getElementById("map");
  const playerImg = document.getElementById("playerImg");
  const rivalImg = document.getElementById("rivalImg");
  const progressEl = document.getElementById("progress");
  const hudLabelEl = document.querySelector(".hud-label");
  const teamBar = document.getElementById("teamBar");
  const rivalTeamBtn = document.getElementById("rivalTeamBtn");

  const missionModal = document.getElementById("missionModal");
  const missionTitleEl = document.getElementById("missionTitle");
  const missionImgEl = document.getElementById("missionImg");
  const missionTextEl = document.getElementById("missionText");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const charactersGrid = document.getElementById("charactersGrid");
  const pickHint = document.getElementById("pickHint");
  const confirmBtn = document.getElementById("confirmBtn");

  const rouletteModal = document.getElementById("rouletteModal");
  const rouletteWheel = document.getElementById("rouletteWheel");
  const rouletteOutcome = document.getElementById("rouletteOutcome");
  const rouletteSub = document.getElementById("rouletteSub");
  const rouletteOkBtn = document.getElementById("rouletteOkBtn");

  const finalModal = document.getElementById("finalModal");
  const finalTitleEl = document.getElementById("finalTitle");
  const finalScoreEl = document.getElementById("finalScore");
  const playAgainBtn = document.getElementById("playAgainBtn");

  const cardInfoModal = document.getElementById("cardInfoModal");
  const cardInfoTitle = document.getElementById("cardInfoTitle");
  const cardInfoText = document.getElementById("cardInfoText");
  const cardInfoImg = document.getElementById("cardInfoImg");
  const cardInfoInfoBtn = document.getElementById("cardInfoInfoBtn");
  const cardInfoSkillsBtn = document.getElementById("cardInfoSkillsBtn");
  const closeCardInfoBtn = document.getElementById("closeCardInfoBtn");

  const specialModal = document.getElementById("specialModal");
  const closeSpecialBtn = document.getElementById("closeSpecialBtn");
  const specialCancelBtn = document.getElementById("specialCancelBtn");
  const specialAcceptBtn = document.getElementById("specialAcceptBtn");
  const tutorialModal = document.getElementById("tutorialModal");
  const tutorialText = document.getElementById("tutorialText");
  const tutorialNextBtn = document.getElementById("tutorialNextBtn");

  const matchmakingModal = document.getElementById("matchmakingModal");
  const matchmakingText = document.getElementById("matchmakingText");
  const cancelMatchBtn = document.getElementById("cancelMatchBtn");

  const rivalTeamModal = document.getElementById("rivalTeamModal");
  const rivalTeamGrid = document.getElementById("rivalTeamGrid");
  const closeRivalTeamBtn = document.getElementById("closeRivalTeamBtn");

  let selectedMode = "arcade";
  let currentMode = "arcade";

  let score = 0;
  let localWins = 0;
  let rivalWins = 0;

  let pendingMissions = [...MISSIONS];
  let activePoints = new Map();
  let completedMissionIds = new Set();
  let remoteClaimedMissionIds = new Set();
  let remoteResolvedMissionIds = new Set();
  let queuedVersusEvents = [];
  let lockedCharIds = new Set();

  let currentMissionId = null;
  let selectedCharIds = new Set();

  let gameEndAt = null;
  let gameClockTimer = null;
  let lifeTicker = null;
  let spawnTimer = null;
  let gameRunning = false;
  let noSpawnRect = null;

  let selectedTeamCardIds = new Set();
  let availableCharacters = [];
  let availableCards = [];

  let avatarIndex = 0;
  let introMenuIndex = 0;
  let specialUsed = false;
  let specialArmed = false;
  let recruitingInProgress = false;
  let unlockedRecruitCharIds = new Set(loadUnlockedRecruitCharIds());
  let currentCardInfoData = null;
  let coins = loadCoins();
  let tutorialPending = false;
  let tutorialStep = 0;

  const versus = {
    clientId: `p_${Math.random().toString(36).slice(2, 10)}`,
    transport: null,
    ws: null,
    wsReady: false,
    wsConnecting: false,
    wsAttempted: false,
    wsLastTried: [],
    matching: false,
    opponentId: null,
    opponentProfile: null,
    isSpawnHost: false,
    spawnWatchdogTimer: null,
    heartbeatTimer: null,
    matchId: null
  };

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max + 1));
  const INTRO_MENU_OPTIONS = [
    { key: "arcade", label: "ARCADE", img: "images/arcade.png" },
    { key: "versus", label: "VERSUS", img: "images/versus.png" },
    { key: "historia", label: "HISTORIA", img: "images/historia.png" },
    { key: "reclutar", label: "RECLUTAR", img: "images/reclutar.png" },
    { key: "cuenta", label: "CUENTA", img: "images/cuenta.png" }
  ];
  const STORY_LINES = [
    { speaker: "Risko", text: "Prueba", active: "left" },
    { speaker: "Landom", text: "Prueba2", active: "right" }
  ];
  const TUTORIAL_STEPS = [
    "Bienvenido al tutorial. Tu objetivo es completar misiones pulsando los puntos rojos del mapa.",
    "Al abrir una mision, elige 1 o 2 personajes. Si sus etiquetas coinciden con la mision, sube la probabilidad de exito.",
    "Tras asignar personajes, el punto pasa a amarillo. Cuando este listo, pulsa el punto para lanzar la ruleta.",
    "Si cae en verde, ganas la mision. Si cae en rojo, fallas. Completa suficientes misiones para ganar."
  ];
  let storyStep = 0;

  function loadUnlockedRecruitCharIds() {
    try {
      const raw = window.localStorage?.getItem(RECRUIT_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const valid = new Set(RECRUITABLE_CHARACTERS.map((c) => c.id));
      return Array.isArray(parsed) ? parsed.filter((id) => valid.has(id)) : [];
    } catch {
      return [];
    }
  }

  function persistUnlockedRecruitCharIds() {
    try {
      window.localStorage?.setItem(RECRUIT_STORAGE_KEY, JSON.stringify([...unlockedRecruitCharIds]));
    } catch {
      // ignore storage errors
    }
  }

  function loadLastRecruitedName() {
    try {
      const raw = window.localStorage?.getItem(RECRUIT_LAST_STORAGE_KEY);
      return raw ? String(raw) : null;
    } catch {
      return null;
    }
  }

  function persistLastRecruitedName(name) {
    try {
      window.localStorage?.setItem(RECRUIT_LAST_STORAGE_KEY, name);
    } catch {
      // ignore storage errors
    }
  }

  function loadCoins() {
    try {
      const raw = window.localStorage?.getItem(COINS_STORAGE_KEY);
      const parsed = Number(raw);
      return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : DEFAULT_COINS;
    } catch {
      return DEFAULT_COINS;
    }
  }

  function persistCoins() {
    try {
      window.localStorage?.setItem(COINS_STORAGE_KEY, String(coins));
    } catch {
      // ignore storage errors
    }
  }

  function renderCoins() {
    if (introCoinsValue) introCoinsValue.textContent = String(coins);
    if (userCoinsValue) userCoinsValue.textContent = String(coins);
    if (recruitCoinsValue) recruitCoinsValue.textContent = String(coins);
  }

  function setCoins(next) {
    coins = Math.max(0, Math.floor(Number(next) || 0));
    persistCoins();
    renderCoins();
  }

  function spendCoins(amount) {
    const cost = Math.max(0, Math.floor(Number(amount) || 0));
    if (coins < cost) return false;
    setCoins(coins - cost);
    return true;
  }

  function getSelectableCharacters() {
    return [
      ...CHARACTERS,
      ...RECRUITABLE_CHARACTERS.filter((ch) => unlockedRecruitCharIds.has(ch.id))
    ];
  }

  function getSelectableCards() {
    return [
      ...CARDS,
      ...RECRUITABLE_CARDS.filter((card) => unlockedRecruitCharIds.has(card.charId))
    ];
  }

  function getAvailableAvatars() {
    return AVATARS.filter((a) => !a.unlockRecruitCharId || unlockedRecruitCharIds.has(a.unlockRecruitCharId));
  }

  function clampAvatarIndex() {
    const avatars = getAvailableAvatars();
    if (!avatars.length) {
      avatarIndex = 0;
      return avatars;
    }
    avatarIndex = clamp(avatarIndex, 0, avatars.length - 1);
    return avatars;
  }

  function setRecruitRevealByName(name) {
    if (!recruitReveal || !recruitRevealImg || !recruitRevealName || !name) return;
    const card = RECRUITABLE_CARDS.find((c) => c.name === name);
    const avatar = AVATARS.find((a) => a.name === name);
    if (!card && !avatar) return;
    const isRisko = card?.name === "Risko";
    recruitReveal.classList.toggle("is-risko", isRisko);
    recruitRevealImg.src = isRisko
      ? "images/Risko.png"
      : (card?.img || avatar?.accountSrc || avatar?.src || "");
    recruitRevealImg.alt = card?.name || avatar?.name || "Recluta";
    recruitRevealName.textContent = card?.name || avatar?.name || name;
    recruitReveal.classList.remove("hidden");
  }

  function triggerRecruitRevealFx() {
    if (!recruitReveal) return;
    recruitReveal.classList.remove("reveal-burst");
    void recruitReveal.offsetWidth;
    recruitReveal.classList.add("reveal-burst");
  }

  function renderRecruitUnlockedState() {
    if (!recruitUnlockedText) return;
    const unlockedNames = RECRUITABLE_CHARACTERS
      .filter((ch) => unlockedRecruitCharIds.has(ch.id))
      .map((ch) => ch.name);
    recruitUnlockedText.textContent = unlockedNames.length
      ? `Desbloqueados: ${unlockedNames.join(", ")}`
      : "Desbloqueados: ninguno";
  }

  function renderRecruitOdds() {
    if (!recruitOddsList) return;

    const locked = RECRUITABLE_CHARACTERS.filter((ch) => !unlockedRecruitCharIds.has(ch.id));
    const pool = locked.length ? locked : RECRUITABLE_CHARACTERS;

    recruitOddsList.innerHTML = "";
    RECRUITABLE_CHARACTERS.forEach((ch) => {
      const pct = pool.some((p) => p.id === ch.id) ? (100 / pool.length) : 0;
      const row = document.createElement("div");
      row.className = "recruit-odds-row";
      row.innerHTML = `
        <span class="recruit-odds-name">${ch.name}</span>
        <span class="recruit-odds-pct">${pct.toFixed(1)}%</span>
      `;
      recruitOddsList.appendChild(row);
    });
  }

  function toggleRecruitOdds() {
    if (!recruitOddsPanel) return;
    recruitOddsPanel.classList.toggle("hidden");
    if (!recruitOddsPanel.classList.contains("hidden")) renderRecruitOdds();
  }

  function goToRecruitScreen() {
    if (!recruitScreen) return;
    introScreen.classList.add("hidden");
    storyScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
    recruitScreen.classList.remove("hidden");
    recruitReveal?.classList.add("hidden");
    recruitOddsPanel?.classList.add("hidden");
    if (recruitPriceHint) recruitPriceHint.textContent = "";
    renderCoins();
    renderRecruitUnlockedState();
    renderRecruitOdds();
  }

  function recruitRandomCharacter() {
    if (!recruitPackBtn || !recruitResultText) return;
    if (recruitingInProgress) return;
    if (!spendCoins(RECRUIT_PACK_COST)) {
      if (recruitPriceHint) recruitPriceHint.textContent = "No tienes suficientes monedas para abrir un cofre.";
      return;
    }
    if (recruitPriceHint) recruitPriceHint.textContent = "";

    const locked = RECRUITABLE_CHARACTERS.filter((ch) => !unlockedRecruitCharIds.has(ch.id));
    const pool = locked.length ? locked : RECRUITABLE_CHARACTERS;

    recruitingInProgress = true;
    recruitPackBtn.classList.add("spinning");
    recruitPackBtn.disabled = true;

    let tick = 0;
    const rollTimer = setInterval(() => {
      const candidate = pool[randInt(0, pool.length - 1)];
      recruitResultText.textContent = `Girando ruleta... ${candidate.name}`;
      tick += 1;
      if (tick >= 16) {
        clearInterval(rollTimer);
        const winner = pool[randInt(0, pool.length - 1)];
        const awardingNew = locked.some((ch) => ch.id === winner.id);

        if (awardingNew) {
          unlockedRecruitCharIds.add(winner.id);
          persistUnlockedRecruitCharIds();
        }

        persistLastRecruitedName(winner.name);
        renderRecruitUnlockedState();
        renderRecruitOdds();
        renderUserAvatarPicker();
        renderUserCollection();
        recruitResultText.textContent = awardingNew
          ? `Te ha tocado: ${winner.name}. Ya esta disponible en Arcade y Versus.`
          : `Te ha tocado: ${winner.name} (repetido). Ya tenias todos desbloqueados.`;
        setRecruitRevealByName(winner.name);
        triggerRecruitRevealFx();
        recruitPackBtn.classList.remove("spinning");
        recruitPackBtn.disabled = false;
        recruitingInProgress = false;
      }
    }, 160);
  }

  function loadUserProfileName() {
    try {
      const raw = window.localStorage?.getItem(USER_PROFILE_NAME_KEY);
      return raw ? String(raw) : null;
    } catch {
      return null;
    }
  }

  function persistUserProfileName(name) {
    try {
      window.localStorage?.setItem(USER_PROFILE_NAME_KEY, name);
    } catch {
      // ignore storage errors
    }
  }

  function normalizeUserProfileName(name) {
    const clean = String(name || "").trim();
    return clean || DEFAULT_PROFILE_NAME;
  }

  function setUserProfileName(name) {
    const next = normalizeUserProfileName(name);
    if (introProfileName) introProfileName.textContent = next;
    if (userProfileTitle) userProfileTitle.textContent = next;
    if (userNameInput && userNameInput.value !== next) userNameInput.value = next;
  }

  function loadUserProfileAvatar() {
    try {
      const raw = window.localStorage?.getItem(USER_PROFILE_AVATAR_KEY);
      return raw ? String(raw) : null;
    } catch {
      return null;
    }
  }

  function persistUserProfileAvatar(src) {
    try {
      window.localStorage?.setItem(USER_PROFILE_AVATAR_KEY, src);
    } catch {
      // ignore storage errors
    }
  }

  function getUnlockedProfileAvatarOptions() {
    const opts = [];
    const pushUnique = (src, name) => {
      if (!src || opts.some((o) => o.src === src)) return;
      opts.push({ src, name });
    };

    getAvailableAvatars().forEach((a) => pushUnique(a.accountSrc || a.src, a.name));
    CARDS.forEach((c) => pushUnique(c.img, c.name));
    RECRUITABLE_CARDS
      .filter((c) => unlockedRecruitCharIds.has(c.charId))
      .forEach((c) => pushUnique(c.img, c.name));

    return opts;
  }

  function setUserProfileAvatar(src) {
    const next = src || DEFAULT_PROFILE_AVATAR_SRC;
    if (userProfileImg) userProfileImg.src = next;
    if (introProfileImg) introProfileImg.src = next;
  }

  function renderUserAvatarPicker() {
    if (!userAvatarPicker) return;
    userAvatarPicker.innerHTML = "";

    const options = getUnlockedProfileAvatarOptions();
    const stored = loadUserProfileAvatar() || DEFAULT_PROFILE_AVATAR_SRC;
    const active = options.some((o) => o.src === stored) ? stored : DEFAULT_PROFILE_AVATAR_SRC;

    setUserProfileAvatar(active);
    persistUserProfileAvatar(active);

    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "avatar-option" + (active === opt.src ? " active" : "");
      btn.innerHTML = "<img src=\"" + opt.src + "\" alt=\"" + opt.name + "\" />";
      btn.addEventListener("click", () => {
        setUserProfileAvatar(opt.src);
        persistUserProfileAvatar(opt.src);
        renderUserAvatarPicker();
        userAvatarPicker?.classList.add("hidden");
        if (userAvatarToggleBtn) userAvatarToggleBtn.textContent = "Elegir avatar";
      });
      userAvatarPicker.appendChild(btn);
    });
  }

  function toggleUserAvatarPicker() {
    if (!userAvatarPicker) return;
    const willShow = userAvatarPicker.classList.contains("hidden");
    userAvatarPicker.classList.toggle("hidden");
    if (userAvatarToggleBtn) userAvatarToggleBtn.textContent = willShow ? "Ocultar avatares" : "Elegir avatar";
  }

  function renderUserCollection() {
    if (!userMainGrid || !userSecondaryGrid) return;
    userMainGrid.innerHTML = "";
    userSecondaryGrid.innerHTML = "";

    const mainCharacters = [...AVATARS]
      .map((a) => {
        const isUnlocked = !a.unlockRecruitCharId || unlockedRecruitCharIds.has(a.unlockRecruitCharId);
        return { ...a, src: a.accountSrc || a.src, isUnlocked };
      })
      .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
    const secondaryCards = [...CARDS, ...RECRUITABLE_CARDS].sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));

    mainCharacters.forEach((ch) => {
      const item = document.createElement("div");
      item.className = "user-char" + (ch.isUnlocked ? "" : " locked");
      item.innerHTML = "<img src=\"" + ch.src + "\" alt=\"" + ch.name + "\" />" +
        "<div class=\"user-char-name\">" + ch.name + "</div>";
      item.addEventListener("click", () => {
        openCardInfo({
          name: ch.name,
          img: ch.src,
          text: ch.isUnlocked
            ? "Personaje principal. Puedes usarlo como avatar."
            : "Personaje principal. Aun no desbloqueado."
        });
      });
      userMainGrid.appendChild(item);
    });

    secondaryCards.forEach((card) => {
      const isRecruitable = RECRUITABLE_CARDS.some((rc) => rc.id === card.id);
      const isUnlocked = !isRecruitable || unlockedRecruitCharIds.has(card.charId);
      const item = document.createElement("div");
      item.className = "user-char" + (isUnlocked ? "" : " locked");
      item.innerHTML = "<img src=\"" + card.img + "\" alt=\"" + card.name + "\" />" +
        "<div class=\"user-char-name\">" + card.name + "</div>";
      item.addEventListener("click", () => {
        openCardInfo({
          name: card.name,
          img: card.img,
          text: isUnlocked ? card.text : (card.text + " (Aun no desbloqueado)")
        });
      });
      userSecondaryGrid.appendChild(item);
    });
  }

  function goToUserScreen() {
    if (!userScreen) return;
    introScreen.classList.add("hidden");
    storyScreen?.classList.add("hidden");
    recruitScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
    userScreen.classList.remove("hidden");
    userAvatarPicker?.classList.add("hidden");
    if (userAvatarToggleBtn) userAvatarToggleBtn.textContent = "Elegir avatar";
    const currentName = normalizeUserProfileName(loadUserProfileName() || DEFAULT_PROFILE_NAME);
    setUserProfileName(currentName);
    persistUserProfileName(currentName);
    renderUserAvatarPicker();
    renderUserCollection();
  }

  function showModal(el) {
    el.classList.add("show");
    el.setAttribute("aria-hidden", "false");
  }

  function hideModal(el) {
    el.classList.remove("show");
    el.setAttribute("aria-hidden", "true");
  }

  function isAnyModalOpen() {
    return (
      missionModal.classList.contains("show") ||
      rouletteModal.classList.contains("show") ||
      finalModal.classList.contains("show") ||
      cardInfoModal.classList.contains("show") ||
      specialModal.classList.contains("show") ||
      tutorialModal.classList.contains("show") ||
      rivalTeamModal.classList.contains("show")
    );
  }

  function setGlobalPause(paused) {
    const now = performance.now();
    for (const st of activePoints.values()) {
      st.isPaused = paused;
      st.lastTickAt = now;
    }
  }

  function setSpecialArmedUI(isArmed) {
    playerImg.classList.toggle("special-armed", !!isArmed);
  }

  function setScore(delta) {
    score += delta;
  }

  function updateHud() {
    if (currentMode === "versus") {
      if (hudLabelEl) hudLabelEl.textContent = "Marcador";
      progressEl.textContent = `${localWins} - ${rivalWins}`;
    } else {
      if (hudLabelEl) hudLabelEl.textContent = "Misiones";
      progressEl.textContent = String(score) + "/" + String(ARCADE_WIN_TARGET);
    }
    rivalTeamBtn?.classList.toggle("hidden", currentMode !== "versus");
  }

  function setIntroVisible() {
    introMenuIndex = 0;
    renderIntroMenu(0);
    introScreen.classList.remove("hidden");
    storyScreen?.classList.add("hidden");
    recruitScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
  }

  function renderIntroMenu(direction = 0) {
    const item = INTRO_MENU_OPTIONS[introMenuIndex];
    if (!item) return;
    if (introMenuImg) {
      introMenuBtn?.classList.remove("no-image");
      introMenuImg.onerror = () => introMenuBtn?.classList.add("no-image");
      introMenuImg.onload = () => introMenuBtn?.classList.remove("no-image");
      introMenuImg.src = item.img;
      introMenuImg.alt = item.label;
      if (direction !== 0) {
        const dx = direction > 0 ? 28 : -28;
        introMenuImg.animate(
          [{ transform: `translateX(${dx}px)`, opacity: .2 }, { transform: "translateX(0px)", opacity: 1 }],
          { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" }
        );
      }
    }
    if (introMenuFallback) introMenuFallback.textContent = item.label;
  }

  function prevIntroMenuOption() {
    introMenuIndex = (introMenuIndex - 1 + INTRO_MENU_OPTIONS.length) % INTRO_MENU_OPTIONS.length;
    renderIntroMenu(-1);
  }

  function nextIntroMenuOption() {
    introMenuIndex = (introMenuIndex + 1) % INTRO_MENU_OPTIONS.length;
    renderIntroMenu(1);
  }

  function activateIntroMenuOption() {
    const current = INTRO_MENU_OPTIONS[introMenuIndex];
    if (!current) return;
    if (current.key === "arcade") goToStartScreen("arcade");
    if (current.key === "versus") goToStartScreen("versus");
    if (current.key === "historia") goToStoryScreen();
    if (current.key === "reclutar") goToRecruitScreen();
    if (current.key === "cuenta") goToUserScreen();
  }

  function goToStartScreen(mode) {
    selectedMode = mode;
    introScreen.classList.add("hidden");
    storyScreen?.classList.add("hidden");
    recruitScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.remove("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
  }

  function renderStoryStep() {
    const line = STORY_LINES[storyStep] || STORY_LINES[0];
    if (storySpeaker) storySpeaker.textContent = line.speaker;
    if (storyText) storyText.textContent = line.text;
    storyLeftChar?.classList.toggle("active", line.active === "left");
    storyRightChar?.classList.toggle("active", line.active === "right");
  }

  function goToStoryScreen() {
    introScreen.classList.add("hidden");
    recruitScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
    const landomAvatar = AVATARS.find((a) => a.key === "landom");
    if (storyRightChar && landomAvatar?.src) storyRightChar.src = landomAvatar.src;
    storyScreen?.classList.remove("hidden");
    storyStep = 0;
    renderStoryStep();
  }

  function startStoryCombat() {
    resetGame();
    selectedMode = "arcade";
    currentMode = "arcade";

    const avatars = clampAvatarIndex();
    const evelynIdx = avatars.findIndex((a) => a.key === "evelyn");
    if (evelynIdx >= 0) avatarIndex = evelynIdx;
    renderAvatarCarousel(0);

    selectedTeamCardIds = new Set(["card_celia", "card_castri", "card_lorena"]);
    if (!applyTeamFromCardIds([...selectedTeamCardIds])) {
      goToTeamScreen();
      return;
    }
    tutorialPending = true;

    introScreen.classList.add("hidden");
    storyScreen?.classList.add("hidden");
    recruitScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.remove("hidden");
    startGame();
  }

  function nextStoryStep() {
    if (storyStep < STORY_LINES.length - 1) {
      storyStep += 1;
      renderStoryStep();
      return;
    }
    startStoryCombat();
  }

  function goToTeamScreen() {
    startScreen.classList.add("hidden");
    teamScreen.classList.remove("hidden");
    renderTeamSelection();
  }

  function backToAvatarSelection() {
    teamScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  }

  function animateCarousel(direction) {
    const dx = direction > 0 ? 24 : -24;
    avatarPreviewImg.animate(
      [{ transform: `translateX(${dx}px)`, opacity: 0 }, { transform: "translateX(0px)", opacity: 1 }],
      { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
    avatarPreviewName.animate(
      [{ transform: `translateX(${dx}px)`, opacity: 0 }, { transform: "translateX(0px)", opacity: 1 }],
      { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  }

  function renderAvatarCarousel(direction = 0) {
    const avatars = clampAvatarIndex();
    const a = avatars[avatarIndex];
    if (!a) return;
    avatarPreviewImg.classList.toggle("is-landom", a.key === "landom");
    avatarPreviewImg.src = a.src;
    avatarPreviewImg.alt = a.alt;
    avatarPreviewName.textContent = a.name;
    dot0?.classList.toggle("active", avatarIndex === 0);
    dot1?.classList.toggle("active", avatars.length > 1 && avatarIndex === 1);
    if (direction !== 0) animateCarousel(direction);
  }

  function prevAvatar() {
    const avatars = clampAvatarIndex();
    if (avatars.length <= 1) return;
    avatarIndex = (avatarIndex - 1 + avatars.length) % avatars.length;
    renderAvatarCarousel(-1);
  }

  function nextAvatar() {
    const avatars = clampAvatarIndex();
    if (avatars.length <= 1) return;
    avatarIndex = (avatarIndex + 1) % avatars.length;
    renderAvatarCarousel(+1);
  }

  function updateTeamUI() {
    const n = selectedTeamCardIds.size;
    teamCountEl.textContent = String(n);
    teamConfirmBtn.disabled = n !== 6;
    teamHint.textContent = n < 6 ? "Elige 6 personajes para continuar." : "Perfecto. Pulsa Confirmar para empezar.";
  }

  function renderTeamSelection() {
    teamGrid.innerHTML = "";
    const cardsSorted = getSelectableCards().sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));

    cardsSorted.forEach((cardData) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "team-card" + (selectedTeamCardIds.has(cardData.id) ? " selected" : "");
      btn.innerHTML = `
        <img src="${cardData.img}" alt="${cardData.name}" />
      `;

      btn.addEventListener("click", () => {
        const isSelected = selectedTeamCardIds.has(cardData.id);
        if (isSelected) selectedTeamCardIds.delete(cardData.id);
        else if (selectedTeamCardIds.size < 6) selectedTeamCardIds.add(cardData.id);

        renderTeamSelection();
        updateTeamUI();
      });

      teamGrid.appendChild(btn);
    });

    updateTeamUI();
  }

  function commitTeam() {
    const allCards = getSelectableCards();
    const allCharacters = getSelectableCharacters();
    const selectedCards = [...selectedTeamCardIds].map((id) => allCards.find((c) => c.id === id)).filter(Boolean);
    const selectedNames = new Set(selectedCards.map((c) => c.name));

    availableCards = selectedCards;
    availableCharacters = allCharacters.filter((ch) => selectedNames.has(ch.name));

    return availableCards.length === 6 && availableCharacters.length === 6;
  }

  function applyTeamFromCardIds(cardIds) {
    const allCards = [...CARDS, ...RECRUITABLE_CARDS];
    const allCharacters = [...CHARACTERS, ...RECRUITABLE_CHARACTERS];
    const selectedCards = cardIds.map((id) => allCards.find((c) => c.id === id)).filter(Boolean);
    const selectedNames = new Set(selectedCards.map((c) => c.name));

    availableCards = selectedCards;
    availableCharacters = allCharacters.filter((ch) => selectedNames.has(ch.name));
    return availableCards.length > 0 && availableCharacters.length > 0;
  }

  function renderTutorialStep() {
    const text = TUTORIAL_STEPS[tutorialStep] || TUTORIAL_STEPS[TUTORIAL_STEPS.length - 1];
    if (tutorialText) tutorialText.textContent = text;
    if (tutorialNextBtn) tutorialNextBtn.textContent = tutorialStep >= TUTORIAL_STEPS.length - 1 ? "Entendido" : "Siguiente";
  }

  function startTutorial() {
    tutorialPending = false;
    tutorialStep = 0;
    renderTutorialStep();
    setGlobalPause(true);
    showModal(tutorialModal);
  }

  function nextTutorialStep() {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      tutorialStep += 1;
      renderTutorialStep();
      return;
    }
    hideModal(tutorialModal);
    if (!isAnyModalOpen()) setGlobalPause(false);
  }

  function normalizeTag(tag) {
    const raw = String(tag || "").trim().toLowerCase();
    const t = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (t === "cuerpo a cuerpo") return "cuerpoacuerpo";
    if (t === "a distancia") return "adistancia";
    if (t === "curacion") return "curacion";
    if (t === "lider") return "lider";
    if (t === "sigilo") return "sigilo";
    if (t === "exploracion") return "exploracion";
    if (t === "volar") return "volar";
    if (t === "magia") return "magia";

    return t.replace(/\s+/g, "");
  }

  function computeChance(mission, chosenIds) {
    const missionTags = Array.isArray(mission.internalTags)
      ? mission.internalTags.map(normalizeTag)
      : [normalizeTag(mission.internalTag)];

    let p = 0;

    for (const cid of chosenIds) {
      const ch = availableCharacters.find((c) => c.id === cid);
      if (!ch) continue;
      const tags = Array.isArray(ch.tags) ? ch.tags : [ch.tags];
      const normalizedTags = tags.map(normalizeTag);
      const match = normalizedTags.some((tag) => missionTags.includes(tag));
      p += match ? 0.8 : 0.1;
    }

    return clamp(p, 0, 1);
  }

  const spriteBoxCache = new Map();
  let referenceVisibleHeightPx = null;

  async function getSpriteBox(src) {
    if (spriteBoxCache.has(src)) return spriteBoxCache.get(src);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    await new Promise((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("No se pudo cargar " + src));
    });

    const hasAlpha = /\.png$/i.test(src) || /\.webp$/i.test(src);
    if (!hasAlpha) {
      const out = { w: img.naturalWidth, h: img.naturalHeight, boxH: img.naturalHeight, boxW: img.naturalWidth };
      spriteBoxCache.set(src, out);
      return out;
    }

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);

    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y++) {
      const row = y * width * 4;
      for (let x = 0; x < width; x++) {
        const a = data[row + x * 4 + 3];
        if (a > 16) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX < 0 || maxY < 0) {
      const out = { w: img.naturalWidth, h: img.naturalHeight, boxH: img.naturalHeight, boxW: img.naturalWidth };
      spriteBoxCache.set(src, out);
      return out;
    }

    const out = { w: img.naturalWidth, h: img.naturalHeight, boxW: maxX - minX + 1, boxH: maxY - minY + 1 };
    spriteBoxCache.set(src, out);
    return out;
  }

  async function applyNormalizedMapSizeFor(src) {
    const baseWidthPx = parseFloat(getComputedStyle(playerImg).width) || 120;
    const box = await getSpriteBox(src);
    const visibleHeight = box.boxH * (baseWidthPx / box.w);

    if (referenceVisibleHeightPx == null) {
      referenceVisibleHeightPx = visibleHeight;
      playerImg.style.width = "";
      return;
    }

    const neededWidth = referenceVisibleHeightPx * (box.w / box.boxH);
    const clamped = Math.max(baseWidthPx * 0.75, Math.min(neededWidth, baseWidthPx * 1.8));
    playerImg.style.width = `${clamped}px`;
  }

  async function applySelectedAvatarToMap() {
    const avatars = clampAvatarIndex();
    const a = avatars[avatarIndex];
    if (!a) return;
    playerImg.src = a.src;
    playerImg.alt = a.alt;
    playerImg.style.width = "";

    if (playerImg.complete) {
      await applyNormalizedMapSizeFor(a.src);
      computeNoSpawnRect();
    } else {
      playerImg.addEventListener("load", async () => {
        await applyNormalizedMapSizeFor(a.src);
        computeNoSpawnRect();
      }, { once: true });
    }
  }

  function computeNoSpawnRect() {
    const mapRect = mapEl.getBoundingClientRect();
    const imgRect = playerImg.getBoundingClientRect();
    if (!mapRect.width || !imgRect.width) return;

    const margin = 14;
    noSpawnRect = {
      left: imgRect.left - mapRect.left - margin,
      top: imgRect.top - mapRect.top - margin,
      right: imgRect.right - mapRect.left + margin,
      bottom: imgRect.bottom - mapRect.top + margin
    };
  }

  function pointWouldOverlapNoSpawn(xPx, yPx) {
    if (!noSpawnRect) return false;
    const r = 14;
    const left = xPx - r;
    const right = xPx + r;
    const top = yPx - r;
    const bottom = yPx + r;
    return !(right < noSpawnRect.left || left > noSpawnRect.right || bottom < noSpawnRect.top || top > noSpawnRect.bottom);
  }

  function updateTeamBarAvailability() {
    if (!teamBar) return;
    const items = teamBar.querySelectorAll(".teambar-item");
    items.forEach((item) => {
      const cid = item.getAttribute("data-char-id");
      const busy = cid && lockedCharIds.has(cid);
      item.classList.toggle("busy", !!busy);
    });
  }

  function renderTeamBar() {
    if (!teamBar) return;
    teamBar.innerHTML = "";
    if (!Array.isArray(availableCards) || availableCards.length < 1) return;

    const ordered = [...availableCards].sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
    ordered.forEach((cardData) => {
      const ch = availableCharacters.find((x) => x.name === cardData.name);
      const item = document.createElement("button");
      item.type = "button";
      item.className = "teambar-item";
      if (ch?.id) item.setAttribute("data-char-id", ch.id);
      item.innerHTML = `<img class="teambar-img" src="${cardData.img}" alt="${cardData.name}" />`;
      item.addEventListener("click", () => openCardInfo(cardData));
      teamBar.appendChild(item);
    });

    updateTeamBarAvailability();
  }

  function getLocalProfile() {
    const avatars = clampAvatarIndex();
    return {
      avatarKey: avatars[avatarIndex]?.key,
      teamCardIds: [...selectedTeamCardIds]
    };
  }

  function renderRivalTeam() {
    rivalTeamGrid.innerHTML = "";
    const ids = versus.opponentProfile?.teamCardIds || [];
    const allCards = [...CARDS, ...RECRUITABLE_CARDS];
    const cards = ids.map((id) => allCards.find((c) => c.id === id)).filter(Boolean);

    cards.forEach((card) => {
      const el = document.createElement("div");
      el.className = "rival-item";
      el.innerHTML = `
        <img src="${card.img}" alt="${card.name}" />
        <div class="rival-item-name">${card.name}</div>
      `;
      rivalTeamGrid.appendChild(el);
    });
  }

  function setRivalAvatarUI() {
    if (!rivalImg) return;
    if (currentMode !== "versus" || !versus.opponentProfile?.avatarKey) {
      rivalImg.classList.add("hidden");
      return;
    }

    const avatar = AVATARS.find((a) => a.key === versus.opponentProfile.avatarKey) || AVATARS[0];
    rivalImg.src = avatar.src;
    rivalImg.alt = avatar.alt || avatar.name;
    rivalImg.classList.remove("hidden");
  }

  function getConfiguredWsUrl() {
    const queryUrl = (() => {
      try {
        const raw = new URLSearchParams(window.location.search).get("ws");
        return raw ? decodeURIComponent(raw).trim() : null;
      } catch {
        return null;
      }
    })();
    if (queryUrl && /^wss?:\/\//i.test(queryUrl)) {
      try { window.localStorage?.setItem("versusWsUrl", queryUrl); } catch {}
      return queryUrl;
    }

    const globalUrl = typeof window !== "undefined" ? window.VERSUS_WS_URL : null;
    const localUrl = typeof window !== "undefined" ? window.localStorage?.getItem("versusWsUrl") : null;
    const candidate = (localUrl || globalUrl || DEFAULT_VERSUS_WS_URL || "").trim();
    if (!candidate) return null;
    if (!/^wss?:\/\//i.test(candidate)) return null;
    return candidate;
  }

  function getVersusWsCandidates() {
    const urls = [];
    const configured = getConfiguredWsUrl();
    if (configured) urls.push(configured);

    if (window.location && (window.location.protocol === "http:" || window.location.protocol === "https:")) {
      const wsProto = window.location.protocol === "https:" ? "wss:" : "ws:";
      urls.push(`${wsProto}//${window.location.host}${VERSUS_WS_PATH}`);

      const hostname = window.location.hostname;
      const port = window.location.port || (window.location.protocol === "https:" ? "443" : "80");
      if (hostname && port !== "3000") {
        urls.push(`${wsProto}//${hostname}:3000${VERSUS_WS_PATH}`);
      }
    }

    return [...new Set(urls)];
  }

  function connectVersusWebSocket(wsUrl, timeoutMs = 1800) {
    return new Promise((resolve) => {
      let settled = false;
      const ws = new WebSocket(wsUrl);

      const finish = (ok) => {
        if (settled) return;
        settled = true;
        resolve(ok);
      };

      const timeout = setTimeout(() => {
        try { ws.close(); } catch {}
        finish(false);
      }, timeoutMs);

      ws.addEventListener("open", () => {
        clearTimeout(timeout);
        versus.ws = ws;
        versus.wsReady = true;
        versus.transport = "ws";
        ws.send(JSON.stringify({ type: "vs_register", from: versus.clientId }));
        if (versus.matching) {
          matchmakingText.textContent = "Buscando rival online (movil, ordenador o tablet conectados ahora).";
          ws.send(JSON.stringify({
            type: "vs_looking",
            from: versus.clientId,
            profile: getLocalProfile(),
            ts: Date.now()
          }));
        }
        finish(true);
      });

      ws.addEventListener("message", (ev) => {
        try {
          const data = JSON.parse(ev.data);
          handleVersusMessage(data);
        } catch {
          // ignore malformed payloads
        }
      });

      ws.addEventListener("error", () => {
        clearTimeout(timeout);
        try { ws.close(); } catch {}
        finish(false);
      });

      ws.addEventListener("close", () => {
        if (!versus.ws || versus.ws !== ws) return;
        versus.wsReady = false;
        versus.ws = null;
        if (versus.transport === "ws") {
          versus.transport = null;
        }
        if (versus.matching) {
          matchmakingText.textContent = `Servidor online no disponible (${versus.wsLastTried[versus.wsLastTried.length - 1] || "sin endpoint WS"}). Reintentando online...`;
        }
      });
    });
  }

  async function ensureVersusTransport() {
    const wsCandidates = getVersusWsCandidates();
    if (!wsCandidates.length) {
      return;
    }

    if (versus.wsReady) return;
    if (versus.wsConnecting) {
      await new Promise((resolve) => {
        const wait = setInterval(() => {
          if (!versus.wsConnecting) {
            clearInterval(wait);
            resolve();
          }
        }, 50);
      });
      return;
    }

    versus.wsConnecting = true;
    versus.wsAttempted = true;
    versus.wsLastTried = [];

    try {
      for (const wsUrl of wsCandidates) {
        versus.wsLastTried.push(wsUrl);
        const ok = await connectVersusWebSocket(wsUrl);
        if (ok) return;
      }
    } finally {
      versus.wsConnecting = false;
    }
  }

  function versusSend(payload) {
    if (versus.wsReady && versus.ws) {
      versus.ws.send(JSON.stringify(payload));
    }
  }

  function clearMatchmakingState() {
    versus.matching = false;
    if (versus.heartbeatTimer) clearInterval(versus.heartbeatTimer);
    versus.heartbeatTimer = null;
    versusSend({ type: "vs_cancel", from: versus.clientId, ts: Date.now() });
  }

  async function startVersusMatchmaking() {
    await ensureVersusTransport();

    versus.matching = true;
    versus.opponentId = null;
    versus.opponentProfile = null;
    versus.matchId = null;

    const usingWs = versus.wsReady;
    matchmakingText.textContent = usingWs
      ? "Buscando rival online (movil, ordenador o tablet conectados ahora)."
      : `Servidor online no disponible (${versus.wsLastTried[versus.wsLastTried.length - 1] || "sin endpoint WS"}). Reintentando online...`;
    showModal(matchmakingModal);

    const announce = () => {
      if (!versus.wsReady) {
        ensureVersusTransport();
        if (!versus.wsReady) {
          matchmakingText.textContent = `Servidor online no disponible (${versus.wsLastTried[versus.wsLastTried.length - 1] || "sin endpoint WS"}). Reintentando online...`;
        }
      } else {
        matchmakingText.textContent = "Buscando rival online (movil, ordenador o tablet conectados ahora).";
      }

      versusSend({
        type: "vs_looking",
        from: versus.clientId,
        profile: getLocalProfile(),
        ts: Date.now()
      });
    };

    announce();
    versus.heartbeatTimer = setInterval(announce, 1000);
  }

  function finalizeVersusMatch(opponentId, opponentProfile) {
    if (!opponentId || typeof opponentId !== "string" || opponentId === versus.clientId) return;
    if (!versus.matching) return;
    clearMatchmakingState();
    hideModal(matchmakingModal);

    versus.opponentId = opponentId;
    versus.opponentProfile = opponentProfile || null;
    versus.matchId = [versus.clientId, opponentId].sort().join("_");
    versus.isSpawnHost = versus.clientId < opponentId;

    currentMode = "versus";
    localWins = 0;
    rivalWins = 0;
    renderRivalTeam();
    setRivalAvatarUI();
    startGame();
  }

  function handleVersusMessage(msg) {
    if (!msg || msg.from === versus.clientId) return;

    if (msg.to && msg.to !== versus.clientId) return;

    if (msg.type === "vs_match_found") {
      if (!versus.matching || msg.to !== versus.clientId || versus.opponentId) return;
      if (!msg.opponentId || msg.opponentId === versus.clientId) return;
      finalizeVersusMatch(msg.opponentId, msg.opponentProfile);
      return;
    }

    if (!versus.opponentId && msg.from) {
      versus.opponentId = msg.from;
    }
    if (versus.opponentId && msg.from !== versus.opponentId) return;

    if (msg.type === "vs_mission_resolved") {
      if (currentMode !== "versus" || !gameRunning) {
        queuedVersusEvents.push(msg);
        return;
      }
      applyRemoteMissionResolution(msg.missionId, !!msg.success);
      return;
    }

    if (msg.type === "vs_spawn_mission" || msg.type === "vs_mission_claimed" || msg.type === "vs_sync_request" || msg.type === "vs_sync_snapshot") return;

    if (msg.type === "vs_match_end") {
      if (currentMode !== "versus" || msg.from !== versus.opponentId) return;
      if (gameRunning) finishVersusGame(false, "Tu rival llego antes a 8 misiones.");
      return;
    }

    if (msg.type === "vs_leave") {
      if (currentMode !== "versus" || msg.from !== versus.opponentId) return;
      if (gameRunning) finishVersusGame(true, "Tu rival se desconecto.");
    }
  }

  function notifyVersusMissionResult(missionId, success) {
    if (currentMode !== "versus" || !versus.opponentId) return;
    versusSend({
      type: "vs_mission_resolved",
      from: versus.clientId,
      to: versus.opponentId,
      missionId,
      success: !!success,
      ts: Date.now()
    });
  }

  function notifyVersusMissionSpawn(missionId, xPct, yPct) {
    if (currentMode !== "versus" || !versus.opponentId) return;
    versusSend({
      type: "vs_spawn_mission",
      from: versus.clientId,
      to: versus.opponentId,
      missionId,
      xPct,
      yPct,
      ts: Date.now()
    });
  }

  function notifyVersusMissionClaim(missionId) {
    if (currentMode !== "versus" || !versus.opponentId) return;
    versusSend({
      type: "vs_mission_claimed",
      from: versus.clientId,
      to: versus.opponentId,
      missionId,
      ts: Date.now()
    });
  }

  function notifyVersusSyncRequest() {
    if (currentMode !== "versus" || !versus.opponentId) return;
    versusSend({
      type: "vs_sync_request",
      from: versus.clientId,
      to: versus.opponentId,
      ts: Date.now()
    });
  }

  function notifyVersusSyncSnapshot() {
    if (currentMode !== "versus" || !versus.opponentId) return;
    const points = [];
    for (const [missionId, st] of activePoints.entries()) {
      if (!st || !st.pointEl) continue;
      if (completedMissionIds.has(missionId)) continue;
      points.push({ missionId, xPct: st.xPct, yPct: st.yPct });
    }
    versusSend({
      type: "vs_sync_snapshot",
      from: versus.clientId,
      to: versus.opponentId,
      points,
      ts: Date.now()
    });
  }

  function applyVersusSyncSnapshot(points) {
    if (!Array.isArray(points)) return;
    const wanted = new Set(points.map((p) => p.missionId));

    for (const [missionId] of activePoints.entries()) {
      if (!wanted.has(missionId) && !completedMissionIds.has(missionId)) {
        removePoint(missionId);
      }
    }

    for (const p of points) {
      if (!p || !p.missionId) continue;
      if (completedMissionIds.has(p.missionId)) continue;
      if (activePoints.has(p.missionId)) continue;
      applyRemoteMissionSpawn(p.missionId, p.xPct, p.yPct);
    }
  }

  function applyRemoteMissionSpawn(missionId, xPct, yPct) {
    if (!gameRunning || completedMissionIds.has(missionId) || activePoints.has(missionId) || getRedPointsCount() >= MAX_ACTIVE_POINTS) return;
    const mission = MISSIONS.find((m) => m.id === missionId);
    if (!mission) return;
    pendingMissions = pendingMissions.filter((m) => m.id !== missionId);
    createMissionPoint(mission, { xPct, yPct });
  }

  function applyRemoteMissionClaim(missionId) {
    if (completedMissionIds.has(missionId)) return;
    remoteClaimedMissionIds.add(missionId);
    pendingMissions = pendingMissions.filter((m) => m.id !== missionId);

    if (currentMissionId === missionId && missionModal.classList.contains("show")) {
      hideModal(missionModal);
      currentMissionId = null;
      selectedCharIds = new Set();
      if (!isAnyModalOpen()) setGlobalPause(false);
    }

    releaseCharsForMission(missionId);
    removePoint(missionId);
  }

  function applyRemoteMissionResolution(missionId, success) {
    if (remoteResolvedMissionIds.has(missionId)) return;
    remoteResolvedMissionIds.add(missionId);

    if (success) rivalWins += 1;
    updateHud();

    if (rivalWins >= VERSUS_WIN_TARGET) {
      finishVersusGame(false, "Tu rival llego antes a 8 misiones.");
    }
  }

  function stopGameLoops() {
    clearInterval(lifeTicker);
    clearTimeout(spawnTimer);
    clearInterval(gameClockTimer);
    gameClockTimer = null;
    gameRunning = false;
    if (versus.spawnWatchdogTimer) {
      clearInterval(versus.spawnWatchdogTimer);
      versus.spawnWatchdogTimer = null;
    }
  }

  function startVersusSpawnWatchdog() {
    if (versus.spawnWatchdogTimer) clearInterval(versus.spawnWatchdogTimer);
    if (currentMode !== "versus") return;

    let checks = 0;
    versus.spawnWatchdogTimer = setInterval(() => {
      if (!gameRunning || currentMode !== "versus") {
        clearInterval(versus.spawnWatchdogTimer);
        versus.spawnWatchdogTimer = null;
        return;
      }

      if (activePoints.size > 0 || completedMissionIds.size > 0) {
        checks = 0;
        return;
      }

      checks += 1;
      if (!versus.isSpawnHost && checks >= 4) {
        notifyVersusSyncRequest();
      }
    }, 1500);
  }

  function startGameClock() {
    clearInterval(gameClockTimer);
    gameEndAt = performance.now() + GAME_DURATION_MS;

    gameClockTimer = setInterval(() => {
      const now = performance.now();
      if (now >= gameEndAt) endGameByTime();
    }, 250);
  }

  function endGameByTime() {
    stopGameLoops();
    rouletteOkBtn.disabled = true;

    hideModal(missionModal);
    hideModal(rouletteModal);
    hideModal(cardInfoModal);
    hideModal(specialModal);

    finishArcadeByTime();
  }

  function startGame() {
    teamScreen.classList.add("hidden");
    gameRoot.classList.remove("hidden");

    specialUsed = false;
    specialArmed = false;
    setSpecialArmedUI(false);

    applySelectedAvatarToMap();

    const refreshNoSpawn = () => computeNoSpawnRect();
    if (playerImg.complete) refreshNoSpawn();
    else playerImg.addEventListener("load", refreshNoSpawn, { once: true });

    renderTeamBar();
    setRivalAvatarUI();
    updateHud();

    gameRunning = true;

    if (currentMode === "arcade") clearInterval(gameClockTimer);
    else clearInterval(gameClockTimer);

    startLifeTicker();
    scheduleNextSpawn();
    if (currentMode === "versus" && queuedVersusEvents.length) {
      const queued = [...queuedVersusEvents];
      queuedVersusEvents = [];
      queued.forEach((ev) => handleVersusMessage(ev));
    }
    if (tutorialPending && currentMode === "arcade") startTutorial();
  }

  function getRedPointsCount() {
    let count = 0;
    for (const st of activePoints.values()) {
      if (st?.phase === "spawned") count += 1;
    }
    return count;
  }

  function createMissionPoint(mission, options = {}) {
    if (!mission) return null;
    if (activePoints.has(mission.id)) return null;
    if (getRedPointsCount() >= MAX_ACTIVE_POINTS) return null;
    const point = document.createElement("div");
    point.className = "point";
    point.setAttribute("role", "button");
    point.setAttribute("tabindex", "0");
    point.setAttribute("aria-label", `Mision: ${mission.title}`);

    const mapRect = mapEl.getBoundingClientRect();
    let xPct = options.xPct;
    let yPct = options.yPct;
    if (typeof xPct !== "number" || typeof yPct !== "number") {
      xPct = 50;
      yPct = 50;
      for (let i = 0; i < 40; i++) {
        xPct = rand(8, 92);
        yPct = rand(10, 86);
        const xPx = (xPct / 100) * mapRect.width;
        const yPx = (yPct / 100) * mapRect.height;
        if (!pointWouldOverlapNoSpawn(xPx, yPx)) break;
      }
    }

    point.style.left = `${xPct}%`;
    point.style.top = `${yPct}%`;

    const state = {
      mission,
      pointEl: point,
      xPct,
      yPct,
      remainingMs: MISSION_LIFETIME_MS,
      lastTickAt: performance.now(),
      phase: "spawned",
      isPaused: false,
      assignedCharIds: new Set(),
      chance: null,
      execRemainingMs: null
    };

    point.addEventListener("click", () => onPointClick(mission.id));
    point.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onPointClick(mission.id);
      }
    });

    mapEl.appendChild(point);
    activePoints.set(mission.id, state);
    return { xPct, yPct };
  }

  function onPointClick(missionId) {
    const st = activePoints.get(missionId);
    if (!st || completedMissionIds.has(missionId)) return;

    if (specialArmed && !specialUsed) {
      specialUsed = true;
      specialArmed = false;
      setSpecialArmedUI(false);
      openForcedWinRoulette(missionId);
      return;
    }

    if (st.phase === "spawned") return openMission(missionId);
    if (st.phase === "ready") return openRouletteForMission(missionId);
  }

  function removePoint(missionId) {
    const st = activePoints.get(missionId);
    if (!st) return;
    st.pointEl?.parentNode?.removeChild(st.pointEl);
    activePoints.delete(missionId);
  }

  function releaseCharsForMission(missionId) {
    const st = activePoints.get(missionId);
    if (!st) return;
    for (const cid of st.assignedCharIds || []) lockedCharIds.delete(cid);
    updateTeamBarAvailability();
  }

  function checkVersusVictory() {
    if (currentMode !== "versus") return;
    if (localWins >= VERSUS_WIN_TARGET) {
      finishVersusGame(true, "Has sido el primero en completar 8 misiones.");
    }
  }

  function failMission(missionId) {
    if (completedMissionIds.has(missionId)) return;

    if (currentMode === "versus") completedMissionIds.add(missionId);
    setScore(SCORE_LOSE);
    releaseCharsForMission(missionId);
    removePoint(missionId);
    updateHud();

    notifyVersusMissionResult(missionId, false);
  }

  function winMission(missionId) {
    if (completedMissionIds.has(missionId)) return;

    completedMissionIds.add(missionId);
    setScore(SCORE_WIN);
    releaseCharsForMission(missionId);
    removePoint(missionId);

    if (currentMode === "versus") {
      localWins += 1;
    } else if (score >= ARCADE_WIN_TARGET) {
      finishArcadeVictory();
      return;
    }

    updateHud();

    notifyVersusMissionResult(missionId, true);
    checkVersusVictory();
  }

  function scheduleNextSpawn() {
    clearTimeout(spawnTimer);
    if (!gameRunning) return;

    if (getRedPointsCount() >= MAX_ACTIVE_POINTS) {
      spawnTimer = setTimeout(scheduleNextSpawn, 800);
      return;
    }

    if (pendingMissions.length === 0) {
      pendingMissions = MISSIONS.filter((m) => !completedMissionIds.has(m.id) && !activePoints.has(m.id));
      if (pendingMissions.length === 0) {
        spawnTimer = setTimeout(scheduleNextSpawn, 1000);
        return;
      }
    }

    spawnTimer = setTimeout(() => {
      if (!gameRunning) return;
      if (getRedPointsCount() >= MAX_ACTIVE_POINTS) {
        scheduleNextSpawn();
        return;
      }

      const idx = randInt(0, pendingMissions.length - 1);
      const mission = pendingMissions.splice(idx, 1)[0];
      if (mission && !completedMissionIds.has(mission.id) && !activePoints.has(mission.id)) {
        createMissionPoint(mission);
      }
      scheduleNextSpawn();
    }, randInt(SPAWN_MIN_DELAY_MS, SPAWN_MAX_DELAY_MS));
  }

  function startLifeTicker() {
    clearInterval(lifeTicker);

    lifeTicker = setInterval(() => {
      const now = performance.now();

      for (const [mid, st] of activePoints.entries()) {
        if (st.isPaused) {
          st.lastTickAt = now;
          continue;
        }

        const dt = now - st.lastTickAt;
        st.lastTickAt = now;

        if (st.phase === "spawned") {
          st.remainingMs -= dt;
          if (st.remainingMs <= 0) failMission(mid);
          continue;
        }

        if (st.phase === "executing") {
          st.execRemainingMs -= dt;
          if (st.execRemainingMs <= 0) {
            st.phase = "ready";
            st.execRemainingMs = 0;
            st.pointEl.classList.remove("assigned");
            st.pointEl.classList.add("ready");
          }
        }
      }
    }, 200);
  }

  function queueMissionResolution(missionId) {
    const st = activePoints.get(missionId);
    if (!st || st.phase !== "ready") return;

    st.phase = "resolving";

    setTimeout(() => {
      const live = activePoints.get(missionId);
      if (!live || live.phase !== "resolving") return;
      const chance = live.chance ?? 0.1;
      const win = Math.random() < chance;
      win ? winMission(missionId) : failMission(missionId);
    }, 160);
  }

  function openMission(missionId) {
    const st = activePoints.get(missionId);
    if (!st) return;

    setGlobalPause(true);
    currentMissionId = missionId;
    selectedCharIds = new Set();

    missionTitleEl.textContent = st.mission.title;
    missionImgEl.src = st.mission.img || "images/mision.png";
    missionImgEl.alt = st.mission.title || "Mision";
    missionTextEl.textContent = st.mission.text;

    pickHint.textContent = "Selecciona al menos 1 personaje (maximo 2).";
    pickHint.style.opacity = "1";

    renderCharacters();
    showModal(missionModal);
  }

  function closeMissionModal() {
    hideModal(missionModal);
    currentMissionId = null;
    selectedCharIds = new Set();
    if (!isAnyModalOpen()) setGlobalPause(false);
  }

  function renderCharacters() {
    charactersGrid.innerHTML = "";

    availableCharacters.forEach((ch) => {
      const locked = lockedCharIds.has(ch.id);
      const card = document.createElement("div");
      card.className = "char" + (locked ? " locked" : "");
      card.innerHTML = `
        <div><div class="name">${ch.name}</div></div>
        <div class="pill">${locked ? "Ocupado" : "Elegir"}</div>
      `;

      card.addEventListener("click", () => {
        if (locked) {
          pickHint.textContent = "Ese personaje esta ocupado en otra mision.";
          pickHint.style.opacity = "1";
          return;
        }
        toggleCharacter(ch.id, card);
      });

      charactersGrid.appendChild(card);
    });
  }

  function toggleCharacter(charId, cardEl) {
    if (selectedCharIds.has(charId)) {
      selectedCharIds.delete(charId);
      cardEl.classList.remove("selected");
      cardEl.querySelector(".pill").textContent = "Elegir";
      return;
    }

    if (selectedCharIds.size >= 2) {
      pickHint.textContent = "Maximo 2 personajes por mision.";
      pickHint.style.opacity = "1";
      return;
    }

    selectedCharIds.add(charId);
    cardEl.classList.add("selected");
    cardEl.querySelector(".pill").textContent = "Elegido";
  }

  function confirmMission() {
    const st = currentMissionId ? activePoints.get(currentMissionId) : null;
    if (!st) return;

    if (selectedCharIds.size < 1) {
      pickHint.textContent = "Debes seleccionar al menos 1 personaje.";
      pickHint.style.opacity = "1";
      return;
    }

    st.assignedCharIds = new Set(selectedCharIds);
    st.chance = computeChance(st.mission, st.assignedCharIds);

    for (const cid of st.assignedCharIds) lockedCharIds.add(cid);
    updateTeamBarAvailability();

    st.phase = "executing";
    st.execRemainingMs = EXECUTION_TIME_MS;
    st.lastTickAt = performance.now();
    st.pointEl.classList.add("assigned");
    st.pointEl.classList.remove("ready");

    hideModal(missionModal);
    currentMissionId = null;
    selectedCharIds = new Set();
    if (!isAnyModalOpen()) setGlobalPause(false);
  }

  function spinRoulette(chance, onDone, forcedWin = null) {
    rouletteOutcome.textContent = "";
    rouletteOkBtn.disabled = true;

    const greenPct = clamp(chance, 0.01, 0.99) * 100;
    const greenDeg = (greenPct / 100) * 360;
    if (rouletteSub) rouletteSub.textContent = "Probabilidad de éxito: " + Math.round(greenPct) + "%";
    rouletteWheel.style.background = `conic-gradient(from 0deg, var(--ok) 0deg ${greenDeg}deg, var(--danger) ${greenDeg}deg 360deg)`;
    rouletteWheel.style.boxShadow = "0 0 0 4px rgba(255,255,255,.18), 0 0 24px rgba(46,229,157," + (0.2 + (greenPct / 200)) + ")";
    rouletteWheel.style.transform = "rotate(0deg)";

    const turns = randInt(5, 8);
    let targetAngle = rand(0, 360);
    if (forcedWin === true) targetAngle = rand(0, Math.max(greenDeg - 0.001, 0.001));
    if (forcedWin === false) targetAngle = rand(Math.min(greenDeg + 0.001, 359.999), 359.999);
    const stopRotation = (360 - targetAngle) % 360;
    const finalDeg = turns * 360 + stopRotation;

    rouletteWheel.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(" + finalDeg + "deg)" }],
      { duration: 1800, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }
    );

    setTimeout(() => {
      const win = forcedWin === null ? targetAngle < greenDeg : forcedWin;
      rouletteOutcome.textContent = win ? "Exito" : "Fallo";
      rouletteOutcome.style.color = win ? "var(--ok)" : "var(--danger)";
      rouletteOkBtn.disabled = false;
      onDone(win);
    }, 1900);
  }

  function openRouletteForMission(missionId) {
    const st = activePoints.get(missionId);
    if (!st || st.phase !== "ready") return;

    setGlobalPause(true);
    showModal(rouletteModal);

    spinRoulette(st.chance ?? 0.1, (win) => {
      rouletteOkBtn.onclick = () => {
        hideModal(rouletteModal);
        win ? winMission(missionId) : failMission(missionId);
        rouletteOkBtn.disabled = true;
        if (!isAnyModalOpen()) setGlobalPause(false);
      };
    });
  }

  function openForcedWinRoulette(missionId) {
    const st = activePoints.get(missionId);
    if (!st) return;

    setGlobalPause(true);
    showModal(rouletteModal);

    spinRoulette(1, () => {
      rouletteOkBtn.onclick = () => {
        hideModal(rouletteModal);
        winMission(missionId);
        rouletteOkBtn.disabled = true;
        if (!isAnyModalOpen()) setGlobalPause(false);
      };
    }, true);
  }

  function openCardInfo(cardData) {
    setGlobalPause(true);
    const cardName = String(cardData?.name || "").trim().toLowerCase();
    const SPECIAL_CARD_INFO = {
      camus: {
        infoText: "Camus era mago de la corte y uno de los hombres de maxima confianza de su majestad, pero, cuando Orion se hizo con el trono, fue declarado traidor a la corona por ser fiel al anterior rey.\n\nUno de los mejores magos de todo el reino, condenado al exilio, ahora se gana la vida como cazafortunas.",
        skillsText: "Sin habilidades actualmente"
      },
      evelyn: {
        infoText: "Evelyn perdio a sus padres a muy temprana edad y se vio obligada a vagar por las calles con la unica compania de su hermano mayor, del que acabo distanciandose con el tiempo.\nActualmente lidera un grupo de mercenarios, fundado por ella misma, conocido con el nombre de Atalaya, que hacen cualquier tipo de trabajo sucio a cambio de dinero, o al menos eso dicen.",
        skillsText: "Pulsa sobre una mision y la completa automaticamente (Durante el combate, pulsa sobre Evelyn para activar su habilidad)."
      },
      eliot: {
        infoText: "Desde joven, Eliot destaco en la magia y, a pesar de contar con pocos ingresos, logro formarse como un gran curandero, llegando a formar parte del prestigioso grupo Asclepio, que reune a los mejores curanderos y magos blancos, como se denominan a los que, como el, se especializan en magia de curacion."
      },
      landom: {
        infoText: "Ya desde muy pequeno se movia por ambientes oscuros, destacando y haciendose famoso por su increible habilidad con todo tipo de armas blancas. Su situacion no mejoro cuando perdio a sus padres ya que, aunque no tenia mucha relacion con ellos, le dejaron una hermana pequena a la que cuidar. Intentando que no siguiera sus pasos, se distancio de ella pero no sirvio de mucho... Experto en liderar con exito todo tipo de peligrosas misiones, a cambio de una buena suma, no teme a nada ni nadie.",
        skillsText: "Pulsa sobre una mision y la completa automaticamente (Durante el combate, pulsa sobre Landom para activar su habilidad)."
      },
      jane: {
        infoText: "Una cazadora que conoce los bosques del reino como la palma de su mano, capaz de entremezclarse con el bosque y fundirse con el viento, no la veras llegar hasta que sea demasiado tarde. Miembro honorifico del grupo de mercenarios Atalaya, con los que colabora asiduamente."
      }
    };
    const specialInfo = SPECIAL_CARD_INFO[cardName];
    currentCardInfoData = {
      infoText: specialInfo?.infoText || cardData?.infoText || "En construcción",
      skillsText: specialInfo?.skillsText || cardData?.skillsText || "En construcción"
    };
    cardInfoTitle.textContent = cardData.name;
    cardInfoImg.src = cardData.img;
    cardInfoImg.alt = cardData.name;
    cardInfoInfoBtn?.classList.add("active");
    cardInfoSkillsBtn?.classList.remove("active");
    cardInfoText.textContent = currentCardInfoData.infoText;
    showModal(cardInfoModal);
  }

  function closeCardInfo() {
    currentCardInfoData = null;
    hideModal(cardInfoModal);
    if (!isAnyModalOpen()) setGlobalPause(false);
  }

  function openSpecialModal() {
    if (specialUsed) return;
    setGlobalPause(true);
    showModal(specialModal);
  }

  function cancelSpecial() {
    specialArmed = false;
    setSpecialArmedUI(false);
    hideModal(specialModal);
    if (!isAnyModalOpen()) setGlobalPause(false);
  }

  function acceptSpecial() {
    if (specialUsed) return;
    specialArmed = true;
    setSpecialArmedUI(true);
    hideModal(specialModal);
    if (!isAnyModalOpen()) setGlobalPause(false);
  }

  function finishArcadeByTime() {
    finalTitleEl.textContent = "Fin de la partida";
    const finalText = finalModal.querySelector(".modal-text");
    if (finalText) finalText.textContent = "¡Tiempo!";
    finalScoreEl.textContent = String(score);
    setGlobalPause(true);
    showModal(finalModal);
  }

  function finishArcadeVictory() {
    stopGameLoops();

    hideModal(missionModal);
    hideModal(rouletteModal);
    hideModal(cardInfoModal);
    hideModal(specialModal);

    finalTitleEl.textContent = "Victoria";
    const finalText = finalModal.querySelector(".modal-text");
    if (finalText) finalText.textContent = "Has completado 8 misiones con éxito.";
    finalScoreEl.textContent = String(score);
    setGlobalPause(true);
    showModal(finalModal);
  }

  function finishVersusGame(isWinner, reason) {
    stopGameLoops();

    hideModal(missionModal);
    hideModal(rouletteModal);
    hideModal(cardInfoModal);
    hideModal(specialModal);

    finalTitleEl.textContent = isWinner ? "Victoria" : "Derrota";
    finalScoreEl.textContent = `${localWins} - ${rivalWins}`;

    const finalText = finalModal.querySelector(".modal-text");
    if (finalText) finalText.textContent = reason;

    if (versus.opponentId) {
      versusSend({ type: "vs_match_end", from: versus.clientId, to: versus.opponentId, ts: Date.now() });
    }

    setGlobalPause(true);
    showModal(finalModal);
  }

  function resetGame() {
    hideModal(missionModal);
    hideModal(rouletteModal);
    hideModal(finalModal);
    hideModal(cardInfoModal);
    hideModal(specialModal);
    hideModal(tutorialModal);
    hideModal(matchmakingModal);
    hideModal(rivalTeamModal);

    stopGameLoops();

    for (const st of activePoints.values()) {
      st.pointEl?.parentNode?.removeChild(st.pointEl);
    }

    score = 0;
    localWins = 0;
    rivalWins = 0;
    pendingMissions = [...MISSIONS];
    activePoints = new Map();
    completedMissionIds = new Set();
    remoteClaimedMissionIds = new Set();
    remoteResolvedMissionIds = new Set();
    queuedVersusEvents = [];
    lockedCharIds = new Set();

    currentMissionId = null;
    selectedCharIds = new Set();

    specialUsed = false;
    specialArmed = false;
    setSpecialArmedUI(false);
    tutorialPending = false;
    tutorialStep = 0;

    if (teamBar) teamBar.innerHTML = "";
    const finalText = finalModal.querySelector(".modal-text");
    if (finalText) finalText.textContent = "¡Tiempo!";

    clearMatchmakingState();

    versus.opponentId = null;
    versus.opponentProfile = null;
    versus.isSpawnHost = false;
    versus.matchId = null;
    if (rivalImg) rivalImg.classList.add("hidden");

    updateHud();
    setGlobalPause(false);
  }

  function startConfiguredGameFlow() {
    if (selectedTeamCardIds.size !== 6) return;
    if (!commitTeam()) return;

    if (selectedMode === "versus") {
      startVersusMatchmaking();
      return;
    }

    currentMode = "arcade";
    startGame();
  }

  introPrevBtn?.addEventListener("click", prevIntroMenuOption);
  introNextBtn?.addEventListener("click", nextIntroMenuOption);
  introMenuBtn?.addEventListener("click", activateIntroMenuOption);
  introProfileImg?.addEventListener("click", goToUserScreen);
  introProfile?.addEventListener("click", goToUserScreen);

  recruitPackBtn?.addEventListener("click", recruitRandomCharacter);
  recruitBackBtn?.addEventListener("click", setIntroVisible);
  userAvatarToggleBtn?.addEventListener("click", toggleUserAvatarPicker);
  userNameInput?.addEventListener("input", () => {
    const next = normalizeUserProfileName(userNameInput.value);
    persistUserProfileName(next);
    setUserProfileName(next);
  });
  userNameInput?.addEventListener("blur", () => {
    const next = normalizeUserProfileName(userNameInput.value);
    persistUserProfileName(next);
    setUserProfileName(next);
  });
  storyNextBtn?.addEventListener("click", nextStoryStep);
  storySkipBtn?.addEventListener("click", startStoryCombat);
  userBackBtn?.addEventListener("click", setIntroVisible);

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.id === "introMenuImg" || target.id === "introMenuFallback") activateIntroMenuOption();
    if (target.id === "recruitPackBtn") recruitRandomCharacter();
    if (target.id === "recruitOddsBtn") toggleRecruitOdds();
    if (target.id === "recruitBackBtn") setIntroVisible();
    if (target.id === "userBackBtn") setIntroVisible();
  });

  prevAvatarBtn.addEventListener("click", prevAvatar);
  nextAvatarBtn.addEventListener("click", nextAvatar);

  document.addEventListener("keydown", (e) => {
    if (!introScreen.classList.contains("hidden")) {
      if (e.key === "ArrowLeft") prevIntroMenuOption();
      if (e.key === "ArrowRight") nextIntroMenuOption();
      if (e.key === "Enter") activateIntroMenuOption();
      return;
    }

    if (!startScreen.classList.contains("hidden")) {
      if (e.key === "ArrowLeft") prevAvatar();
      if (e.key === "ArrowRight") nextAvatar();
    }
  });

  startBackBtn?.addEventListener("click", setIntroVisible);

  startBtn.addEventListener("click", () => {
    selectedTeamCardIds = new Set();
    teamConfirmBtn.disabled = true;
    teamCountEl.textContent = "0";
    teamHint.textContent = "Elige 6 personajes para continuar.";
    goToTeamScreen();
  });

  teamBackBtn?.addEventListener("click", backToAvatarSelection);
  teamConfirmBtn.addEventListener("click", startConfiguredGameFlow);

  playerImg.addEventListener("click", openSpecialModal);

  closeModalBtn.addEventListener("click", closeMissionModal);
  missionModal.addEventListener("click", (e) => { if (e.target === missionModal) closeMissionModal(); });
  confirmBtn.addEventListener("click", confirmMission);

  closeCardInfoBtn.addEventListener("click", closeCardInfo);
  cardInfoInfoBtn?.addEventListener("click", () => {
    if (!currentCardInfoData) return;
    cardInfoInfoBtn.classList.add("active");
    cardInfoSkillsBtn?.classList.remove("active");
    cardInfoText.textContent = currentCardInfoData.infoText;
  });
  cardInfoSkillsBtn?.addEventListener("click", () => {
    if (!currentCardInfoData) return;
    cardInfoSkillsBtn.classList.add("active");
    cardInfoInfoBtn?.classList.remove("active");
    cardInfoText.textContent = currentCardInfoData.skillsText;
  });
  cardInfoModal.addEventListener("click", (e) => { if (e.target === cardInfoModal) closeCardInfo(); });

  closeSpecialBtn.addEventListener("click", cancelSpecial);
  specialCancelBtn.addEventListener("click", cancelSpecial);
  specialAcceptBtn.addEventListener("click", acceptSpecial);
  specialModal.addEventListener("click", (e) => { if (e.target === specialModal) cancelSpecial(); });
  tutorialNextBtn?.addEventListener("click", nextTutorialStep);

  rivalTeamBtn?.addEventListener("click", () => {
    renderRivalTeam();
    setGlobalPause(true);
    showModal(rivalTeamModal);
  });
  closeRivalTeamBtn?.addEventListener("click", () => {
    hideModal(rivalTeamModal);
    if (!isAnyModalOpen()) setGlobalPause(false);
  });
  rivalTeamModal?.addEventListener("click", (e) => {
    if (e.target === rivalTeamModal) {
      hideModal(rivalTeamModal);
      if (!isAnyModalOpen()) setGlobalPause(false);
    }
  });

  cancelMatchBtn?.addEventListener("click", () => {
    clearMatchmakingState();
    hideModal(matchmakingModal);
  });

  playAgainBtn.addEventListener("click", () => {
    const wasVersus = currentMode === "versus";
    if (wasVersus && versus.opponentId) {
      versusSend({ type: "vs_leave", from: versus.clientId, to: versus.opponentId, ts: Date.now() });
    }

    resetGame();
    currentMode = "arcade";
    selectedMode = "arcade";
    avatarIndex = 0;
    renderAvatarCarousel(0);
    setIntroVisible();
  });

  window.addEventListener("resize", () => {
    setAppHeightVar();
    if (!gameRoot.classList.contains("hidden")) computeNoSpawnRect();
  });

  window.addEventListener("beforeunload", () => {
    if (versus.opponentId) {
      versusSend({ type: "vs_leave", from: versus.clientId, to: versus.opponentId, ts: Date.now() });
    }
  });

  renderAvatarCarousel(0);
  renderIntroMenu(0);
  setCoins(loadCoins());
  renderRecruitUnlockedState();
  setUserProfileAvatar(loadUserProfileAvatar() || DEFAULT_PROFILE_AVATAR_SRC);
  const initialProfileName = normalizeUserProfileName(loadUserProfileName() || DEFAULT_PROFILE_NAME);
  setUserProfileName(initialProfileName);
  persistUserProfileName(initialProfileName);
  updateHud();
  ensureVersusTransport();
});
