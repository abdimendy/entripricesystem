const ICON_MAP = {
  hotel: { emoji: '🏨', gradient: 'from-sky-400 via-blue-500 to-indigo-600' },
  hospital: { emoji: '🏥', gradient: 'from-rose-400 via-red-500 to-pink-600' },
  healthcare: { emoji: '🏥', gradient: 'from-rose-400 via-red-500 to-pink-600' },
  school: { emoji: '🏫', gradient: 'from-violet-400 via-purple-500 to-fuchsia-600' },
  education: { emoji: '🎓', gradient: 'from-violet-400 via-purple-500 to-fuchsia-600' },
  university: { emoji: '🎓', gradient: 'from-indigo-400 via-violet-500 to-purple-600' },
  restaurant: { emoji: '🍽️', gradient: 'from-orange-400 via-amber-500 to-yellow-500' },
  bank: { emoji: '🏦', gradient: 'from-emerald-400 via-teal-500 to-cyan-600' },
  banking: { emoji: '🏦', gradient: 'from-emerald-400 via-teal-500 to-cyan-600' },
  pharmacy: { emoji: '💊', gradient: 'from-green-400 via-emerald-500 to-teal-600' },
  telecom: { emoji: '📡', gradient: 'from-cyan-400 via-sky-500 to-blue-600' },
  transport: { emoji: '🚗', gradient: 'from-slate-500 via-zinc-600 to-stone-700' },
  supermarket: { emoji: '🛒', gradient: 'from-lime-400 via-green-500 to-emerald-600' },
  retail: { emoji: '🛍️', gradient: 'from-pink-400 via-rose-500 to-red-500' },
  services: { emoji: '🔧', gradient: 'from-amber-400 via-orange-500 to-red-500' },
  sports: { emoji: '⚽', gradient: 'from-lime-400 via-green-500 to-emerald-600' },
};

const DEFAULT = { emoji: '📒', gradient: 'from-yellow-400 via-amber-500 to-orange-500' };

export function getCategoryStyle(category) {
  const key = category?.icon?.toLowerCase?.();
  if (key && ICON_MAP[key]) return ICON_MAP[key];

  const name = (category?.name || '').toLowerCase();
  for (const [k, style] of Object.entries(ICON_MAP)) {
    if (name.includes(k)) return style;
  }
  return DEFAULT;
}

export function getCategoryIcon(category) {
  return getCategoryStyle(category).emoji;
}
