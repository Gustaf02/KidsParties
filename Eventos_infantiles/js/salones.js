

const LOCAL_STORAGE_KEY = 'salonesEventos';

// Inicializar LocalStorage 
if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    const initialSalones = [
        { id: 1, nombre: "Princesas Encantadas", capacidad: 30, precio: 20000, fecha: "2025-12-01" },
        { id: 2, nombre: "Game Over Party", capacidad: 25, precio: 25000, fecha: "2025-12-02" }, 
        { id: 3, nombre: "Mi primer año", capacidad: 40, precio: 85000, fecha: "2025-12-02" },
        { id: 4, nombre: "Caritas Creativas", capacidad: 20, precio: 90000, fecha: "2025-12-02" }


    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSalones));
}

// Función para obtener todos los salones
function getSalones() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    } catch (error) {
        console.error("Error al obtener salones:", error);
        return [];
    }
}

// Función para agregar un nuevo salón
function addSalon(salon) {
    try {
        const salones = getSalones();
        salon.id = salones.length ? Math.max(...salones.map(s => s.id)) + 1 : 1; 
        salones.push(salon);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(salones));
    } catch (error) {
        console.error("Error al agregar salón:", error);
    }
}
// Función para modificar un salón
function updateSalon(updatedSalon) {
    try {
        const salones = getSalones();
        const index = salones.findIndex(salon => salon.id === updatedSalon.id);
        if (index !== -1) {
            salones[index] = updatedSalon;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(salones));
        }
    } catch (error) {
        console.error("Error al actualizar salón:", error);
    }
}

// Función para eliminar un salón
function deleteSalon(id) {
    try {
        const salones = getSalones().filter(salon => salon.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(salones));
    } catch (error) {
        console.error("Error al eliminar salón:", error);
    }
}
