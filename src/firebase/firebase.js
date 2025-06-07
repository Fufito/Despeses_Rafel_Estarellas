import { firebaseConfig } from "./config"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore, addDoc, collection, getDocs, onSnapshot, doc, deleteDoc } from "firebase/firestore"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

/*Firestore functions*/
export const saveDespesa = async (despesa) => {
  console.log(despesa);
  const docRef = await addDoc(collection(db, "despeses"), despesa);

  return docRef.id;   
}

export const saveCollection = async (collectionName, item) => {
  console.log(item);
  const docRef = await addDoc(collection(db, collectionName), item);

  return docRef.id;   
}

export const getDespeses = () => 
  getDocs(collection(db, "despeses"));

export const onGetCollection = (collectionName, callback) =>
  onSnapshot(collection(db, collectionName), callback);

export const onGetDespesa = (id, callback) =>
  onSnapshot(doc(db, "despeses", id), callback);

export const deleteDespesa = async (id) => {
  deleteDoc(doc(db, "despeses", id));
}

/*Auth functions */
export const registerUser = async (email, password) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error.code);
    console.log(error.message);

    if (error.code == "auth/invalid-email"){
      error.message = "Email no vàlid";
    }

    return error;
    
  }
};

export const loginUser = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error.code == "auth/invalid-email"){
      error.message = "Email no vàlid";
    } else if (error.code == "auth/invalid-credential"){
       error.message = "Email o contrasenya erronis";
    }

    return error;
  }
};

export const logoutUser = async ()=>{
  await signOut(auth);
}

//Crear mètode per comprovar si tenim usuari loguejat: isUserLoggedIn que crida a onAuthStateChanged

