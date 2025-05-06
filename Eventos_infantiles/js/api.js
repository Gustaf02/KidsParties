const API_KEY = '9tNEjFhwUIus25QDwOd8iywPhg5QEyYDWiVS9NlvWfD2MeSClgYAU125'; 
const container = document.getElementById('imagenes-container');

// Función para obtener imágenes de cumpleaños
async function fetchBirthdayImages() {
    const foto = "Promo Uner extra globos"
    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=birthday&per_page=6`, {
            headers: {
                'Authorization': API_KEY
            }
        });
        
        
        if (!response.ok) {
            throw new Error('Error al cargar imágenes');
        }
        
        const data = await response.json();
        displayImages(data.photos);
        
    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
}

// Función para mostrar imágenes en tarjetas
function displayImages(photos) {
    const foto = "Promo Uner extra globos" //parametro customisado ver como hacerlo individual
    container.innerHTML = photos.map(photo => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <img src="${photo.src.medium}" class="card-img-top" alt="${photo.photographer}">
                <div class="card-body">
                    <h5 class="card-title">Cumpleanios ${foto}</h5>
                    <a href="${photo.url}" target="_blank" class="btn btn-sm btn-primary">Ver disponibilidad</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', fetchBirthdayImages);



// 1. Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // 2. Obtener referencias a los botones
    const saveDataBtn = document.getElementById('saveDataBtn');
    const viewDataBtn = document.getElementById('viewDataBtn');
    const clearDataBtn = document.getElementById('clearDataBtn');
    const dataDisplay = document.getElementById('dataDisplay');

    // 3. Datos de ejemplo
    const exampleData = {
        name: "Salón Mi Primer Año",
        diponibilidad: true,
        precio: 20000,
        capacidad: 100,
        email: "contacto@salonesdefiesta.com"
    };

    // 4. Funciones
    function saveData() {
        localStorage.setItem('userData', JSON.stringify(exampleData));
        dataDisplay.textContent = "Datos guardados!";
    }

    function viewData() {
        const data = localStorage.getItem('userData');
        dataDisplay.textContent = data || "No hay datos guardados";
    }

    function clearData() {
        localStorage.removeItem('userData');
        dataDisplay.textContent = "Datos eliminados!";
    }

    // 5. Asignar eventos (¡IMPORTANTE! Después de definir las funciones)
    saveDataBtn.addEventListener('click', saveData);
    viewDataBtn.addEventListener('click', viewData);
    clearDataBtn.addEventListener('click', clearData);
});




{/* <div class="storage-buttons">
        <button id="saveDataBtn">Guardar Datos</button>
        <button id="viewDataBtn">Ver Datos</button>
        <button id="clearDataBtn">Limpiar Datos</button>
    </div>
    <div id="dataDisplay">Presiona algún botón...</div>
     */}