// js/footer.js

document.addEventListener('DOMContentLoaded', updateFooterVisibility);
window.addEventListener('storage', updateFooterVisibility); // Sincroniza entre pestañas
window.addEventListener('updateUI', updateFooterVisibility); // Escucha eventos de login/logout

function updateFooterVisibility() {
    // Obtenemos las referencias a los enlaces del footer
    const footerAdminLink = document.getElementById('footerAdminLink');
    const footerAdminLinkContainer = document.getElementById('footerAdminLinkContainer');

    // NUEVAS REFERENCIAS para el enlace 'Usuarios' en el footer
    const footerUsuariosLink = document.getElementById('footerUsuariosLink');
    const footerUsuariosLinkContainer = document.getElementById('footerUsuariosLinkContainer');

    // Verificamos si el usuario logueado es administrador
    const isAdmin = localStorage.getItem('admin') === 'true';

    // --- Lógica para el enlace "Admin" del Footer (ya la tenías) ---
    if (footerAdminLink) {
        if (isAdmin) {
            footerAdminLink.classList.remove('d-none');
        } else {
            footerAdminLink.classList.add('d-none');
        }
    }
    if (footerAdminLinkContainer) {
        if (isAdmin) {
            footerAdminLinkContainer.classList.remove('d-none');
        } else {
            footerAdminLinkContainer.classList.add('d-none');
        }
    }

    // --- NUEVA LÓGICA para el enlace "Usuarios" del Footer ---
    if (footerUsuariosLink) {
        if (isAdmin) { // Si es administrador
            footerUsuariosLink.classList.remove('d-none'); // Mostrar el enlace "Usuarios"
        } else { // Si NO es administrador
            footerUsuariosLink.classList.add('d-none'); // Ocultar el enlace "Usuarios"
        }
    }
    if (footerUsuariosLinkContainer) {
        if (isAdmin) {
            footerUsuariosLinkContainer.classList.remove('d-none');
        } else {
            footerUsuariosLinkContainer.classList.add('d-none');
        }
    }

    // Opcional: Actualizar el año actual en el footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

// Inicializa el año al cargar la página (adicional, no relacionado con el login)
document.addEventListener('DOMContentLoaded', () => {
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});