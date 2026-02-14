(() => {
  function createStoryMapFlowModule() {
    const TIERS = [
      [
        { id: "m1", x: 22, y: 16 },
        { id: "m2", x: 50, y: 18 },
        { id: "m3", x: 78, y: 16 }
      ],
      [
        { id: "m4", x: 24, y: 38 },
        { id: "m5", x: 50, y: 40 },
        { id: "m6", x: 76, y: 38 }
      ],
      [
        { id: "m7", x: 26, y: 60 },
        { id: "m8", x: 50, y: 62 },
        { id: "m9", x: 74, y: 60 }
      ]
    ];

    const BOSS = { id: "boss", x: 50, y: 84 };
    const POINTS = [...TIERS.flat(), BOSS];

    function createInitialState() {
      return {
        tierIndex: 0,
        completedIds: [],
        bossUnlocked: false,
        bossCompleted: false
      };
    }

    function normalizeState(raw) {
      const base = createInitialState();
      if (!raw || typeof raw !== "object") return base;
      const validIds = new Set(POINTS.map((p) => p.id));
      const completed = Array.isArray(raw.completedIds)
        ? raw.completedIds.filter((id) => validIds.has(id))
        : [];
      const tierIndexRaw = Number(raw.tierIndex);
      const tierIndex = Number.isFinite(tierIndexRaw) ? Math.max(0, Math.min(TIERS.length, Math.floor(tierIndexRaw))) : 0;
      const bossUnlocked = !!raw.bossUnlocked || tierIndex >= TIERS.length;
      const bossCompleted = !!raw.bossCompleted || completed.includes(BOSS.id);
      return {
        tierIndex,
        completedIds: [...new Set(completed)],
        bossUnlocked,
        bossCompleted
      };
    }

    function getPoints() {
      return POINTS.map((p) => ({ ...p }));
    }

    function getTierIndexForPoint(pointId) {
      for (let i = 0; i < TIERS.length; i++) {
        if (TIERS[i].some((p) => p.id === pointId)) return i;
      }
      return -1;
    }

    function isPointCompleted(state, pointId) {
      return state.completedIds.includes(pointId);
    }

    function isPointUnlocked(state, pointId) {
      if (pointId === BOSS.id) return !!state.bossUnlocked;
      const tier = getTierIndexForPoint(pointId);
      if (tier < 0) return false;
      return tier === state.tierIndex && !isPointCompleted(state, pointId);
    }

    function completePoint(inputState, pointId) {
      const state = normalizeState(inputState);
      if (state.bossCompleted) return state;
      if (!POINTS.some((p) => p.id === pointId)) return state;
      if (state.completedIds.includes(pointId)) return state;

      const next = {
        ...state,
        completedIds: [...state.completedIds, pointId]
      };

      if (pointId === BOSS.id) {
        next.bossCompleted = true;
        next.bossUnlocked = true;
        return next;
      }

      const currentTier = TIERS[state.tierIndex] || [];
      const tierCompleted = currentTier.length > 0 && currentTier.every((p) => next.completedIds.includes(p.id));
      if (tierCompleted) {
        next.tierIndex = Math.min(TIERS.length, state.tierIndex + 1);
        if (next.tierIndex >= TIERS.length) next.bossUnlocked = true;
      }
      return next;
    }

    function getRouteProgress(state) {
      const normalized = normalizeState(state);
      if (normalized.bossCompleted) return 1;
      if (normalized.bossUnlocked) return 0.88;
      const step = Math.max(0, Math.min(TIERS.length, normalized.tierIndex));
      return step / TIERS.length;
    }

    return {
      createInitialState,
      normalizeState,
      getPoints,
      isPointUnlocked,
      isPointCompleted,
      completePoint,
      getRouteProgress
    };
  }

  window.createStoryMapFlowModule = createStoryMapFlowModule;
})();
