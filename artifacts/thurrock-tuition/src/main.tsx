import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Scoped public-site design system (see the file header). Imported after
// index.css so its .tta-scoped rules sit downstream of Tailwind's preflight.
import "./styles/tta-public.css";
import "./styles/tta-nav.css";
import "./styles/tta-form.css";
import "./styles/tta-reviews.css";
// Admin dashboard + parent portal design system (LaunchOS treatment).
import "./styles/dashboard.css";

createRoot(document.getElementById("root")!).render(<App />);
