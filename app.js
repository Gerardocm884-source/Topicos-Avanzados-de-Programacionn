// 1. IMPORTACIONES DE FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. CONFIGURACIÓN DE TU PROYECTO (Copia y pega la tuya aquí)
const firebaseConfig = {
  apiKey: "AIzaSyA_qAfAlnMLhRFHdcm0_9GRywei5eLulbI",
  authDomain: "borrame2-f4c22.firebaseapp.com",
  projectId: "borrame2-f4c22",
  storageBucket: "borrame2-f4c22.firebasestorage.app",
  messagingSenderId: "720103605947",
  appId: "1:720103605947:web:95ba4b9d7e343842c30b9e"
};


// 3. INICIALIZAR FIREBASE Y FIRESTORE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variable para guardar los datos localmente y poder filtrar
let datos = [];

// --- FUNCIÓN PARA AGREGAR PRODUCTO ---
window.agregar = async function() {
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;

    if (nombre === "" || precio === "") {
        alert("Completa todos los campos");
        return;
    }

    try {
        await addDoc(collection(db, "productos"), {
            nombre: nombre,
            precio: precio
        });
        alert("Producto agregado");
        // Limpiar campos
        document.getElementById("nombre").value = "";
        document.getElementById("precio").value = "";
        leer(); // Recargar tabla
    } catch (error) {
        console.error("Error al agregar: ", error);
    }
};

// --- FUNCIÓN PARA LEER PRODUCTOS ---
async function leer() {
    datos = [];
    const querySnapshot = await getDocs(collection(db, "productos"));
    querySnapshot.forEach((doc) => {
        datos.push({ id: doc.id, ...doc.data() });
    });
    mostrar(datos);
}

// --- FUNCIÓN PARA MOSTRAR DATOS EN LA TABLA ---
function mostrar(lista) {
    const tabla = document.getElementById("tabla");
    tabla.innerHTML = "";

    lista.forEach((p) => {
        tabla.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.precio}</td>
                <td>
                    <button onclick="eliminar('${p.id}')" style="background: red;">Eliminar</button>
                    <button onclick="editar('${p.id}')" style="background: orange;">Editar</button>
                </td>
            </tr>
        `;
    });
}

// --- FUNCIÓN PARA ELIMINAR ---
window.eliminar = async function(id) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        await deleteDoc(doc(db, "productos", id));
        leer();
    }
};

// --- FUNCIÓN PARA EDITAR ---
window.editar = async function(id) {
    const nuevoNombre = prompt("Nuevo nombre:");
    const nuevoPrecio = prompt("Nuevo precio:");

    if (nuevoNombre && nuevoPrecio) {
        const docRef = doc(db, "productos", id);
        await updateDoc(docRef, {
            nombre: nuevoNombre,
            precio: nuevoPrecio
        });
        leer();
    }
};

// --- FUNCIÓN PARA FILTRAR/BUSCAR ---
window.filtrar = function() {
    const texto = document.getElementById("buscar").value.toLowerCase();
    const filtrados = datos.filter(p => 
        p.nombre.toLowerCase().includes(texto)
    );
    mostrar(filtrados);
};

// Cargar los datos al iniciar la página
leer();