/**
 * Links de prueba imagenes pixel API
 * https://api.pexels.com/v1/search?query=birthday+backdrop+colorful&per_page=100
 * https://api.pexels.com/v1/search?query=children+playzone+decoration&per_page=100
 */

const API_KEY = "9tNEjFhwUIus25QDwOd8iywPhg5QEyYDWiVS9NlvWfD2MeSClgYAU125";
let salonSeleccionado = null;

async function fetchData() {
  try {
    document.getElementById("loading").classList.remove("d-none");
    document.getElementById("error-message").classList.add("d-none");

    const [imagesResponse, salonesResponse] = await Promise.all([
      fetch(
        "https://api.pexels.com/v1/search?query=birthday+backdrop+colorful&per_page=100",
        {
          headers: { Authorization: API_KEY },
        }
      ),
      fetch("https://681a090f1ac1155635078a8f.mockapi.io/salones"),
    ]);

    if (!imagesResponse.ok) throw new Error("Error en API de imágenes");
    if (!salonesResponse.ok) throw new Error("Error en API de salones");

    const [imagesData, salonesDataApi] = await Promise.all([
      imagesResponse.json(),
      salonesResponse.json(),
    ]);

    salonesData = salonesDataApi.map((salon) => {
      // Convertir el ID a número y usarlo como índice
      const idNum = parseInt(salon.id);
      const imageIndex = idNum % imagesData.photos.length;
      return {
        ...salon,
        imagen: imagesData.photos[imageIndex]?.src.medium || PLACEHOLDER_IMAGE,
      };
    });
    renderCatalog(salonesData);
  } catch (error) {
    console.error("Error:", error);
    showError("Error al cargar los datos: " + error.message);
  } finally {
    document.getElementById("loading").classList.add("d-none");
  }
}

