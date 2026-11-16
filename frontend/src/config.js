export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// true = use mock data, false = call the real FastAPI backend
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
