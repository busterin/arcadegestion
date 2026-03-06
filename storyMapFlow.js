(() => {
  function createStoryMapFlowModule() {
    const LAYOUTS = {
      map1: {
        id: "map1",
        tiers: [
          [
            { id: "m1", x: 38, y: 76 },
            { id: "m2", x: 50, y: 78 },
            { id: "m3", x: 62, y: 76 }
          ],
          [
            { id: "m4", x: 38, y: 52 },
            { id: "m5", x: 50, y: 54 },
            { id: "m6", x: 62, y: 52 }
          ],
          [
            { id: "m7", x: 38, y: 28 },
            { id: "m8", x: 50, y: 30 },
            { id: "m9", x: 62, y: 28 }
          ]
        ],
        boss: { id: "boss", x: 50, y: 10 },
        mapHeightUnits: 100
      },
      map2: {
        id: "map2",
        tiers: [
          [
            { id: "m1", x: 20, y: 156 },
            { id: "m2", x: 40, y: 160 },
            { id: "m3", x: 60, y: 160 },
            { id: "m4", x: 80, y: 156 }
          ],
          [
            { id: "m5", x: 20, y: 128 },
            { id: "m6", x: 40, y: 132 },
            { id: "m7", x: 60, y: 132 },
            { id: "m8", x: 80, y: 128 }
          ],
          [
            { id: "m9", x: 20, y: 100 },
            { id: "m10", x: 40, y: 104 },
            { id: "m11", x: 60, y: 104 },
            { id: "m12", x: 80, y: 100 }
          ],
          [
            { id: "m13", x: 20, y: 72 },
            { id: "m14", x: 40, y: 76 },
            { id: "m15", x: 60, y: 76 },
            { id: "m16", x: 80, y: 72 }
          ],
          [
            { id: "m17", x: 20, y: 44 },
            { id: "m18", x: 40, y: 48 },
            { id: "m19", x: 60, y: 48 },
            { id: "m20", x: 80, y: 44 }
          ]
        ],
        boss: { id: "boss", x: 50, y: 16 },
        mapHeightUnits: 170
      }
    };

    function getLayout(input) {
      if (typeof input === "string" && LAYOUTS[input]) return LAYOUTS[input];
      if (input && typeof input === "object") {
        const rawId = String(input.layoutId || "");
        if (LAYOUTS[rawId]) return LAYOUTS[rawId];
      }
      return LAYOUTS.map1;
    }

    function getLayoutPoints(layout) {
      return [...layout.tiers.flat(), layout.boss];
    }

    function createInitialState(layoutId = "map1") {
      const layout = getLayout(layoutId);
      return {
        layoutId: layout.id,
        tierIndex: 0,
        completedIds: [],
        chosenByTier: Array.from({ length: layout.tiers.length }, () => null),
        bossUnlocked: false,
        bossCompleted: false
      };
    }

    function normalizeState(raw) {
      const inferredLayout = getLayout(raw);
      const base = createInitialState(inferredLayout.id);
      if (!raw || typeof raw !== "object") return base;
      const points = getLayoutPoints(inferredLayout);
      const validIds = new Set(points.map((p) => p.id));
      const completed = Array.isArray(raw.completedIds)
        ? raw.completedIds.filter((id) => validIds.has(id))
        : [];
      const chosenByTierRaw = Array.isArray(raw.chosenByTier) ? raw.chosenByTier : [];
      const chosenByTier = Array.from({ length: inferredLayout.tiers.length }, (_, idx) => {
        const id = chosenByTierRaw[idx];
        if (!validIds.has(id)) return null;
        const tierPointIds = new Set((inferredLayout.tiers[idx] || []).map((point) => point.id));
        return tierPointIds.has(id) ? id : null;
      });
      const tierIndexRaw = Number(raw.tierIndex);
      const tierIndex = Number.isFinite(tierIndexRaw)
        ? Math.max(0, Math.min(inferredLayout.tiers.length, Math.floor(tierIndexRaw)))
        : 0;
      const contiguousTierProgress = (() => {
        let idx = 0;
        while (idx < inferredLayout.tiers.length && chosenByTier[idx]) idx += 1;
        return idx;
      })();
      const normalizedTierIndex = Math.min(tierIndex, contiguousTierProgress);
      for (let i = normalizedTierIndex; i < chosenByTier.length; i++) {
        chosenByTier[i] = null;
      }
      const bossUnlocked = !!raw.bossUnlocked || normalizedTierIndex >= inferredLayout.tiers.length;
      const bossCompleted = !!raw.bossCompleted || completed.includes(inferredLayout.boss.id);
      return {
        layoutId: inferredLayout.id,
        tierIndex: normalizedTierIndex,
        completedIds: [...new Set(completed)],
        chosenByTier,
        bossUnlocked: !!bossUnlocked || normalizedTierIndex >= inferredLayout.tiers.length,
        bossCompleted
      };
    }

    function getPoints(stateOrLayout) {
      const layout = getLayout(stateOrLayout);
      return getLayoutPoints(layout).map((p) => ({ ...p }));
    }

    function getTiers(stateOrLayout) {
      const layout = getLayout(stateOrLayout);
      return layout.tiers.map((tier) => tier.map((p) => ({ ...p })));
    }

    function getBoss(stateOrLayout) {
      const layout = getLayout(stateOrLayout);
      return { ...layout.boss };
    }

    function getMapHeightUnits(stateOrLayout) {
      const layout = getLayout(stateOrLayout);
      return Math.max(100, Number(layout.mapHeightUnits) || 100);
    }

    function getLayoutId(state) {
      return getLayout(state).id;
    }

    function getTierIndexForPoint(stateOrLayout, pointId) {
      const layout = getLayout(stateOrLayout);
      for (let i = 0; i < layout.tiers.length; i++) {
        if (layout.tiers[i].some((p) => p.id === pointId)) return i;
      }
      return -1;
    }

    function getTierPointIndex(stateOrLayout, pointId) {
      const layout = getLayout(stateOrLayout);
      const tier = getTierIndexForPoint(layout, pointId);
      if (tier < 0) return -1;
      return layout.tiers[tier].findIndex((p) => p.id === pointId);
    }

    function getAllowedNextIndices(stateOrLayout, fromIndex) {
      const layout = getLayout(stateOrLayout);
      const width = Math.max(1, (layout.tiers[0] || []).length);
      const out = [];
      for (let idx = Math.max(0, fromIndex - 1); idx <= Math.min(width - 1, fromIndex + 1); idx++) {
        out.push(idx);
      }
      return out;
    }

    function isPointCompleted(inputState, pointId) {
      const state = normalizeState(inputState);
      return state.completedIds.includes(pointId);
    }

    function isPointUnlocked(inputState, pointId) {
      const state = normalizeState(inputState);
      const layout = getLayout(state);
      if (pointId === layout.boss.id) return !!state.bossUnlocked;
      const tier = getTierIndexForPoint(state, pointId);
      if (tier < 0) return false;
      if (tier !== state.tierIndex || isPointCompleted(state, pointId)) return false;
      if (tier === 0) return true;

      const prevChosenId = Array.isArray(state.chosenByTier) ? state.chosenByTier[tier - 1] : null;
      if (!prevChosenId) return false;
      const prevIdx = getTierPointIndex(state, prevChosenId);
      const idx = getTierPointIndex(state, pointId);
      if (prevIdx < 0 || idx < 0) return false;
      return getAllowedNextIndices(state, prevIdx).includes(idx);
    }

    function completePoint(inputState, pointId) {
      const state = normalizeState(inputState);
      const layout = getLayout(state);
      if (state.bossCompleted) return state;
      const points = getLayoutPoints(layout);
      if (!points.some((p) => p.id === pointId)) return state;
      if (state.completedIds.includes(pointId)) return state;

      const next = {
        ...state,
        completedIds: [...state.completedIds, pointId]
      };

      if (pointId === layout.boss.id) {
        next.bossCompleted = true;
        next.bossUnlocked = true;
        return next;
      }

      const tier = getTierIndexForPoint(state, pointId);
      if (tier >= 0) next.chosenByTier[tier] = pointId;
      const currentTier = layout.tiers[state.tierIndex] || [];
      const tierIds = currentTier.map((p) => p.id);
      next.completedIds = [...new Set([...next.completedIds, ...tierIds])];
      next.tierIndex = Math.min(layout.tiers.length, state.tierIndex + 1);
      if (next.tierIndex >= layout.tiers.length) next.bossUnlocked = true;
      return next;
    }

    function getRouteProgress(inputState) {
      const state = normalizeState(inputState);
      const layout = getLayout(state);
      if (state.bossCompleted) return 1;
      if (state.bossUnlocked) return 0.88;
      const step = Math.max(0, Math.min(layout.tiers.length, state.tierIndex));
      return step / layout.tiers.length;
    }

    return {
      createInitialState,
      normalizeState,
      getPoints,
      getTiers,
      getBoss,
      getMapHeightUnits,
      getLayoutId,
      getTierIndexForPoint,
      isPointUnlocked,
      isPointCompleted,
      completePoint,
      getRouteProgress
    };
  }

  window.createStoryMapFlowModule = createStoryMapFlowModule;
})();
