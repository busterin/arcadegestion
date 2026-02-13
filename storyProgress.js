(function () {
  function escapeHtml(raw) {
    return String(raw || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  window.createStoryProgressModule = function createStoryProgressModule(config) {
    const characters = Array.isArray(config?.characters) ? config.characters : [];
    const recruitableCharacters = Array.isArray(config?.recruitableCharacters) ? config.recruitableCharacters : [];
    const cards = Array.isArray(config?.cards) ? config.cards : [];
    const recruitableCards = Array.isArray(config?.recruitableCards) ? config.recruitableCards : [];
    const avatars = Array.isArray(config?.avatars) ? config.avatars : [];

    const allCharacters = [...characters, ...recruitableCharacters];

    const PASSIVE_SKILLS = {
      c7: {
        name: "Organizar la retaguardia",
        description: "Los personajes con etiqueta a distancia aumentan +20% su probabilidad de éxito si van acompañados de Jane."
      },
      c1: {
        name: "Guerrera solitaria",
        description: "Si Winchester va sola a una misión y tiene éxito, obtiene el doble de experiencia."
      },
      c3: {
        name: "Doppelganger",
        description: "Si Camus va a una misión y quedan huecos libres, crea copias para ocuparlos con sus mismos atributos."
      }
    };

    function createInitialProgress() {
      const base = {};
      allCharacters.forEach((ch) => {
        base[ch.id] = { points: 0, level: 1 };
      });
      return base;
    }

    function normalizeProgress(raw) {
      const base = createInitialProgress();
      if (!raw || typeof raw !== "object") return base;

      Object.keys(base).forEach((charId) => {
        const points = Number(raw?.[charId]?.points);
        const level = Number(raw?.[charId]?.level);
        const safePoints = Number.isFinite(points) ? Math.max(0, Math.floor(points)) : 0;
        const derivedLevel = Math.floor(safePoints / 3) + 1;
        const safeLevel = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : derivedLevel;
        base[charId] = {
          points: safePoints,
          level: Math.max(safeLevel, derivedLevel)
        };
      });
      return base;
    }

    function getCharacterByName(name) {
      const target = String(name || "").trim().toLowerCase();
      if (!target) return null;
      return allCharacters.find((item) => item.name.toLowerCase() === target) || null;
    }

    function getCharacterDisplayById(charId) {
      const ch = allCharacters.find((item) => item.id === charId);
      if (!ch) return { name: "Personaje", img: "images/mision.png" };
      const card = [...cards, ...recruitableCards].find((item) => item.name === ch.name);
      const avatar = avatars.find((item) => item.name === ch.name);
      const img = card?.img || avatar?.accountSrc || avatar?.src || "images/mision.png";
      return { name: ch.name, img };
    }

    function isSkillUnlocked(progress, charId) {
      const level = Number(progress?.[charId]?.level);
      return Number.isFinite(level) && level >= 2;
    }

    function hasPassiveSkill(charId) {
      return !!PASSIVE_SKILLS[charId];
    }

    function getCardSkillsHtml(cardName, progress) {
      const ch = getCharacterByName(cardName);
      const passive = ch ? PASSIVE_SKILLS[ch.id] : null;
      if (!passive) return null;
      const unlocked = isSkillUnlocked(progress, ch.id);
      return `
        <div class="card-skills">
          <article class="card-skill${unlocked ? "" : " locked"}">
            <div class="card-skill-name">${escapeHtml(passive.name)}</div>
            <div class="card-skill-state">${unlocked ? "Desbloqueada" : "Bloqueada (se desbloquea en Nivel 2)"}</div>
            <div class="card-skill-desc">${escapeHtml(passive.description)}</div>
          </article>
        </div>
      `;
    }

    function getCharacterLevelByName(name, progress) {
      const ch = getCharacterByName(name);
      if (!ch) return 1;
      const level = Number(progress?.[ch.id]?.level);
      return Number.isFinite(level) && level >= 1 ? Math.floor(level) : 1;
    }

    function getPassiveSkills() {
      return PASSIVE_SKILLS;
    }

    return {
      createInitialProgress,
      normalizeProgress,
      getCharacterByName,
      getCharacterDisplayById,
      isSkillUnlocked,
      hasPassiveSkill,
      getCardSkillsHtml,
      getCharacterLevelByName,
      getPassiveSkills
    };
  };
})();
