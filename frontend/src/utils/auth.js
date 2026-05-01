const KEY = 'silkreader_user';

export const getUser  = () => JSON.parse(localStorage.getItem(KEY) || 'null');
export const setUser  = (user) => localStorage.setItem(KEY, JSON.stringify(user));
export const clearUser = () => localStorage.removeItem(KEY);
export const isLoggedIn = () => Boolean(getUser());

/** Returns the headers object with X-User-Id set if a user is logged in */
export const authHeaders = () => {
  const user = getUser();
  return user ? { 'Content-Type': 'application/json', 'X-User-Id': user._id } : { 'Content-Type': 'application/json' };
};
