export type NexoUser = { name: string; email: string; password: string };
const USERS_KEY = "nexotech-users";
const SESSION_KEY = "nexotech-session";
const PENDING_KEY = "nexotech-pending-registration";

export type PendingRegistration = { name: string; email: string; password: string; code: string; expiresAt: number };

export function getUsers(): NexoUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getSession(): NexoUser | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
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
  const suggestions = [
    `${base}01`,
    `${base}123`,
    `${base}br`,
    `${base}tech`,
    `${base}2026`,
    `${base}${Math.floor(100 + Math.random() * 900)}`,
  ];
  return suggestions.find(item => !taken.has(item.toLowerCase())) || `${base}0386`;
}

export function beginRegistration(name: string, email: string, password: string) {
  const cleanName = normalizeUsername(name);
  const cleanEmail = email.trim().toLowerCase();
  const users = getUsers();

  if (!cleanName) return { ok: false, message: "Digite um nome de usuário." };
  if (!isUsernameAvailable(cleanName)) {
    return { ok: false, message: `O nome "${cleanName}" está indisponível.`, suggestion: suggestUsername(cleanName) };
  }
  if (users.some(user => user.email.toLowerCase() === cleanEmail)) {
    return { ok: false, message: "Este e-mail já está cadastrado." };
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const pending: PendingRegistration = {
    name: cleanName,
    email: cleanEmail,
    password,
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };
  localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  return { ok: true, pending };
}

export function getPendingRegistration(): PendingRegistration | null {
  try {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || "null") as PendingRegistration | null;
    if (!pending || pending.expiresAt < Date.now()) {
      localStorage.removeItem(PENDING_KEY);
      return null;
    }
    return pending;
  } catch {
    return null;
  }
}

export function verifyRegistration(code: string) {
  const pending = getPendingRegistration();
  if (!pending) return { ok: false, message: "O código expirou. Solicite um novo código." };
  if (code.trim() !== pending.code) return { ok: false, message: "Código de confirmação incorreto." };

  const users = getUsers();
  if (users.some(user => normalizeUsername(user.name).toLowerCase() === pending.name.toLowerCase())) {
    localStorage.removeItem(PENDING_KEY);
    return { ok: false, message: "Este nome de usuário acabou de ser utilizado. Escolha outro nome." };
  }

  const user: NexoUser = { name: pending.name, email: pending.email, password: pending.password };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  localStorage.removeItem(PENDING_KEY);
  return { ok: true, user };
}

export function resendRegistrationCode() {
  const pending = getPendingRegistration();
  if (!pending) return { ok: false, message: "Não há uma confirmação pendente." };
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const updated = { ...pending, code, expiresAt: Date.now() + 10 * 60 * 1000 };
  localStorage.setItem(PENDING_KEY, JSON.stringify(updated));
  return { ok: true, pending: updated };
}

export function registerUser(name: string, email: string, password: string) {
  const result = beginRegistration(name, email, password);
  if (!result.ok) return result;
  return verifyRegistration(result.pending.code);
}

export function loginUser(email: string, password: string) {
  const user = getUsers().find(item => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password);
  if (!user) return { ok: false, message: "E-mail ou senha incorretos." };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { ok: true, user };
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}
