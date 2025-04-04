const API_KEY = '9tNEjFhwUIus25QDwOd8iywPhg5QEyYDWiVS9NlvWfD2MeSClgYAU125'; 
const container = document.getElementById('imagenes-container');

// Función para obtener imágenes de cumpleaños
async function fetchBirthdayImages() {
    const foto1 = "Promo Uner extra globos"
    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=birthday&per_page=12`, {
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
    const foto1 = "Promo Uner extra globos" //parametro customisado ver como hacerlo individual
    container.innerHTML = photos.map(photo => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <img src="${photo.src.medium}" class="card-img-top" alt="${photo.photographer}">
                <div class="card-body">
                    <h5 class="card-title">Cumpleanios ${foto1}</h5>
                    <a href="${photo.url}" target="_blank" class="btn btn-sm btn-primary">Ver disponibilidad</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', fetchBirthdayImages);