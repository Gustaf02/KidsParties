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
      imagen: "../img/tp_des_web_portada_0.webp",
    },
    {
      id: 3,
      nombre: "Mi primer año",
      capacidad: 40,
      precio: 85000,
      fecha: "2025-12-02",
      imagen: "../img/tp_desweb_portada_1.webp",
    },
    {
      id: 2,
      nombre: "Game Over Party",
      capacidad: 25,
      precio: 25000,
      fecha: "2025-12-02",
      imagen: "../img/tp_desweb_portada_2.webp",
    },

    {
      id: 4,
      nombre: "Caritas Creativas",
      capacidad: 20,
      precio: 90000,
      fecha: "2025-12-02",
      imagen: "../img/tp_desweb_portada_3.webp",
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
        imagen: salon.imagen || "img/placeholder.jpg",
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
  galeria.innerHTML = "";

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
    <div class="card-img-container">
        <img src="${salon.imagen}" 
             class="card-img-top img-fluid" 
             alt="${salon.nombre}"
             onerror="this.onerror=null;this.src='../img/tp_des_web_portada_0.webp'">
        <div class="card-img-overlay d-flex justify-content-end align-items-start">
            <span class="badge bg-dark opacity-75">${
              salon.tipo || "Salón"
            }</span>
        </div>
    </div>
    <div class="card-body">
        <h5 class="card-title">${salon.nombre}</h5>
        <div class="salon-features mb-3">
            <div class="d-flex align-items-center mb-2">
                <i class="bi bi-people-fill me-2 text-primary"></i>
                <span class="text-muted">${salon.capacidad} personas</span>
            </div>
            <div class="d-flex align-items-center">
                <i class="bi bi-currency-dollar me-2 text-success"></i>
                <span class="text-muted">$${salon.precio.toLocaleString()}</span>
            </div>
        </div>
        <p class="card-text"><small class="text-muted"><i class="bi bi-calendar3 me-1"></i> ${new Date(
          salon.fecha
        ).toLocaleDateString()}</small></p>
    </div>
    <div class="card-footer bg-transparent border-top-0">
        <button class="btn btn-outline-primary w-100">Reservar</button>
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

//Amin
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("salon-form");
  const salonList = document.getElementById("salones-list");

  // Cargar salones al inicio
  function loadSalones() {
    salonList.innerHTML = "";
    const salones = getSalones();
    salones.forEach((salon) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${salon.id}</td>
            <td>${salon.nombre}</td>
            <td>${salon.capacidad}</td>
            <td>${salon.precio}</td>
            <td>${salon.fecha}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editSalon(${salon.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteSalon(${salon.id})">Eliminar</button>
            </td>
        `;
      salonList.appendChild(row);

      console.log(salones);
    });
  }

  // Manejar el envío del formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const salon = {
      id: parseInt(document.getElementById("salon-id").value) || null,
      nombre: document.getElementById("nombre").value,
      capacidad: document.getElementById("capacidad").value,
      precio: document.getElementById("precio").value,
      fecha: document.getElementById("fecha").value,
    };

    if (!salon.nombre || !salon.capacidad || !salon.precio || !salon.fecha) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (salon.id) {
      updateSalon(salon);
      alert("Salón actualizado con éxito.");
    } else {
      addSalon(salon);
      alert("Salón agregado con éxito.");
    }
    loadSalones();
    form.reset();
  });

  // Editar salón
  window.editSalon = function (id) {
    const salones = getSalones();
    const salon = salones.find((s) => s.id === parseInt(id));
    if (salon) {
      document.getElementById("salon-id").value = salon.id;
      document.getElementById("nombre").value = salon.nombre;
      document.getElementById("capacidad").value = salon.capacidad;
      document.getElementById("precio").value = salon.precio;
      document.getElementById("fecha").value = salon.fecha;
    }
  };
  // Función para eliminar un salón (versión corregida)
  window.deleteSalon = function (id) {
    if (confirm("¿Estás seguro de eliminar este salón?")) {
      try {
        id = parseInt(id); // Convertir a número
        const salones = getSalones().filter((salon) => salon.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(salones));
        loadSalones(); // Actualizar la vista
        console.log(`Salón con ID ${id} eliminado correctamente`);
      } catch (error) {
        console.error("Error al eliminar salón:", error);
        alert("Ocurrió un error al eliminar el salón");
      }
    }
  };
  loadSalones();
});
