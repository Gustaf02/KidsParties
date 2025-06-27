// FUNCIÓN: Gestiona el inicio/cierre de sesión y actualiza
// el estado de la sesión en la navbar.


document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURACIÓN Y SELECCIÓN DE ELEMENTOS ---
    const API_ENDPOINT = 'https://dummyjson.com/auth/login'; 

    // --- Elementos del Formulario de Login (en el modal)
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const spinner = document.getElementById('spinner');
    const errorMessage = document.getElementById('error-message');

    //if (loginForm) console.log("login.js: Funcionando ok."); 

    // --- 2. FUNCIONES DE UTILIDAD 

    // Función para verificar el estado de sesión al cargar la página
    function checkSessionAndLoadUserData() {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const isAdmin = localStorage.getItem('admin') === 'true';
        const isUser = localStorage.getItem('user') === 'true';

        if (token && (isAdmin || isUser)) {
            console.log(" Usuario logueado. Nombre:", username, "Admin:", isAdmin); 
        } else {
           
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('admin');
            localStorage.removeItem('user');
            localStorage.removeItem('userImage');
        }
        // Chequea la sesión y dispara el evento para que la navbar se actualice.
        window.dispatchEvent(new Event('updateUI'));
    }


    // --- 3. MANEJO DEL LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
           

            spinner.style.display = 'block';
            errorMessage.textContent = ''; 

            const username = usernameInput.value;
            const password = passwordInput.value;

            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    
                    errorMessage.textContent = errorData.message || 'Ingresaste erróneamente usuario o contraseña.';
                    throw new Error(errorData.message || 'Error en el login'); 
                }

                const data = await response.json();
                console.log('login.js: Login exitoso:', data); 

                // Definir el usuario administrador 
                const isAdminUser = data.username === 'emilys'; 

                // Guardar información en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('admin', isAdminUser ? 'true' : 'false');
                localStorage.setItem('user', isAdminUser ? 'false' : 'true'); 
                if (data.image) {
                    localStorage.setItem('userImage', data.image); 
                } else {
                    localStorage.removeItem('userImage');
                    console.warn('login.js: API no proporcionó URL de imagen para el usuario. Usando placeholder.'); 
                }

                // Oculta el modal de login
                const loginModalElement = document.getElementById('loginModal');
                let loginModal = bootstrap.Modal.getInstance(loginModalElement);
                if (!loginModal) {
                    loginModal = new bootstrap.Modal(loginModalElement);
                }
                if (loginModal) {
                    loginModal.hide();
                    console.log('login.js: Login modal hidden.'); 
                }

                // Mensaje de inicio de sesión
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: `Iniciaste sesión como ${data.username}.`,
                    showConfirmButton: false,
                    timer: 2000
                });

                // Dispara el evento personalizado para que nav.js se actualice en la misma pestaña
                window.dispatchEvent(new Event('updateUI'));
                console.log('login.js: Custom updateUI event dispatched.'); 

            } catch (error) {
                console.error('login.js: Error durante el login:', error); 
                
                let userFriendlyMessage = 'Error al iniciar sesión. Por favor, verificá tu usuario y contraseña.';

                // Si el error contiene "credentials" o "invalid", lo hacemos más genérico
                if (error.message && (error.message.includes('credentials') || error.message.includes('invalid'))) {
                    userFriendlyMessage = 'Usuario o contraseña incorrectos. Por favor, intentalo de nuevo.';
                } else if (error.message) {
                   
                    userFriendlyMessage = `Error: ${error.message}`;
                } else {
                    userFriendlyMessage = 'Ocurrió un error inesperado al intentar iniciar sesión.';
                }
                
                errorMessage.textContent = userFriendlyMessage; 
                // SweetAlert para errores críticos
                Swal.fire({
                    icon: 'error',
                    title: 'Fallo al iniciar sesión',
                    text: userFriendlyMessage, 
                    confirmButtonText: 'Entendido'
                });
            } finally {
                spinner.style.display = 'none';
            }
        });
    }
    // --- 4. MANEJO DEL LOGOUT ---
    function handleLogout() {
        console.log("login.js: Logout triggered."); 
        
        // *** MENSAJE DE CONFIRMACIÓN CON SWEETALERT2 ***
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: 'Estás a punto de cerrar tu sesión actual.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Limpia datos en localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('admin');
                localStorage.removeItem('user');
                localStorage.removeItem('userImage');
                localStorage.removeItem('reservas'); 

                // Dispara el evento personalizado para que nav.js se actualice inmediatamente
                window.dispatchEvent(new Event('updateUI'));
                console.log('login.js: Custom updateUI event dispatched after logout.'); 

                // Mensaje de éxito de logout
                Swal.fire({
                    icon: 'success',
                    title: 'Sesión cerrada',
                    text: 'Cerraste sesión exitosamente.',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    // Redirección obligatoria si el usuario está en una de estas páginas
                    const currentPage = window.location.pathname.split('/').pop(); 
                    const pagesToRedirect = ['adminServicios.html','adminApi.html', 'usuarios.html', 'verReservaLocalStorage.html'];

                    if (pagesToRedirect.includes(currentPage)) {
                        console.log(`login.js: Redirecting from ${currentPage} to index.html`);
                        window.location.href = '../index.html'; 
                    } else {
                        console.log(`login.js: Not redirecting from ${currentPage}.`); 
                        
                        // window.location.reload(); 
                    }
                });
            } else {
                console.log("login.js: Logout cancelled."); 
            }
        });
    }

    // --- 5. INICIALIZACIÓN ---
    // Verificar el estado de sesión y cargar datos al cargar la página
    checkSessionAndLoadUserData();

    
    window.addEventListener('storage', (event) => {
        console.log("login.js: Storage event detected in login.js:", event.key); 
        if (['token', 'username', 'admin', 'user', 'userImage', 'reservas'].includes(event.key)) {
           
            window.dispatchEvent(new Event('updateUI'));
            
            if (event.key === 'token' && !localStorage.getItem('token')) { 
                const currentPage = window.location.pathname.split('/').pop();
                const pagesToRedirect = ['adminApi.html', 'usuarios.html', 'verReservaLocalStorage.html'];
                if (pagesToRedirect.includes(currentPage)) {
                    console.log(`login.js: Storage event triggered redirect from ${currentPage} to index.html.`);
                    window.location.href = '../index.html';
                }
            }
        }
    });

    // Hacemos handleLogout global para que nav.js pueda llamarlo
    window.handleLogout = handleLogout;
});

document.addEventListener('DOMContentLoaded', function() {
    // Función para copiar texto
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const textToCopy = this.getAttribute('data-text');
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Cambiar temporalmente el texto del botón
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="bi bi-check2"></i> Copiado!';
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Error al copiar: ', err);
                });
        });
    });
});