function renderCatalog(data) {
  console.log(data)
  const container = document.getElementById("catalogo-container");

  if (!data || data.length === 0) {
    container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <h4>No hay salones disponibles</h4>
                    </div>
                `;
    return;
  }

 container.innerHTML = data
    .map(
      (item) => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100 salon-card">
                        <div class="position-relative overflow-hidden rounded-top">
                            <img src="${item.imagen}" 
                                class="card-img-top salon-image" 
                                alt="${item.nombre}"
                                onerror="this.src='https://images.unsplash.com/photo-1575425186775-b8de9a427e67?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80'">
                            <div class="image-overlay"></div>
                        </div>

                        <div class="card-body pb-0 position-relative">
                            <div class="position-absolute top-0 end-0 translate-middle-y">
                                <div class="bg-success text-white rounded-circle price-bubble d-flex align-items-center justify-content-center">
                                    <span class="fw-bold">$${(
                                      item.precio || 0
                                    ).toLocaleString("es-AR")}</span>
                                </div>
                            </div>
                            
                            <h5 class="card-title fw-bold text-primary mb-3 mt-4">${
                              item.nombre
                            }</h5>
                            
                            <div class="d-flex flex-column gap-2 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-people-fill text-info feature-icon me-2"></i>
                                    <span>Capacidad: <strong>${
                                      item.capacidad || "20"
                                    }</strong> niños</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-geo-alt-fill text-danger feature-icon me-2"></i>
                                    <span>${item.ubicacion || "CABA"}</span>
                                </div>
                            
                                <p class="card-text text-muted mt-2">${
                                  item.descripcion ||
                                  "Sin descripción adicional."
                                }</p>
                            </div>
                        </div>

                        ${localStorage.getItem('admin') !== null ? `
                        <div class="card-footer bg-transparent border-0 pt-0 pb-3">
                            <button class="btn btn-reservar w-100 py-2"
                                onclick="reservar('${item.id}', ${item.capacidad}, '${item.nombre}','${item.precio}')">
                                <i class="bi bi-calendar-check me-2"></i> Reservar ahora
                            </button>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `
    )
    .join("");}

function showError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  errorDiv.classList.remove("d-none");
}

function reservar(salonId, capacidad, nombreSalon, precioSalon) {
  salonSeleccionado = {
    id: salonId,
    capacidad: capacidad,
    nombre: nombreSalon,
    precio: precioSalon,
  };

  // Actualizar título del modal
  document.getElementById(
    "modalSalonTitle"
  ).textContent = `Reservar: ${nombreSalon}`;
  //document.getElementById('modalPrecio').textContent = `Precio: ${precioSalon}`;

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("reservaModal"));
  modal.show();
}

async function guardarReserva(reserva) {
  // 1. Validación de reserva existente (tu código actual)
  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
  const reservaExistente = reservas.find(
    (r) =>
      r.salonId === reserva.salonId && r.fechaEvento === reserva.fechaEvento
  );

  if (reservaExistente) {
    alert("Ya existe una reserva para este salón en la fecha seleccionada");
    return false;
  }

  // 2. Guardar en localStorage 
  reservas.push(reserva);
  localStorage.setItem("reservas", JSON.stringify(reservas));

  // 3. Agregar al historial JSON
  const resultado = await agregarAlHistorial(reserva);

  if (resultado) {
    alert(`¡Reserva para ${reserva.salonNombre} realizada con éxito!`);
    return true;
  } else {
    alert("Error al guardar el historial de la reserva");
    return false;
  }
}
document.getElementById('btnConfirmarReserva').addEventListener('click', async function() {
    // Obtener datos del formulario
    const reservaData = {
        salonId: salonSeleccionado.id,
        salonNombre: salonSeleccionado.nombre,
        cliente: document.getElementById('nombreCliente').value,
        telefono: document.getElementById('telefonoCliente').value,
        fechaEvento: document.getElementById('fechaEvento').value,
        cantidadPersonas: parseInt(document.getElementById('cantidadPersonas').value),
        precio: salonSeleccionado.precio
    };

    // Validaciones básicas
    if (!reservaData.cliente || !reservaData.telefono || !reservaData.fechaEvento) {
        mostrarError('Por favor complete todos los campos');
        return;
    }

    // Guardar la reserva
    const resultado = await guardarReserva(reservaData);
    
    if (resultado) {
        // Cerrar modal y resetear formulario
        bootstrap.Modal.getInstance(document.getElementById('reservaModal')).hide();
        document.getElementById('reservaForm').reset();
    }
});

// Iniciar la carga de datos
document.addEventListener("DOMContentLoaded", fetchData);

// Inicializar campo de fecha con fecha mínima de hoy
window.onload = function () {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("fechaEvento").min = today;
};

// Ruta relativa al archivo JSON (simulación)
const ARCHIVO_RESERVAS = '../reservas.json';

// Función principal para guardar reservas
async function guardarReserva(reservaData) {
    try {
        // 1. Validar datos de la reserva
        if (!validarReserva(reservaData)) {
            throw new Error('Datos de reserva inválidos');
        }

        // 2. Crear objeto de reserva completo
        const reservaCompleta = {
            ...reservaData,
            id: generarIdUnico(),
            fechaRegistro: new Date().toISOString(),
            estado: 'confirmada'
        };

        // 3. Guardar en el sistema
        await guardarReservaEnHistorial(reservaCompleta);

        // 4. Mostrar confirmación
        mostrarConfirmacion(reservaCompleta);
        return true;
    } catch (error) {
        console.error('Error al guardar reserva:', error);
        mostrarError(error.message);
        return false;
    }
}

// Función para guardar en el historial JSON
async function guardarReservaEnHistorial(reserva) {
    try {
        // Obtener reservas existentes
        let historialReservas = await obtenerHistorialReservas();
        
        // Agregar nueva reserva
        historialReservas.push(reserva);
        
        // En un entorno real, aquí enviarías los datos al servidor
        // Esta es una simulación que usa localStorage
        localStorage.setItem('reservas_historial', JSON.stringify(historialReservas));
        
        console.log('Reserva guardada:', reserva);
    } catch (error) {
        console.error('Error al guardar en historial:', error);
        throw error;
    }
}

// Función para obtener el historial de reservas
async function obtenerHistorialReservas() {
    try {
        // En un entorno real, aquí harías una petición al servidor
        // Por ahora simulamos con localStorage
        const historial = localStorage.getItem('reservas_historial');
        return historial ? JSON.parse(historial) : [];
    } catch (error) {
        console.error('Error al obtener historial:', error);
        return [];
    }
}

// Funciones auxiliares
function generarIdUnico() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function validarReserva(reserva) {
    return reserva && 
           reserva.salonId && 
           reserva.cliente && 
           reserva.fechaEvento;
}

function mostrarConfirmacion(reserva) {
    alert(`Reserva confirmada para ${reserva.cliente}\nID: ${reserva.id}`);
}

function mostrarError(mensaje) {
    alert(`Error: ${mensaje}`);
}