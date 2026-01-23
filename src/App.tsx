import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomCursor } from "./components/CustomCursor";
import Index from "./pages/Index";
import Landing from "./pages/Landing";

function App() {
  return (
    <Router>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/gallery" element={<Index />} />
      </Routes>
    </Router>
  );
}

export default App;