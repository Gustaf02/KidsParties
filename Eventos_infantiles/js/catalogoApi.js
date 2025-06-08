 
        const API_KEY = '9tNEjFhwUIus25QDwOd8iywPhg5QEyYDWiVS9NlvWfD2MeSClgYAU125';
        async function fetchData() {
            try {
                // Mostrar spinner de carga
                document.getElementById('loading').classList.remove('d-none');
                document.getElementById('error-message').classList.add('d-none');
                
                // Hacer ambas llamadas a API simultáneamente
                const [imagesResponse, salonesResponse] = await Promise.all([
                    fetch('https://api.pexels.com/v1/search?query=birthday&per_page=8856', {
                        headers: { 'Authorization': API_KEY }
                    }),
                    fetch('https://681a090f1ac1155635078a8f.mockapi.io/salones')
                ]);
                
                // Verificar respuestas
                if (!imagesResponse.ok) throw new Error('Error en API de imágenes');
                if (!salonesResponse.ok) throw new Error('Error en API de salones');
                
                // Convertir a JSON
                const [imagesData, salonesData] = await Promise.all([
                    imagesResponse.json(),
                    salonesResponse.json()
                ]);
                console.log(salonesData)
                console.log(imagesData)
                // Combinar datos
                const combinedData = salonesData.map((salon, index) => {
                    const imageIndex = index % imagesData.photos.length;
                    return {
                        ...salon,
                        imagen: imagesData.photos[imageIndex]?.src.medium || 'https://via.placeholder.com/300'
                    };
                });
                
                // Mostrar datos
                renderCatalog(combinedData);
                
            } catch (error) {
                console.error('Error:', error);
                showError('Error al cargar los datos: ' + error.message);
            } finally {
                document.getElementById('loading').classList.add('d-none');
            }
        }
        
        function renderCatalog(data) {
            const container = document.getElementById('catalogo-container');
            
            if (!data || data.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <h4>No hay salones disponibles</h4>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = data.map(item => `
                 <!-- Modal de Reserva -->
<div class="modal fade" id="reservaModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title">Completar Reserva</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="reservaForm">
          <div class="mb-3">
            <label class="form-label">Nombre Completo</label>
            <input type="text" class="form-control" id="nombreCliente" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Teléfono</label>
            <input type="tel" class="form-control" id="telefonoCliente" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Fecha del Evento</label>
            <input type="date" class="form-control" id="fechaEvento" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Cantidad de Personas</label>
            <input type="number" class="form-control" id="cantidadPersonas" min="1" required>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="confirmarReserva" onclick="confirmarReserva()">Confirmar Reserva</button>
      </div>
    </div>
  </div>
</div>
                <div class="col-lg-4 col-md-8 mb-4">
    <div class="card h-100 border-0 shadow-hover">
        <!-- Encabezado con imagen y etiqueta -->
        <div class="position-relative overflow-hidden rounded-top">
            <img src="${item.imagen}" 
                 class="card-img-top img-fluid salon-image" 
                 alt="${item.nombre}"
                 onerror="this.src='https://images.unsplash.com/photo-1575425186775-b8de9a427e67?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80'">
            <div class="position-absolute top-0 start-0 text-dark px-3 py-1 rounded-end">
               <!--lass="bi bi-stars me-1"></i> -->
            </div>
            <div class="image-overlay"></div>
        </div>

        <!-- Cuerpo de la tarjeta -->
        <div class="card-body pb-0 position-relative">
            <!-- Precio con efecto burbuja -->
            <div class="position-absolute top-0 end-0 translate-middle-y">
                <div class="bg-success text-white rounded-circle price-bubble d-flex align-items-center justify-content-center">
                    <span class="fw-bold">$${(item.precio || 0).toLocaleString('es-AR')}</span>
                </div>
            </div>
            
            <h5 class="card-title fw-bold text-primary mb-3">${item.nombre}</h5>
            
            <!-- Características -->
            <div class="d-flex flex-column gap-2 mb-3">
                <div class="d-flex align-items-center">
                    <i class="bi bi-people-fill text-info me-2"></i>
                    <span>Capacidad: <strong>${item.capacidad || '20'}</strong> niños</span>
                </div>
                <div class="d-flex align-items-center">
                    <i class="bi bi-geo-alt-fill text-danger me-2"></i>
                    <span>${item.ubicacion || 'CABA'}</span>
                </div>
                <div class="d-flex align-items-center">
                    <i class="bi bi-calendar2-check-fill text-success me-2"></i>
                    <span>${item.fecha || 'Disponible'}</span>
                </div>
                <p class="card-text text-muted">${item.descripcion || 'Sin descripción adicional.'}</p>
            </div>
        </div>

        <!-- Pie de tarjeta -->
        <div class="card-footer bg-transparent border-0 pt-0 pb-3">
            <button class="btn btn-reservar w-100 py-2"
            onClick="reservar('${item.id}')">
                <i class="bi bi-balloon-heart-fill me-2"></i> Reservar ahora
            </button>
        </div>
       
    </div>
</div>
               
            `).join('');
        }
        
        function showError(message) {
            const errorDiv = document.getElementById('error-message');
            errorDiv.textContent = message;
            errorDiv.classList.remove('d-none');
        }
        
        // Iniciar la carga de datos cuando la página esté lista
        document.addEventListener('DOMContentLoaded', fetchData);


// Función para reservar
async function reservar(salonId) {
    try {
        // Mostrar modal de reserva
        const modal = new bootstrap.Modal(document.getElementById('reservaModal'));
        modal.show();

        // Guardar ID en el botón confirmar
        document.getElementById('confirmarReserva').dataset.salonId = salonId;
    } catch (error) {
        console.error('Error al iniciar reserva:', error);
        alert('Error al iniciar el proceso de reserva');
    }
}

// Confirmar reserva (llamada desde el modal)
async function confirmarReserva() {
    const salonId = document.getElementById('confirmarReserva').dataset.salonId;
    const nombreCliente = document.getElementById('nombreCliente').value;
    const telefonoCliente = document.getElementById('telefonoCliente').value;
    const fechaEvento = document.getElementById('fechaEvento').value;
    const cantidadPersonas = document.getElementById('cantidadPersonas').value;

    if (!nombreCliente || !telefonoCliente || !fechaEvento || !cantidadPersonas) {
        alert('Por favor complete todos los campos');
        return;
    }

    try {
        // Crear objeto de reserva
        const reservaData = {
            salonId: salonId,
            cliente: nombreCliente,
            telefono: telefonoCliente,
            fechaEvento: fechaEvento,
            cantidadPersonas: cantidadPersonas,
            fechaReserva: new Date().toISOString().split('T')[0]
        };

        // Enviar reserva a la API
        const response = await fetch('https://681a090f1ac1155635078a8f.mockapi.io/salones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservaData)
        });

        if (!response.ok) throw new Error('Error en la respuesta de la API');

        alert('¡Reserva realizada con éxito!');
        
        // Cerrar modal y limpiar formulario
        const modal = bootstrap.Modal.getInstance(document.getElementById('reservaModal'));
        modal.hide();
        document.getElementById('reservaForm').reset();
        
    } catch (error) {
        console.error('Error en reserva:', error);
        alert('Error al realizar la reserva: ' + error.message);
    }
}
