document.addEventListener('DOMContentLoaded', function() {
    // Obtener el estado de admin del localStorage
    const isAdmin = localStorage.getItem('admin') === 'true';
    
    // Buscar el enlace de Admin en el navbar
    const adminLinkItem = document.querySelector('.nav-item a[href="./admin.html"]').closest('.nav-item');
    
    // Mostrar u ocultar según el privilegio
    if (!isAdmin && adminLinkItem) {
        adminLinkItem.style.display = 'none';
    }
});