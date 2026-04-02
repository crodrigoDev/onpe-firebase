import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, where, orderBy, query} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBJ4W-i5SNKnj5XqkKi91c32m3Tv5fQhuY",
    authDomain: "onpe-rodrigo.firebaseapp.com",
    projectId: "onpe-rodrigo",
    storageBucket: "onpe-rodrigo.firebasestorage.app",
    messagingSenderId: "603629458203",
    appId: "1:603629458203:web:b0f7686e50f169f78779be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// export const participacion = async (ambito) => getDocs(query(collection(db, `${ambito}`),orderBy('DPD')))
//export const dpdparticipacion = async (ambito, dpd) => getDocs(query(collection(db, `${ambito}`), where('DPD', '==', `${dpd}`),orderBy('DPD')))
const p_departamento = async (id) => getDocs(query(collection(db, 'participacion_departamento'),where("ID", "==", `${id}`), orderBy('DPD')))
const p_provincia = async (id) => getDocs(query(collection(db, 'participacion_provincia'),where("Departamento", "==", `${id}`), orderBy('DPD')))
const p_distrito = async (id) => getDocs(query(collection(db, 'participacion_distrito'),where("Provincia", "==", `${id}`), orderBy('DPD')))


export const OnpeController = async (metodo, id) => {
    let accion = "";
    let data = null;

    switch(metodo) {
        case "participacion": data = await p_departamento(id); accion = "departamento"; break;
        case "provincia": data = await p_provincia(id); accion = "provincia"; break;
        case "distrito": data = await p_distrito(id); accion = "distrito"; break;
    }

    const array = [];
    array.push(accion, data);
    return array;

}