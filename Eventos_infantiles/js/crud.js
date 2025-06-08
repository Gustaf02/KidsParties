// Constantes
        const API_KEY = '9tNEjFhwUIus25QDwOd8iywPhg5QEyYDWiVS9NlvWfD2MeSClgYAU125';
        
        const API_URL = 'https://681a090f1ac1155635078a8f.mockapi.io/salones';
        const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1575425186775-b8de9a427e67?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80';
        
        // Elementos DOM
        const catalogoContainer = document.getElementById('catalogo-container');
        const loadingElement = document.getElementById('loading');
        const errorMessageElement = document.getElementById('error-message');
        const refreshButton = document.getElementById('refresh-btn');
        
        // Variables globales
        let salonesData = [];
        
        // Inicialización
        document.addEventListener('DOMContentLoaded', function() {
            cargarSalones();
            
            // Configurar botón de refrescar
            refreshButton.addEventListener('click', cargarSalones);
            
            // Configurar botones de los modales
            document.getElementById('btn-add-saloon').addEventListener('click', crearSalon);
            document.getElementById('btn-update-saloon').addEventListener('click', actualizarSalon);
            document.getElementById('btn-delete-saloon').addEventListener('click', borrarSalon);
        });
        
        // Función para cargar salones desde la API
        async function cargarSalones() {
            try {
                // Mostrar spinner de carga
                document.getElementById('loading').classList.remove('d-none');
                document.getElementById('error-message').classList.add('d-none');
                
                // Hacer ambas llamadas a API simultáneamente
                const [imagesResponse, salonesResponse] = await Promise.all([
                    fetch('https://api.pexels.com/v1/search?query=kids+party+paint&colorful=true&per_page=88', {
                        headers: { 'Authorization': API_KEY }
                    }),
                    fetch('https://681a090f1ac1155635078a8f.mockapi.io/salones')
                ]);
                
                // Verificar respuestas
                if (!imagesResponse.ok) throw new Error('Error en API de imágenes');
                if (!salonesResponse.ok) throw new Error('Error en API de salones');
                
                // Convertir a JSON
                const [imagesData, salonesDataApi] = await Promise.all([
                    imagesResponse.json(),
                    salonesResponse.json()
                ]);
                console.log(salonesData)
                console.log(imagesData)
                // Combinar datos
                salonesData= salonesDataApi.map((salon, index) => {
                    const imageIndex = index % imagesData.photos.length;
                    return {
                        ...salon,
                        imagen: imagesData.photos[imageIndex]?.src.medium || 'https://via.placeholder.com/300'
                    };
                });
               // salonesData = await response.json();
                renderizarCatalogo(salonesData);
                //actualizarEstadisticas(salonesData);
                
            } catch (error) {
                console.error('Error:', error);
                mostrarError('Error al cargar los datos: ' + error.message);
            } finally {
                mostrarCarga(false);
            }
        }
        
        // Función para crear un nuevo salón
        async function crearSalon() {
            const nombre = document.getElementById('add-nombre').value;
            const capacidad = document.getElementById('add-capacidad').value;
            const precio = document.getElementById('add-precio').value;
            const ubicacion = document.getElementById('add-ubicacion').value;
            const fecha = document.getElementById('add-fecha').value;
            const imagen = document.getElementById('add-imagen').value || PLACEHOLDER_IMAGE;
            const descripcion = document.getElementById('add-descripcion').value;
            const catering = document.getElementById('add-catering').checked;
            const maquillaje = document.getElementById('add-maquillaje').checked;
            
            if (!nombre || !capacidad || !precio || !ubicacion || !fecha) {
                mostrarToast('error', 'Por favor complete todos los campos obligatorios');
                return;
            }
            
            const salonData = {
                nombre,
                capacidad: parseInt(capacidad),
                precio: precio.toString(),
                ubicacion,
                fecha,
                imagen,
                descripcion,
                catering,
                maquillaje
            };
            
            try {
                mostrarCarga(true);
                
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(salonData)
                });
                localStorage.setItem("nombre salon:", salonData.nombre)
                if (!response.ok) throw new Error('Error al crear el salón');
                
                mostrarToast('success', 'Salón creado correctamente');
                document.getElementById('add-form').reset();
                bootstrap.Modal.getInstance(document.getElementById('addModal')).hide();
                await cargarSalones();
                localStorage.setItem(salonData.nombre)
                
            } catch (error) {
                console.error('Error:', error);
                mostrarToast('error', 'Error al crear el salón: ' + error.message);
            } finally {
                mostrarCarga(false);
            }
        }
        
        // Función para actualizar un salón existente
        async function actualizarSalon() {
            const id = document.getElementById('edit-id').value;
            const nombre = document.getElementById('edit-nombre').value;
            const capacidad = document.getElementById('edit-capacidad').value;
            const precio = document.getElementById('edit-precio').value;
            const ubicacion = document.getElementById('edit-ubicacion').value;
            const fecha = document.getElementById('edit-fecha').value;
            const imagen = document.getElementById('edit-imagen').value;
            const descripcion = document.getElementById('edit-descripcion').value;
            const catering = document.getElementById('edit-catering').checked;
            const maquillaje = document.getElementById('edit-maquillaje').checked;
            
            if (!nombre || !capacidad || !precio || !ubicacion || !fecha) {
                mostrarToast('error', 'Por favor complete todos los campos obligatorios');
                return;
            }
            
            const salonData = {
                nombre,
                capacidad: parseInt(capacidad),
                precio: precio.toString(),
                ubicacion,
                fecha,
                imagen,
                descripcion,
                catering,
                maquillaje
            };
            
            try {
                mostrarCarga(true);
                
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(salonData)
                });
                
                if (!response.ok) throw new Error('Error al actualizar el salón');
                
                mostrarToast('success', 'Salón actualizado correctamente');
                bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
                await cargarSalones();
                
            } catch (error) {
                console.error('Error:', error);
                mostrarToast('error', 'Error al actualizar el salón: ' + error.message);
            } finally {
                mostrarCarga(false);
            }
        }
        
        // Función para borrar un salón
        async function borrarSalon() {
            const id = document.getElementById('delete-id').value;
            
            try {
                mostrarCarga(true);
                
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) throw new Error('Error al eliminar el salón');
                
                mostrarToast('success', 'Salón eliminado correctamente');
                bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
                await cargarSalones();
                
            } catch (error) {
                console.error('Error:', error);
                mostrarToast('error', 'Error al eliminar el salón: ' + error.message);
            } finally {
                mostrarCarga(false);
            }
        }
        
        // Función para abrir el modal de edición
        function abrirModalEditar(id) {
            const salon = salonesData.find(s => s.id === id);
            if (!salon) return;
            
            document.getElementById('edit-id').value = salon.id;
            document.getElementById('edit-nombre').value = salon.nombre;
            document.getElementById('edit-capacidad').value = salon.capacidad;
            document.getElementById('edit-precio').value = salon.precio;
            document.getElementById('edit-ubicacion').value = salon.ubicacion;
            document.getElementById('edit-fecha').value = salon.fecha;
            document.getElementById('edit-imagen').value = salon.imagen;
            document.getElementById('edit-descripcion').value = salon.descripcion || '';
            document.getElementById('edit-catering').checked = salon.catering || false;
            document.getElementById('edit-maquillaje').checked = salon.maquillaje || false;
            
            const editModal = new bootstrap.Modal(document.getElementById('editModal'));
            editModal.show();
        }
        
        // Función para abrir el modal de eliminación
        function abrirModalEliminar(id) {
            const salon = salonesData.find(s => s.id === id);
            if (!salon) return;
            
            document.getElementById('delete-id').value = salon.id;
            document.getElementById('delete-saloon-name').textContent = salon.nombre;
            document.getElementById('delete-saloon-location').textContent = salon.ubicacion;
            document.getElementById('delete-saloon-capacity').textContent = salon.capacidad;
            document.getElementById('delete-saloon-price').textContent = salon.precio;
            
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
            deleteModal.show();
        }
        
        // Función para renderizar el catálogo
        function renderizarCatalogo(data) {
            catalogoContainer.innerHTML = '';
            
            if (!data || data.length === 0) {
                catalogoContainer.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <h4>No hay salones disponibles</h4>
                        <p class="text-muted">Utilice el botón "Nuevo Salón" para agregar salones</p>
                    </div>
                `;
                return;
            }
            
            data.forEach(item => {
                const salonCard = document.createElement('div');
                salonCard.className = 'col';
                salonCard.innerHTML = `
                    <div class="card h-100 salon-card">
                        <div class="position-relative">
                            <img src="${item.imagen || PLACEHOLDER_IMAGE}   " 
                                 class="card-img-top salon-image" 
                                 alt="${item.nombre}"
                                 onerror="this.src='${PLACEHOLDER_IMAGE}'">
                            <div class="price-bubble bg-success text-white rounded-circle d-flex align-items-center justify-content-center">
                                <span class="fw-bold">$${parseFloat(item.precio).toLocaleString('es-AR', {minimumFractionDigits: 2})}</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${item.nombre}</h5>
                            <div class="d-flex flex-column gap-2 mb-3">
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-people-fill text-info me-2"></i>
                                    <span>Capacidad: <strong>${item.capacidad}</strong> niños</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-geo-alt-fill text-danger me-2"></i>
                                    <span>${item.ubicacion}</span>
                                </div>
                                <div class="d-flex align-items-center">
                                    <i class="bi bi-calendar2-check-fill text-success me-2"></i>
                                    <span>${traducirDia(item.fecha)}</span>
                                </div>
                                ${item.catering ? `<div class="d-flex align-items-center">
                                    <i class="bi bi-cup-straw text-warning me-2"></i>
                                    <span>Incluye catering</span>
                                </div>` : ''}
                                ${item.maquillaje ? `<div class="d-flex align-items-center">
                                    <i class="bi bi-brush text-primary me-2"></i>
                                    <span>Incluye servicio de maquillaje</span>
                                </div>` : ''}
                            </div>
                            <p class="card-text text-muted">${item.descripcion || 'Sin descripción adicional.'}</p>
                        </div>
                        <div class="card-footer bg-white border-0 pt-0 pb-3 action-buttons">
                            <button class="btn btn-primary" onclick="abrirModalEditar('${item.id}')">
                                <i class="bi bi-pencil-square me-1"></i> Editar
                            </button>
                            <button class="btn btn-danger" onclick="abrirModalEliminar('${item.id}')">
                                <i class="bi bi-trash me-1"></i> Eliminar
                            </button>
                        </div>
                    </div>
                `;
                catalogoContainer.appendChild(salonCard);
            });
        }
        
        // Función para actualizar estadísticas
        function actualizarEstadisticas(data) {
            const totalSalones = data.length;
            const totalCapacidad = data.reduce((sum, salon) => sum + parseInt(salon.capacidad), 0);
            const totalValor = data.reduce((sum, salon) => sum + parseFloat(salon.precio), 0);
            
            document.getElementById('total-salones').textContent = totalSalones;
            document.getElementById('total-capacidad').textContent = totalCapacidad;
            document.getElementById('total-valor').textContent = totalValor.toLocaleString('es-AR', {minimumFractionDigits: 2});
        }
        
        // Función para traducir días de la semana
        function traducirDia(day) {
            const dias = {
                'Monday': 'Lunes',
                'Tuesday': 'Martes',
                'Wednesday': 'Miércoles',
                'Thursday': 'Jueves',
                'Friday': 'Viernes',
                'Saturday': 'Sábado',
                'Sunday': 'Domingo'
            };
            return dias[day] || day;
        }
        
        // Función para mostrar/ocultar carga
        function mostrarCarga(mostrar) {
            if (mostrar) {
                loadingElement.classList.remove('d-none');
            } else {
                loadingElement.classList.add('d-none');
            }
        }
        
        // Función para mostrar errores
        function mostrarError(mensaje) {
            errorMessageElement.textContent = mensaje;
            errorMessageElement.classList.remove('d-none');
        }
        
        // Función para mostrar toast
        function mostrarToast(tipo, mensaje) {
            const toastId = tipo === 'success' ? 'successToast' : 'errorToast';
            const toastElement = document.getElementById(toastId);
            
            // Actualizar mensaje
            toastElement.querySelector('.toast-body').textContent = mensaje;
            
            // Mostrar toast
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
        }