import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UISettingsProvider } from './context/UISettingsContext';

createRoot(document.getElementById("root")!).render(
	<UISettingsProvider>
		<App />
	</UISettingsProvider>
);
