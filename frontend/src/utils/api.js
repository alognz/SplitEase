const BASE_URL = "https://hostedsplitease.onrender.com";

export async function api(url, method = "GET", body = null) {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + url, options);

  if (!res.ok) {
    const msg = await res.text().catch(() => {});
    throw new Error(`API error (${res.status}): ${msg}`);
  }

  return res.json();
}
