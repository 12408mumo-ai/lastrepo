const ADMIN_SESSION_KEY = 'rafna_admin_session';
const ADMIN_PASSWORD = 'Rafna2026!';

export function loginAdmin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(
      ADMIN_SESSION_KEY,
      JSON.stringify({ authenticated: true, timestamp: Date.now() })
    );
    return true;
  }
  return false;
}

export function isAdminAuthenticated(): boolean {
  const raw = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return false;
  try {
    const session = JSON.parse(raw) as { authenticated: boolean; timestamp: number };
    const oneDay = 24 * 60 * 60 * 1000;
    return session.authenticated && Date.now() - session.timestamp < oneDay;
  } catch {
    return false;
  }
}

export function logoutAdmin(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
