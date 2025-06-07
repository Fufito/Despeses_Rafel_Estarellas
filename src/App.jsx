
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Projects from "./pages/projects/Projects";
import ProjectDetail from "./pages/projects/ProjectDetail";
import { useAuth } from "./Context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <><Navbar /><Routes>
      <Route path="/" element={<Projects />} />
      <Route path="/projecte/:id" element={<ProjectDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes></>
    
  );
}

export default App;
