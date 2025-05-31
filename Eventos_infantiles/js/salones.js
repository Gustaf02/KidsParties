const LOCAL_STORAGE_KEY = "salonesEventos";

// Inicializar LocalStorage
if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
  const initialSalones = [
    {
      id: 1,
      nombre: "Princesas Encantadas",
      capacidad: 30,
      precio: 20000,
      fecha: "2025-12-01",
      imagen: "./img/tp_des_web_portada_0.webp",
    },
    {
      id: 2,
      nombre: "Game Over Party",
      capacidad: 25,
      precio: 25000,
      fecha: "2025-12-02",
      imagen: "../img/tp_des_web_portada_0",
    },
    {
      id: 3,
      nombre: "Mi primer año",
      capacidad: 40,
      precio: 85000,
      fecha: "2025-12-02",
      imagen: "/KidsParties/Eventos_infantiles/img/tp_des_web_portada_0.webp",
    },
    {
      id: 4,
      nombre: "Caritas Creativas",
      capacidad: 20,
      precio: 90000,
      fecha: "2025-12-02",
      imagen: "/img/tp_des_web_portada_3.webp",
    },
  ];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSalones));
}

// Función para obtener todos los salones
function getSalones() {
  try {
    let salones = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

    // Asegurar que cada salón tenga propiedad imagen
    salones = salones.map((salon) => {
      return {
        ...salon,
        imagen: salon.imagen || "img/placeholder.jpg", // Valor por defecto
      };
    });

    return salones;
  } catch (error) {
    console.error("Error al obtener salones:", error);
    return [];
  }
}

// Función para agregar un nuevo salón
function addSalon(salon) {
  try {
    const salones = getSalones();
    salon.id = salones.length ? Math.max(...salones.map((s) => s.id)) + 1 : 1;
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
    const index = salones.findIndex((salon) => salon.id === updatedSalon.id);
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
    const salones = getSalones().filter((salon) => salon.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(salones));
  } catch (error) {
    console.error("Error al eliminar salón:", error);
  }
}

// Función para renderizar los salones en la galería
function renderizarSalones(salones = getSalones()) {
  const galeria = document.getElementById("galeriaSalones");
  galeria.innerHTML = ""; // Limpiar galería

  if (salones.length === 0) {
    galeria.innerHTML =
      '<div class="col-12 text-center py-4"><p>No hay salones disponibles.</p></div>';
    return;
  }

  salones.forEach((salon) => {
    const card = document.createElement("div");
    card.className = "col";
    card.innerHTML = `
            <div class="card card-salon h-100">
   <img src="${salon.imagen}" 
           class="card-img-top" 
           alt="${salon.nombre}"
           onerror="this.onerror=null;this.src='/KidsParties/Eventos_infantiles/img/tp_des_web_portada_0.webp'">
        
                    <h5 class="card-title">${salon.nombre}</h5>
                    <p class="card-text">
                        <span class="badge badge-capacidad text-white me-2">Capacidad: ${
                          salon.capacidad
                        } personas</span>
                        <span class="badge badge-precio text-white">$${salon.precio.toLocaleString()}</span>
                    </p>
                    <p class="card-text"><small class="text-muted">Disponible: ${new Date(
                      salon.fecha
                    ).toLocaleDateString()}</small></p>
                </div>
            </div>
        `;
    galeria.appendChild(card);
    console.log(salon.imagen);
  });
}

// Función para aplicar filtros
function aplicarFiltros() {
  const nombre = document.getElementById("filtroNombre").value.toLowerCase();
  const capacidadMin =
    parseInt(document.getElementById("filtroCapacidadMin").value) || 0;

  const salonesFiltrados = getSalones().filter((salon) => {
    return (
      salon.nombre.toLowerCase().includes(nombre) &&
      salon.capacidad >= capacidadMin
    );
  });

  renderizarSalones(salonesFiltrados);
}

// Eventos
document.addEventListener("DOMContentLoaded", () => {
  renderizarSalones();

  document
    .getElementById("btnFiltrar")
    .addEventListener("click", aplicarFiltros);

  document
    .getElementById("filtroNombre")
    .addEventListener("input", aplicarFiltros);
  document
    .getElementById("filtroCapacidadMin")
    .addEventListener("input", aplicarFiltros);
});
