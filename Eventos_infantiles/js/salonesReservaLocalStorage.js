// Agrega esta variable global al inicio de tu archivo
let salonesDataGlobal = []; // Almacenará los datos de los salones

const API_KEY = "9tNEjFhwUIus25QDwOd8iywPhg5QEyYDWiVS9NlvWfD2MeSClgYAU125";
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1575425186775-b8de9a427e67?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80';

// Modifica tu función fetchData para guardar los datos en la variable global
async function fetchData() {
  try {
    document.getElementById("loading").classList.remove("d-none");
    document.getElementById("error-message").classList.add("d-none");

    const [imagesResponse, salonesResponse] = await Promise.all([
      fetch(
        "https://api.pexels.com/v1/search?query=Avengers+party+OR+princess+party+OR+kids+party+balloons+OR+Minecraft+party+OR+Frozen+party&per_page=100",
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

    salonesDataGlobal = salonesDataApi.map((salon) => {
      const idNum = parseInt(salon.id);
      const imageIndex = idNum % imagesData.photos.length;
      return {
        ...salon,
        imagen: imagesData.photos[imageIndex]?.src.medium || PLACEHOLDER_IMAGE,
      };
    });
    
    renderCatalog(salonesDataGlobal);
  } catch (error) {
    console.error("Error:", error);
    showError("Error al cargar los datos: " + error.message);
  } finally {
    document.getElementById("loading").classList.add("d-none");
  }
}

// Función de filtrado 
function filtrarSalonesAvanzado() {
  const capacidad = parseInt(document.getElementById('filtroCapacidad').value) || 0;
  const precioMax = parseInt(document.getElementById('filtroPrecio').value) || Infinity;
  const nombreBusqueda = document.getElementById('filtroNombre').value.toLowerCase();
  
  //variable global salonesDataGlobal 
  const salonesFiltrados = salonesDataGlobal.filter(salon => 
    salon.capacidad >= capacidad &&
    salon.precio <= precioMax &&
    salon.nombre.toLowerCase().includes(nombreBusqueda)
  );
  
  renderCatalog(salonesFiltrados);
}

// Función para mostrar los salones en HTML (ya la tienes)
function renderCatalog(data) {
  const container = document.getElementById("catalogo-container");

  if (!data || data.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <h4>No hay salones disponibles con estos filtros</h4>
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
                onerror="this.src='${PLACEHOLDER_IMAGE}'">
              <div class="image-overlay"></div>
            </div>

            <div class="card-body pb-0 position-relative">
              <div class="position-absolute top-0 end-0 translate-middle-y">
                <div class="bg-success text-white rounded-circle price-bubble d-flex align-items-center justify-content-center">
                  <span class="fw-bold">$${(item.precio || 0).toLocaleString("es-AR")}</span>
                </div>
              </div>
              
              <h5 class="card-title fw-bold text-primary mb-3 mt-4">${item.nombre}</h5>
              
              <div class="d-flex flex-column gap-2 mb-3">
                <div class="d-flex align-items-center">
                  <i class="bi bi-people-fill text-info feature-icon me-2"></i>
                  <span>Capacidad: <strong>${item.capacidad || "20"}</strong> niños</span>
                </div>
                <div class="d-flex align-items-center">
                  <i class="bi bi-geo-alt-fill text-danger feature-icon me-2"></i>
                  <span>${item.ubicacion || "CABA"}</span>
                </div>
              
                <p class="card-text text-muted mt-2">${item.descripcion || "Sin descripción adicional."}</p>
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
    .join("");
}

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
    precio: parseFloat(precioSalon),
  };

  document.getElementById("modalSalonTitle").textContent = `Reservar: ${nombreSalon}`;
  
  // Actualizar el precio base
  document.getElementById('precioBase').textContent = `$${precioSalon}`;
  document.getElementById('precioBase').dataset.precio = precioSalon;
  
  // Calcular y mostrar el precio total inicial
  calcularPrecioTotal();
  
  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("reservaModal"));
  modal.show();
}

function calcularPrecioTotal() {
  const precioBase = parseFloat(document.getElementById('precioBase').dataset.precio) || 0;
  const cantidadPersonas = parseInt(document.getElementById('cantidadPersonas').value) || 0;
  const incluyeMaquillaje = document.getElementById('toggleMaquillaje').checked;
  const incluyeCatering = document.getElementById('toggleCatering').checked;
  
  let precioTotal = precioBase;
  let servicios = [];
  
  // Calcular servicios adicionales
  if (incluyeMaquillaje) {
    const costoMaquillaje = precioBase * 0.001 * cantidadPersonas;
    precioTotal += costoMaquillaje;
    servicios.push({
      nombre: "Maquillaje",
      costo: costoMaquillaje.toFixed(2)
    });
  }
  
  if (incluyeCatering) {
    const costoCatering = precioBase * 0.002 * cantidadPersonas;
    precioTotal += costoCatering;
    servicios.push({
      nombre: "Catering",
      costo: costoCatering.toFixed(2)
    });
  }
  
  // Actualizar el precio total en el modal
  document.getElementById('precioTotal').textContent = `$${precioTotal.toFixed(2)}`;
  
  // Guardar los datos de servicios en el modal para usarlos después
  document.getElementById('reservaModal').dataset.servicios = JSON.stringify(servicios);
}

async function guardarReserva(reservaData) {
  try {
    // Validación de reserva existente
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const reservaExistente = reservas.find(
      r => r.salonId === reservaData.salonId && r.fechaEvento === reservaData.fechaEvento
    );

    if (reservaExistente) {
      mostrarError("Ya existe una reserva para este salón en la fecha seleccionada");
      return false;
    }

    // Crear objeto de reserva completo
    const servicios = JSON.parse(document.getElementById('reservaModal').dataset.servicios || '[]');
    
    const reservaCompleta = {
      ...reservaData,
      id: generarIdUnico(),
      fechaRegistro: new Date().toISOString(),
      estado: 'confirmada',
      servicios: servicios,
      precioDesglose: {
        base: parseFloat(reservaData.precioBase),
        serviciosAdicionales: parseFloat(reservaData.precioTotal) - parseFloat(reservaData.precioBase),
        total: parseFloat(reservaData.precioTotal)
      }
    };

    // Guardar en localStorage
    reservas.push(reservaCompleta);
    localStorage.setItem("reservas", JSON.stringify(reservas));

    // Mostrar confirmación
    mostrarConfirmacion(reservaCompleta);
    return true;
  } catch (error) {
    console.error("Error al guardar reserva:", error);
    mostrarError("Error al guardar la reserva: " + error.message);
    return false;
  }
}

document.getElementById('btnConfirmarReserva').addEventListener('click', async function() {
  // Obtener datos del formulario
  const servicios = JSON.parse(document.getElementById('reservaModal').dataset.servicios || '[]');
  
  const reservaData = {
    salonId: salonSeleccionado.id,
    salonNombre: salonSeleccionado.nombre,
    cliente: document.getElementById('nombreCliente').value.trim(),
    telefono: document.getElementById('telefonoCliente').value.trim(),
    fechaEvento: document.getElementById('fechaEvento').value,
    cantidadPersonas: parseInt(document.getElementById('cantidadPersonas').value) || 0,
    precioBase: salonSeleccionado.precio,
    precioTotal: parseFloat(document.getElementById('precioTotal').textContent.replace('$', '') || 0),
    incluyeMaquillaje: document.getElementById('toggleMaquillaje').checked,
    incluyeCatering: document.getElementById('toggleCatering').checked
  };

  // Validaciones básicas
  if (!reservaData.cliente || !reservaData.telefono || !reservaData.fechaEvento) {
    mostrarError('Por favor complete todos los campos obligatorios');
    return;
  }
  
  if (reservaData.cantidadPersonas <= 0) {
    mostrarError('La cantidad de personas debe ser mayor a cero');
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

// Funciones auxiliares
function generarIdUnico() {
  return 'res-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

function mostrarConfirmacion(reserva) {
  alert(`¡Reserva confirmada para ${reserva.cliente}!\nSalón: ${reserva.salonNombre}\nTotal: $${reserva.precioDesglose.total.toFixed(2)}`);
}

function mostrarError(mensaje) {
  alert(`Error: ${mensaje}`);
}

// Iniciar la carga de datos
document.addEventListener("DOMContentLoaded", fetchData);

// Inicializar campo de fecha con fecha mínima de hoy
window.onload = function() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("fechaEvento").min = today;
  
  // Escuchar cambios en cantidad de personas y servicios
  document.getElementById('cantidadPersonas').addEventListener('input', calcularPrecioTotal);
  document.getElementById('toggleMaquillaje').addEventListener('change', calcularPrecioTotal);
  document.getElementById('toggleCatering').addEventListener('change', calcularPrecioTotal);
};


function filtrarSalones() {
  const capacidadMinima = parseInt(document.getElementById('filtroCapacidad').value) || 0;
  
  const salonesFiltrados = salones.filter(salon => salon.capacidad >= capacidadMinima);
  
  mostrarSalonesEnHTML(salonesFiltrados);
}



// Inicialmente mostrar todos los salones
mostrarSalonesEnHTML(salonesDataGlobal);
console.log(salonesDataGlobal)