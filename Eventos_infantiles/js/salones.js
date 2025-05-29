

const LOCAL_STORAGE_KEY = 'salonesEventos';

// Inicializar LocalStorage 
if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    const initialSalones = [
        { id: 1, nombre: "Princesas Encantadas", capacidad: 30, precio: 20000, fecha: "2023-12-01" },
        { id: 2, nombre: "Game Over Party", capacidad: 25, precio: 25000, fecha: "2023-12-02" }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSalones));
}

// Función para obtener todos los salones
function getSalones() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
}

// Función para agregar un nuevo salón
function addSalon(salon) {
    const salones = getSalones();
    salon.id = salones.length ? Math.max(salones.map(s => s.id)) + 1 : 1; // Asignar nuevo ID
    salones.push(salon);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(salones));
}

// Función para modificar un salón
function updateSalon(updatedSalon) {
    const salones = getSalones();
    const index = salones.findIndex(salon => salon.id === updatedSalon.id);
    if (index !== -1) {
        salones[index] = updatedSalon;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(salones));
    }
}

// Función para eliminar un salón
function deleteSalon(id) {
    const salones = getSalones().filter(salon => salon.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(salones));
}