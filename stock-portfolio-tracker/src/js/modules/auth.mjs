// auth.mjs
import {
  setCurrentUser,
  clearCurrentUser,
  getCurrentUser,
} from "./storage.mjs";

const USERS_KEY = "users";
const USERNAME_INDEX_KEY = "usernameIndex";

// ---------- Internal Helpers ----------
function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("Failed to parse users:", err);
    return {};
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save users:", err);
  }
}

export function getUsernameIndex() {
  try {
    const raw = localStorage.getItem(USERNAME_INDEX_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("Failed to parse usernameIndex:", err);
    return {};
  }
}

function saveUsernameIndex(index) {
  try {
    localStorage.setItem(USERNAME_INDEX_KEY, JSON.stringify(index));
  } catch (err) {
    console.error("Failed to save usernameIndex:", err);
  }
}

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

function generateId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return "user-" + Math.random().toString(36).substr(2, 9);
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---------- User Class ----------
export class User {
  constructor(username, password, email = null, id = null) {
    this.username = normalizeUsername(username);
    this.password = password;
    this.email = email;
    this.id = id || generateId();
  }

  // Register a new user
  async register() {
    if (!this.username || !this.password)
      return { success: false, error: "Username and password required" };

    const index = getUsernameIndex();
    if (index[this.username])
      return { success: false, error: "Username already exists" };

    const users = getUsers();
    const hashedPassword = await hashPassword(this.password);

    users[this.id] = {
      id: this.id,
      username: this.username,
      password: hashedPassword,
      email: this.email,
    };
    saveUsers(users);

    index[this.username] = this.id;
    saveUsernameIndex(index);

    setCurrentUser(this.id);

    return { success: true, user: { id: this.id, username: this.username, email: this.email } };
  }

  // Login existing user
  async login() {
    if (!this.username || !this.password)
      return { success: false, error: "Username and password required" };

    const index = getUsernameIndex();
    const userId = index[this.username];
    if (!userId) return { success: false, error: "Username not found" };

    const users = getUsers();
    const user = users[userId];
    if (!user) return { success: false, error: "User data corrupted" };

    const hashedPassword = await hashPassword(this.password);
    if (user.password !== hashedPassword)
      return { success: false, error: "Incorrect password" };

    setCurrentUser(user.id);
    return { success: true, user };
  }

  // Logout current user
  static logout() {
    clearCurrentUser();
  }

  // Get currently logged-in user
  static getCurrentUserId() {
    return getCurrentUser();
  }

  // Get currently logged-in user object
  static getCurrentUser() {
    const id = getCurrentUser();
    if (!id) return null;
    const users = getUsers();
    return users[id] || null;
  }
}
