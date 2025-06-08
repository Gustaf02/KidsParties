/**
 * Links de prueba imagenes pixel API
 * https://api.pexels.com/v1/search?query=birthday+backdrop+colorful&per_page=100
 * https://api.pexels.com/v1/search?query=children+playzone+decoration&per_page=100
 */



const API_KEY = '9tNEjFhwUIus25QDwOd8iywPhg5QEyYDWiVS9NlvWfD2MeSClgYAU125';
        let salonSeleccionado = null;

        async function fetchData() {
            try {
                document.getElementById('loading').classList.remove('d-none');
                document.getElementById('error-message').classList.add('d-none');
                
                const [imagesResponse, salonesResponse] = await Promise.all([
                    fetch('https://api.pexels.com/v1/search?query=birthday+backdrop+colorful&per_page=100', {
                        headers: { 'Authorization': API_KEY }
                    }),
                    fetch('https://681a090f1ac1155635078a8f.mockapi.io/salones')
                ]);
                
                if (!imagesResponse.ok) throw new Error('Error en API de imágenes');
                if (!salonesResponse.ok) throw new Error('Error en API de salones');
                
                const [imagesData, salonesDataApi] = await Promise.all([
                    imagesResponse.json(),
                    salonesResponse.json()
                ]);
                
             salonesData = salonesDataApi.map((salon) => {
    // Convertir el ID a número y usarlo como índice
    const idNum = parseInt(salon.id);
    const imageIndex = idNum % imagesData.photos.length;
    return {
        ...salon,
        imagen: imagesData.photos[imageIndex]?.src.medium || PLACEHOLDER_IMAGE
    };
});
                renderCatalog(salonesData);
                
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
                                    <span class="fw-bold">$${(item.precio || 0).toLocaleString('es-AR')}</span>
                                </div>
                            </div>
                            
                            <h5 class="card-title fw-bold text-primary mb-3 mt-4">${item.nombre}</h5>
                            
                            <div class="d-flex flex-column gap-2 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-people-fill text-info feature-icon me-2"></i>
                                    <span>Capacidad: <strong>${item.capacidad || '20'}</strong> niños</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-geo-alt-fill text-danger feature-icon me-2"></i>
                                    <span>${item.ubicacion || 'CABA'}</span>
                                </div>
                            
                                <p class="card-text text-muted mt-2">${item.descripcion || 'Sin descripción adicional.'}</p>
                            </div>
                        </div>

                        <div class="card-footer bg-transparent border-0 pt-0 pb-3">
                            <button class="btn btn-reservar w-100 py-2"
                                onclick="reservar('${item.id}', ${item.capacidad}, '${item.nombre}','${item.precio}')">
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
        
        function reservar(salonId, capacidad, nombreSalon, precioSalon) {
            salonSeleccionado = {
                id: salonId,
                capacidad: capacidad,
                nombre: nombreSalon,
                precio: precioSalon,
            };
            
            // Actualizar título del modal
            document.getElementById('modalSalonTitle').textContent = `Reservar: ${nombreSalon}`;
            //document.getElementById('modalPrecio').textContent = `Precio: ${precioSalon}`;
            
            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('reservaModal'));
            modal.show();
        }
        
        // Función para guardar reserva en localStorage
        function guardarReserva(reserva) {
            // Obtener reservas existentes o inicializar array
            const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
            
            // Verificar si ya existe una reserva para la misma fecha
            const reservaExistente = reservas.find(r => 
                r.salonId === reserva.salonId && r.fechaEvento === reserva.fechaEvento
            );
            
            if (reservaExistente) {
                alert('Ya existe una reserva para este salón en la fecha seleccionada');
                return false;
            }
            
            // Agregar nueva reserva
            reservas.push(reserva);
            
            // Guardar en localStorage
            localStorage.setItem('reservas', JSON.stringify(reservas));
            
            return true;
        }
        
        // Configurar evento para el botón de confirmar reserva
        document.getElementById('btnConfirmarReserva').addEventListener('click', function() {
            if (!salonSeleccionado) {
                alert('Error: No se seleccionó ningún salón');
                return;
            }
            
            const nombreCliente = document.getElementById('nombreCliente').value;
            const telefonoCliente = document.getElementById('telefonoCliente').value;
            const fechaEvento = document.getElementById('fechaEvento').value;
            const cantidadPersonas = parseInt(document.getElementById('cantidadPersonas').value);
            
            // Validaciones
            if (!nombreCliente || !telefonoCliente || !fechaEvento || !cantidadPersonas) {
                alert('Por favor complete todos los campos');
                return;
            }
            
            if (cantidadPersonas > salonSeleccionado.capacidad) {
                alert(`La capacidad máxima es de ${salonSeleccionado.capacidad} personas`);
                return;
            }
            
            // Crear objeto de reserva
            const reserva = {
                salonId: salonSeleccionado.id,
                salonNombre: salonSeleccionado.nombre,
                cliente: nombreCliente,
                telefono: telefonoCliente,
                fechaEvento: fechaEvento,
                cantidadPersonas: cantidadPersonas,
                fechaReserva: new Date().toISOString().split('T')[0]
            };
            
            // Guardar en localStorage
            if (guardarReserva(reserva)) {
                alert(`¡Reserva para ${salonSeleccionado.nombre} realizada con éxito!`);
                
                // Cerrar modal y resetear formulario
                bootstrap.Modal.getInstance(document.getElementById('reservaModal')).hide();
                document.getElementById('reservaForm').reset();
            }
        });
        
        // Iniciar la carga de datos
        document.addEventListener('DOMContentLoaded', fetchData);
        
        // Inicializar campo de fecha con fecha mínima de hoy
        window.onload = function() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('fechaEvento').min = today;
        };
