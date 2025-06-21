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

      

      if (response.ok) {
        const isAdmin = username === 'emilys' && password === 'emilyspass';
        localStorage.setItem('admin', isAdmin.toString());
            
        // sessionStorage.setItem('accessToken', data.token);
        // sessionStorage.setItem('isAdmin', 'false');

        //document.getElementById('login-container').style.display = 'none';
        document.getElementById('user-container').style.display = 'block';
        document.getElementById('avatar').src = data.image || 'https://i.pravatar.cc/100';
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
  document.getElementById('user-container').style.display = 'none'; 
  document.getElementById('login-container').style.display = 'block'; 
};


const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}
});