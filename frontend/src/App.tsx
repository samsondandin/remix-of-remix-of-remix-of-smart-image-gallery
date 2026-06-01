import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/gallery" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  );
}

export default App;