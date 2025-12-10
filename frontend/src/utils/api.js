const BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_URL || "https://hostedsplitease.onrender.com";

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
    if (res.status === 401) {
      localStorage.removeItem("token");
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup"
      ) {
        window.location.href = "/login";
      }
      throw new Error("Unauthorized. Please login again.");
    }

    const msg = await res.text().catch(() => {});
    throw new Error(`API error (${res.status}): ${msg}`);
  }

  return res.json();
}
