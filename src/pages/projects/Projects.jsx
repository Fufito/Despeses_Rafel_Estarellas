
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { db } from "../../firebase/firebase";
import {
  collection, query, where, getDocs, addDoc, deleteDoc, doc
} from "firebase/firestore";

export default function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchProjects = async () => {
      const q = query(collection(db, "projectes"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    };
    fetchProjects();
  }, [user]);

  const createProject = async () => {
    const title = prompt("Títol del projecte:");
    if (!title) return;
    const newProject = {
      title,
      uid: user.uid,
      participants: [{ name: user.email }]
    };
    const ref = await addDoc(collection(db, "projectes"), newProject);
    navigate(`/projecte/${ref.id}`);
  };

  const deleteProject = async (id) => {
    if (confirm("Eliminar projecte?")) {
      await deleteDoc(doc(db, "projectes", id));
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <h2>Els meus projectes</h2>
      <button onClick={createProject}>Nou projecte</button>
      <ul>
        {projects.map(p => (
          <li key={p.id}>
            <strong>{p.title}</strong>
            <button onClick={() => navigate(`/projecte/${p.id}`)}>Veure</button>
            <button onClick={() => deleteProject(p.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
