document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const spinner = document.getElementById('spinner');
  const errorMessage = document.getElementById('error-message');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';
    spinner.style.display = 'block';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'  
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      spinner.style.display = 'none';
      console.log('Respuesta:', data);

      

    // Dentro del bloque if (response.ok) { ... } del login:
if (response.ok) {
    const isAdmin = username === 'emilys' && password === 'emilyspass';
    localStorage.setItem('admin', isAdmin.toString());
    
    // Guardar los datos del usuario para usarlos después
    localStorage.setItem('userData', JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image
    }));

    document.getElementById('user-nav-item').style.display = 'none';
    document.getElementById('user-container').style.display = 'flex'; // Cambiado a flex para que se vea bien
    const avatarImg = document.getElementById('avatar');
    avatarImg.src = data.image || 'https://i.pravatar.cc/100';
    avatarImg.style.display = 'block'; // Asegurar que la imagen sea visible
    document.getElementById('name').textContent = `${data.firstName} ${data.lastName}`;
    document.getElementById('admin-status').textContent = '👤 Usuario externo';

    Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `${data.firstName} ${data.lastName}, has iniciado sesión correctamente.`,
        confirmButtonColor: '#3085d6'
    });
} else {
        throw new Error(data.message || 'Credenciales inválidas');
      }

    } catch (error) {
      spinner.style.display = 'none';
      console.error('Error:', error);
      errorMessage.textContent = error.message;

      Swal.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: error.message,
        confirmButtonColor: '#d33'
      });
    }
  });

  // Función de logout
const logout = () => {
    localStorage.clear(); 
    const avatar = document.getElementById('avatar');
    avatar.src = ''; // Limpiar la imagen
    avatar.style.display = 'none'; 
    document.getElementById('logout-button').style.display = 'none'; 
    document.getElementById('botonIniciarSesion').style.display = 'block';
    document.getElementById('user-container').style.display = 'none'; // Ocultar el contenedor completo
};

const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}
});


// document.addEventListener('DOMContentLoaded', function() {
//     // Verificar si hay un usuario logueado
//     const userNavItem = document.getElementById('user-nav-item');
//     const loginButton = document.getElementById('botonIniciarSesion');
//     const userNavInfo = document.getElementById('user-nav-info');
//     const navAvatar = document.getElementById('nav-avatar');
//     const navUsername = document.getElementById('nav-username');
//     const navLogoutButton = document.getElementById('nav-logout-button');

//     function checkUserLogin() {
//         const adminData = localStorage.getItem('admin');
        
//         if (adminData) {
//             try {
//                 const user = JSON.parse(adminData);
                
//                 // Mostrar información del usuario en el nav
                
//                 // userNavItem.style.display = 'none';
//                 // userNavInfo.style.display = 'flex';
                
//                 // Configurar avatar (puedes usar un placeholder si no hay imagen)
//                 // navAvatar.src = user.avatar || 'https://via.placeholder.com/32';
//                 // navUsername.textContent = user.nombre || user.usuario || 'Usuario';
                
//             } catch (e) {
//                 console.error('Error al parsear datos de usuario:', e);
//                 // Si hay error, mostrar el botón de login
//                 loginButton.style.display = 'block';
//                 userNavInfo.style.display = 'none';
//             }
//         } else {
//             // No hay usuario logueado
//             loginButton.style.display = 'block';
//             userNavInfo.style.display = 'none';
//         }
//     }

//     // Manejar el logout
//     navLogoutButton.addEventListener('click', function() {
//         localStorage.removeItem('admin');
//         checkUserLogin();
//         // Opcional: redirigir al inicio
//         window.location.href = './index.html';
//     });

//     // Verificar estado al cargar
//     checkUserLogin();
    
//     // También puedes escuchar cambios en el localStorage por si se modifica en otra pestaña
//     window.addEventListener('storage', function(event) {
//         if (event.key === 'admin') {
//             checkUserLogin();
//         }
//     });
// });