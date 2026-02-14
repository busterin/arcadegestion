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
  const STORY_COMBAT_WIN_TARGET = 3;
  const STORY_MAP_BATTLE_WIN_TARGET = 3;
  const STORY_MAP_POINT_ICONS = [
    "historia/iconomapabatalla.png",
    "historia/iconomapacofre.png",
    "historia/iconomapaconversacion.png",
    "historia/iconomapainterrogante.png"
  ];
  const STORY_JACK_MISSION_ID = "m5";
  const STORY_JACK_DELAY_MS = 2 * 60 * 1000;

  const VERSUS_WIN_TARGET = 8;
  const VERSUS_WS_PATH = "/versus";
  const DEFAULT_VERSUS_WS_URL = "wss://arcadegestion.onrender.com/versus";
  const RECRUIT_STORAGE_KEY = "arcadegestion_recruits_v1";
  const RECRUIT_LAST_STORAGE_KEY = "arcadegestion_last_recruit_v1";
  const STORY_CONTINUE_KEY = "arcadegestion_story_continue_v1";
  const STORY_SAVE_SLOTS_KEY = "arcadegestion_story_save_slots_v1";
  const USER_PROFILE_AVATAR_KEY = "arcadegestion_user_profile_avatar_v1";
  const USER_PROFILE_NAME_KEY = "arcadegestion_user_profile_name_v1";
  const COINS_STORAGE_KEY = "arcadegestion_coins_v1";
  const STORE_PURCHASES_KEY = "arcadegestion_store_purchases_v1";
  const WINCHESTER_OUTFIT_KEY = "arcadegestion_winchester_outfit_v1";
  const DEFAULT_PROFILE_AVATAR_SRC = "images/Evelyn2.PNG";
  const DEFAULT_PROFILE_NAME = "Usuario";
  const DEFAULT_COINS = 50;
  const RECRUIT_CHARACTER_COST = 10;
  const WINCHESTER_DEFAULT_IMG = "images/Winchester.PNG";
  const WINCHESTER_ALT_IMG = "images/Winchester3.png";
  const WINCHESTER_STORE_ITEM_ID = "winchester_outfit_3";
  const WINCHESTER_STORE_ITEM_PRICE = 10;
  const STORY_SAVE_SLOT_COUNT = 3;

  const MISSIONS = [
    { id: "m1", title: "Oso peligroso", internalTags: ["cuerpoacuerpo", "adistancia"], img: "misiones/misionoso.png", text: "Un oso ha atacado en repetidas ocasiones un pueblo de montaña. Ya no solo se trata de destrozos materiales, sino que algún aldeano ha resultado herido. Urge detenerlo." },
    { id: "m2", title: "Robos en Marjoire", internalTags: ["exploracion", "lider"], img: "misiones/misionmarjoire.png", text: "En la flamante ciudad de Marjoire, concretamente en el barrio Ashira, donde la alta sociedad acostumbra a reunirse para celebrar sus ostentosas fiestas, se está produciendo una serie de robos. Es necesario investigar la escena y descubrir a los responsables lo antes posible." },
    { id: "m3", title: "Arena de gladiadores", internalTags: ["cuerpoacuerpo"], img: "misiones/misiongladiadores.png", text: "¡Se buscan a los mejores guerreros! Una gran oportunidad de demostrar tus dotes de combate cuerpo a cuerpo. Nada de arcos ni magia, aquí solo se admiten auténticos gladiadores que no teman a nada." },
    { id: "m4", title: "Entrega urgente", internalTags: ["volar", "exploracion"], img: "misiones/misionmedicinas.png", text: "Un pequeño pueblo montañoso se ha quedado sin medicinas y la salud de muchos de sus habitantes comienza a ser preocupante. Es necesario entregar el paquete lo más rápido posible." },
    { id: "m6", title: "¡Como una cabra!", internalTags: ["exploracion", "lider"], img: "misiones/misioncabras.png", text: "El afable Tomi ha perdido sus cabras y está como loco buscándolas por todo el pueblo. Ayúdale a recuperarlas y así evitar que se pierdan o incluso causen destrozos en el pueblo." },
    { id: "m7", title: "Caos local", internalTags: ["lider"], img: "misiones/misionlider.png", text: "En la ciudad de Arniville reina la locura. La delincuencia cada vez es mayor y los pocos agentes del orden que quedaban o están muertos o han huido. Necesitamos que alguien con madera de líder reúna a los mercenarios dispersos por la zona y ponga orden en la urbe.", maxChars: 1 },
    { id: "m8", title: "El nido oculto", internalTags: ["volar", "adistancia"], img: "misiones/misionmonstruovolador.png", text: "Un nido de uzgals, unos desagradables monstruos voladores, está haciéndose cada vez más grande en las inmediaciones del condado de Uryay y comienza a causar gran preocupación entre los pueblos cercanos. Además, los guerreros uryayenses no son capaces de acabar con ellos; son necesarias personas capaces de lidiar con amenazas voladoras." },
    { id: "m5", title: "La banda de Jack el Tuerto", internalTags: ["cuerpoacuerpo", "adistancia", "magia"], img: "misiones/misionjack.png", text: "El famoso bandido Jack el Tuerto tiene aterrorizado a todo el condado de Veiran y nadie se atreve a hacerle frente. ¡Alguien debe detenerlo! Pero cuidado, no será un combate fácil.", maxChars: 3, matchBonus: 0.4 }
  ];
  const STORY_BASE_MISSIONS = MISSIONS.filter((m) => m.id !== STORY_JACK_MISSION_ID);
  const STORY_JACK_MISSION = MISSIONS.find((m) => m.id === STORY_JACK_MISSION_ID) || null;

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
    { id: "card_castri", name: "Winchester", img: "images/Winchester.PNG", text: "Carta de apoyo: coordinación y ejecución con criterio." },
    { id: "card_maider", name: "Eliot", img: "images/Eliot.PNG", text: "Carta de apoyo: mirada de sala y ajuste fino." },
    { id: "card_celia", name: "Camus", img: "images/Camus.PNG", text: "Carta de apoyo: resuelve operativa con rapidez." },
    { id: "card_lorena", name: "Jane", img: "images/Jane.PNG?v=20260209", text: "Carta de apoyo: mejora presentación, orden y estética." },
    { id: "card_alba", name: "Lisa", img: "images/Lisa.PNG", text: "Carta de apoyo: ejecución rápida y organizada." },
    { id: "card_mariam", name: "Willard", img: "images/Willard.PNG", text: "Carta de apoyo: coordina y aterriza lo pendiente." }
  ];

  const RECRUITABLE_CARDS = [
    { id: "card_friday", charId: "c4", name: "Friday", img: "images/Friday.PNG", text: "Carta de apoyo: programación precisa y resolutiva." },
    { id: "card_risko", charId: "c5", name: "Risko", img: "images/Risko.png", text: "Carta de apoyo: depura problemas técnicos con calma." },
    { id: "card_pendergast", charId: "c6", name: "Pendergast", img: "images/Pendergast.PNG", text: "Carta de apoyo: dinamiza equipos y formación." }
  ];

  const AVATARS = [
    { key: "evelyn", name: "Evelyn", src: "images/Evelyn.png", accountSrc: "images/Evelyn2.PNG", alt: "Evelyn" },
    { key: "landom", name: "Landom", src: "images/Landom.png?v=20260210-4", accountSrc: "images/Landom2.png", alt: "Landom", unlockRecruitCharId: "c10" },
  ].sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));

  const storyProgress = window.createStoryProgressModule({
    characters: CHARACTERS,
    recruitableCharacters: RECRUITABLE_CHARACTERS,
    cards: CARDS,
    recruitableCards: RECRUITABLE_CARDS,
    avatars: AVATARS
  });
  const storyMapFlow = typeof window.createStoryMapFlowModule === "function"
    ? window.createStoryMapFlowModule()
    : null;

  const introScreen = document.getElementById("introScreen");
  const introPrevBtn = document.getElementById("introPrevBtn");
  const introNextBtn = document.getElementById("introNextBtn");
  const introMenuBtn = document.getElementById("introMenuBtn");
  const introMenuImg = document.getElementById("introMenuImg");
  const introMenuFallback = document.getElementById("introMenuFallback");
  const introProfile = document.getElementById("introProfile");
  const introProfileImg = document.getElementById("introProfileImg");
  const introProfileName = document.getElementById("introProfileName");
  const storyScreen = document.getElementById("storyScreen");
  const storyStage = document.getElementById("storyStage");
  const storyDialog = document.getElementById("storyDialog");
  const storyMapLayer = document.getElementById("storyMapLayer");
  const storyMapConnections = document.getElementById("storyMapConnections");
  const storyMapPoints = document.getElementById("storyMapPoints");
  const storyMapRouteFill = document.getElementById("storyMapRouteFill");
  const storyLeftChar = document.getElementById("storyLeftChar");
  const storyRightChar = document.getElementById("storyRightChar");
  const storyLeftSupportChar = document.getElementById("storyLeftSupportChar");
  const storyRightSupportChar = document.getElementById("storyRightSupportChar");
  const storySpeaker = document.getElementById("storySpeaker");
  const storyText = document.getElementById("storyText");
  const storyNextBtn = document.getElementById("storyNextBtn");
  const storyMenuBtn = document.getElementById("storyMenuBtn");
  const storySkipBtn = document.getElementById("storySkipBtn");

  const recruitScreen = document.getElementById("recruitScreen");
  const recruitBackBtn = document.getElementById("recruitBackBtn");
  const recruitStoreGrid = document.getElementById("recruitStoreGrid");
  const recruitStoreEmpty = document.getElementById("recruitStoreEmpty");
  const recruitCoinsValue = document.getElementById("recruitCoinsValue");
  const recruitPriceHint = document.getElementById("recruitPriceHint");
  const storeScreen = document.getElementById("storeScreen");
  const storeBackBtn = document.getElementById("storeBackBtn");
  const storeCoinsValue = document.getElementById("storeCoinsValue");
  const storeBuyWinchesterBtn = document.getElementById("storeBuyWinchesterBtn");
  const storeWinchesterState = document.getElementById("storeWinchesterState");

  const userScreen = document.getElementById("userScreen");
  const userProfileImg = document.getElementById("userProfileImg");
  const userProfileTitle = document.getElementById("userProfileTitle");
  const userNameEditBtn = document.getElementById("userNameEditBtn");
  const userCoinsValue = document.getElementById("userCoinsValue");
  const userAvatarToggleBtn = document.getElementById("userAvatarToggleBtn");
  const userAvatarPicker = document.getElementById("userAvatarPicker");
  const userNameInput = document.getElementById("userNameInput");
  const userMainGrid = document.getElementById("userMainGrid");
  const userSecondaryGrid = document.getElementById("userSecondaryGrid");
  const userBackBtn = document.getElementById("userBackBtn");

  const startScreen = document.getElementById("startScreen");
  const startBtn = document.getElementById("startBtn");
  const startTutorialBtn = document.getElementById("startTutorialBtn");
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
  const hudStoryHintEl = document.getElementById("hudStoryHint");
  const activeEffectBtn = document.getElementById("activeEffectBtn");
  const trainEffectCounter = document.getElementById("trainEffectCounter");
  const storySkipBattleBtn = document.getElementById("storySkipBattleBtn");
  const teamBar = document.getElementById("teamBar");
  const rivalTeamBtn = document.getElementById("rivalTeamBtn");
  const missionBarPicker = document.getElementById("missionBarPicker");
  const missionBarTitle = document.getElementById("missionBarTitle");
  const missionBarText = document.getElementById("missionBarText");
  const missionBarHint = document.getElementById("missionBarHint");
  const missionBarCancelBtn = document.getElementById("missionBarCancelBtn");
  const missionBarConfirmBtn = document.getElementById("missionBarConfirmBtn");
  const missionMapPreview = document.getElementById("missionMapPreview");
  const missionMapPreviewImg = document.getElementById("missionMapPreviewImg");

  const missionModal = document.getElementById("missionModal");
  const missionChooseTitle = document.getElementById("missionChooseTitle");
  const missionTitleEl = document.getElementById("missionTitle");
  const missionImgEl = document.getElementById("missionImg");
  const missionTextEl = document.getElementById("missionText");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const charactersGrid = document.getElementById("charactersGrid");
  const pickHint = document.getElementById("pickHint");
  const confirmBtn = document.getElementById("confirmBtn");

  const rouletteModal = document.getElementById("rouletteModal");
  const rouletteTitle = document.getElementById("rouletteTitle");
  const rouletteWheel = document.getElementById("rouletteWheel");
  const rouletteOutcome = document.getElementById("rouletteOutcome");
  const rouletteSub = document.getElementById("rouletteSub");
  const rouletteOkBtn = document.getElementById("rouletteOkBtn");

  const finalModal = document.getElementById("finalModal");
  const finalTitleEl = document.getElementById("finalTitle");
  const finalScoreEl = document.getElementById("finalScore");
  const finalLabelEl = finalModal?.querySelector(".final-label") || null;
  const playAgainBtn = document.getElementById("playAgainBtn");

  const cardInfoModal = document.getElementById("cardInfoModal");
  const cardInfoTitle = document.getElementById("cardInfoTitle");
  const cardInfoLevel = document.getElementById("cardInfoLevel");
  const cardInfoText = document.getElementById("cardInfoText");
  const cardInfoImg = document.getElementById("cardInfoImg");
  const cardInfoInfoBtn = document.getElementById("cardInfoInfoBtn");
  const cardInfoSkillsBtn = document.getElementById("cardInfoSkillsBtn");
  const cardInfoOutfitsBtn = document.getElementById("cardInfoOutfitsBtn");
  const cardInfoOutfitsPanel = document.getElementById("cardInfoOutfitsPanel");
  const cardInfoOutfitDefaultBtn = document.getElementById("cardInfoOutfitDefaultBtn");
  const cardInfoOutfitAltBtn = document.getElementById("cardInfoOutfitAltBtn");
  const closeCardInfoBtn = document.getElementById("closeCardInfoBtn");

  const specialModal = document.getElementById("specialModal");
  const closeSpecialBtn = document.getElementById("closeSpecialBtn");
  const specialCancelBtn = document.getElementById("specialCancelBtn");
  const specialAcceptBtn = document.getElementById("specialAcceptBtn");
  const effectModal = document.getElementById("effectModal");
  const effectTitle = document.getElementById("effectTitle");
  const effectText = document.getElementById("effectText");
  const closeEffectBtn = document.getElementById("closeEffectBtn");
  const effectOkBtn = document.getElementById("effectOkBtn");
  const tutorialModal = document.getElementById("tutorialModal");
  const tutorialRightChar = document.getElementById("tutorialRightChar");
  const tutorialText = document.getElementById("tutorialText");
  const tutorialNextBtn = document.getElementById("tutorialNextBtn");
  const storyEntryModal = document.getElementById("storyEntryModal");
  const storyContinueBtn = document.getElementById("storyContinueBtn");
  const storyNewGameBtn = document.getElementById("storyNewGameBtn");
  const storyLoadGameBtn = document.getElementById("storyLoadGameBtn");
  const storyEntryBackBtn = document.getElementById("storyEntryBackBtn");
  const storyLoadPanel = document.getElementById("storyLoadPanel");
  const storyLoadList = document.getElementById("storyLoadList");
  const storyLoadEmpty = document.getElementById("storyLoadEmpty");
  const storySavePromptModal = document.getElementById("storySavePromptModal");
  const storySavePromptText = document.getElementById("storySavePromptText");
  const storySaveNowBtn = document.getElementById("storySaveNowBtn");
  const storySaveLaterBtn = document.getElementById("storySaveLaterBtn");
  const storyLevelUpModal = document.getElementById("storyLevelUpModal");
  const storyLevelUpImg = document.getElementById("storyLevelUpImg");
  const storyLevelUpName = document.getElementById("storyLevelUpName");
  const storyLevelUpLevel = document.getElementById("storyLevelUpLevel");
  const storyLevelUpNote = document.getElementById("storyLevelUpNote");
  const storyLevelUpOkBtn = document.getElementById("storyLevelUpOkBtn");
  const storyChapterSplashModal = document.getElementById("storyChapterSplashModal");

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
  let injuredCharIds = new Set();
  let eliminatedCharIds = new Set();

  let currentMissionId = null;
  let selectedCharIds = new Set();
  let missionPickFromBarActive = false;

  let gameEndAt = null;
  let gameClockTimer = null;
  let lifeTicker = null;
  let spawnTimer = null;
  let gameRunning = false;
  let gamePaused = false;
  let noSpawnRect = null;

  let selectedTeamCardIds = new Set();
  let availableCharacters = [];
  let availableCards = [];

  let avatarIndex = 0;
  let introMenuIndex = 0;
  let specialUsed = false;
  let specialArmed = false;
  let unlockedRecruitCharIds = new Set(loadUnlockedRecruitCharIds());
  let currentCardInfoData = null;
  let coins = loadCoins();
  let purchasedStoreItems = new Set(loadPurchasedStoreItems());
  let selectedWinchesterOutfit = loadWinchesterOutfit();
  let isEditingUserName = false;
  let tutorialPending = false;
  let tutorialStep = 0;
  let tutorialReturnToAvatar = false;

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
    { key: "tienda", label: "TIENDA", img: "images/tienda.png" },
    { key: "cuenta", label: "CUENTA", img: "images/cuenta.png" }
  ];
  const STORY_PRE_COMBAT_SCENES = [
    {
      speaker: "",
      text: "Vivimos tiempos convulsos... Nuestro futuro parece cubierto por una espesa niebla... Antes la vida era más sencilla pero ahora todo ha cambiado... Niebla...",
      background: "historia/1niebla.PNG",
      showChars: false
    },
    {
      speaker: "Evelyn",
      text: "Y ahí vamos otra vez... Ese sueño recurrente de nuevo...",
      active: "left",
      leftSrc: "images/Evelyn.png",
      rightSrc: "images/Landom.png?v=20260210-4",
      showChars: true
    },
    {
      speaker: "Landom",
      text: "¿Qué pasa, hermanita? ¿Otra vez perdida en tus mundos? ¡Espabila! Es hora de entrenar. ¿Aún recuerdas cómo se hace?",
      active: "right",
      leftSrc: "images/Evelyn.png",
      rightSrc: "images/Landom.png?v=20260210-4",
      showChars: true
    }
  ];
  const STORY_POST_COMBAT_SCENES = [
    {
      speaker: "Evelyn",
      text: "¿Dónde estoy? ¿Landom? ¿Landom? No me abandones otra vez, por favor... No, otra vez, no... Niebla... Todo lo cubre la niebla...",
      background: "historia/1nieblaevelyn.PNG",
      showChars: false
    },
    {
      speaker: "Evelyn",
      text: "Uf... Uf... Ufff... ¿Qué ha pasado? ¿Dónde...?",
      background: "historia/1fondopueblo.PNG",
      active: "left",
      leftSrc: "images/Evelyn.png",
      rightSrc: "historia/Camus2.png",
      rightMirror: false,
      showChars: true
    },
    {
      speaker: "Camus",
      text: "¿Has vuelto a tener ese sueño?",
      background: "historia/1fondopueblo.PNG",
      active: "right",
      leftSrc: "images/Evelyn.png",
      rightSrc: "historia/Camus2.png",
      rightMirror: false,
      showChars: true
    },
    {
      speaker: "Evelyn",
      text: "Sí... pero era solo eso, un sueño...",
      background: "historia/1fondopueblo.PNG",
      active: "left",
      leftSrc: "images/Evelyn.png",
      rightSrc: "historia/Camus2.png",
      rightMirror: false,
      showChars: true
    },
    {
      speaker: "Camus",
      text: "A veces los sueños buscan darnos pistas, pero no te preocupes. Yo no le daría muchas vueltas, por ahora...",
      background: "historia/1fondopueblo.PNG",
      active: "right",
      leftSrc: "images/Evelyn.png",
      rightSrc: "historia/Camus2.png",
      rightMirror: false,
      showChars: true
    },
    {
      speaker: "Evelyn",
      text: "Tú sí que sabes tranquilizar a un amigo, Camus...",
      background: "historia/1fondopueblo.PNG",
      active: "left",
      leftSrc: "images/Evelyn.png",
      rightSrc: "historia/Camus2.png",
      rightMirror: false,
      showChars: true
    },
    {
      speaker: "Camus",
      text: "*Se ríe* Vayamos con el resto, nos están esperando.",
      background: "historia/1fondopueblo.PNG",
      active: "right",
      leftSrc: "images/Evelyn.png",
      rightSrc: "historia/Camus2.png",
      rightMirror: false,
      showChars: true
    },
    {
      speaker: "",
      text: "Somos Atalaya, un grupo de mercenarios que completa cualquier tipo de misión por dinero. Aunque preferimos acabar con grupos de bandidos o rescatar a personas en apuros, no tenemos ningún problema en realizar misiones menos éticas. De algo hay que vivir...",
      background: "historia/1grupocharla.PNG",
      showChars: false
    },
    {
      speaker: "",
      text: "Atalaya estaba formada por cuatro miembros: Camus, el mago de la corte exiliado, que ahoga su dolor en el campo de batalla; Winchester, una de las pocas Magas Guerreras que quedan en el reino, una rama de combate casi extinta; Jane, la seria y letal cazadora con un corazón de oro, y yo, Evelyn, guerrera por imposición desde que tenía uso de razón, fundadora de este peculiar grupo.",
      background: "historia/1grupocharla.PNG",
      showChars: false
    },
    {
      speaker: "Evelyn",
      text: "¿Algún nuevo encargo para hoy?",
      background: "historia/1fondopueblo.PNG",
      active: "left",
      leftSrc: "images/Evelyn.png",
      leftSupportSrc: "historia/Winchester2.png",
      rightSrc: "historia/Camus2.png",
      rightMirror: false,
      rightSupportSrc: "historia/Jane2.png",
      showChars: true
    },
    {
      speaker: "Camus",
      text: "Parece que hay un grupo de bandidos atemorizando la zona. Se hacen llamar la banda de Jack, el tuerto.",
      background: "historia/1fondopueblo.PNG",
      active: "right",
      leftSrc: "images/Evelyn.png",
      leftSupportSrc: "historia/Winchester2.png",
      rightSrc: "historia/Camus2.png",
      rightMirror: false,
      rightSupportSrc: "historia/Jane2.png",
      showChars: true
    },
    {
      speaker: "Winchester",
      text: "Son unos don nadie que han tenido la suerte de dar con un pueblo que apenas puede defenderse. Vayamos resolviendo encargos menores, como siempre, hasta que demos con su escondite.",
      background: "historia/1fondopueblo.PNG",
      active: "left-support",
      leftSrc: "images/Evelyn.png",
      leftSupportSrc: "historia/Winchester2.png",
      rightSrc: "historia/Camus2.png",
      rightMirror: false,
      rightSupportSrc: "historia/Jane2.png",
      showChars: true
    },
    {
      speaker: "Jane",
      text: "Probarán mis flechas...",
      background: "historia/1fondopueblo.PNG",
      active: "right-support",
      leftSrc: "images/Evelyn.png",
      leftSupportSrc: "historia/Winchester2.png",
      rightSrc: "historia/Camus2.png",
      rightMirror: false,
      rightSupportSrc: "historia/Jane2.png",
      showChars: true
    }
  ];
  const STORY_EPILOGUE_SCENES = [
    {
      speaker: "",
      text: "La batalla contra los bandidos fue más intensa de lo que esperábamos pero nada con lo que Atalaya no pudiera lidiar. Sin embargo, sucedió algo fuera de lo normal...",
      background: "historia/1combatebandidos.PNG",
      showChars: false
    },
    {
      speaker: "Evelyn",
      text: "Tenemos que hablar de lo que ha pasado...",
      background: "historia/1fondopueblo.PNG",
      active: "left",
      leftSrc: "images/Evelyn.png",
      leftSupportSrc: "historia/Winchester2.png",
      rightSrc: "historia/Camus2.png",
      rightMirror: false,
      rightSupportSrc: "historia/Jane2.png",
      showChars: true
    }
  ];
  const STORY_MAP_POST_SCENES = [
    {
      speaker: "Camus",
      text: "No me gusta nada lo que hemos encontrado. Esto no ha terminado.",
      background: "historia/1fondopueblo.PNG",
      active: "right",
      leftSrc: "images/Evelyn.png",
      leftSupportSrc: "historia/Winchester2.png",
      rightSrc: "historia/Camus2.png",
      rightMirror: false,
      rightSupportSrc: "historia/Jane2.png",
      showChars: true
    }
  ];
  const STORY_MAP_INTRO_SCENES = [
    {
      speaker: "Winchester",
      text: "Este es el mapa de misión. Aquí vemos las rutas disponibles hasta llegar a nuestro objetivo.",
      background: "historia/mapa1.png",
      active: "left",
      leftSrc: "historia/Winchester2.png",
      showChars: true,
      showRight: false
    },
    {
      speaker: "Winchester",
      text: "Cuando eliges un lugar, el resto de la misma línea ya no podrán ser explorados. Decide con cautela.",
      background: "historia/mapa1.png",
      active: "left",
      leftSrc: "historia/Winchester2.png",
      showChars: true,
      showRight: false
    },
    {
      speaker: "Winchester",
      text: "El icono de las espadas representa una batalla. Tendremos que completar varios encargos de mercenarios.",
      background: "historia/mapa1.png",
      active: "left",
      leftSrc: "historia/Winchester2.png",
      showChars: true,
      showRight: false
    },
    {
      speaker: "Winchester",
      text: "El icono del bocadillo representa una conversación. Quizás conozcamos a nuevos personajes o misiones.",
      background: "historia/mapa1.png",
      active: "left",
      leftSrc: "historia/Winchester2.png",
      showChars: true,
      showRight: false
    },
    {
      speaker: "Winchester",
      text: "El icono del cofre promete un tesoro valioso y en el del interrogante nadie sabe lo que puede pasar.",
      background: "historia/mapa1.png",
      active: "left",
      leftSrc: "historia/Winchester2.png",
      showChars: true,
      showRight: false
    },
    {
      speaker: "Winchester",
      text: "¡Vamos! ¡Rumbo al castillo!",
      background: "historia/mapa1.png",
      active: "left",
      leftSrc: "historia/Winchester2.png",
      showChars: true,
      showRight: false
    }
  ];
  const TUTORIAL_STEPS = [
    "¡Prepárate para un combate real! Tu objetivo es liderar a tu equipo y completar misiones pulsando los iconos que irán apareciendo en el mapa.",
    "Al abrir una misión, tendrás que elegir personajes. Debes conocer bien a tu equipo porque si mandas a los más aptos para la misión, las probabilidades de éxito aumentarán considerablemente.",
    "Si pulsas sobre un personaje, podrás leer su ficha para averiguar quién es más apto para cada misión. Tras asignar personajes, el icono pasa a amarillo. Cuando la misión finalice, el icono parpadeará; púlsalo y se activará una ruleta.",
    "Si la ruleta se detiene en la zona verde, completarás la misión con éxito. Si se detiene en el color rojo, fallarás. El porcentaje de verde o rojo depende de los personajes que hayas enviado a la misión. Completa suficientes misiones para superar la fase.",
    "Todos los líderes tienen una habilidad especial, pulsa sobre ellos para activarla. ¡Buena suerte!"
  ];
  const BATTLE_EFFECTS = [
    {
      key: "bosque",
      place: "bosque",
      image: "misiones/fondobosque.png",
      description: "Los personajes expertos en sigilo y exploración tienen +20% de probabilidad de éxito, pero las misiones de sigilo o exploración son un 20% más complicadas."
    },
    {
      key: "barco",
      place: "barco",
      image: "misiones/fondobarco.png",
      description: "Solo puedes enviar a 1 personaje por misión."
    },
    {
      key: "ciudad",
      place: "ciudad",
      image: "misiones/fondociudad.png",
      description: "Las misiones completadas con éxito otorgan el doble de experiencia."
    },
    {
      key: "pueblo",
      place: "pueblo",
      image: "misiones/fondopueblo.png",
      description: "Ganas un 10% extra de probabilidad en todas las misiones."
    },
    {
      key: "castillo",
      place: "castillo",
      image: "misiones/fondocastillo.png",
      description: "Cada misión completada con éxito te otorga 5 monedas extra."
    },
    {
      key: "tren",
      place: "tren",
      image: "misiones/fondotren.png",
      description: "Cada minuto, el tren llega a una parada y elimina todas las misiones aún no iniciadas."
    }
  ];
  let storyStep = 0;
  let storySceneTextPages = [];
  let storySceneTextPageIndex = 0;
  let lastRenderedStorySceneKey = "";
  let storyPhase = "pre";
  let storyMapState = storyMapFlow ? storyMapFlow.createInitialState() : null;
  let storyMapBattleActive = false;
  let currentStoryMapPointId = null;
  let storyCombatActive = false;
  let storyCombatStage = 0;
  let storyJackSpawnTimer = null;
  let storyChapterSplashTimer = null;
  let storyJackUnlocked = false;
  let storyJackCompleted = false;
  let storyCombatStartAt = 0;
  let failedMissionsCount = 0;
  let lastBattleEffectIndex = -1;
  let activeBattleEffect = null;
  let pendingBattleEffectKey = null;
  let trainEffectTimer = null;
  let trainEffectElapsedSec = 0;
  let trainEffectAlertTimer = null;
  let storyCharacterProgress = storyProgress.createInitialProgress();
  let storyLevelUpQueue = [];
  let storyContinueSnapshot = loadStoryContinueSnapshot();
  let storySaveSlots = loadStorySaveSlots();
  let finalModalPrimaryAction = null;
  const modalFocusReturnMap = new WeakMap();

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

  function getEmptyStorySaveSlots() {
    return Array.from({ length: STORY_SAVE_SLOT_COUNT }, () => null);
  }

  function enqueueStoryLevelUp(charId, nextLevel) {
    const display = storyProgress.getCharacterDisplayById(charId);
    const unlockedSkill = nextLevel >= 2 && storyProgress.hasPassiveSkill(charId);
    storyLevelUpQueue.push({
      name: display.name,
      img: display.img,
      level: nextLevel,
      unlockedSkill
    });
    maybeShowNextStoryLevelUp();
  }

  function maybeShowNextStoryLevelUp() {
    if (!storyLevelUpModal || !storyLevelUpQueue.length) return;
    if (storyLevelUpModal.classList.contains("show")) return;
    const current = storyLevelUpQueue[0];
    if (storyLevelUpImg) {
      storyLevelUpImg.src = current.img;
      storyLevelUpImg.alt = current.name;
    }
    if (storyLevelUpName) storyLevelUpName.textContent = current.name;
    if (storyLevelUpLevel) storyLevelUpLevel.textContent = `Nivel ${current.level}`;
    if (storyLevelUpNote) {
      storyLevelUpNote.classList.toggle("hidden", !current.unlockedSkill);
      storyLevelUpNote.textContent = current.unlockedSkill
        ? "Has desbloqueado una nueva habilidad."
        : "";
    }
    setGlobalPause(true);
    showModal(storyLevelUpModal);
  }

  function closeStoryLevelUpModal() {
    if (!storyLevelUpModal) return;
    if (storyLevelUpQueue.length) storyLevelUpQueue.shift();
    hideModal(storyLevelUpModal);
    if (storyLevelUpQueue.length) {
      requestAnimationFrame(maybeShowNextStoryLevelUp);
      return;
    }
    if (!isAnyModalOpen()) setGlobalPause(false);
  }

  function addStoryCharacterSuccessPoint(charId) {
    if (!charId || !storyCharacterProgress[charId]) return;
    const current = storyCharacterProgress[charId];
    const prevLevel = current.level;
    current.points += 1;
    current.level = Math.floor(current.points / 3) + 1;
    if (current.level > prevLevel) enqueueStoryLevelUp(charId, current.level);
  }

  function addStoryCharacterSuccessPoints(charId, amount) {
    const total = Math.max(0, Math.floor(Number(amount) || 0));
    for (let i = 0; i < total; i++) addStoryCharacterSuccessPoint(charId);
  }

  function awardStoryMissionSuccessPoints(st) {
    if (!storyCombatActive || !st?.assignedCharIds) return;
    const assigned = [...st.assignedCharIds];
    const winchester = CHARACTERS.find((ch) => String(ch.name).toLowerCase() === "winchester");
    const winchesterSoloBonus = !!(
      winchester &&
      assigned.length === 1 &&
      assigned[0] === winchester.id &&
      storyProgress.isSkillUnlocked(storyCharacterProgress, winchester.id)
    );
    const cityMultiplier = isBattleEffectActive("ciudad") ? 2 : 1;

    assigned.forEach((charId) => {
      let gainedPoints = 1;
      if (winchesterSoloBonus && charId === winchester.id) gainedPoints = 2;
      addStoryCharacterSuccessPoints(charId, gainedPoints * cityMultiplier);
    });
  }

  function normalizeStorySaveSlot(raw) {
    if (!raw || typeof raw !== "object") return null;
    const savedAt = Number(raw.savedAt);
    const phase = String(raw?.state?.storyPhase || "");
    const step = Number(raw?.state?.storyStep);
    const stage = Number(raw?.state?.storyCombatStage);
    const validPhase = ["pre", "post", "epilogue", "mapintro", "mappost", "map", "combat"].includes(phase) ? phase : "pre";
    return {
      savedAt: Number.isFinite(savedAt) ? savedAt : Date.now(),
      label: String(raw.label || "Partida guardada"),
      state: {
        storyPhase: validPhase,
        storyStep: Number.isFinite(step) ? Math.max(0, Math.floor(step)) : 0,
        storyCombatActive: !!raw?.state?.storyCombatActive,
        storyCombatStage: stage === 2 ? 2 : 1,
        storyMapState: storyMapFlow ? storyMapFlow.normalizeState(raw?.state?.storyMapState) : null,
        storyCharacterProgress: storyProgress.normalizeProgress(raw?.state?.storyCharacterProgress)
      }
    };
  }

  function loadStorySaveSlots() {
    try {
      const raw = window.localStorage?.getItem(STORY_SAVE_SLOTS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return getEmptyStorySaveSlots();
      const normalized = parsed
        .slice(0, STORY_SAVE_SLOT_COUNT)
        .map((slot) => normalizeStorySaveSlot(slot));
      while (normalized.length < STORY_SAVE_SLOT_COUNT) normalized.push(null);
      return normalized;
    } catch {
      return getEmptyStorySaveSlots();
    }
  }

  function persistStorySaveSlots() {
    try {
      window.localStorage?.setItem(STORY_SAVE_SLOTS_KEY, JSON.stringify(storySaveSlots));
    } catch {
      // ignore storage errors
    }
  }

  function formatStorySaveDate(ts) {
    const date = new Date(ts);
    if (!Number.isFinite(date.getTime())) return "Fecha desconocida";
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function findAutoStorySaveSlotIndex() {
    const emptyIdx = storySaveSlots.findIndex((slot) => !slot);
    if (emptyIdx >= 0) return emptyIdx;
    let oldestIdx = 0;
    let oldestAt = Number(storySaveSlots[0]?.savedAt || Date.now());
    storySaveSlots.forEach((slot, idx) => {
      const at = Number(slot?.savedAt || Date.now());
      if (at < oldestAt) {
        oldestAt = at;
        oldestIdx = idx;
      }
    });
    return oldestIdx;
  }

  function buildCurrentStorySaveState() {
    return {
      storyPhase,
      storyStep,
      storyCombatActive,
      storyCombatStage: storyCombatStage === 2 ? 2 : 1,
      storyMapState: storyMapFlow ? storyMapFlow.normalizeState(storyMapState) : null,
      storyCharacterProgress
    };
  }

  function saveStoryProgress(label = "Partida guardada") {
    const idx = findAutoStorySaveSlotIndex();
    storySaveSlots[idx] = {
      savedAt: Date.now(),
      label,
      state: buildCurrentStorySaveState()
    };
    persistStorySaveSlots();
    return idx;
  }

  function applyStorySaveState(state) {
    const normalized = normalizeStorySaveSlot({ savedAt: Date.now(), label: "", state });
    if (!normalized) return false;
    const payload = normalized.state;
    storyCharacterProgress = storyProgress.normalizeProgress(payload.storyCharacterProgress);

    if (payload.storyCombatActive) {
      startStoryCombat(payload.storyCombatStage);
      return true;
    }

    resetGame();
    selectedMode = "arcade";
    currentMode = "arcade";
    storyMapBattleActive = false;
    currentStoryMapPointId = null;
    storyCombatActive = false;
    storyCombatStage = 0;
    storyJackUnlocked = false;
    storyJackCompleted = false;
    storyMapState = storyMapFlow ? storyMapFlow.normalizeState(payload.storyMapState) : null;
    storyPhase = payload.storyPhase === "combat" ? "pre" : payload.storyPhase;
    if (storyPhase === "map") {
      storyStep = 0;
    } else {
      const scenes = getStorySceneList();
      storyStep = clamp(payload.storyStep, 0, Math.max(0, scenes.length - 1));
    }

    introScreen.classList.add("hidden");
    recruitScreen?.classList.add("hidden");
    storeScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
    storyScreen?.classList.remove("hidden");
    renderStoryStep();
    resetViewportTop();
    return true;
  }

  function renderStoryLoadSlots() {
    if (!storyLoadList) return;
    storyLoadList.innerHTML = "";
    storySaveSlots.forEach((slot, idx) => {
      const row = document.createElement("div");
      row.className = "story-save-row";
      if (!slot) {
        row.innerHTML = `
          <div class="story-save-meta">
            <div class="story-save-title">Archivo ${idx + 1}</div>
            <div class="story-save-sub">Vacío</div>
          </div>
          <button class="btn btn-ghost" type="button" disabled>Cargar</button>
        `;
        storyLoadList.appendChild(row);
        return;
      }
      row.innerHTML = `
        <div class="story-save-meta">
          <div class="story-save-title">Archivo ${idx + 1}: ${slot.label}</div>
          <div class="story-save-sub">${formatStorySaveDate(slot.savedAt)}</div>
        </div>
        <button class="btn btn-ghost story-load-slot-btn" data-slot-index="${idx}" type="button">Cargar</button>
      `;
      storyLoadList.appendChild(row);
    });
    const hasAnySlot = storySaveSlots.some(Boolean);
    storyLoadEmpty?.classList.toggle("hidden", hasAnySlot);

    storyLoadList.querySelectorAll(".story-load-slot-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.getAttribute("data-slot-index"));
        const slot = storySaveSlots[idx];
        if (!slot?.state) return;
        hideModal(storyEntryModal);
        applyStorySaveState(slot.state);
      });
    });
  }

  function loadStoryContinueSnapshot() {
    try {
      const raw = window.localStorage?.getItem(STORY_CONTINUE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }

  function persistStoryContinueSnapshot(snapshot) {
    try {
      if (!snapshot) {
        window.localStorage?.removeItem(STORY_CONTINUE_KEY);
        storyContinueSnapshot = null;
        return;
      }
      window.localStorage?.setItem(STORY_CONTINUE_KEY, JSON.stringify(snapshot));
      storyContinueSnapshot = snapshot;
    } catch {
      // ignore storage errors
    }
  }

  function hasStoryContinueSnapshot() {
    return !!(storyContinueSnapshot && typeof storyContinueSnapshot === "object");
  }

  function isStoryContextVisible() {
    const storyVisible = !!(storyScreen && !storyScreen.classList.contains("hidden"));
    const storyCombatVisible = !!(
      gameRoot &&
      !gameRoot.classList.contains("hidden") &&
      (storyCombatActive || storyMapBattleActive)
    );
    return storyVisible || storyCombatVisible;
  }

  function serializeActivePointsForContinue() {
    const out = [];
    for (const [missionId, st] of activePoints.entries()) {
      if (!st?.mission) continue;
      out.push({
        missionId,
        xPct: st.xPct,
        yPct: st.yPct,
        phase: st.phase === "resolving" ? "ready" : st.phase,
        remainingMs: Number(st.remainingMs) || 0,
        execRemainingMs: Number(st.execRemainingMs) || 0,
        chance: Number.isFinite(st.chance) ? st.chance : null,
        assignedCharIds: [...(st.assignedCharIds || [])],
        forceBlue: !!st.pointEl?.classList.contains("special-blue")
      });
    }
    return out;
  }

  function buildStoryContinueSnapshot() {
    if (!isStoryContextVisible()) return null;

    if (!storyCombatActive) {
      return {
        v: 1,
        mode: "story",
        savedAt: Date.now(),
        state: {
          storyPhase,
          storyStep,
          storyCombatStage,
          storyJackUnlocked,
          storyJackCompleted,
          storyMapState: storyMapFlow ? storyMapFlow.normalizeState(storyMapState) : null,
          storyCharacterProgress
        }
      };
    }

    const pool = getMissionPoolForCurrentMode();
    const activeMissionIds = new Set([...activePoints.keys()]);
    const pendingMissionIds = [...pendingMissions]
      .map((m) => m?.id)
      .filter((id) => id && !activeMissionIds.has(id) && !completedMissionIds.has(id));
    const elapsedCombatMs = storyCombatStartAt > 0 ? Math.max(0, performance.now() - storyCombatStartAt) : 0;

    return {
      v: 1,
      mode: "combat",
      savedAt: Date.now(),
      state: {
        storyPhase,
        storyStep,
        storyCombatActive,
        storyCombatStage,
        storyJackUnlocked,
        storyJackCompleted,
        tutorialPending,
        score,
        failedMissionsCount,
        selectedTeamCardIds: [...selectedTeamCardIds],
        avatarIndex,
        specialUsed,
        specialArmed,
        completedMissionIds: [...completedMissionIds],
        lockedCharIds: [...lockedCharIds],
        injuredCharIds: [...injuredCharIds],
        eliminatedCharIds: [...eliminatedCharIds],
        pendingMissionIds: pendingMissionIds.filter((id) => pool.some((m) => m.id === id)),
        activePoints: serializeActivePointsForContinue(),
        missionPickFromBarActive,
        currentMissionId,
        selectedCharIds: [...selectedCharIds],
        elapsedCombatMs,
        activeBattleEffectKey: activeBattleEffect?.key || null,
        storyCharacterProgress
      }
    };
  }

  function saveStoryContinueSnapshot() {
    const snapshot = buildStoryContinueSnapshot();
    if (snapshot) persistStoryContinueSnapshot(snapshot);
  }

  function restoreStoryDialogState(state) {
    resetGame();
    selectedMode = "arcade";
    currentMode = "arcade";
    storyMapBattleActive = false;
    currentStoryMapPointId = null;
    storyCombatActive = false;
    storyCombatStage = Number(state?.storyCombatStage) === 2 ? 2 : 0;
    storyJackUnlocked = !!state?.storyJackUnlocked;
    storyJackCompleted = !!state?.storyJackCompleted;
    storyMapState = storyMapFlow ? storyMapFlow.normalizeState(state?.storyMapState) : null;
    storyCharacterProgress = storyProgress.normalizeProgress(state?.storyCharacterProgress);
    storyPhase = ["pre", "post", "epilogue", "mapintro", "map", "mappost"].includes(state?.storyPhase) ? state.storyPhase : "pre";
    storyStep = Math.max(0, Math.floor(Number(state?.storyStep) || 0));

    introScreen.classList.add("hidden");
    recruitScreen?.classList.add("hidden");
    storeScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
    storyScreen?.classList.remove("hidden");

    if (storyPhase !== "map") {
      const scenes = getStorySceneList();
      storyStep = clamp(storyStep, 0, Math.max(0, scenes.length - 1));
    } else {
      storyStep = 0;
    }
    renderStoryStep();
    resetViewportTop();
    return true;
  }

  function restoreStoryCombatState(state) {
    const stage = Number(state?.storyCombatStage) === 2 ? 2 : 1;
    resetGame();
    selectedMode = "arcade";
    currentMode = "arcade";
    storyMapBattleActive = false;
    currentStoryMapPointId = null;
    storyCombatActive = true;
    storyCombatStage = stage;
    storyPhase = "combat";
    storyJackUnlocked = !!state?.storyJackUnlocked;
    storyJackCompleted = !!state?.storyJackCompleted;
    storyCharacterProgress = storyProgress.normalizeProgress(state?.storyCharacterProgress);
    tutorialPending = !!state?.tutorialPending;
    storyStep = Math.max(0, Math.floor(Number(state?.storyStep) || 0));
    storyCombatStartAt = performance.now() - Math.max(0, Number(state?.elapsedCombatMs) || 0);
    pendingBattleEffectKey = typeof state?.activeBattleEffectKey === "string" ? state.activeBattleEffectKey : null;
    if (!pendingBattleEffectKey) pendingBattleEffectKey = stage === 2 ? "pueblo" : "none";

    const savedTeamIds = Array.isArray(state?.selectedTeamCardIds) ? state.selectedTeamCardIds : [];
    if (!applyTeamFromCardIds(savedTeamIds)) {
      if (!applyTeamFromCardIds(["card_celia", "card_castri", "card_lorena"])) {
        goToTeamScreen();
        return false;
      }
      selectedTeamCardIds = new Set(["card_celia", "card_castri", "card_lorena"]);
    } else {
      selectedTeamCardIds = new Set(savedTeamIds);
    }

    const avatars = clampAvatarIndex();
    const savedAvatarIndex = Number(state?.avatarIndex);
    avatarIndex = Number.isInteger(savedAvatarIndex) ? clamp(savedAvatarIndex, 0, Math.max(0, avatars.length - 1)) : 0;
    renderAvatarCarousel(0);

    score = Math.max(0, Math.floor(Number(state?.score) || 0));
    failedMissionsCount = Math.max(0, Math.floor(Number(state?.failedMissionsCount) || 0));
    completedMissionIds = new Set(Array.isArray(state?.completedMissionIds) ? state.completedMissionIds : []);
    lockedCharIds = new Set(Array.isArray(state?.lockedCharIds) ? state.lockedCharIds : []);
    injuredCharIds = new Set(Array.isArray(state?.injuredCharIds) ? state.injuredCharIds : []);
    eliminatedCharIds = new Set(Array.isArray(state?.eliminatedCharIds) ? state.eliminatedCharIds : []);
    activePoints = new Map();

    const pool = getMissionPoolForCurrentMode();
    const byId = new Map(pool.map((m) => [m.id, m]));
    const savedPendingIds = Array.isArray(state?.pendingMissionIds) ? state.pendingMissionIds : [];
    pendingMissions = savedPendingIds
      .map((id) => byId.get(id))
      .filter(Boolean);

    const savedPoints = Array.isArray(state?.activePoints) ? state.activePoints : [];
    savedPoints.forEach((entry) => {
      const mission = byId.get(entry?.missionId);
      if (!mission || completedMissionIds.has(mission.id)) return;
      const created = createMissionPoint(mission, {
        xPct: Number(entry?.xPct),
        yPct: Number(entry?.yPct),
        forceBlue: !!entry?.forceBlue
      });
      if (!created) return;
      const st = activePoints.get(mission.id);
      if (!st) return;
      st.remainingMs = Math.max(0, Number(entry?.remainingMs) || MISSION_LIFETIME_MS);
      st.execRemainingMs = Math.max(0, Number(entry?.execRemainingMs) || 0);
      st.assignedCharIds = new Set(Array.isArray(entry?.assignedCharIds) ? entry.assignedCharIds : []);
      st.chance = Number.isFinite(Number(entry?.chance)) ? Number(entry.chance) : null;
      st.phase = ["spawned", "executing", "ready"].includes(entry?.phase) ? entry.phase : "spawned";
      st.lastTickAt = performance.now();
      st.pointEl.classList.remove("assigned", "ready");
      if (st.phase === "executing") st.pointEl.classList.add("assigned");
      if (st.phase === "ready") st.pointEl.classList.add("ready");
    });

    refillPendingMissions();

    introScreen.classList.add("hidden");
    storyScreen?.classList.add("hidden");
    recruitScreen?.classList.add("hidden");
    storeScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.remove("hidden");

    startGame();
    specialUsed = !!state?.specialUsed;
    specialArmed = !!state?.specialArmed;
    setSpecialArmedUI(specialArmed && !specialUsed);
    updateHud();

    if (state?.missionPickFromBarActive && state?.currentMissionId && activePoints.has(state.currentMissionId)) {
      startMissionBarSelection(state.currentMissionId);
      selectedCharIds = new Set(Array.isArray(state?.selectedCharIds) ? state.selectedCharIds : []);
      updateTeamBarAvailability();
    }

    if (storyCombatActive && storyCombatStage === 2 && storyJackUnlocked && !completedMissionIds.has(STORY_JACK_MISSION_ID)) {
      startStoryJackCountdown();
    }
    return true;
  }

  function continueStoryFromSnapshot() {
    const snapshot = loadStoryContinueSnapshot();
    if (!snapshot || typeof snapshot !== "object") return false;
    storyContinueSnapshot = snapshot;
    if (snapshot.mode === "combat") return restoreStoryCombatState(snapshot.state);
    return restoreStoryDialogState(snapshot.state);
  }

  function loadCoins() {
    try {
      if (unlockedRecruitCharIds.size === 0) return DEFAULT_COINS;
      const raw = window.localStorage?.getItem(COINS_STORAGE_KEY);
      const parsed = Number(raw);
      return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : DEFAULT_COINS;
    } catch {
      return DEFAULT_COINS;
    }
  }

  function loadPurchasedStoreItems() {
    try {
      const raw = window.localStorage?.getItem(STORE_PURCHASES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
    } catch {
      return [];
    }
  }

  function persistPurchasedStoreItems() {
    try {
      window.localStorage?.setItem(STORE_PURCHASES_KEY, JSON.stringify([...purchasedStoreItems]));
    } catch {
      // ignore storage errors
    }
  }

  function loadWinchesterOutfit() {
    try {
      const raw = String(window.localStorage?.getItem(WINCHESTER_OUTFIT_KEY) || "default");
      return raw === "alt" ? "alt" : "default";
    } catch {
      return "default";
    }
  }

  function persistWinchesterOutfit() {
    try {
      window.localStorage?.setItem(WINCHESTER_OUTFIT_KEY, selectedWinchesterOutfit);
    } catch {
      // ignore storage errors
    }
  }

  function normalizeWinchesterOutfit() {
    const hasAlt = purchasedStoreItems.has(WINCHESTER_STORE_ITEM_ID);
    if (selectedWinchesterOutfit === "alt" && !hasAlt) selectedWinchesterOutfit = "default";
  }

  function getWinchesterImage() {
    normalizeWinchesterOutfit();
    return selectedWinchesterOutfit === "alt" ? WINCHESTER_ALT_IMG : WINCHESTER_DEFAULT_IMG;
  }

  function getResolvedCardImage(card) {
    if (!card) return "";
    if (String(card.name || "").toLowerCase() === "winchester") return getWinchesterImage();
    return card.img || "";
  }

  function persistCoins() {
    try {
      window.localStorage?.setItem(COINS_STORAGE_KEY, String(coins));
    } catch {
      // ignore storage errors
    }
  }

  function renderCoins() {
    if (userCoinsValue) userCoinsValue.textContent = String(coins);
    if (recruitCoinsValue) recruitCoinsValue.textContent = String(coins);
    if (storeCoinsValue) storeCoinsValue.textContent = String(coins);
    if (recruitScreen && !recruitScreen.classList.contains("hidden")) renderRecruitShop();
  }

  function renderStore() {
    renderCoins();
    if (!storeBuyWinchesterBtn || !storeWinchesterState) return;
    const purchased = purchasedStoreItems.has(WINCHESTER_STORE_ITEM_ID);
    if (purchased) {
      storeWinchesterState.textContent = "Comprado";
      storeBuyWinchesterBtn.textContent = "Comprado";
      storeBuyWinchesterBtn.disabled = true;
      return;
    }
    storeWinchesterState.textContent = `No comprado (${WINCHESTER_STORE_ITEM_PRICE} monedas)`;
    storeBuyWinchesterBtn.textContent = coins >= WINCHESTER_STORE_ITEM_PRICE ? "Comprar" : "Sin monedas";
    storeBuyWinchesterBtn.disabled = coins < WINCHESTER_STORE_ITEM_PRICE;
  }

  function applyWinchesterOutfitEverywhere() {
    if (Array.isArray(availableCards) && availableCards.length) {
      availableCards = availableCards.map((card) => ({
        ...card,
        img: getResolvedCardImage(card)
      }));
    }
    if (teamScreen && !teamScreen.classList.contains("hidden")) renderTeamSelection();
    if (gameRoot && !gameRoot.classList.contains("hidden")) renderTeamBar();
    if (userScreen && !userScreen.classList.contains("hidden")) {
      renderUserAvatarPicker();
      renderUserCollection();
    }
    renderStore();
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
    ].map((card) => ({
      ...card,
      img: getResolvedCardImage(card)
    }));
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

  function getRecruitShopLockedCharacters() {
    const order = new Map([["Landom", 0], ["Pendergast", 1], ["Risko", 2], ["Friday", 3]]);
    return RECRUITABLE_CHARACTERS
      .filter((ch) => !unlockedRecruitCharIds.has(ch.id))
      .sort((a, b) => {
        const aOrder = order.has(a.name) ? order.get(a.name) : 99;
        const bOrder = order.has(b.name) ? order.get(b.name) : 99;
        return aOrder - bOrder;
      });
  }

  function renderRecruitShop() {
    if (!recruitStoreGrid || !recruitStoreEmpty) return;
    recruitStoreGrid.innerHTML = "";
    const lockedCharacters = getRecruitShopLockedCharacters();
    recruitStoreEmpty.classList.toggle("hidden", lockedCharacters.length > 0);

    lockedCharacters.forEach((ch) => {
      const card = RECRUITABLE_CARDS.find((c) => c.charId === ch.id) || null;
      const avatar = AVATARS.find((a) => a.unlockRecruitCharId === ch.id || a.name.toLowerCase() === ch.name.toLowerCase()) || null;
      const imgSrc = card?.img || avatar?.accountSrc || avatar?.src || "images/mision.png";

      const item = document.createElement("article");
      item.className = "recruit-store-item";
      item.innerHTML = `
        <img class="recruit-store-img" src="${imgSrc}" alt="${ch.name}" />
        <div class="recruit-store-name">${ch.name}</div>
        <div class="recruit-store-price">Precio: ${RECRUIT_CHARACTER_COST} monedas</div>
        <button class="btn recruit-buy-btn" data-char-id="${ch.id}" type="button">Comprar</button>
      `;

      const buyBtn = item.querySelector(".recruit-buy-btn");
      if (buyBtn) {
        if (coins < RECRUIT_CHARACTER_COST) {
          buyBtn.textContent = "Sin monedas";
          buyBtn.disabled = true;
        }
      }
      item.querySelector(".recruit-store-img")?.addEventListener("click", () => {
        openCardInfo({
          name: ch.name,
          img: imgSrc
        });
      });
      recruitStoreGrid.appendChild(item);
    });
  }

  function buyRecruitCharacter(charId) {
    const target = RECRUITABLE_CHARACTERS.find((ch) => ch.id === charId);
    if (!target || unlockedRecruitCharIds.has(target.id)) return;
    if (!spendCoins(RECRUIT_CHARACTER_COST)) {
      if (recruitPriceHint) recruitPriceHint.textContent = "No tienes suficientes monedas para comprar este personaje.";
      renderRecruitShop();
      return;
    }
    unlockedRecruitCharIds.add(target.id);
    persistUnlockedRecruitCharIds();
    if (recruitPriceHint) recruitPriceHint.textContent = `${target.name} se ha unido a tu equipo.`;
    renderRecruitShop();
    renderUserAvatarPicker();
    renderUserCollection();
  }

  function goToRecruitScreen() {
    if (!recruitScreen) return;
    introScreen.classList.add("hidden");
    storyScreen?.classList.add("hidden");
    storeScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
    recruitScreen.classList.remove("hidden");
    if (recruitPriceHint) recruitPriceHint.textContent = "";
    renderCoins();
    renderRecruitShop();
    resetViewportTop();
  }

  function goToStoreScreen() {
    if (!storeScreen) return;
    introScreen.classList.add("hidden");
    storyScreen?.classList.add("hidden");
    recruitScreen?.classList.add("hidden");
    storeScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
    storeScreen.classList.remove("hidden");
    renderStore();
    resetViewportTop();
  }

  function setWinchesterOutfit(mode) {
    selectedWinchesterOutfit = mode === "alt" ? "alt" : "default";
    normalizeWinchesterOutfit();
    persistWinchesterOutfit();
    applyWinchesterOutfitEverywhere();
  }

  function buyWinchesterOutfit() {
    if (purchasedStoreItems.has(WINCHESTER_STORE_ITEM_ID)) {
      renderStore();
      return;
    }
    if (!spendCoins(WINCHESTER_STORE_ITEM_PRICE)) {
      renderStore();
      return;
    }
    purchasedStoreItems.add(WINCHESTER_STORE_ITEM_ID);
    persistPurchasedStoreItems();
    renderStore();
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

  function beginUserNameEdit() {
    if (!userNameInput) return;
    isEditingUserName = true;
    userNameInput.classList.remove("hidden");
    userNameInput.value = normalizeUserProfileName(loadUserProfileName() || userProfileTitle?.textContent || DEFAULT_PROFILE_NAME);
    userNameInput.focus();
    userNameInput.select();
    if (userNameEditBtn) userNameEditBtn.textContent = "Guardar nombre";
  }

  function endUserNameEdit(commit = true) {
    if (!userNameInput) return;
    if (!isEditingUserName) return;
    isEditingUserName = false;

    if (commit) {
      const next = normalizeUserProfileName(userNameInput.value);
      persistUserProfileName(next);
      setUserProfileName(next);
    } else {
      const current = normalizeUserProfileName(loadUserProfileName() || DEFAULT_PROFILE_NAME);
      setUserProfileName(current);
    }

    userNameInput.classList.add("hidden");
    if (userNameEditBtn) userNameEditBtn.textContent = "Editar nombre";
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
    CARDS.forEach((c) => pushUnique(getResolvedCardImage(c), c.name));
    RECRUITABLE_CARDS
      .filter((c) => unlockedRecruitCharIds.has(c.charId))
      .forEach((c) => pushUnique(getResolvedCardImage(c), c.name));

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
    const secondaryCards = [...CARDS, ...RECRUITABLE_CARDS]
      .map((card) => ({ ...card, img: getResolvedCardImage(card) }))
      .sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));

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
            : "Personaje principal. Aún no desbloqueado."
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
          text: isUnlocked ? card.text : (card.text + " (Aún no desbloqueado)")
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
    storeScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
    userScreen.classList.remove("hidden");
    userAvatarPicker?.classList.add("hidden");
    if (userAvatarToggleBtn) userAvatarToggleBtn.textContent = "Elegir avatar";
    const currentName = normalizeUserProfileName(loadUserProfileName() || DEFAULT_PROFILE_NAME);
    setUserProfileName(currentName);
    persistUserProfileName(currentName);
    userNameInput?.classList.add("hidden");
    isEditingUserName = false;
    if (userNameEditBtn) userNameEditBtn.textContent = "Editar nombre";
    renderUserAvatarPicker();
    renderUserCollection();
    resetViewportTop();
  }

  function showModal(el) {
    if (!el) return;
    const active = document.activeElement;
    if (active instanceof HTMLElement) modalFocusReturnMap.set(el, active);
    el.classList.add("show");
    el.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      if (!el.classList.contains("show")) return;
      const focusable = el.querySelector(
        "button:not([disabled]), [href], input:not([disabled]):not([type='hidden']), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
      );
      if (focusable instanceof HTMLElement) focusable.focus({ preventScroll: true });
    });
  }

  function hideModal(el) {
    if (!el) return;
    el.classList.remove("show");
    el.setAttribute("aria-hidden", "true");
    if (!isAnyModalOpen()) {
      const returnTo = modalFocusReturnMap.get(el);
      if (returnTo instanceof HTMLElement && returnTo.isConnected) {
        returnTo.focus({ preventScroll: true });
      }
    }
  }

  function isAnyModalOpen() {
    return (
      missionModal.classList.contains("show") ||
      rouletteModal.classList.contains("show") ||
      finalModal.classList.contains("show") ||
      cardInfoModal.classList.contains("show") ||
      specialModal.classList.contains("show") ||
      effectModal?.classList.contains("show") ||
      storyChapterSplashModal?.classList.contains("show") ||
      tutorialModal.classList.contains("show") ||
      rivalTeamModal.classList.contains("show") ||
      storyEntryModal?.classList.contains("show") ||
      storySavePromptModal?.classList.contains("show") ||
      storyLevelUpModal?.classList.contains("show")
    );
  }

  function setGlobalPause(paused) {
    gamePaused = !!paused;
    mapEl?.classList.toggle("points-hidden", gamePaused);
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

  function getCurrentArcadeWinTarget() {
    if (storyMapBattleActive) return STORY_MAP_BATTLE_WIN_TARGET;
    if (storyCombatActive && storyCombatStage === 1) return STORY_COMBAT_WIN_TARGET;
    return ARCADE_WIN_TARGET;
  }

  function getStorySceneList() {
    if (storyPhase === "mapintro") return STORY_MAP_INTRO_SCENES;
    if (storyPhase === "mappost") return STORY_MAP_POST_SCENES;
    if (storyPhase === "post") return STORY_POST_COMBAT_SCENES;
    if (storyPhase === "epilogue") return STORY_EPILOGUE_SCENES;
    return STORY_PRE_COMBAT_SCENES;
  }

  function getMissionPoolForCurrentMode() {
    if (storyMapBattleActive) return STORY_BASE_MISSIONS;
    if (!storyCombatActive) return MISSIONS;
    if (storyCombatStage === 1) return STORY_BASE_MISSIONS;
    if (storyCombatStage === 2) {
      if (storyJackUnlocked && STORY_JACK_MISSION) return [...STORY_BASE_MISSIONS, STORY_JACK_MISSION];
      return STORY_BASE_MISSIONS;
    }
    return MISSIONS;
  }

  function refillPendingMissions() {
    const pool = getMissionPoolForCurrentMode();
    pendingMissions = pool.filter((m) => !completedMissionIds.has(m.id) && !activePoints.has(m.id));
  }

  function formatDuration(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function setFinalModalPrimaryAction(label, onClick) {
    if (playAgainBtn) playAgainBtn.textContent = label || "Jugar otra vez";
    finalModalPrimaryAction = typeof onClick === "function" ? onClick : null;
  }

  function showStoryMissionCompletedLayout() {
    stopGameLoops();
    hideModal(missionModal);
    hideModal(rouletteModal);
    hideModal(cardInfoModal);
    hideModal(specialModal);
    hideModal(effectModal);

    const elapsedMs = storyCombatStartAt > 0 ? (performance.now() - storyCombatStartAt) : 0;
    finalTitleEl.textContent = "MISIÓN COMPLETADA";
    if (finalLabelEl) finalLabelEl.textContent = "Misiones completadas";
    finalScoreEl.textContent = String(score);
    const finalText = finalModal.querySelector(".modal-text");
    if (finalText) {
      finalText.innerHTML = `La banda de Jack el Tuerto ha sido derrotada.<br/>Fallos: <b>${failedMissionsCount}</b><br/>Tiempo: <b>${formatDuration(elapsedMs)}</b>`;
    }
    setFinalModalPrimaryAction("Continuar", () => {
      resetGame();
      storyCombatActive = false;
      storyCombatStage = 0;
      storyPhase = "epilogue";
      storyStep = 0;
      introScreen.classList.add("hidden");
      storyScreen?.classList.remove("hidden");
      recruitScreen?.classList.add("hidden");
      storeScreen?.classList.add("hidden");
      userScreen?.classList.add("hidden");
      startScreen.classList.add("hidden");
      teamScreen.classList.add("hidden");
      gameRoot.classList.add("hidden");
      resetViewportTop();
      renderStoryStep();
    });

    setGlobalPause(true);
    showModal(finalModal);
  }

  function showStoryTutorialCompletedLayout() {
    stopGameLoops();
    hideModal(missionModal);
    hideModal(rouletteModal);
    hideModal(cardInfoModal);
    hideModal(specialModal);
    hideModal(effectModal);
    hideModal(storyChapterSplashModal);
    clearTimeout(storyChapterSplashTimer);
    const elapsedMs = storyCombatStartAt > 0 ? (performance.now() - storyCombatStartAt) : 0;
    finalTitleEl.textContent = "MISIÓN COMPLETADA";
    if (finalLabelEl) finalLabelEl.textContent = "Misiones completadas";
    finalScoreEl.textContent = String(score);
    const finalText = finalModal.querySelector(".modal-text");
    if (finalText) {
      finalText.innerHTML = `Tutorial superado.<br/>Fallos: <b>${failedMissionsCount}</b><br/>Tiempo: <b>${formatDuration(elapsedMs)}</b>`;
    }
    setFinalModalPrimaryAction("Continuar", () => {
      resetGame();
      storyCombatActive = false;
      storyCombatStage = 0;
      storyPhase = "post";
      storyStep = 0;
      introScreen.classList.add("hidden");
      storyScreen?.classList.remove("hidden");
      recruitScreen?.classList.add("hidden");
      storeScreen?.classList.add("hidden");
      userScreen?.classList.add("hidden");
      startScreen.classList.add("hidden");
      teamScreen.classList.add("hidden");
      gameRoot.classList.add("hidden");
      resetViewportTop();
      renderStoryStep();
      openStorySavePrompt();
    });

    setGlobalPause(true);
    showModal(finalModal);
  }

  function startStoryJackCountdown() {
    clearTimeout(storyJackSpawnTimer);
    storyJackSpawnTimer = null;
    if (!storyCombatActive || storyCombatStage !== 2 || !STORY_JACK_MISSION) return;
    storyJackSpawnTimer = setTimeout(() => {
      storyJackUnlocked = true;
      refillPendingMissions();
      scheduleNextSpawn();
    }, STORY_JACK_DELAY_MS);
  }

  function setImageWithFallback(el, src, fallback) {
    if (!el) return;
    const primary = src || fallback || "";
    const backup = fallback || "";
    el.onerror = () => {
      if (backup && el.src !== new URL(backup, window.location.href).href) {
        el.onerror = null;
        el.src = backup;
      } else {
        el.onerror = null;
      }
    };
    el.src = primary;
  }

  function getActiveBattleEffect() {
    if (currentMode === "versus") return null;
    return activeBattleEffect;
  }

  function isBattleEffectActive(effectKey) {
    return getActiveBattleEffect()?.key === effectKey;
  }

  function updateActiveEffectButton() {
    if (!activeEffectBtn) return;
    const effect = getActiveBattleEffect();
    if (!gameRunning || !effect) {
      activeEffectBtn.classList.add("hidden");
      return;
    }
    activeEffectBtn.textContent = `Efecto activo ${effect.place}`;
    activeEffectBtn.classList.remove("hidden");
  }

  function updateTrainEffectCounterUI() {
    if (!trainEffectCounter) return;
    const isVisible = gameRunning && isBattleEffectActive("tren");
    trainEffectCounter.classList.toggle("hidden", !isVisible);
    if (!isVisible) {
      trainEffectCounter.classList.remove("alert");
      return;
    }
    const secs = clamp(trainEffectElapsedSec, 0, 60);
    trainEffectCounter.textContent = `Parada del tren: 00:${String(secs).padStart(2, "0")} / 01:00`;
  }

  function triggerTrainEffectCounterAlert() {
    if (!trainEffectCounter) return;
    clearTimeout(trainEffectAlertTimer);
    trainEffectCounter.classList.add("alert");
    trainEffectAlertTimer = setTimeout(() => {
      trainEffectCounter.classList.remove("alert");
    }, 700);
  }

  function applyTrainStopEffect() {
    if (!isBattleEffectActive("tren") || !gameRunning) return;
    let removedCount = 0;
    for (const [missionId, st] of activePoints.entries()) {
      const isCurrentMissionSelecting = missionPickFromBarActive && currentMissionId === missionId;
      if (st?.phase !== "spawned" || isCurrentMissionSelecting) continue;
      removePoint(missionId);
      removedCount += 1;
    }
    if (removedCount > 0) {
      showGameStatusNotice(`Parada del tren: ${removedCount} misión(es) no iniciada(s) eliminada(s).`, "danger");
    }
  }

  function restartTrainEffectTimer() {
    clearInterval(trainEffectTimer);
    trainEffectTimer = null;
    clearTimeout(trainEffectAlertTimer);
    trainEffectAlertTimer = null;
    trainEffectElapsedSec = 0;
    updateTrainEffectCounterUI();
    if (!gameRunning || !isBattleEffectActive("tren")) return;
    trainEffectTimer = setInterval(() => {
      if (!gameRunning || !isBattleEffectActive("tren")) return;
      trainEffectElapsedSec += 1;
      if (trainEffectElapsedSec >= 60) {
        triggerTrainEffectCounterAlert();
        applyTrainStopEffect();
        trainEffectElapsedSec = 0;
      }
      updateTrainEffectCounterUI();
    }, 1000);
  }

  function pickRandomBattleBackground(preferredEffectKey = null) {
    if (!mapEl || BATTLE_EFFECTS.length < 1) return;
    if (preferredEffectKey === "none") {
      activeBattleEffect = null;
      mapEl.style.setProperty("--battle-bg-image", "linear-gradient(0deg, rgba(0,0,0,0), rgba(0,0,0,0))");
      updateActiveEffectButton();
      restartTrainEffectTimer();
      return;
    }
    let effect = null;
    if (preferredEffectKey) {
      effect = BATTLE_EFFECTS.find((item) => item.key === preferredEffectKey) || null;
    }
    if (!effect) {
      let idx = randInt(0, BATTLE_EFFECTS.length - 1);
      if (BATTLE_EFFECTS.length > 1 && idx === lastBattleEffectIndex) {
        idx = (idx + 1 + randInt(0, BATTLE_EFFECTS.length - 2)) % BATTLE_EFFECTS.length;
      }
      lastBattleEffectIndex = idx;
      effect = BATTLE_EFFECTS[idx];
    } else {
      const idx = BATTLE_EFFECTS.findIndex((item) => item.key === effect.key);
      if (idx >= 0) lastBattleEffectIndex = idx;
    }
    activeBattleEffect = effect || null;
    mapEl.style.setProperty("--battle-bg-image", `url("${effect?.image || "misiones/fondobosque.png"}")`);
    updateActiveEffectButton();
    updateTrainEffectCounterUI();
    restartTrainEffectTimer();
  }

  function applyStoryScene(scene) {
    if (!scene) return;
    const showChars = scene.showChars !== false;
    const bgLower = String(scene.background || "").toLowerCase();
    const isWidePanScene = bgLower.includes("1grupocharla.png") || bgLower.includes("1combatebandidos.png");

    if (storySpeaker) {
      storySpeaker.textContent = scene.speaker || "";
      storySpeaker.classList.toggle("hidden", !scene.speaker);
    }
    if (storyText) storyText.textContent = scene.text || "";

    if (storyScreen) {
      storyScreen.style.background = scene.background
        ? `url("${scene.background}") center center / cover no-repeat`
        : 'url("images/portadainicio.PNG") center center / cover no-repeat';
      storyScreen.classList.toggle("story-pan-group-mobile", isWidePanScene);
    }
    if (storyStage) storyStage.style.background = "";

    const showLeft = showChars && scene.showLeft !== false;
    const showRight = showChars && scene.showRight !== false;
    const showLeftSupport = showLeft && !!scene.leftSupportSrc && scene.showLeftSupport !== false;
    const showRightSupport = showRight && !!scene.rightSupportSrc && scene.showRightSupport !== false;
    storyLeftChar?.classList.toggle("hidden", !showLeft);
    storyRightChar?.classList.toggle("hidden", !showRight);
    storyLeftSupportChar?.classList.toggle("hidden", !showLeftSupport);
    storyRightSupportChar?.classList.toggle("hidden", !showRightSupport);

    if (!showChars) {
      storyLeftChar?.classList.remove("active");
      storyRightChar?.classList.remove("active");
      storyLeftSupportChar?.classList.remove("active");
      storyRightSupportChar?.classList.remove("active");
      return;
    }

    if (showLeft && storyLeftChar) setImageWithFallback(storyLeftChar, scene.leftSrc, "images/Evelyn.png");
    if (showRight && storyRightChar) setImageWithFallback(storyRightChar, scene.rightSrc, "images/Landom.png?v=20260210-4");
    if (showLeftSupport && storyLeftSupportChar) setImageWithFallback(storyLeftSupportChar, scene.leftSupportSrc, "historia/Winchester2.png");
    if (showRightSupport && storyRightSupportChar) setImageWithFallback(storyRightSupportChar, scene.rightSupportSrc, "historia/Jane2.png");
    storyRightChar?.classList.toggle("no-mirror", scene.rightMirror === false);
    storyRightSupportChar?.classList.toggle("no-mirror", scene.rightSupportMirror === false);
    storyLeftChar?.classList.toggle("active", scene.active === "left");
    storyRightChar?.classList.toggle("active", scene.active === "right");
    storyLeftSupportChar?.classList.toggle("active", scene.active === "left-support");
    storyRightSupportChar?.classList.toggle("active", scene.active === "right-support");
    applyStoryCharacterNormalization();
  }

  function isMobileStoryViewport() {
    return window.matchMedia("(max-width: 820px)").matches;
  }

  function splitLongTextByWords(text, maxChars) {
    const clean = String(text || "").trim();
    if (!clean) return [""];
    const words = clean.split(/\s+/);
    const out = [];
    let current = "";
    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length <= maxChars) {
        current = candidate;
      } else {
        if (current) out.push(current);
        current = word;
      }
    });
    if (current) out.push(current);
    return out.length ? out : [clean];
  }

  function splitStorySceneTextForMobile(text) {
    const clean = String(text || "").trim();
    if (!clean) return [""];
    const viewportW = Math.max(320, window.innerWidth || 390);
    let maxChars = 150;
    if (viewportW <= 360) maxChars = 110;
    else if (viewportW <= 430) maxChars = 130;

    const chunks = clean.split(/(?<=[.!?…])\s+/).filter(Boolean);
    if (chunks.length < 2 && clean.length <= maxChars) return [clean];
    if (chunks.length < 2) return splitLongTextByWords(clean, maxChars);

    const pages = [];
    let current = "";
    chunks.forEach((chunk) => {
      const candidate = current ? `${current} ${chunk}` : chunk;
      if (candidate.length <= maxChars) {
        current = candidate;
      } else {
        if (current) {
          pages.push(current);
          current = chunk;
          if (current.length > maxChars) {
            const split = splitLongTextByWords(current, maxChars);
            pages.push(...split.slice(0, -1));
            current = split[split.length - 1] || "";
          }
        } else {
          const split = splitLongTextByWords(chunk, maxChars);
          pages.push(...split.slice(0, -1));
          current = split[split.length - 1] || "";
        }
      }
    });
    if (current) pages.push(current);
    return pages.length ? pages : [clean];
  }

  function getStorySceneTextPages(scene) {
    if (!scene) return [""];
    if (!isMobileStoryViewport()) return [String(scene.text || "")];
    return splitStorySceneTextForMobile(scene.text || "");
  }

  function updateHud() {
    if (currentMode === "versus") {
      if (hudLabelEl) hudLabelEl.textContent = "Marcador";
      progressEl.textContent = `${localWins} - ${rivalWins}`;
      if (hudStoryHintEl) {
        hudStoryHintEl.textContent = "";
        hudStoryHintEl.classList.add("hidden");
      }
    } else {
      if (hudLabelEl) hudLabelEl.textContent = "Misiones";
      if (storyCombatActive && storyCombatStage === 2) {
        progressEl.textContent = String(score);
      } else {
        progressEl.textContent = String(score) + "/" + String(getCurrentArcadeWinTarget());
      }
      if (hudStoryHintEl) {
        if (storyCombatActive && storyCombatStage === 1) {
          hudStoryHintEl.textContent = "Completa 3 misiones para superar el tutorial.";
          hudStoryHintEl.classList.remove("hidden");
        } else if (storyCombatActive && storyCombatStage === 2) {
          hudStoryHintEl.textContent = "Encuentra la guarida de Jack el tuerto y acaba con él.";
          hudStoryHintEl.classList.remove("hidden");
        } else {
          hudStoryHintEl.textContent = "";
          hudStoryHintEl.classList.add("hidden");
        }
      }
    }
    const canSkipStoryBattle = currentMode !== "versus" && (storyCombatActive || storyMapBattleActive);
    storySkipBattleBtn?.classList.toggle("hidden", !canSkipStoryBattle);
    rivalTeamBtn?.classList.toggle("hidden", currentMode !== "versus");
    updateActiveEffectButton();
    updateTrainEffectCounterUI();
  }

  function skipCurrentStoryBattle() {
    if (!(storyCombatActive || storyMapBattleActive)) return;
    finishArcadeVictory();
  }

  function setIntroVisible() {
    if (isStoryContextVisible()) saveStoryContinueSnapshot();
    if (isEditingUserName) endUserNameEdit(true);
    const targetMenuKey = resolveIntroMenuKeyFromContext();
    const targetIndex = INTRO_MENU_OPTIONS.findIndex((option) => option.key === targetMenuKey);
    introMenuIndex = targetIndex >= 0 ? targetIndex : 0;
    renderIntroMenu(0);
    introScreen.classList.remove("hidden");
    storyScreen?.classList.add("hidden");
    recruitScreen?.classList.add("hidden");
    storeScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
    resetViewportTop();
  }

  function resolveIntroMenuKeyFromContext() {
    if (storyScreen && !storyScreen.classList.contains("hidden")) return "historia";
    if (recruitScreen && !recruitScreen.classList.contains("hidden")) return "reclutar";
    if (storeScreen && !storeScreen.classList.contains("hidden")) return "tienda";
    if (userScreen && !userScreen.classList.contains("hidden")) return "cuenta";

    const inPlayflow = !startScreen.classList.contains("hidden") || !teamScreen.classList.contains("hidden") || !gameRoot.classList.contains("hidden");
    if (inPlayflow) {
      if (storyCombatActive || storyMapBattleActive) return "historia";
      if (selectedMode === "versus" || currentMode === "versus") return "versus";
      return "arcade";
    }

    return INTRO_MENU_OPTIONS[introMenuIndex]?.key || "arcade";
  }

  function resetViewportTop() {
    const resetElementScroll = (el) => {
      if (!el) return;
      el.scrollTop = 0;
      el.scrollLeft = 0;
    };
    const resetScrollableTree = (root) => {
      if (!root) return;
      resetElementScroll(root);
      root.querySelectorAll("*").forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth) {
          resetElementScroll(node);
        }
      });
    };
    const applyReset = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      resetScrollableTree(introScreen);
      resetScrollableTree(storyScreen);
      resetScrollableTree(recruitScreen);
      resetScrollableTree(storeScreen);
      resetScrollableTree(userScreen);
      resetScrollableTree(startScreen);
      resetScrollableTree(teamScreen);
      resetScrollableTree(gameRoot);
    };
    applyReset();
    requestAnimationFrame(applyReset);
    setTimeout(applyReset, 60);
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
    if (current.key === "historia") openStoryEntryModal();
    if (current.key === "reclutar") goToRecruitScreen();
    if (current.key === "tienda") goToStoreScreen();
    if (current.key === "cuenta") goToUserScreen();
  }

  function openStoryEntryModal() {
    storyContinueSnapshot = loadStoryContinueSnapshot();
    storySaveSlots = loadStorySaveSlots();
    storyLoadPanel?.classList.add("hidden");
    if (storyLoadGameBtn) storyLoadGameBtn.textContent = "Cargar partida";
    storyContinueBtn?.classList.toggle("hidden", !hasStoryContinueSnapshot());
    showModal(storyEntryModal);
  }

  function toggleStoryLoadPanel() {
    if (!storyLoadPanel) return;
    const willShow = storyLoadPanel.classList.contains("hidden");
    storyLoadPanel.classList.toggle("hidden");
    if (storyLoadGameBtn) {
      storyLoadGameBtn.textContent = willShow ? "Ocultar archivos" : "Cargar partida";
    }
    if (willShow) renderStoryLoadSlots();
  }

  function openStorySavePrompt() {
    if (!storySavePromptModal) return;
    if (storySavePromptText) {
      storySavePromptText.textContent = "¿Quieres guardar partida?";
    }
    showModal(storySavePromptModal);
  }

  function renderStoryMapLayer() {
    if (!storyMapLayer || !storyMapPoints || !storyMapRouteFill || !storyMapFlow) return;
    const isMobileMap = isMobileStoryViewport();
    const getProjectedPoint = (point) => {
      if (!point) return { x: 50, y: 50 };
      if (!isMobileMap) return point;
      if (point.id === "boss") return { ...point, y: 8 };
      const tier = storyMapFlow.getTierIndexForPoint(point.id);
      if (tier < 0) return point;
      const tierYBase = [86, 56, 26];
      const tierCenterYOffset = [2, 2, 2];
      const tierPointIndex = (storyMapFlow.getTiers()[tier] || []).findIndex((p) => p.id === point.id);
      const y = tierYBase[tier] + (tierPointIndex === 1 ? tierCenterYOffset[tier] : 0);
      return { ...point, y };
    };
    storyMapLayer.classList.remove("hidden");
    storyDialog?.classList.add("hidden");
    storyLeftChar?.classList.add("hidden");
    storyRightChar?.classList.add("hidden");
    storyLeftSupportChar?.classList.add("hidden");
    storyRightSupportChar?.classList.add("hidden");
    storyScreen.style.background = 'url("historia/mapa1.png") center center / cover no-repeat';
    storyMapPoints.innerHTML = "";
    if (storyMapConnections) {
      storyMapConnections.innerHTML = "";
      const tiers = storyMapFlow.getTiers();
      const boss = storyMapFlow.getBoss();
      const chosenByTier = Array.isArray(storyMapState?.chosenByTier) ? storyMapState.chosenByTier : [];
      const getTierPointIndex = (pointId) => {
        const tier = storyMapFlow.getTierIndexForPoint(pointId);
        if (tier < 0) return -1;
        return (tiers[tier] || []).findIndex((p) => p.id === pointId);
      };
      const getAllowedNextIndices = (fromIndex) => {
        if (fromIndex === 0) return [0, 1];
        if (fromIndex === 2) return [1, 2];
        return [0, 1, 2];
      };
      const isTransitionAllowed = (fromId, toId) => {
        const fromIdx = getTierPointIndex(fromId);
        const toIdx = getTierPointIndex(toId);
        if (fromIdx < 0 || toIdx < 0) return false;
        return getAllowedNextIndices(fromIdx).includes(toIdx);
      };

      const isConnectionActive = (fromId, toId) => {
        const fromTier = storyMapFlow.getTierIndexForPoint(fromId);
        if (fromTier < 0) return false;
        if (chosenByTier[fromTier] !== fromId) return false;
        if (fromTier === tiers.length - 1) return toId === boss.id;
        const nextChosen = chosenByTier[fromTier + 1];
        if (nextChosen) return toId === nextChosen;
        return true;
      };

      for (let t = 0; t < tiers.length - 1; t++) {
        tiers[t].forEach((from) => {
          tiers[t + 1].forEach((to) => {
            if (!isTransitionAllowed(from.id, to.id)) return;
            const fromPos = getProjectedPoint(from);
            const toPos = getProjectedPoint(to);
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", String(fromPos.x));
            line.setAttribute("y1", String(fromPos.y));
            line.setAttribute("x2", String(toPos.x));
            line.setAttribute("y2", String(toPos.y));
            line.setAttribute("class", `story-map-connection${isConnectionActive(from.id, to.id) ? " active" : ""}`);
            storyMapConnections.appendChild(line);
          });
        });
      }

      const lastTier = tiers[tiers.length - 1] || [];
      lastTier.forEach((from) => {
        const fromPos = getProjectedPoint(from);
        const bossPos = getProjectedPoint(boss);
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", String(fromPos.x));
        line.setAttribute("y1", String(fromPos.y));
        line.setAttribute("x2", String(bossPos.x));
        line.setAttribute("y2", String(bossPos.y));
        line.setAttribute("class", `story-map-connection${isConnectionActive(from.id, boss.id) ? " active" : ""}`);
        storyMapConnections.appendChild(line);
      });
    }
    const points = storyMapFlow.getPoints();
    points.forEach((point) => {
      const pointPos = getProjectedPoint(point);
      const completed = storyMapFlow.isPointCompleted(storyMapState, point.id);
      const unlocked = storyMapFlow.isPointUnlocked(storyMapState, point.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "story-map-point";
      if (point.id === "boss") btn.classList.add("boss");
      if (point.id !== "boss") {
        const icon = STORY_MAP_POINT_ICONS[randInt(0, STORY_MAP_POINT_ICONS.length - 1)];
        btn.style.backgroundImage = `url("${icon}")`;
        btn.style.backgroundSize = "cover";
        btn.style.backgroundPosition = "center";
        btn.style.backgroundRepeat = "no-repeat";
      }
      if (completed) btn.classList.add("completed");
      else if (unlocked) btn.classList.add("current");
      else btn.classList.add("locked");
      btn.style.left = `${pointPos.x}%`;
      btn.style.top = `${pointPos.y}%`;
      btn.disabled = !unlocked || completed;
      btn.setAttribute("aria-label", point.id === "boss" ? "Punto principal" : "Punto de batalla");
      btn.addEventListener("click", () => startStoryMapBattle(point.id));
      storyMapPoints.appendChild(btn);
    });
    const progress = storyMapFlow.getRouteProgress(storyMapState);
    storyMapRouteFill.style.height = `${Math.round(progress * 100)}%`;
  }

  function showStoryMapConversation() {
    storyPhase = "mappost";
    storyStep = 0;
    renderStoryStep();
  }

  function completeStoryMapBattle(pointId) {
    if (!storyMapFlow || !pointId) return;
    storyMapState = storyMapFlow.completePoint(storyMapState, pointId);
    currentStoryMapPointId = null;
    storyMapBattleActive = false;
    resetGame();
    introScreen.classList.add("hidden");
    storyScreen?.classList.remove("hidden");
    recruitScreen?.classList.add("hidden");
    storeScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
    resetViewportTop();
    if (storyMapState?.bossCompleted) {
      showStoryMapConversation();
      return;
    }
    storyPhase = "map";
    storyStep = 0;
    renderStoryStep();
  }

  function startStoryMapBattle(pointId) {
    if (!storyMapFlow || !storyMapFlow.isPointUnlocked(storyMapState, pointId)) return;
    resetGame();
    currentStoryMapPointId = pointId;
    storyMapBattleActive = true;
    selectedMode = "arcade";
    currentMode = "arcade";
    storyCombatActive = false;
    storyCombatStage = 0;
    tutorialPending = false;
    pendingMissions = [...STORY_BASE_MISSIONS];
    selectedTeamCardIds = new Set(["card_celia", "card_castri", "card_lorena"]);
    if (!applyTeamFromCardIds([...selectedTeamCardIds])) {
      goToTeamScreen();
      return;
    }
    pendingBattleEffectKey = null;
    introScreen.classList.add("hidden");
    storyScreen?.classList.add("hidden");
    recruitScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.remove("hidden");
    startGame();
  }

  function startStoryMapMode() {
    if (storyMapFlow && !storyMapState) storyMapState = storyMapFlow.createInitialState();
    storyPhase = "mapintro";
    storyStep = 0;
    renderStoryStep();
  }

  function goToStartScreen(mode) {
    selectedMode = mode;
    introScreen.classList.add("hidden");
    storyScreen?.classList.add("hidden");
    recruitScreen?.classList.add("hidden");
    storeScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.remove("hidden");
    startTutorialBtn?.classList.toggle("hidden", selectedMode !== "arcade");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
    resetViewportTop();
  }

  function renderStoryStep() {
    if (storyPhase === "map") {
      renderStoryMapLayer();
      if (storySkipBtn) storySkipBtn.classList.add("hidden");
      if (storyMenuBtn) storyMenuBtn.classList.add("hidden");
      return;
    }
    storyMapLayer?.classList.add("hidden");
    storyDialog?.classList.remove("hidden");
    const scenes = getStorySceneList();
    const scene = scenes[storyStep] || scenes[0];
    const sceneKey = `${storyPhase}:${storyStep}`;
    if (sceneKey !== lastRenderedStorySceneKey) {
      storySceneTextPageIndex = 0;
      lastRenderedStorySceneKey = sceneKey;
    }
    storySceneTextPages = getStorySceneTextPages(scene);
    storySceneTextPageIndex = clamp(storySceneTextPageIndex, 0, Math.max(0, storySceneTextPages.length - 1));
    const pagedScene = { ...scene, text: storySceneTextPages[storySceneTextPageIndex] || "" };
    applyStoryScene(pagedScene);
    const isLast = storyStep >= scenes.length - 1;
    const isLastPage = storySceneTextPageIndex >= storySceneTextPages.length - 1;
    if (storySkipBtn) storySkipBtn.classList.toggle("hidden", !(storyPhase === "pre" || storyPhase === "post"));
    const isFinalPhase = storyPhase === "mappost";
    if (storyMenuBtn) storyMenuBtn.classList.toggle("hidden", !(isFinalPhase && isLast));
    if (storyNextBtn) {
      storyNextBtn.textContent = isLast && isLastPage && isFinalPhase ? "Fin" : "Siguiente";
    }
  }

  function goToStoryScreen() {
    storyCharacterProgress = storyProgress.createInitialProgress();
    storyLevelUpQueue = [];
    introScreen.classList.add("hidden");
    recruitScreen?.classList.add("hidden");
    storeScreen?.classList.add("hidden");
    userScreen?.classList.add("hidden");
    startScreen.classList.add("hidden");
    teamScreen.classList.add("hidden");
    gameRoot.classList.add("hidden");
    storyScreen?.classList.remove("hidden");
    storyCombatActive = false;
    storyCombatStage = 0;
    storyMapBattleActive = false;
    currentStoryMapPointId = null;
    storyMapState = storyMapFlow ? storyMapFlow.createInitialState() : null;
    storyJackUnlocked = false;
    storyJackCompleted = false;
    storyPhase = "pre";
    storyStep = 0;
    renderStoryStep();
    resetViewportTop();
  }

  function startStoryCombat(stage = 1) {
    const normalizedStage = stage === 2 ? 2 : 1;
    resetGame();
    selectedMode = "arcade";
    currentMode = "arcade";
    storyCombatActive = true;
    storyCombatStage = normalizedStage;
    storyPhase = "combat";
    storyCombatStartAt = performance.now();

    const avatars = clampAvatarIndex();
    const evelynIdx = avatars.findIndex((a) => a.key === "evelyn");
    if (evelynIdx >= 0) avatarIndex = evelynIdx;
    renderAvatarCarousel(0);

    if (normalizedStage === 1) {
      selectedTeamCardIds = new Set(["card_celia", "card_castri", "card_lorena"]);
    } else {
      selectedTeamCardIds = new Set(["card_celia", "card_castri", "card_lorena"]);
    }
    pendingBattleEffectKey = normalizedStage === 2 ? "pueblo" : "none";
    if (!applyTeamFromCardIds([...selectedTeamCardIds])) {
      goToTeamScreen();
      return;
    }
    tutorialPending = normalizedStage === 1;
    storyJackUnlocked = false;
    storyJackCompleted = false;
    refillPendingMissions();
    if (normalizedStage === 2) startStoryJackCountdown();

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
    if (storyPhase === "map") return;
    if (storySceneTextPageIndex < storySceneTextPages.length - 1) {
      storySceneTextPageIndex += 1;
      renderStoryStep();
      return;
    }
    const scenes = getStorySceneList();
    if (storyStep < scenes.length - 1) {
      storyStep += 1;
      storySceneTextPageIndex = 0;
      renderStoryStep();
      return;
    }
    if (storyPhase === "pre") {
      startStoryCombat(1);
      return;
    }
    if (storyPhase === "post") {
      startStoryCombat(2);
      return;
    }
    if (storyPhase === "epilogue") {
      startStoryMapMode();
      return;
    }
    if (storyPhase === "mapintro") {
      storyPhase = "map";
      storyStep = 0;
      renderStoryStep();
      return;
    }
    if (storyPhase === "mappost") {
      setIntroVisible();
    }
  }

  function skipStoryPhase() {
    if (storyPhase === "pre") {
      startStoryCombat(1);
      return;
    }
    if (storyPhase === "post") {
      startStoryCombat(2);
      return;
    }
    if (storyPhase === "epilogue") {
      startStoryMapMode();
    }
  }

  function goToTeamScreen() {
    startScreen.classList.add("hidden");
    teamScreen.classList.remove("hidden");
    renderTeamSelection();
    resetViewportTop();
  }

  function backToAvatarSelection() {
    teamScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    resetViewportTop();
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
    applyAvatarPreviewNormalization(a.src);
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
    const selectedCards = cardIds
      .map((id) => allCards.find((c) => c.id === id))
      .filter(Boolean)
      .map((card) => ({ ...card, img: getResolvedCardImage(card) }));
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
    const landomAvatar = AVATARS.find((a) => a.key === "landom");
    if (tutorialRightChar && landomAvatar?.src) tutorialRightChar.src = landomAvatar.src;
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
    if (tutorialReturnToAvatar) {
      tutorialReturnToAvatar = false;
      goToStartScreen("arcade");
    }
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
    const matchBonus = Number.isFinite(mission?.matchBonus) ? mission.matchBonus : 0.8;
    const missBonus = Number.isFinite(mission?.missBonus) ? mission.missBonus : 0.1;
    const chosenList = Array.isArray(chosenIds) ? chosenIds : [...chosenIds];
    const maxChars = getMissionMaxChars(mission);
    const participants = [...chosenList];

    const camus = CHARACTERS.find((ch) => String(ch.name).toLowerCase() === "camus");
    const camusUnlocked = !!(storyCombatActive && camus && participants.includes(camus.id) && storyProgress.isSkillUnlocked(storyCharacterProgress, camus.id));
    if (camusUnlocked && participants.length < maxChars) {
      const clones = maxChars - participants.length;
      for (let i = 0; i < clones; i++) participants.push(camus.id);
    }

    let p = 0;

    for (const cid of participants) {
      const ch = availableCharacters.find((c) => c.id === cid);
      if (!ch) continue;
      const tags = Array.isArray(ch.tags) ? ch.tags : [ch.tags];
      const normalizedTags = tags.map(normalizeTag);
      const match = normalizedTags.some((tag) => missionTags.includes(tag));
      p += match ? matchBonus : missBonus;
    }

    const jane = CHARACTERS.find((ch) => String(ch.name).toLowerCase() === "jane");
    const janeUnlocked = !!(storyCombatActive && jane && participants.includes(jane.id) && storyProgress.isSkillUnlocked(storyCharacterProgress, jane.id));
    if (janeUnlocked) {
      participants.forEach((cid) => {
        if (cid === jane.id) return;
        const ch = availableCharacters.find((c) => c.id === cid);
        if (!ch) return;
        const tags = Array.isArray(ch.tags) ? ch.tags : [ch.tags];
        const normalizedTags = tags.map(normalizeTag);
        if (normalizedTags.includes("adistancia")) p += 0.2;
      });
    }

    if (isBattleEffectActive("bosque")) {
      participants.forEach((cid) => {
        const ch = availableCharacters.find((c) => c.id === cid);
        if (!ch) return;
        const tags = Array.isArray(ch.tags) ? ch.tags : [ch.tags];
        const normalizedTags = tags.map(normalizeTag);
        if (normalizedTags.includes("sigilo") || normalizedTags.includes("exploracion")) {
          p += 0.2;
        }
      });
      if (missionTags.includes("sigilo") || missionTags.includes("exploracion")) p -= 0.2;
    }

    if (isBattleEffectActive("pueblo")) p += 0.1;

    return clamp(p, 0, 1);
  }

  function getMissionMaxChars(mission) {
    if (isBattleEffectActive("barco")) return 1;
    const raw = Number(mission?.maxChars);
    return Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 2;
  }

  const spriteBoxCache = new Map();
  let referenceVisibleHeightPx = null;
  let selectorReferenceVisibleRatio = null;
  let storyReferenceVisiblePerWidth = null;
  let avatarPreviewNormalizeReq = 0;
  let storyNormalizeReq = 0;

  async function getSpriteBox(src) {
    if (spriteBoxCache.has(src)) return spriteBoxCache.get(src);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    await new Promise((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("No se pudo cargar " + src));
    });

    const normalizedSrc = String(src || "").split("?")[0].split("#")[0];
    const hasAlpha = /\.png$/i.test(normalizedSrc) || /\.webp$/i.test(normalizedSrc);
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

  async function getSelectorScaleFor(src) {
    const box = await getSpriteBox(src);
    const ratio = box.h > 0 ? (box.boxH / box.h) : 1;
    if (selectorReferenceVisibleRatio == null) selectorReferenceVisibleRatio = ratio;
    if (ratio <= 0) return 1;
    return clamp(selectorReferenceVisibleRatio / ratio, 0.85, 1.7);
  }

  async function getStoryScaleFor(src) {
    const box = await getSpriteBox(src);
    const visiblePerWidth = box.w > 0 ? (box.boxH / box.w) : 1;
    if (storyReferenceVisiblePerWidth == null) storyReferenceVisiblePerWidth = visiblePerWidth;
    if (visiblePerWidth <= 0) return 1;
    return clamp(storyReferenceVisiblePerWidth / visiblePerWidth, 0.85, 1.7);
  }

  async function applyAvatarPreviewNormalization(src) {
    if (!avatarPreviewImg) return;
    const req = ++avatarPreviewNormalizeReq;
    avatarPreviewImg.style.setProperty("--sprite-scale", "1");
    try {
      const scale = await getSelectorScaleFor(src);
      if (req !== avatarPreviewNormalizeReq) return;
      avatarPreviewImg.style.setProperty("--sprite-scale", scale.toFixed(3));
    } catch (_) {
      if (req !== avatarPreviewNormalizeReq) return;
      avatarPreviewImg.style.setProperty("--sprite-scale", "1");
    }
  }

  async function applyStoryCharacterNormalization() {
    const req = ++storyNormalizeReq;
    const targets = [
      [storyLeftChar, storyLeftChar?.src],
      [storyRightChar, storyRightChar?.src],
      [storyLeftSupportChar, storyLeftSupportChar?.src],
      [storyRightSupportChar, storyRightSupportChar?.src]
    ];

    for (const [el, src] of targets) {
      if (!el || !src) continue;
      el.style.setProperty("--char-scale", "1");
      try {
        const scale = await getStoryScaleFor(src);
        if (req !== storyNormalizeReq) return;
        el.style.setProperty("--char-scale", scale.toFixed(3));
      } catch (_) {
        if (req !== storyNormalizeReq) return;
        el.style.setProperty("--char-scale", "1");
      }
    }
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
      const selected = !!cid && selectedCharIds.has(cid);
      const injured = !!cid && injuredCharIds.has(cid);
      const eliminated = !!cid && eliminatedCharIds.has(cid);
      item.classList.toggle("busy", !!busy && !selected);
      item.classList.toggle("pick-mode", missionPickFromBarActive);
      item.classList.toggle("pick-selected", missionPickFromBarActive && selected);
      item.classList.toggle("injured", injured);
      item.classList.toggle("eliminated", eliminated);
    });
  }

  function updateMissionBarHint(text) {
    if (missionBarHint) missionBarHint.textContent = text || "";
  }

  function startMissionBarSelection(missionId) {
    const st = activePoints.get(missionId);
    if (!st) return;
    currentMissionId = missionId;
    selectedCharIds = new Set();
    missionPickFromBarActive = true;
    if (missionBarTitle) missionBarTitle.textContent = st.mission?.title || "Misión";
    if (missionBarText) missionBarText.textContent = st.mission?.text || "Selecciona personajes desde la barra inferior.";
    if (missionMapPreviewImg) {
      missionMapPreviewImg.src = st.mission?.img || "images/mision.png";
      missionMapPreviewImg.alt = st.mission?.title || "Misión";
    }
    missionMapPreview?.classList.remove("hidden");
    const maxChars = getMissionMaxChars(st.mission);
    updateMissionBarHint(`Elige al menos 1 personaje (máximo ${maxChars}) desde la barra inferior.`);
    missionBarPicker?.classList.remove("hidden");
    setGlobalPause(true);
    updateTeamBarAvailability();
  }

  function stopMissionBarSelection(resume = true) {
    missionPickFromBarActive = false;
    currentMissionId = null;
    selectedCharIds = new Set();
    missionBarPicker?.classList.add("hidden");
    missionMapPreview?.classList.add("hidden");
    updateMissionBarHint("");
    updateTeamBarAvailability();
    if (resume && !isAnyModalOpen()) setGlobalPause(false);
  }

  function toggleMissionBarCharacter(charId) {
    if (!missionPickFromBarActive || !charId) return;
    const st = currentMissionId ? activePoints.get(currentMissionId) : null;
    if (!st) return;
    const maxChars = getMissionMaxChars(st.mission);
    const isBusy = lockedCharIds.has(charId);

    if (selectedCharIds.has(charId)) {
      selectedCharIds.delete(charId);
      updateMissionBarHint(`Seleccionados: ${selectedCharIds.size}/${maxChars}.`);
      updateTeamBarAvailability();
      return;
    }

    if (isBusy) {
      updateMissionBarHint("Ese personaje está ocupado en otra misión.");
      return;
    }

    if (selectedCharIds.size >= maxChars) {
      updateMissionBarHint("Máximo " + maxChars + " personajes por misión.");
      return;
    }

    selectedCharIds.add(charId);
    updateMissionBarHint(`Seleccionados: ${selectedCharIds.size}/${maxChars}.`);
    updateTeamBarAvailability();
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
      const injured = !!(ch?.id && injuredCharIds.has(ch.id));
      item.innerHTML = `<img class="teambar-img" src="${cardData.img}" alt="${cardData.name}" />${injured ? '<span class="teambar-status teambar-status-injured" title="Herido">🩹</span>' : ""}`;
      item.addEventListener("click", () => {
        if (missionPickFromBarActive) {
          toggleMissionBarCharacter(ch?.id);
          return;
        }
        openCardInfo(cardData);
      });
      teamBar.appendChild(item);
    });

    updateTeamBarAvailability();
  }

  function showGameStatusNotice(message, tone = "warn") {
    if (!gameRoot || !message) return;
    const note = document.createElement("div");
    note.className = `game-status-notice ${tone}`;
    note.textContent = message;
    gameRoot.appendChild(note);
    requestAnimationFrame(() => note.classList.add("show"));
    setTimeout(() => {
      note.classList.remove("show");
      setTimeout(() => note.remove(), 260);
    }, 2200);
  }

  function finishGameNoCharacters() {
    stopGameLoops();
    hideModal(missionModal);
    hideModal(rouletteModal);
    hideModal(cardInfoModal);
    hideModal(specialModal);
    hideModal(effectModal);
    hideModal(tutorialModal);
    hideModal(matchmakingModal);
    hideModal(rivalTeamModal);
    hideModal(storyEntryModal);
    hideModal(storySavePromptModal);
    hideModal(storyLevelUpModal);

    finalTitleEl.textContent = "Fin de la partida";
    if (finalLabelEl) finalLabelEl.textContent = "Misiones completadas";
    finalScoreEl.textContent = String(score);
    const finalText = finalModal.querySelector(".modal-text");
    if (finalText) finalText.textContent = "Te has quedado sin personajes disponibles.";
    setFinalModalPrimaryAction("Volver al menú", () => {
      resetGame();
      currentMode = "arcade";
      selectedMode = "arcade";
      avatarIndex = 0;
      renderAvatarCarousel(0);
      setIntroVisible();
    });

    setGlobalPause(true);
    showModal(finalModal);
  }

  function applyInjuryFromFailedMission(st) {
    const assigned = [...(st?.assignedCharIds || [])].filter((cid) => availableCharacters.some((ch) => ch.id === cid));
    if (!assigned.length) return;

    const injuredId = assigned[randInt(0, assigned.length - 1)];
    if (!injuredId || eliminatedCharIds.has(injuredId)) return;
    const injuredChar = availableCharacters.find((ch) => ch.id === injuredId);
    const injuredName = injuredChar?.name || "Un personaje";
    const femaleNames = new Set(["Winchester", "Jane", "Pendergast", "Friday", "Lisa", "Risko"]);
    const isFemale = femaleNames.has(injuredName);
    const eliminatedText = isFemale ? "ha sido eliminada del combate." : "ha sido eliminado del combate.";
    const injuredText = isFemale ? "ha quedado herida." : "ha quedado herido.";

    if (injuredCharIds.has(injuredId)) {
      injuredCharIds.delete(injuredId);
      eliminatedCharIds.add(injuredId);
      lockedCharIds.delete(injuredId);
      selectedCharIds.delete(injuredId);
      const removedNames = new Set(availableCharacters.filter((ch) => ch.id === injuredId).map((ch) => ch.name));
      availableCharacters = availableCharacters.filter((ch) => ch.id !== injuredId);
      availableCards = availableCards.filter((card) => !removedNames.has(card.name));
      renderTeamBar();
      showGameStatusNotice(`${injuredName} ${eliminatedText}`, "danger");
      if (availableCharacters.length === 0) {
        finishGameNoCharacters();
      }
      return;
    }

    injuredCharIds.add(injuredId);
    updateTeamBarAvailability();
    showGameStatusNotice(`${injuredName} ${injuredText}`, "warn");
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
          matchmakingText.textContent = "Buscando rival online (móvil, ordenador o tablet conectados ahora).";
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
      ? "Buscando rival online (móvil, ordenador o tablet conectados ahora)."
      : `Servidor online no disponible (${versus.wsLastTried[versus.wsLastTried.length - 1] || "sin endpoint WS"}). Reintentando online...`;
    showModal(matchmakingModal);

    const announce = () => {
      if (!versus.wsReady) {
        ensureVersusTransport();
        if (!versus.wsReady) {
          matchmakingText.textContent = `Servidor online no disponible (${versus.wsLastTried[versus.wsLastTried.length - 1] || "sin endpoint WS"}). Reintentando online...`;
        }
      } else {
        matchmakingText.textContent = "Buscando rival online (móvil, ordenador o tablet conectados ahora).";
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
      if (gameRunning) finishVersusGame(false, "Tu rival llegó antes a 8 misiones.");
      return;
    }

    if (msg.type === "vs_leave") {
      if (currentMode !== "versus" || msg.from !== versus.opponentId) return;
      if (gameRunning) finishVersusGame(true, "Tu rival se desconectó.");
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
    if (currentMissionId === missionId && missionPickFromBarActive) {
      stopMissionBarSelection(true);
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
      finishVersusGame(false, "Tu rival llegó antes a 8 misiones.");
    }
  }

  function stopGameLoops() {
    clearInterval(lifeTicker);
    clearTimeout(spawnTimer);
    clearTimeout(storyJackSpawnTimer);
    clearTimeout(storyChapterSplashTimer);
    clearTimeout(trainEffectAlertTimer);
    storyJackSpawnTimer = null;
    storyChapterSplashTimer = null;
    trainEffectAlertTimer = null;
    clearInterval(gameClockTimer);
    clearInterval(trainEffectTimer);
    gameClockTimer = null;
    trainEffectTimer = null;
    trainEffectElapsedSec = 0;
    gameRunning = false;
    updateActiveEffectButton();
    updateTrainEffectCounterUI();
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
    hideModal(effectModal);

    finishArcadeByTime();
  }

  function startGame() {
    teamScreen.classList.add("hidden");
    gameRoot.classList.remove("hidden");
    pickRandomBattleBackground(pendingBattleEffectKey);
    pendingBattleEffectKey = null;

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
    updateActiveEffectButton();
    restartTrainEffectTimer();

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
    point.setAttribute("aria-label", `Misión: ${mission.title}`);

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
    if (options.forceBlue) {
      point.classList.add("special-blue");
    }

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
    if (missionPickFromBarActive) return;
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
    const st = activePoints.get(missionId);

    if (currentMode === "versus") completedMissionIds.add(missionId);
    if (currentMode !== "versus") failedMissionsCount += 1;
    if (st) applyInjuryFromFailedMission(st);
    setScore(SCORE_LOSE);
    releaseCharsForMission(missionId);
    removePoint(missionId);
    updateHud();

    notifyVersusMissionResult(missionId, false);
  }

  function winMission(missionId) {
    if (completedMissionIds.has(missionId)) return;
    const st = activePoints.get(missionId);

    completedMissionIds.add(missionId);
    if (missionId === STORY_JACK_MISSION_ID) storyJackCompleted = true;
    if (st && storyCombatActive) awardStoryMissionSuccessPoints(st);
    if (isBattleEffectActive("castillo") && currentMode !== "versus") {
      setCoins(coins + 5);
      showGameStatusNotice("+5 monedas por completar la misión.", "warn");
    }
    setScore(SCORE_WIN);
    releaseCharsForMission(missionId);
    removePoint(missionId);

    if (currentMode === "versus") {
      localWins += 1;
    } else if (storyCombatActive && storyCombatStage === 2) {
      if (missionId === STORY_JACK_MISSION_ID) {
        showStoryMissionCompletedLayout();
        return;
      }
    } else if (score >= getCurrentArcadeWinTarget()) {
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
    if (gamePaused) {
      spawnTimer = setTimeout(scheduleNextSpawn, 250);
      return;
    }

    if (getRedPointsCount() >= MAX_ACTIVE_POINTS) {
      spawnTimer = setTimeout(scheduleNextSpawn, 800);
      return;
    }

    if (
      storyCombatActive &&
      storyCombatStage === 2 &&
      storyJackUnlocked &&
      STORY_JACK_MISSION &&
      !completedMissionIds.has(STORY_JACK_MISSION_ID) &&
      !activePoints.has(STORY_JACK_MISSION_ID)
    ) {
      createMissionPoint(STORY_JACK_MISSION, { forceBlue: true });
      spawnTimer = setTimeout(scheduleNextSpawn, 500);
      return;
    }

    if (pendingMissions.length === 0) {
      refillPendingMissions();
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
    startMissionBarSelection(missionId);
  }

  function closeMissionModal() {
    hideModal(missionModal);
    stopMissionBarSelection(true);
  }

  function renderCharacters() {
    charactersGrid.innerHTML = "";

    availableCharacters.forEach((ch) => {
      const locked = lockedCharIds.has(ch.id);
      const cardMatch = availableCards.find((c) => c.name === ch.name)
        || CARDS.find((c) => c.name === ch.name)
        || RECRUITABLE_CARDS.find((c) => c.name === ch.name);
      const avatarMatch = AVATARS.find((a) => a.name === ch.name);
      const imgSrc = cardMatch?.img || avatarMatch?.src || "images/mision.png";
      const card = document.createElement("div");
      card.className = "char" + (locked ? " locked" : "");
      card.setAttribute("aria-label", ch.name);
      card.innerHTML = `
        <div class="char-photo-wrap">
          <img class="char-photo" src="${imgSrc}" alt="${ch.name}" />
        </div>
        <div class="pill">${locked ? "Ocupado" : "Elegir"}</div>
      `;

      card.addEventListener("click", () => {
        if (locked) {
          pickHint.textContent = "Ese personaje está ocupado en otra misión.";
          pickHint.style.opacity = "1";
          return;
        }
        toggleCharacter(ch.id, card);
      });

      charactersGrid.appendChild(card);
    });
  }

  function toggleCharacter(charId, cardEl) {
    const st = currentMissionId ? activePoints.get(currentMissionId) : null;
    const maxChars = getMissionMaxChars(st?.mission);

    if (selectedCharIds.has(charId)) {
      selectedCharIds.delete(charId);
      cardEl.classList.remove("selected");
      cardEl.querySelector(".pill").textContent = "Elegir";
      return;
    }

    if (selectedCharIds.size >= maxChars) {
      pickHint.textContent = "Máximo " + maxChars + " personajes por misión.";
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
      updateMissionBarHint("Debes seleccionar al menos 1 personaje.");
      return;
    }

    st.assignedCharIds = new Set(selectedCharIds);
    st.chance = computeChance(st.mission, st.assignedCharIds);

    const maxChars = getMissionMaxChars(st.mission);
    const camus = CHARACTERS.find((ch) => String(ch.name).toLowerCase() === "camus");
    const camusSkillTriggered = !!(
      storyCombatActive &&
      camus &&
      st.assignedCharIds.has(camus.id) &&
      storyProgress.isSkillUnlocked(storyCharacterProgress, camus.id) &&
      st.assignedCharIds.size < maxChars
    );
    if (camusSkillTriggered) {
      showGameStatusNotice("Camus creará una copia de sí mismo para acompañarlo en la misión.", "warn");
    }

    for (const cid of st.assignedCharIds) lockedCharIds.add(cid);
    updateTeamBarAvailability();

    st.phase = "executing";
    st.execRemainingMs = EXECUTION_TIME_MS;
    st.lastTickAt = performance.now();
    st.pointEl.classList.add("assigned");
    st.pointEl.classList.remove("ready");

    stopMissionBarSelection(true);
  }

  function spinRoulette(chance, onDone, forcedWin = null) {
    rouletteOutcome.textContent = "";
    rouletteOkBtn.disabled = true;

    const normalizedChance = clamp(chance, 0, 1);
    const greenPct = normalizedChance * 100;
    const greenDeg = (greenPct / 100) * 360;
    if (rouletteSub) rouletteSub.textContent = "Probabilidad de éxito: " + Math.round(greenPct) + "%";
    if (greenPct >= 100) {
      rouletteWheel.style.background = "var(--ok)";
    } else if (greenPct <= 0) {
      rouletteWheel.style.background = "var(--danger)";
    } else {
      rouletteWheel.style.background = `conic-gradient(from 0deg, var(--ok) 0deg ${greenDeg}deg, var(--danger) ${greenDeg}deg 360deg)`;
    }
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
      rouletteOutcome.textContent = win ? "Éxito" : "Fallo";
      rouletteOutcome.style.color = win ? "var(--ok)" : "var(--danger)";
      rouletteOkBtn.disabled = false;
      onDone(win);
    }, 1900);
  }

  function openRouletteForMission(missionId) {
    const st = activePoints.get(missionId);
    if (!st || st.phase !== "ready") return;

    setGlobalPause(true);
    if (rouletteTitle) rouletteTitle.textContent = "Resolviendo misión: " + (st.mission?.title || "");
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
    if (rouletteTitle) rouletteTitle.textContent = "Resolviendo misión: " + (st.mission?.title || "");
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
        infoText: "Camus era mago de la corte y uno de los hombres de máxima confianza de su majestad, pero, cuando Orión se hizo con el trono, fue declarado traidor a la corona por ser fiel al anterior rey.\n\nUno de los mejores magos de todo el reino, condenado al exilio, ahora se gana la vida como cazafortunas.",
        skillsText: "Sin habilidades actualmente"
      },
      evelyn: {
        infoText: "Evelyn perdió a sus padres a muy temprana edad y se vio obligada a vagar por las calles con la única compañía de su hermano mayor, del que acabó distanciándose con el tiempo.\nActualmente lidera un grupo de mercenarios, fundado por ella misma, conocido con el nombre de Atalaya, que hacen cualquier tipo de trabajo sucio a cambio de dinero, o al menos eso dicen.",
        skillsText: "Pulsa sobre una misión y la completa automáticamente (durante el combate, pulsa sobre Evelyn para activar su habilidad)."
      },
      eliot: {
        infoText: "Desde joven, Eliot destacó en la magia y, a pesar de contar con pocos ingresos, logró formarse como un gran curandero, llegando a formar parte del prestigioso grupo Asclepio, que reúne a los mejores curanderos y magos blancos, como se denominan a los que, como él, se especializan en magia de curación."
      },
      landom: {
        infoText: "Ya desde muy pequeño se movía por ambientes oscuros, destacando y haciéndose famoso por su increíble habilidad con todo tipo de armas blancas. Su situación no mejoró cuando perdió a sus padres ya que, aunque no tenía mucha relación con ellos, le dejaron una hermana pequeña a la que cuidar. Intentando que no siguiera sus pasos, se distanció de ella pero no sirvió de mucho... Experto en liderar con éxito todo tipo de peligrosas misiones, a cambio de una buena suma, no teme a nada ni nadie.",
        skillsText: "Pulsa sobre una misión y la completa automáticamente (durante el combate, pulsa sobre Landom para activar su habilidad)."
      },
      jane: {
        infoText: "Una cazadora que conoce los bosques del reino como la palma de su mano, capaz de entremezclarse con el bosque y fundirse con el viento; no la verás llegar hasta que sea demasiado tarde. Miembro honorífico del grupo de mercenarios Atalaya, con los que colabora asiduamente."
      },
      lisa: {
        infoText: "Lisa creció como una niña normal y corriente y puede decirse que tuvo una infancia feliz. A medida que llegaba a la adultez, iba notando cómo la magia aumentaba en su interior, siendo capaz de canalizarla hacia la luz, negándose a utilizarla con otro fin que no fuera curativo, especializándose así en la llamada magia blanca. Todo esto la llevó a convertirse en una sanadora muy conocida en todo el reino."
      },
      pendergast: {
        infoText: "Proveniente de una familia de inventores y visionarios, no hay cachivache que Pendergast no pueda arreglar ni extraño artilugio que no pueda crear. Fue reclutada por el ejército del Sur cuando era joven, debido a su capacidad de liderazgo y espíritu creativo, pero acabó renunciando ya que los ideales que ellos transmitían no encajaban con los suyos."
      },
      willard: {
        infoText: "Primero de su promoción, este soldado ha vivido más batallas de las que desearía y ha sido condecorado en múltiples ocasiones. Con una puntería excepcional y un amplio entrenamiento en el combate cuerpo a cuerpo, Willard es una auténtica máquina de matar. Él no entiende de bandos, solo de cumplir órdenes."
      },
      winchester: {
        infoText: "Esta guerrera mágica es la mano derecha de Evelyn en el grupo de mercenarios \"Atalaya\". Capaz de rivalizar con cualquier soldado de élite, blande la espada con la misma precisión que un cetro mágico. Sabe mantener la cabeza fría en las situaciones más delicadas y trabajar bajo presión es su especialidad."
      },
      risko: {
        infoText: "Los Pinkerton eran una banda organizada muy conocida en la región. Como una suerte de Robin Hoods, robaban a los ricos para dárselo a los pobres y la población los amaba y temía a partes iguales. Un día que Risko estaba buscando recursos por la zona, su banda, la que hubiera sido su familia durante tanto tiempo, fue masacrada por el ejército del Sur, a modo de advertencia para todo aquel que quisiera tomarse la justicia por su mano. Consumida por la rabia y el dolor, comenzó una cruzada de venganza que solo terminará cuando no quede ni un soldado en pie."
      },
      friday: {
        infoText: "El calendario indicaba que era viernes el día que encontraron a una pequeña niña que no recordaba nada y cuya existencia era un misterio. Criada por una acaudalada familia, Friday estudió en las mejores escuelas y logró entrar en la prestigiosa escuela de aviación donde logró cumplir su sueño de surcar los cielos. Sin embargo, pequeñas visiones la acechan mientras duerme, como si retazos de su pasado la advirtieran de un peligro por llegar."
      }
    };
    const specialInfo = SPECIAL_CARD_INFO[cardName];
    const isWinchester = cardName === "winchester";
    const winchesterAltOwned = purchasedStoreItems.has(WINCHESTER_STORE_ITEM_ID);
    const skillsHtml = storyProgress.getCardSkillsHtml(cardData.name, storyCharacterProgress);
    currentCardInfoData = {
      infoText: specialInfo?.infoText || cardData?.infoText || "En construcción",
      skillsText: specialInfo?.skillsText || cardData?.skillsText || "En construcción",
      skillsHtml,
      outfitsEnabled: isWinchester,
      winchesterAltOwned
    };
    cardInfoTitle.textContent = cardData.name;
    if (cardInfoLevel) {
      const showLevel = isStoryContextVisible();
      if (showLevel) {
        cardInfoLevel.textContent = `Nivel ${storyProgress.getCharacterLevelByName(cardData.name, storyCharacterProgress)}`;
      }
      cardInfoLevel.classList.toggle("hidden", !showLevel);
    }
    cardInfoImg.src = isWinchester ? getWinchesterImage() : cardData.img;
    cardInfoImg.alt = cardData.name;
    cardInfoInfoBtn?.classList.add("active");
    cardInfoSkillsBtn?.classList.remove("active");
    cardInfoOutfitsBtn?.classList.toggle("hidden", !isWinchester);
    cardInfoOutfitsBtn?.classList.remove("active");
    cardInfoOutfitsPanel?.classList.add("hidden");
    if (cardInfoOutfitAltBtn) {
      cardInfoOutfitAltBtn.disabled = !winchesterAltOwned;
      cardInfoOutfitAltBtn.textContent = winchesterAltOwned ? "Caballera Blanca" : "Caballera Blanca (No comprado)";
    }
    if (cardInfoOutfitDefaultBtn) {
      cardInfoOutfitDefaultBtn.classList.toggle("active", selectedWinchesterOutfit !== "alt");
    }
    if (cardInfoOutfitAltBtn) {
      cardInfoOutfitAltBtn.classList.toggle("active", selectedWinchesterOutfit === "alt");
    }
    cardInfoText.textContent = currentCardInfoData.infoText;
    showModal(cardInfoModal);
  }

  function closeCardInfo() {
    currentCardInfoData = null;
    hideModal(cardInfoModal);
    if (!isAnyModalOpen()) setGlobalPause(false);
  }

  function openEffectInfoModal() {
    const effect = getActiveBattleEffect();
    if (!effect) return;
    if (effectTitle) effectTitle.textContent = `Efecto activo ${effect.place}`;
    if (effectText) effectText.textContent = effect.description;
    setGlobalPause(true);
    showModal(effectModal);
  }

  function closeEffectInfoModal() {
    hideModal(effectModal);
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
    if (finalLabelEl) finalLabelEl.textContent = "Puntuación final";
    finalScoreEl.textContent = String(score);
    setFinalModalPrimaryAction("Jugar otra vez", null);
    setGlobalPause(true);
    showModal(finalModal);
  }

  function finishArcadeVictory() {
    if (storyMapBattleActive) {
      completeStoryMapBattle(currentStoryMapPointId);
      return;
    }
    if (storyCombatActive) {
      if (storyCombatStage === 2) {
        showStoryMissionCompletedLayout();
        return;
      }
      showStoryTutorialCompletedLayout();
      return;
    }

    stopGameLoops();

    hideModal(missionModal);
    hideModal(rouletteModal);
    hideModal(cardInfoModal);
    hideModal(specialModal);
    hideModal(effectModal);

    finalTitleEl.textContent = "Victoria";
    const finalText = finalModal.querySelector(".modal-text");
    if (finalText) finalText.textContent = "Has completado 8 misiones con éxito.";
    if (finalLabelEl) finalLabelEl.textContent = "Puntuación final";
    finalScoreEl.textContent = String(score);
    setFinalModalPrimaryAction("Jugar otra vez", null);
    setGlobalPause(true);
    showModal(finalModal);
  }

  function finishVersusGame(isWinner, reason) {
    stopGameLoops();

    hideModal(missionModal);
    hideModal(rouletteModal);
    hideModal(cardInfoModal);
    hideModal(specialModal);
    hideModal(effectModal);

    finalTitleEl.textContent = isWinner ? "Victoria" : "Derrota";
    if (finalLabelEl) finalLabelEl.textContent = "Puntuación final";
    finalScoreEl.textContent = `${localWins} - ${rivalWins}`;

    const finalText = finalModal.querySelector(".modal-text");
    if (finalText) finalText.textContent = reason;

    if (versus.opponentId) {
      versusSend({ type: "vs_match_end", from: versus.clientId, to: versus.opponentId, ts: Date.now() });
    }

    setFinalModalPrimaryAction("Jugar otra vez", null);
    setGlobalPause(true);
    showModal(finalModal);
  }

  function resetGame() {
    hideModal(missionModal);
    hideModal(rouletteModal);
    hideModal(finalModal);
    hideModal(cardInfoModal);
    hideModal(specialModal);
    hideModal(effectModal);
    hideModal(tutorialModal);
    hideModal(matchmakingModal);
    hideModal(rivalTeamModal);
    hideModal(storyLevelUpModal);
    hideModal(storyChapterSplashModal);

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
    injuredCharIds = new Set();
    eliminatedCharIds = new Set();

    currentMissionId = null;
    selectedCharIds = new Set();
    missionPickFromBarActive = false;
    missionBarPicker?.classList.add("hidden");

    specialUsed = false;
    specialArmed = false;
    setSpecialArmedUI(false);
    tutorialPending = false;
    tutorialStep = 0;
    storyLevelUpQueue = [];
    storyJackUnlocked = false;
    storyJackCompleted = false;
    storyMapBattleActive = false;
    currentStoryMapPointId = null;
    activeBattleEffect = null;
    pendingBattleEffectKey = null;
    storyCombatStartAt = 0;
    failedMissionsCount = 0;
    finalModalPrimaryAction = null;

    if (teamBar) teamBar.innerHTML = "";
    const finalText = finalModal.querySelector(".modal-text");
    if (finalText) finalText.textContent = "¡Tiempo!";
    if (finalLabelEl) finalLabelEl.textContent = "Puntuación final";
    if (playAgainBtn) playAgainBtn.textContent = "Jugar otra vez";

    clearMatchmakingState();

    versus.opponentId = null;
    versus.opponentProfile = null;
    versus.isSpawnHost = false;
    versus.matchId = null;
    if (rivalImg) rivalImg.classList.add("hidden");

    updateHud();
    mapEl?.classList.remove("points-hidden");
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

  recruitStoreGrid?.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const btn = target.closest(".recruit-buy-btn");
    if (!(btn instanceof HTMLButtonElement)) return;
    const charId = String(btn.getAttribute("data-char-id") || "");
    if (!charId) return;
    buyRecruitCharacter(charId);
  });
  recruitBackBtn?.addEventListener("click", setIntroVisible);
  storeBackBtn?.addEventListener("click", setIntroVisible);
  storeBuyWinchesterBtn?.addEventListener("click", buyWinchesterOutfit);
  userAvatarToggleBtn?.addEventListener("click", toggleUserAvatarPicker);
  userNameEditBtn?.addEventListener("pointerdown", (e) => {
    if (isEditingUserName) e.preventDefault();
  });
  userNameEditBtn?.addEventListener("click", () => {
    if (isEditingUserName) {
      endUserNameEdit(true);
      return;
    }
    beginUserNameEdit();
  });
  userNameInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      endUserNameEdit(true);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      endUserNameEdit(false);
    }
  });
  userNameInput?.addEventListener("input", () => {
    if (!isEditingUserName) return;
    const preview = normalizeUserProfileName(userNameInput.value);
    setUserProfileName(preview);
  });
  userNameInput?.addEventListener("blur", () => {
    if (isEditingUserName) endUserNameEdit(true);
  });
  storyNextBtn?.addEventListener("click", nextStoryStep);
  storyMenuBtn?.addEventListener("click", setIntroVisible);
  storySkipBtn?.addEventListener("click", skipStoryPhase);
  userBackBtn?.addEventListener("click", setIntroVisible);

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.id === "introMenuImg" || target.id === "introMenuFallback") activateIntroMenuOption();
  });

  prevAvatarBtn.addEventListener("click", prevAvatar);
  nextAvatarBtn.addEventListener("click", nextAvatar);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (missionPickFromBarActive) {
        e.preventDefault();
        stopMissionBarSelection(true);
        return;
      }
      if (specialModal.classList.contains("show")) {
        e.preventDefault();
        cancelSpecial();
        return;
      }
      if (effectModal?.classList.contains("show")) {
        e.preventDefault();
        closeEffectInfoModal();
        return;
      }
      if (cardInfoModal.classList.contains("show")) {
        e.preventDefault();
        closeCardInfo();
        return;
      }
      if (missionModal.classList.contains("show")) {
        e.preventDefault();
        closeMissionModal();
        return;
      }
      if (rivalTeamModal.classList.contains("show")) {
        e.preventDefault();
        hideModal(rivalTeamModal);
        if (!isAnyModalOpen()) setGlobalPause(false);
        return;
      }
      if (tutorialModal.classList.contains("show")) {
        e.preventDefault();
        hideModal(tutorialModal);
        tutorialPending = false;
        tutorialStep = 0;
        if (tutorialReturnToAvatar) {
          tutorialReturnToAvatar = false;
          backToAvatarSelection();
        }
        if (!isAnyModalOpen()) setGlobalPause(false);
        return;
      }
      if (matchmakingModal.classList.contains("show")) {
        e.preventDefault();
        clearMatchmakingState();
        hideModal(matchmakingModal);
        return;
      }
      if (storySavePromptModal?.classList.contains("show")) {
        e.preventDefault();
        hideModal(storySavePromptModal);
        return;
      }
      if (storyLevelUpModal?.classList.contains("show")) {
        e.preventDefault();
        closeStoryLevelUpModal();
        return;
      }
      if (storyEntryModal?.classList.contains("show")) {
        e.preventDefault();
        hideModal(storyEntryModal);
        return;
      }
    }

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
  startTutorialBtn?.addEventListener("click", () => {
    tutorialReturnToAvatar = true;
    startTutorial();
  });

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
  missionBarCancelBtn?.addEventListener("click", () => stopMissionBarSelection(true));
  missionBarConfirmBtn?.addEventListener("click", confirmMission);

  closeCardInfoBtn?.addEventListener("click", closeCardInfo);
  cardInfoInfoBtn?.addEventListener("click", () => {
    if (!currentCardInfoData) return;
    cardInfoInfoBtn.classList.add("active");
    cardInfoSkillsBtn?.classList.remove("active");
    cardInfoOutfitsBtn?.classList.remove("active");
    cardInfoOutfitsPanel?.classList.add("hidden");
    cardInfoText.textContent = currentCardInfoData.infoText;
  });
  cardInfoSkillsBtn?.addEventListener("click", () => {
    if (!currentCardInfoData) return;
    cardInfoSkillsBtn.classList.add("active");
    cardInfoInfoBtn?.classList.remove("active");
    cardInfoOutfitsBtn?.classList.remove("active");
    cardInfoOutfitsPanel?.classList.add("hidden");
    if (currentCardInfoData.skillsHtml) {
      cardInfoText.innerHTML = currentCardInfoData.skillsHtml;
    } else {
      cardInfoText.textContent = currentCardInfoData.skillsText;
    }
  });
  cardInfoOutfitsBtn?.addEventListener("click", () => {
    if (!currentCardInfoData?.outfitsEnabled) return;
    cardInfoOutfitsBtn.classList.add("active");
    cardInfoInfoBtn?.classList.remove("active");
    cardInfoSkillsBtn?.classList.remove("active");
    cardInfoOutfitsPanel?.classList.remove("hidden");
    cardInfoText.textContent = currentCardInfoData.winchesterAltOwned
      ? "Elige el atuendo que quieres usar en el juego."
      : "Aún no has comprado el atuendo alternativo en la tienda.";
  });
  cardInfoOutfitDefaultBtn?.addEventListener("click", () => {
    setWinchesterOutfit("default");
    cardInfoImg.src = getWinchesterImage();
    cardInfoOutfitDefaultBtn.classList.add("active");
    cardInfoOutfitAltBtn?.classList.remove("active");
  });
  cardInfoOutfitAltBtn?.addEventListener("click", () => {
    if (!purchasedStoreItems.has(WINCHESTER_STORE_ITEM_ID)) return;
    setWinchesterOutfit("alt");
    cardInfoImg.src = getWinchesterImage();
    cardInfoOutfitAltBtn.classList.add("active");
    cardInfoOutfitDefaultBtn?.classList.remove("active");
  });
  cardInfoModal.addEventListener("click", (e) => { if (e.target === cardInfoModal) closeCardInfo(); });

  closeSpecialBtn.addEventListener("click", cancelSpecial);
  specialCancelBtn.addEventListener("click", cancelSpecial);
  specialAcceptBtn.addEventListener("click", acceptSpecial);
  specialModal.addEventListener("click", (e) => { if (e.target === specialModal) cancelSpecial(); });
  activeEffectBtn?.addEventListener("click", openEffectInfoModal);
  storySkipBattleBtn?.addEventListener("click", skipCurrentStoryBattle);
  closeEffectBtn?.addEventListener("click", closeEffectInfoModal);
  effectOkBtn?.addEventListener("click", closeEffectInfoModal);
  effectModal?.addEventListener("click", (e) => {
    if (e.target === effectModal) closeEffectInfoModal();
  });
  tutorialNextBtn?.addEventListener("click", nextTutorialStep);
  storyNewGameBtn?.addEventListener("click", () => {
    hideModal(storyEntryModal);
    goToStoryScreen();
  });
  storyContinueBtn?.addEventListener("click", () => {
    hideModal(storyEntryModal);
    if (!continueStoryFromSnapshot()) goToStoryScreen();
  });
  storyLoadGameBtn?.addEventListener("click", toggleStoryLoadPanel);
  storyEntryBackBtn?.addEventListener("click", () => hideModal(storyEntryModal));
  storyEntryModal?.addEventListener("click", (e) => {
    if (e.target === storyEntryModal) hideModal(storyEntryModal);
  });
  storySaveLaterBtn?.addEventListener("click", () => hideModal(storySavePromptModal));
  storySaveNowBtn?.addEventListener("click", () => {
    const slotIndex = saveStoryProgress("Tras batalla del tutorial");
    if (storySavePromptText) {
      storySavePromptText.textContent = `Partida guardada en Archivo ${slotIndex + 1}.`;
    }
    renderStoryLoadSlots();
    setTimeout(() => {
      hideModal(storySavePromptModal);
      if (storySavePromptText) storySavePromptText.textContent = "¿Quieres guardar partida?";
    }, 800);
  });
  storySavePromptModal?.addEventListener("click", (e) => {
    if (e.target === storySavePromptModal) hideModal(storySavePromptModal);
  });
  storyLevelUpOkBtn?.addEventListener("click", closeStoryLevelUpModal);
  storyLevelUpModal?.addEventListener("click", (e) => {
    if (e.target === storyLevelUpModal) closeStoryLevelUpModal();
  });

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
    if (finalModalPrimaryAction) {
      const action = finalModalPrimaryAction;
      finalModalPrimaryAction = null;
      hideModal(finalModal);
      action();
      return;
    }
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
    if (isStoryContextVisible()) saveStoryContinueSnapshot();
    if (versus.opponentId) {
      versusSend({ type: "vs_leave", from: versus.clientId, to: versus.opponentId, ts: Date.now() });
    }
  });

  setInterval(() => {
    if (isStoryContextVisible()) saveStoryContinueSnapshot();
  }, 2500);

  renderAvatarCarousel(0);
  renderIntroMenu(0);
  setCoins(loadCoins());
  normalizeWinchesterOutfit();
  renderStore();
  renderRecruitShop();
  setUserProfileAvatar(loadUserProfileAvatar() || DEFAULT_PROFILE_AVATAR_SRC);
  const initialProfileName = normalizeUserProfileName(loadUserProfileName() || DEFAULT_PROFILE_NAME);
  setUserProfileName(initialProfileName);
  persistUserProfileName(initialProfileName);
  updateHud();
  ensureVersusTransport();
});
