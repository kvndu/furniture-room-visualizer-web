export const AUTH_STORAGE_KEY = "authUser";

export const DEMO_USER = {
  email: "designer@demo.com",
  password: "123456",
  name: "Demo Designer"
};

function safeParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function getDemoUser() {
  return {
    email: DEMO_USER.email,
    password: DEMO_USER.password,
    name: DEMO_USER.name
  };
}

export function getAuthUser() {
  return safeParse(localStorage.getItem(AUTH_STORAGE_KEY), null);
}

export function restoreUserSession() {
  return getAuthUser();
}

export function isAuthenticated() {
  return !!getAuthUser();
}

export function loginUser(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "").trim();

  if (
    normalizedEmail === DEMO_USER.email.toLowerCase() &&
    normalizedPassword === DEMO_USER.password
  ) {
    const sessionUser = {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));

    return {
      success: true,
      user: sessionUser
    };
  }

  return {
    success: false,
    message: "Invalid email or password"
  };
}

export function logoutUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function requireAuth() {
  const user = getAuthUser();
  if (!user) {
    return null;
  }
  return user;
}