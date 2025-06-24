// js/adminServicios.js

// Array para almacenar los servicios 
// let servicesData = JSON.parse(localStorage.getItem('servicesData')) || [];
let servicesData = []; // Para simulación en memoria (no persistente)

let editingServiceId = null; // Para saber si estamos editando o añadiendo

// Ejecutar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
   
    const isAdmin = localStorage.getItem('admin') === 'true';
    if (!isAdmin) {
        Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: 'Solo los administradores pueden acceder a esta sección de servicios.',
            confirmButtonText: 'Entendido'
        }).then(() => {
            window.location.href = '../index.html'; 
        });
        return; 
    }

    // Cargar datos de ejemplo si el array está vacío (solo para simulación inicial)
    if (servicesData.length === 0) {
        servicesData = [
            { id: 1, description: 'Servicio de Animación Básica (2hs)', value: 15000 },
            { id: 2, description: 'Servicio de Catering Infantil (20 niños)', value: 25000 },
            { id: 3, description: 'Decoración Temática Premium', value: 18000 }
        ];
       
        // localStorage.setItem('servicesData', JSON.stringify(servicesData));
    }
    
    renderServicesTable(servicesData); 
    updateServiceCounters(servicesData); 
    setupEventListeners(); 
});

/**
 * Renderiza la tabla de servicios en el HTML
 * @param {Array} services - 
 */
function renderServicesTable(services) {
    const tableBody = document.getElementById('servicesTableBody');
    tableBody.innerHTML = ''; 

    if (services.length === 0) {
        document.getElementById('noServicesMessage').classList.remove('d-none');
        return;
    } else {
        document.getElementById('noServicesMessage').classList.add('d-none');
    }

    services.forEach(service => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${service.id}</td>
            <td>${service.description}</td>
            <td>$${service.value.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-info edit-service-btn" data-id="${service.id}">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-service-btn" data-id="${service.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
    });

    attachTableButtonListeners(); 
}

/**
 * Actualiza los contadores de servicios
 * @param {Array} services - 
 */
function updateServiceCounters(services) {
    document.getElementById('totalServicesCount').textContent = services.length;
}

/**
 * Configura los event listeners para el formulario y los botones de la tabla
 */
function setupEventListeners() {
    const serviceForm = document.getElementById('serviceForm');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    serviceForm.addEventListener('submit', handleServiceFormSubmit);
    cancelEditBtn.addEventListener('click', resetForm);
}

/**
 * Maneja el envío del formulario de servicio (añadir/editar)
 * @param {Event} event
 */
async function handleServiceFormSubmit(event) {
    event.preventDefault(); 

    const serviceId = document.getElementById('serviceId').value;
    const description = document.getElementById('serviceDescription').value;
    const value = parseFloat(document.getElementById('serviceValue').value); 

    if (isNaN(value) || value < 0) {
        Swal.fire('Error', 'El valor debe ser un número positivo.', 'error');
        return;
    }

    const serviceData = { description, value };

    if (serviceId) {
        
        simulateUpdateService(serviceId, serviceData);
    } else {
        
        simulateAddService(serviceData);
    }
}

/**
 * Se agrega un un nuevo servicio
 * @param {Object} serviceData
 */
function simulateAddService(serviceData) {
    const newId = servicesData.length > 0 ? Math.max(...servicesData.map(s => s.id)) + 1 : 1;
    const newService = { id: newId, ...serviceData };
    servicesData.push(newService); 
    
    
    // localStorage.setItem('servicesData', JSON.stringify(servicesData));

    renderServicesTable(servicesData); 
    updateServiceCounters(servicesData); 
    resetForm(); 

    Swal.fire('¡Éxito!', 'Servicio añadido exitosamente.', 'success');
}

/**
 * Actualización de un servicio existente
 * @param {string} serviceId
 * @param {Object} serviceData
 */
function simulateUpdateService(serviceId, serviceData) {
    const index = servicesData.findIndex(s => s.id == serviceId);
    if (index !== -1) {
        servicesData[index] = { ...servicesData[index], ...serviceData };
        
        // localStorage.setItem('servicesData', JSON.stringify(servicesData));

        renderServicesTable(servicesData);
        updateServiceCounters(servicesData);
        resetForm();
        Swal.fire('¡Éxito!', 'Servicio actualizado exitosamente.', 'success');
    } else {
        Swal.fire('Error', 'Servicio no encontrado.', 'error');
    }
}

/**
 * Eliminación de un servicio
 * @param {string} serviceId
 */
function simulateDeleteService(serviceId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
        if (result.isConfirmed) {
            servicesData = servicesData.filter(service => service.id != serviceId);
            

            renderServicesTable(servicesData);
            updateServiceCounters(servicesData);
            Swal.fire('¡Eliminado!', 'El servicio ha sido eliminado.', 'success');
        }
    });
}

/**
 * Rellena el formulario con los datos de un servicio para edición
 * @param {string} serviceId
 */
function fillFormForEdit(serviceId) {
    const serviceToEdit = servicesData.find(service => service.id == serviceId);
    if (serviceToEdit) {
        document.getElementById('serviceId').value = serviceToEdit.id;
        document.getElementById('serviceDescription').value = serviceToEdit.description;
        document.getElementById('serviceValue').value = serviceToEdit.value;

        document.getElementById('serviceFormTitle').textContent = 'Editar Servicio';
        document.getElementById('saveServiceBtn').textContent = 'Guardar Cambios';
        document.getElementById('cancelEditBtn').classList.remove('d-none');
        editingServiceId = serviceId;
    }
}

/**
 * Limpia el formulario y lo resetea al modo "Añadir"
 */
function resetForm() {
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceId').value = '';
    document.getElementById('serviceFormTitle').textContent = 'Añadir Nuevo Servicio';
    document.getElementById('saveServiceBtn').textContent = 'Guardar Servicio';
    document.getElementById('cancelEditBtn').classList.add('d-none');
    editingServiceId = null;
}

/**
 * Con esto adjuntamos los listeners a los botones de editar y eliminar en la tabla

 */
function attachTableButtonListeners() {
    document.querySelectorAll('.edit-service-btn').forEach(button => {
        button.onclick = (e) => fillFormForEdit(e.currentTarget.dataset.id);
    });

    document.querySelectorAll('.delete-service-btn').forEach(button => {
        button.onclick = (e) => simulateDeleteService(e.currentTarget.dataset.id);
    });
}