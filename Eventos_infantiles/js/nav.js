document.addEventListener('DOMContentLoaded', function() {
    function updateNavbarVisibility() {
        try {
            const isAdmin = localStorage.getItem('admin') === 'true';
            const hasAdminKey = localStorage.getItem('admin') !== null;
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            
            // Elementos del navbar
            const adminLinkItem = document.querySelector('a[href*="adminApi.html"]')?.parentElement;
            const reservasLinkItem = document.querySelector('a[href*="verReservaLocalStorage.html"]')?.parentElement;
            const usuariosLinkItem = document.querySelector('a[href*="usuarios.html"]')?.parentElement;
            
            // Elementos de usuario
            const botonIniciarSesion = document.getElementById('botonIniciarSesion');
            const userContainer = document.getElementById('user-container');
            const avatar = document.getElementById('avatar');
            const name = document.getElementById('name');
            const logoutButton = document.getElementById('logout-button');

            // Reglas de visualización
            if (hasAdminKey) {
                // Hay clave admin (usuario logueado) - mostrar avatar y nombre, ocultar botón login
                if (botonIniciarSesion) botonIniciarSesion.style.display = 'none';
                if (logoutButton) userContainer.style.display = 'block';
                if (userContainer) userContainer.style.display = 'block';
                
                // Actualizar datos del usuario
                if (avatar && userData.avatar) avatar.src = userData.avatar;
                if (name && userData.name) name.textContent = userData.name;
                
                // Mostrar/ocultar enlaces según si es admin
                if (isAdmin) {
                    if (adminLinkItem) adminLinkItem.style.display = 'block';
                    if (usuariosLinkItem) usuariosLinkItem.style.display = 'block';
                } else {
                    if (adminLinkItem) adminLinkItem.style.display = 'none';
                    if (usuariosLinkItem) usuariosLinkItem.style.display = 'none';
                }
                
                // Mostrar reservas para todos los usuarios logueados
                if (reservasLinkItem) reservasLinkItem.style.display = 'block';
            } else {
                // No hay clave admin (usuario no logueado) - mostrar botón login, ocultar avatar
                if (botonIniciarSesion) botonIniciarSesion.style.display = 'block';
                if (userContainer) userContainer.style.display = 'none';
                
                // Ocultar enlaces protegidos
                if (adminLinkItem) adminLinkItem.style.display = 'none';
                if (usuariosLinkItem) usuariosLinkItem.style.display = 'none';
                if (reservasLinkItem) reservasLinkItem.style.display = 'none';
            }

            // Actualizar contador del carrito
            const cartCounter = document.querySelector('.notificacion-carrito');
            if (cartCounter) {
                try {
                    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
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
        if (e.key === 'admin' || e.key === 'user') {
            updateNavbarVisibility();
        }
    });
});

