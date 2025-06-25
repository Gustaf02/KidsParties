// FUNCIÓN: Gestiona los filtros de salón y las cards con información e imagenes

// // Variable para almacenar todos los datos de los salones que se consumen de las APIs
let salonesDataGlobal = []; 

const API_KEY = "9tNEjFhwUIus25QDwOd8iywPhg5QEyYDWiVS9NlvWfD2MeSClgYAU125";
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1575425186775-b8de9a427e67?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80';

// Guarda los datos en la variable salonesDataGlobal
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
    // Se combinan los la data de ambas peticiones para crear el objeto salon
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

// Funcion para busqueda avanzada fitra por capacidad, precio y nombre
function filtrarSalonesAvanzado() {
  const capacidad = parseInt(document.getElementById('filtroCapacidad').value) || 0;
  const precioMax = parseInt(document.getElementById('filtroPrecio').value) || Infinity;
  const nombreBusqueda = document.getElementById('filtroNombre').value.toLowerCase();
  
  //Filtrar salones desde salonesDataGlobal 
  const salonesFiltrados = salonesDataGlobal.filter(salon => 
    salon.capacidad >= capacidad &&
    salon.precio <= precioMax &&
    salon.nombre.toLowerCase().includes(nombreBusqueda)
  );
  
  renderCatalog(salonesFiltrados);
}

// Función para mostrar los salones en HTML
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
             <!-- Botón de presupuesto siempre visible -->
  <button class="btn btn-presupuesto w-100 py-2 ${localStorage.getItem('admin') !== null ? 'mt-2' : ''}"
    onclick="solicitarPresupuesto('${item.id}', ${item.capacidad}, '${item.nombre}','${item.precio}')">
    <i class="bi bi-calculator me-2"></i> Solicitar Presupuesto
  </button>
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
    capacidad: parseInt(capacidad),
    nombre: nombreSalon,
    precio: parseFloat(precioSalon),
  };


  document.getElementById("modalSalonTitle").textContent = `Reservar: ${nombreSalon}`;
  //document.getElementById('capacidad').textContent = capacidad;
  document.getElementById('capacidadAdvertencia').textContent = `Máximo ${capacidad} personas`
  
  // Actualizar el precio base
  document.getElementById('precioBase').textContent = `$${precioSalon}`;
  document.getElementById('precioBase').dataset.precio = precioSalon;
  
  // Calcular y mostrar el precio total inicial
  calcularPrecioTotal();
  
  // Constante para mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("reservaModal"));
  modal.show();
}

function calcularPrecioTotal() {
  const precioBase = parseFloat(document.getElementById('precioBase').dataset.precio) || 0;
  const cantidadPersonas = parseInt(document.getElementById('cantidadPersonas').value) || 0;
  const capacidadSalon = salonSeleccionado ? salonSeleccionado.capacidad : 0;
  const incluyeMaquillaje = document.getElementById('toggleMaquillaje').checked;
  const incluyeCatering = document.getElementById('toggleCatering').checked;
  
  let precioTotal = precioBase;
  let servicios = [];
  
    // Validacion de capacidad
  if (cantidadPersonas > capacidadSalon) {
    document.getElementById('capacidadAdvertencia').textContent = `Máximo ${capacidadSalon} personas`
    document.getElementById('errorCapacidad').textContent = 
      `La cantidad de personas (${cantidadPersonas}) supera la capacidad del salón (${capacidadSalon})`;
    document.getElementById('btnConfirmarReserva').disabled = true;
    return;

  } else {
    document.getElementById('errorCapacidad').textContent = '';
    document.getElementById('btnConfirmarReserva').disabled = false;
  }
  
  // Calcular servicios adicionales y sumar al total
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
  
  // Guardar los datos de servicios en el modal 
  document.getElementById('reservaModal').dataset.servicios = JSON.stringify(servicios);
}

 // Funcion para guardar reservas en localStorage
