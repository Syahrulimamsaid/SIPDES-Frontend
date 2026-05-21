export function clearCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}