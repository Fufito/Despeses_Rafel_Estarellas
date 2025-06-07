
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import {
  doc, getDoc, updateDoc, collection,
  addDoc, getDocs, deleteDoc
} from "firebase/firestore";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [gastos, setGastos] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editParticipants, setEditParticipants] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      const projectRef = doc(db, "projectes", id);
      const projectSnap = await getDoc(projectRef);
      const data = { id: projectSnap.id, ...projectSnap.data() };
      setProject(data);
      setEditTitle(data.title);
      setEditParticipants(data.participants || []);
    };

    const fetchGastos = async () => {
      const q = collection(db, "projectes", id, "gastos");
      const querySnapshot = await getDocs(q);
      setGastos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchProject();
    fetchGastos();
  }, [id]);

  const addGasto = async () => {
    const concepto = prompt("Concepte:");
    const cuantia = parseFloat(prompt("Import:"));
    if (!concepto || isNaN(cuantia)) return;

    const pagadoPor = project.participants[0].name;
    const dividirEntre = project.participants.map(p => p.name);

    const ref = await addDoc(collection(db, "projectes", id, "gastos"), {
      concepto, cuantia, pagadoPor, dividirEntre
    });

    setGastos([...gastos, { id: ref.id, concepto, cuantia, pagadoPor, dividirEntre }]);
  };

  const eliminarGasto = async (gastoId) => {
    await deleteDoc(doc(db, "projectes", id, "gastos", gastoId));
    setGastos(gastos.filter(g => g.id !== gastoId));
  };

  const guardarCambiosProyecto = async () => {
    const ref = doc(db, "projectes", id);
    await updateDoc(ref, {
      title: editTitle,
      participants: editParticipants
    });
    setProject(prev => ({ ...prev, title: editTitle, participants: editParticipants }));
    setEditMode(false);
  };

  const actualizarParticipante = (i, valor) => {
    const copia = [...editParticipants];
    copia[i].name = valor;
    setEditParticipants(copia);
  };

  const agregarParticipante = () => {
    setEditParticipants([...editParticipants, { name: "" }]);
  };

  const eliminarParticipante = (i) => {
    const copia = [...editParticipants];
    copia.splice(i, 1);
    setEditParticipants(copia);
  };

  
  const editarGasto = (gastoId) => {
    setGastos(gastos.map(g => g.id === gastoId ? { ...g, editing: true } : g));
  };

  const guardarEdicionGasto = async (g) => {
    const ref = doc(db, "projectes", id, "gastos", g.id);
    await updateDoc(ref, {
      concepto: g.concepto,
      cuantia: parseFloat(g.cuantia),
      pagadoPor: g.pagadoPor,
      dividirEntre: g.dividirEntre
    });
    setGastos(gastos.map(x => x.id === g.id ? { ...g, editing: false } : x));
  };


  if (!project) return <p>Carregant projecte...</p>;

  return (
    <div>
      <h2>{project.title}</h2>
      <button onClick={() => setEditMode(!editMode)}>✏️ Editar projecte</button>

      {editMode && (
        <div>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Títol del projecte"
          />
          <h4>Participants</h4>
          {editParticipants.map((p, i) => (
            <div key={i}>
              <input
                type="text"
                value={p.name}
                onChange={(e) => actualizarParticipante(i, e.target.value)}
              />
              <button onClick={() => eliminarParticipante(i)}>🗑️</button>
            </div>
          ))}
          <button onClick={agregarParticipante}>Afegir participant</button>
          <button onClick={guardarCambiosProyecto}>💾 Guardar</button>
        </div>
      )}

      <h3>Participants:</h3>
      <ul>
        {project.participants.map((p, i) => (
          <li key={i}>{p.name}</li>
        ))}
      </ul>

      <button onClick={addGasto}>Afegir Despesa</button>
      
      <h3>Despeses:</h3>
      <ul>
        {gastos.map(g => (
          <li key={g.id}>
            {g.editing ? (
              <div>
                <input
                  type="text"
                  value={g.concepto}
                  onChange={(e) => setGastos(gastos.map(x => x.id === g.id ? { ...x, concepto: e.target.value } : x))}
                  placeholder="Concepte"
                />
                <input
                  type="number"
                  value={g.cuantia}
                  onChange={(e) => setGastos(gastos.map(x => x.id === g.id ? { ...x, cuantia: e.target.value } : x))}
                  placeholder="Import"
                />
                <select
                  value={g.pagadoPor}
                  onChange={(e) => setGastos(gastos.map(x => x.id === g.id ? { ...x, pagadoPor: e.target.value } : x))}
                >
                  {project.participants.map((p, i) => (
                    <option key={i} value={p.name}>{p.name}</option>
                  ))}
                </select>
                <div>
                  {project.participants.map((p, i) => (
                    <label key={i}>
                      <input
                        type="checkbox"
                        checked={g.dividirEntre.includes(p.name)}
                        onChange={(e) => {
                          const nuevos = e.target.checked
                            ? [...g.dividirEntre, p.name]
                            : g.dividirEntre.filter(n => n !== p.name);
                          setGastos(gastos.map(x => x.id === g.id ? { ...x, dividirEntre: nuevos } : x));
                        }}
                      />
                      {p.name}
                    </label>
                  ))}
                </div>
                <button onClick={() => guardarEdicionGasto(g)}>💾</button>
              </div>
            ) : (
              <div>
                {g.concepto}: {g.cuantia} € — Pagat per: {g.pagadoPor}
                <button onClick={() => editarGasto(g.id)}>✏️</button>
                <button onClick={() => eliminarGasto(g.id)}>🗑️</button>
              </div>
            )}
          </li>
        ))}
      </ul>

    </div>
  );
}