async function guardarReserva(reservaData) {
  console.log(reservaData)
  try {
    // Validación de reserva existente
    const reservas = JSON.parse(localStorage.getItem("reservas")) || [];
    const reservaExistente = reservas.find(
      r => r.salonId === reservaData.salonId && r.fechaEvento === reservaData.fechaEvento
    );

    if (reservaExistente) {
      mostrarError("Ya existe una reserva para este salón en la fecha seleccionada, elige otra fecha..");
      return false;
    }

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

    // Guardar reserva en localStorage
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

// Funciones de validación
function validarNombre(nombre) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  return regex.test(nombre);
}
function validarTelefono(telefono) {
  // Permite números y opcionalmente un + al inicio
  const regex = /^\+?[0-9]+$/;
  return regex.test(telefono);
}

document.getElementById('btnConfirmarReserva').addEventListener('click', async function() {
  // Obtener datos del formulario
  const servicios = JSON.parse(document.getElementById('reservaModal').dataset.servicios || '[]');
  console.log(servicios)
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

  // Validaciones de campos incompletos
  if (!reservaData.cliente || !reservaData.telefono || !reservaData.fechaEvento) {
    mostrarError('Por favor complete todos los campos obligatorios');
    return;
  }
  
  if (reservaData.cantidadPersonas <= 0) {
    mostrarError('La cantidad de personas debe ser mayor a cero');
    return;
  }
  if (reservaData.cantidadPersonas > salonSeleccionado.capacidad) {
    mostrarError(`La cantidad de personas (${reservaData.cantidadPersonas}) supera la capacidad del salón (${salonSeleccionado.capacidad})`);
    return;
  }
  // Validación del nombre
  if (!validarNombre(reservaData.cliente)) {
    mostrarError('El nombre solo puede contener letras y espacios (no se permiten números ni caracteres especiales)');
    return;
  }
  //Validacion del telefono
  if (!validarTelefono(reservaData.telefono)){
    mostrarError('El telefono no se permiten letras ni caracteres especiales)');
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
  
  document.getElementById('cantidadPersonas').addEventListener('input', calcularPrecioTotal);

  document.getElementById('toggleMaquillaje').addEventListener('change', calcularPrecioTotal);
  document.getElementById('toggleCatering').addEventListener('change', calcularPrecioTotal);
};


function filtrarSalones() {
  const capacidadMinima = parseInt(document.getElementById('filtroCapacidad').value) || 0;
  
  const salonesFiltrados = salones.filter(salon => salon.capacidad >= capacidadMinima);
  
  mostrarSalonesEnHTML(salonesFiltrados);
}


// Función para solicitar presupuesto
function solicitarPresupuesto(salonId, capacidad, nombreSalon, precioSalon) {
    salonSeleccionado = {
        id: salonId,
        capacidad: parseInt(capacidad),
        nombre: nombreSalon,
        precio: parseFloat(precioSalon),
    };

    document.getElementById("modalPresupuestoTitle").textContent = `Presupuesto: ${nombreSalon}`;
    document.getElementById('capacidadAdvertenciaPresupuesto').textContent = `Máximo ${capacidad} personas`;
    document.getElementById('precioBasePresupuesto').textContent = `$${precioSalon}`;
    document.getElementById('precioBasePresupuesto').dataset.precio = precioSalon;
    calcularPrecioTotalPresupuesto();
    
    const modal = new bootstrap.Modal(document.getElementById("presupuestoModal"));
    modal.show();
}

// Función para calcular precio total en presupuesto
function calcularPrecioTotalPresupuesto() {
    const precioBase = parseFloat(document.getElementById('precioBasePresupuesto').dataset.precio) || 0;
    const cantidadPersonas = parseInt(document.getElementById('cantidadPersonasPresupuesto').value) || 0;
    const capacidadSalon = salonSeleccionado ? salonSeleccionado.capacidad : 0;
    const incluyeMaquillaje = document.getElementById('toggleMaquillajePresupuesto').checked;
    const incluyeCatering = document.getElementById('toggleCateringPresupuesto').checked;
    
    let precioTotal = precioBase;
    let servicios = [];
    
    // Validación de capacidad
    if (cantidadPersonas > capacidadSalon) {
        document.getElementById('errorCapacidadPresupuesto').textContent = 
            `La cantidad de personas (${cantidadPersonas}) supera la capacidad del salón (${capacidadSalon})`;
        document.getElementById('btnConfirmarPresupuesto').disabled = true;
        return;
    } else {
        document.getElementById('errorCapacidadPresupuesto').textContent = '';
        document.getElementById('btnConfirmarPresupuesto').disabled = false;
    }
    
    // Calcular servicios adicionales
    if (incluyeMaquillaje) {
        const costoMaquillaje = precioBase * 0.01 * cantidadPersonas;
        precioTotal += costoMaquillaje;
        servicios.push({
            nombre: "Maquillaje",
            costo: costoMaquillaje.toFixed(2)
        });
    }
    
    if (incluyeCatering) {
        const costoCatering = precioBase * 0.02 * cantidadPersonas;
        precioTotal += costoCatering;
        servicios.push({
            nombre: "Catering",
            costo: costoCatering.toFixed(2)
        });
    }

    document.getElementById('precioTotalPresupuesto').textContent = `$${precioTotal.toFixed(2)}`;
    document.getElementById('presupuestoModal').dataset.servicios = JSON.stringify(servicios);
}

// Función para guardar presupuesto en localStorage, aca lo guardo en la misma key que reservas....
async function guardarPresupuesto(presupuestoData) {
    try {
        const presupuestos = JSON.parse(localStorage.getItem("reservas")) || [];
        
        const servicios = JSON.parse(document.getElementById('presupuestoModal').dataset.servicios || '[]');
        
        const presupuestoCompleto = {
            ...presupuestoData,
            id: generarIdUnico(),
            fechaRegistro: new Date().toISOString(),
            estado: 'presupuesto',
            estadoReserva: false, // Nuevo campo para diferenciar presupuestos
            servicios: servicios,
            precioDesglose: {
                base: parseFloat(presupuestoData.precioBase),
                serviciosAdicionales: parseFloat(presupuestoData.precioTotal) - parseFloat(presupuestoData.precioBase),
                total: parseFloat(presupuestoData.precioTotal)
            }
        };

        presupuestos.push(presupuestoCompleto);
        localStorage.setItem("reservas", JSON.stringify(presupuestos));

        mostrarConfirmacionPresupuesto(presupuestoCompleto);
        return true;
    } catch (error) {
        console.error("Error al guardar presupuesto:", error);
        mostrarError("Error al guardar el presupuesto: " + error.message);
        return false;
    }
}

function mostrarConfirmacionPresupuesto(presupuesto) {
    alert(`¡Presupuesto solicitado con éxito para ${presupuesto.cliente}!\nSalón: ${presupuesto.salonNombre}\nTotal: $${presupuesto.precioDesglose.total.toFixed(2)}\n\nTe contactaremos a la brevedad.`);
}

// Valida que el nombre solo contenga letras y espacios (con soporte para acentos y ñ)
function validarNombre(nombre) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/;
  return regex.test(nombre) && nombre.trim().length > 0;
}

// Valida el formato de email estándar
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) && email.trim().length > 0;
}

