const THEME_KEY = (userId) => `theme:${userId}`;

export function setUserTheme(userId, theme) {
  localStorage.setItem(THEME_KEY(userId), theme);
}

export function getUserTheme(userId) {
  return localStorage.getItem(THEME_KEY(userId)) || "light";
}