// Fetches an HTML fragment (such as the sidebar) from the server and returns it as text.
export async function loadHtml(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not load ${url} (HTTP ${response.status})`);
  }
  return response.text();
}