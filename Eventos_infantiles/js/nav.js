document.addEventListener('DOMContentLoaded', function() {
    function updateNavbarVisibility() {
        try {
            const isAdmin = localStorage.getItem('admin') === 'true';
            const hasAdminKey = localStorage.getItem('admin') !== null;
            
            const adminLinkItem = document.querySelector('a[href*="adminApi.html"]')?.parentElement;
            const reservasLinkItem = document.querySelector('a[href*="verReservaLocalStorage.html"]')?.parentElement;
            const usuariosLinkItem = document.querySelector('a[href*="usuarios.html"]')?.parentElement;

            // Reglas de visualización
            if (isAdmin) {
                // Admin verdadero - mostrar todo
                if (adminLinkItem) adminLinkItem.style.display = 'block';
                if (reservasLinkItem) reservasLinkItem.style.display = 'block';
                if (usuariosLinkItem) usuariosLinkItem.style.display = 'block'; 
            } else if (hasAdminKey) {
                // Admin falso - ocultar solo admin
                if (usuariosLinkItem) usuariosLinkItem.style.display = 'none'; 
                if (adminLinkItem) adminLinkItem.style.display = 'none';
                if (reservasLinkItem) reservasLinkItem.style.display = 'block';
            } else {
                // No hay clave admin - ocultar ambos
                if (adminLinkItem) adminLinkItem.style.display = 'none';
                if (reservasLinkItem) reservasLinkItem.style.display = 'none';
                if (usuariosLinkItem) usuariosLinkItem.style.display = 'none'; 

            }

            // Actualizar contador del carrito
            const cartCounter = document.querySelector('.notificacion-carrito');
            if (cartCounter) {
                try {
                    const reservas = JSON.parse(localStorage.getItem('reservas_historial') || '[]');
                    cartCounter.textContent = reservas.length.toString();
                    cartCounter.style.display = reservas.length > 0 ? 'block' : 'none';
                } catch (e) {
                    console.error('Error al procesar reservas:', e);
                    cartCounter.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Error al actualizar la visibilidad del navbar:', error);
        }
    }

    // Ejecutar al cargar la página
    updateNavbarVisibility();

    // Escuchar cambios en el localStorage (para cuando se modifique el estado admin)
    window.addEventListener('storage', function(e) {
        if (e.key === 'admin') {
            updateNavbarVisibility();
        }
    });
});