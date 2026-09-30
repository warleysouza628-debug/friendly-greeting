export type NexoUser = { name: string; email: string; password: string };
const USERS_KEY = "nexotech-users";
const SESSION_KEY = "nexotech-session";
export function getUsers(): NexoUser[] { try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; } }
export function getSession(): NexoUser | null { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; } }
export function registerUser(name: string, email: string, password: string) { const users = getUsers(); if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) return { ok: false, message: "Este e-mail já está cadastrado." }; const user = { name: name.trim(), email: email.trim().toLowerCase(), password }; localStorage.setItem(USERS_KEY, JSON.stringify([...users, user])); localStorage.setItem(SESSION_KEY, JSON.stringify(user)); return { ok: true, user }; }
export function loginUser(email: string, password: string) { const user = getUsers().find(item => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password); if (!user) return { ok: false, message: "E-mail ou senha incorretos." }; localStorage.setItem(SESSION_KEY, JSON.stringify(user)); return { ok: true, user }; }
export function logoutUser() { localStorage.removeItem(SESSION_KEY); }
