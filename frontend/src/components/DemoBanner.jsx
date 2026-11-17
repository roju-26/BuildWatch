import { USE_MOCK } from "../config";

// Shows only while the app uses sample data. Disappears when VITE_USE_MOCK=false.
export default function DemoBanner() {
  if (!USE_MOCK) return null;
  return (
    <div className="demo-banner">
      Demo mode: showing sample data. Reports are not saved permanently.
    </div>
  );
}
