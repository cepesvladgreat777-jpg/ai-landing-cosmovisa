export const SCREENSAVER_TIMING = {
  firstIdleMs: 5_000,
  repeatIdleMs: 5 * 60 * 1_000,
} as const;

export const SCREENSAVER_COPY = {
  label: 'Режим ожидания Cosmovisa',
  activate: 'Щёлкните по экрану мышкой, чтобы перейти в активный режим',
} as const;
