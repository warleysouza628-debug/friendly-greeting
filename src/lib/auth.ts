export type NexoUser = { name: string; email: string; password: string };
const USERS_KEY = "nexotech-users";
const SESSION_KEY = "nexotech-session";

export function getUsers(): NexoUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}

export function getSession(): NexoUser | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
}

export function normalizeUsername(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export function isUsernameAvailable(name: string) {
  const normalized = normalizeUsername(name).toLowerCase();
  if (!normalized) return false;
  return !getUsers().some(user => normalizeUsername(user.name).toLowerCase() === normalized);
}

export function suggestUsername(name: string) {
  const base = normalizeUsername(name).replace(/[^a-zA-Z0-9]+/g, "").toLowerCase() || "usuario";
  const users = getUsers();
  const taken = new Set(users.map(user => normalizeUsername(user.name).toLowerCase()));
  const suggestions = [`${base}01`, `${base}123`, `${base}br`, `${base}tech`, `${base}2026`, `${base}${Math.floor(100 + Math.random() * 900)}`];
  return suggestions.find(item => !taken.has(item.toLowerCase())) || `${base}0386`;
}

export function registerUser(name: string, email: string, password: string) {
  const cleanName = normalizeUsername(name);
  const cleanEmail = email.trim().toLowerCase();
  const users = getUsers();
  if (!cleanName) return { ok: false, message: "Digite um nome de usuário." };
  if (!isUsernameAvailable(cleanName)) return { ok: false, message: `O nome "${cleanName}" está indisponível.`, suggestion: suggestUsername(cleanName) };
  if (users.some(user => user.email.toLowerCase() === cleanEmail)) return { ok: false, message: "Este e-mail já está cadastrado." };
  const user: NexoUser = { name: cleanName, email: cleanEmail, password };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { ok: true, user };
}

export function loginUser(email: string, password: string) {
  const user = getUsers().find(item => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password);
  if (!user) return { ok: false, message: "E-mail ou senha incorretos." };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { ok: true, user };
}

export function logoutUser() { localStorage.removeItem(SESSION_KEY); }
