const AUTH_KEY = "frv_auth_user";

export function validateCredentials(email, password) {
  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (String(password).trim().length < 4) {
    return { success: false, message: "Password must contain at least 4 characters." };
  }

  return { success: true };
}

export function loginUser(email, password) {
  const validation = validateCredentials(email, password);
  if (!validation.success) {
    return validation;
  }

  const user = {
    name: String(email).split("@")[0].replace(/[-_.]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    email,
    loggedInAt: new Date().toISOString()
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return { success: true, user };
}

export function restoreUserSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to restore session:", error);
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEY);
}
