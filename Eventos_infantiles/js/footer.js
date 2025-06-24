// js/footer.js

document.addEventListener('DOMContentLoaded', updateFooterVisibility);
window.addEventListener('storage', updateFooterVisibility); 
window.addEventListener('updateUI', updateFooterVisibility); 

function updateFooterVisibility() {
   
    const footerAdminLink = document.getElementById('footerAdminLink');
    const footerAdminLinkContainer = document.getElementById('footerAdminLinkContainer');

   
    const footerUsuariosLink = document.getElementById('footerUsuariosLink');
    const footerUsuariosLinkContainer = document.getElementById('footerUsuariosLinkContainer');

    
    const isAdmin = localStorage.getItem('admin') === 'true';

    // --- Lógica para el enlace "Admin" del Footer ---
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
        if (isAdmin) { 
            footerUsuariosLink.classList.remove('d-none'); 
        } else { 
            footerUsuariosLink.classList.add('d-none'); 
        }
    }
    if (footerUsuariosLinkContainer) {
        if (isAdmin) {
            footerUsuariosLinkContainer.classList.remove('d-none');
        } else {
            footerUsuariosLinkContainer.classList.add('d-none');
        }
    }

   const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}

