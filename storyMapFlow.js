(() => {
  function createStoryMapFlowModule() {
    const TIERS = [
      [
        { id: "m1", x: 22, y: 78 },
        { id: "m2", x: 50, y: 80 },
        { id: "m3", x: 78, y: 78 }
      ],
      [
        { id: "m4", x: 24, y: 56 },
        { id: "m5", x: 50, y: 58 },
        { id: "m6", x: 76, y: 56 }
      ],
      [
        { id: "m7", x: 26, y: 34 },
        { id: "m8", x: 50, y: 36 },
        { id: "m9", x: 74, y: 34 }
      ]
    ];

    const BOSS = { id: "boss", x: 50, y: 16 };
    const POINTS = [...TIERS.flat(), BOSS];

    function createInitialState() {
      return {
        tierIndex: 0,
        completedIds: [],
        chosenByTier: Array.from({ length: TIERS.length }, () => null),
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
      const chosenByTierRaw = Array.isArray(raw.chosenByTier) ? raw.chosenByTier : [];
      const chosenByTier = Array.from({ length: TIERS.length }, (_, idx) => {
        const id = chosenByTierRaw[idx];
        return validIds.has(id) ? id : null;
      });
      const tierIndexRaw = Number(raw.tierIndex);
      const tierIndex = Number.isFinite(tierIndexRaw) ? Math.max(0, Math.min(TIERS.length, Math.floor(tierIndexRaw))) : 0;
      const bossUnlocked = !!raw.bossUnlocked || tierIndex >= TIERS.length;
      const bossCompleted = !!raw.bossCompleted || completed.includes(BOSS.id);
      return {
        tierIndex,
        completedIds: [...new Set(completed)],
        chosenByTier,
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

      const tier = getTierIndexForPoint(pointId);
      if (tier >= 0) next.chosenByTier[tier] = pointId;
      const currentTier = TIERS[state.tierIndex] || [];
      const tierIds = currentTier.map((p) => p.id);
      next.completedIds = [...new Set([...next.completedIds, ...tierIds])];
      next.tierIndex = Math.min(TIERS.length, state.tierIndex + 1);
      if (next.tierIndex >= TIERS.length) next.bossUnlocked = true;
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
      getTiers: () => TIERS.map((tier) => tier.map((p) => ({ ...p }))),
      getBoss: () => ({ ...BOSS }),
      getTierIndexForPoint,
      isPointUnlocked,
      isPointCompleted,
      completePoint,
      getRouteProgress
    };
  }

  window.createStoryMapFlowModule = createStoryMapFlowModule;
})();