// Valida que el teléfono solo contenga números y opcionalmente un + al inicio
function validarTelefono(telefono) {
  const regex = /^\+?\d{8,15}$/; // Entre 8 y 15 dígitos
  return regex.test(telefono) && telefono.trim().length > 0;
}

// Event listener para el botón de confirmar presupuesto
document.getElementById('btnConfirmarPresupuesto').addEventListener('click', async function() {
    const servicios = JSON.parse(document.getElementById('presupuestoModal').dataset.servicios || '[]');
    const presupuestoData = {
        salonId: salonSeleccionado.id,
        salonNombre: salonSeleccionado.nombre,
        cliente: document.getElementById('nombreClientePresupuesto').value.trim(),
        email: document.getElementById('emailClientePresupuesto').value.trim(),
        telefono: document.getElementById('telefonoClientePresupuesto').value.trim(),
        cantidadPersonas: parseInt(document.getElementById('cantidadPersonasPresupuesto').value) || 0,
        precioBase: salonSeleccionado.precio,
        precioTotal: parseFloat(document.getElementById('precioTotalPresupuesto').textContent.replace('$', '') || 0),
        incluyeMaquillaje: document.getElementById('toggleMaquillajePresupuesto').checked,
        incluyeCatering: document.getElementById('toggleCateringPresupuesto').checked
    };

    // Validaciones
    if (!presupuestoData.cliente || !presupuestoData.email || !presupuestoData.telefono) {
        mostrarError('Por favor complete todos los campos obligatorios');
        return;
    }

    if (!validarNombre(presupuestoData.cliente)) {
        mostrarError('El nombre solo puede contener letras y espacios (no se permiten números ni caracteres especiales)');
        return;
    }

    if (!validarEmail(presupuestoData.email)) {
        mostrarError('Por favor ingrese un email válido (ejemplo: usuario@dominio.com)');
        return;
    }

    if (!validarTelefono(presupuestoData.telefono)) {
        mostrarError('El teléfono debe contener solo números (8-15 dígitos). Opcionalmente puede comenzar con +');
        return;
    }

    if (presupuestoData.cantidadPersonas <= 0) {
        mostrarError('La cantidad de personas debe ser mayor a cero');
        return;
    }
    if (presupuestoData.cantidadPersonas > salonSeleccionado.capacidad) {
        mostrarError(`La cantidad de personas (${presupuestoData.cantidadPersonas}) supera la capacidad del salón (${salonSeleccionado.capacidad})`);
        return;
    }

    const resultado = await guardarPresupuesto(presupuestoData);

    if (resultado) {
        // Cierra el modal y resetea el formulario
        bootstrap.Modal.getInstance(document.getElementById('presupuestoModal')).hide();
        document.getElementById('presupuestoForm').reset();

        // --- Código para redirigir al usuario a la página de presupuesto ---
        window.location.href = '/pages/verPresupuesto.html';
    }
});

// En window.onload, agregar event listeners para el modal de presupuesto
window.onload = function() {
    const today = new Date().toISOString().split("T")[0];
  document.getElementById("fechaEvento").min = today;
    
    // Para el modal de presupuesto
    document.getElementById('cantidadPersonasPresupuesto').addEventListener('input', calcularPrecioTotalPresupuesto);
    document.getElementById('toggleMaquillajePresupuesto').addEventListener('change', calcularPrecioTotalPresupuesto);
    document.getElementById('toggleCateringPresupuesto').addEventListener('change', calcularPrecioTotalPresupuesto);
};