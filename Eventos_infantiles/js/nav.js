// FUNCIÓN: Gestiona la visibilidad de los elementos de la navbar
// y del carrito según el estado de la sesión del usuario.
// Activa el enlace de la página actual.


document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELECCIÓN DE ELEMENTOS GLOBALES ---
    const loginButtonDiv = document.getElementById('botonIniciarSesion');
    const navUserContainer = document.getElementById('nav-user-container');
    const navAvatar = document.getElementById('nav-avatar');
    const navName = document.getElementById('nav-name');
    const navLogoutButton = document.getElementById('nav-logout-button');

    const adminLinkItem = document.getElementById('admin-link-item');
    const usuariosLinkItem = document.getElementById('usuarios-link-item');
    const carritoLinkItem = document.getElementById('carrito-link-item');
    const cartCounter = document.querySelector('.notificacion-carrito');

    // --- 2. FUNCIONES DE UTILIDAD ---

    /**
     * Extrae y normaliza el nombre de archivo de una URL o ruta.
     * @param {string} url 
     * @returns {string} 
     */
    const getNormalizedFileName = (url) => {
        
        let parsedUrl;
        try {
            
            parsedUrl = new URL(url, window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1));
        } catch (e) {
            
            let tempUrl = url;
            if (tempUrl.startsWith('./')) {
                tempUrl = tempUrl.substring(2); 
            }
            
            return tempUrl.substring(tempUrl.lastIndexOf('/') + 1).split('?')[0].split('#')[0] || 'index.html';
        }

        
        let fileName = parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf('/') + 1);

        
        if (fileName === '' || fileName.toLowerCase() === 'idweventos/') { 
            fileName = 'index.html';
        }

        
        fileName = fileName.split('?')[0].split('#')[0];

        return fileName;
    };

    // --- FUNCIÓN PRINCIPAL DE ACTUALIZACIÓN DE VISIBILIDAD DE LA NAVBAR ---
    function updateNavbarVisibility() {
        console.log("nav.js: updateNavbarVisibility: Ejecutando..."); 

        try {
            const isAdmin = localStorage.getItem('admin') === 'true';
            const isUser = localStorage.getItem('user') === 'true';
            const isLoggedIn = isAdmin || isUser;
            const username = localStorage.getItem('username');
            const userImage = localStorage.getItem('userImage');

            console.log("nav.js: updateNavbarVisibility: isLoggedIn:", isLoggedIn, "isAdmin:", isAdmin, "username:", username); 

            // Maneja la visibilidad de los botones de login/logout y avatar
            if (isLoggedIn) {
                if (loginButtonDiv) loginButtonDiv.classList.add('d-none');
                if (navUserContainer) {
                    navUserContainer.classList.remove('d-none');
                    navUserContainer.classList.add('d-flex');

                    if (navName) navName.textContent = `Hola, ${username || 'Usuario'}`;
                    if (navAvatar) navAvatar.src = userImage || 'https://via.placeholder.com/40/007bff/ffffff?text=Avatar';
                }
            } else {
                if (loginButtonDiv) loginButtonDiv.classList.remove('d-none');
                if (navUserContainer) {
                    navUserContainer.classList.add('d-none');
                    navUserContainer.classList.remove('d-flex');
                    if (navName) navName.textContent = '';
                    if (navAvatar) navAvatar.src = 'https://via.placeholder.com/40/007bff/ffffff?text=Avatar';
                }
            }

            // Maneja la visibilidad de los enlaces protegidos
            function toggleLinkVisibility(element, show) {
                if (element) {
                    if (show) {
                        element.classList.remove('d-none');
                    } else {
                        element.classList.add('d-none');
                    }
                }
            }

            toggleLinkVisibility(carritoLinkItem, isLoggedIn);

            if (isAdmin) {
                toggleLinkVisibility(adminLinkItem, true);
                toggleLinkVisibility(usuariosLinkItem, true);
            } else {
                toggleLinkVisibility(adminLinkItem, false);
                toggleLinkVisibility(usuariosLinkItem, false);
            }

            // Actualiza el contador del carrito
            if (cartCounter) {
                try {
                    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
                    cartCounter.textContent = reservas.length.toString();
                    if (reservas.length > 0 && isLoggedIn) {
                        cartCounter.classList.remove('d-none');
                    } else {
                        cartCounter.classList.add('d-none');
                    }
                } catch (e) {
                    console.error('nav.js: Error al procesar reservas para el contador:', e);
                    cartCounter.classList.add('d-none');
                }
            }
        } catch (error) {
            console.error('nav.js: Error general en updateNavbarVisibility:', error);
        }
    }

    // --- Lógica para destacar el enlace de la página actual ---
    const activarEnlaceNavegacion = () => {
        const nombreArchivoPaginaActual = getNormalizedFileName(window.location.href);
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        console.log("--- Activando enlaces de navegación ---");
        console.log(`Página actual (normalizada): ${nombreArchivoPaginaActual}`);

        navLinks.forEach(link => {
            const hrefDelEnlace = link.getAttribute('href');
            if (!hrefDelEnlace) return;

            const nombreArchivoEnlace = getNormalizedFileName(hrefDelEnlace);

            console.log(`  Comparando: Enlace '${link.textContent.trim()}' (normalizado: '${nombreArchivoEnlace}') con Página actual ('${nombreArchivoPaginaActual}')`);

            if (nombreArchivoPaginaActual === nombreArchivoEnlace) {
                link.classList.add('active');
                console.log(`  -> ¡ACTIVO!: ${link.textContent.trim()}`);
            } else {
                link.classList.remove('active');
            }
        });
        console.log("--- Fin activación enlaces de navegación ---");
    };

    /**
     * Lógica para actualizar dinámicamente el año del footer.
     */
    const actualizarAnioFooter = () => {
        const anioElemento = document.getElementById('current-year');
        if (anioElemento) {
            anioElemento.textContent = new Date().getFullYear();
        }
    };

    // --- 3. INICIALIZACIÓN Y LISTENERS ---

   
    updateNavbarVisibility();

   
    activarEnlaceNavegacion();
    actualizarAnioFooter();

    
    window.addEventListener('storage', function(e) {
        console.log("nav.js: Storage event detected:", e.key, e.newValue);
        if (['admin', 'user', 'token', 'username', 'userImage', 'reservas'].includes(e.key)) {
            updateNavbarVisibility();
            activarEnlaceNavegacion();
        }
    });

    // Añade un listener para un evento personalizado disparado por login.js
    window.addEventListener('updateUI', () => {
        updateNavbarVisibility();
        activarEnlaceNavegacion();
    });
    console.log("nav.js: Listening for 'updateUI' custom event.");

    // Adjunta evento de click al botón de cerrar sesión en la navbar
    if (navLogoutButton) {
        navLogoutButton.addEventListener('click', () => {
            console.log("nav.js: Logout button (navbar) clicked.");
            if (window.handleLogout) {
                window.handleLogout();
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('admin');
                localStorage.removeItem('user');
                localStorage.removeItem('userImage');
                localStorage.removeItem('reservas');
                window.dispatchEvent(new Event('updateUI'));
            }
            console.log('nav.js: Custom updateUI event dispatched after logout.');
        });
    }
});