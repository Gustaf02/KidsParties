document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Validación simple
    if (!username || !password) {
        errorMessage.textContent = "Username y password son obligatorios";
        return;
    }

    try {
        // Llamar al endpoint de login de DummyJSON
        const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Verificar si es el usuario admin (emilys)
            const isAdmin = username === 'emilys' && password === 'emilyspass';
            
            // Guardar estado de admin en localStorage
            localStorage.setItem('admin', isAdmin.toString());
            
            // Guardar token de autenticación
            if (data.token) {
                localStorage.setItem('token', data.accessTokentoken);
            }

            // Ocultar formulario y mostrar datos del usuario
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('user-container').style.display = 'block';

            // Renderizar datos del usuario
            document.getElementById('avatar').src = data.image || 'https://i.imgur.com/6VBx3io.png';
            document.getElementById('name').textContent = `${data.firstName} ${data.lastName}`;
            document.getElementById('accessToken').textContent = data.accessToken || 'No token provided';
            
            // Mostrar si es admin (opcional, para propósitos de demostración)
            document.getElementById('admin-status').textContent = isAdmin ? 
                '✅ Usuario ADMIN' : '❌ Usuario normal';

        } else {
            errorMessage.textContent = data.message || "Error en el login";
            // Asegurarse de marcar como no admin si el login falla
            localStorage.setItem('admin', 'false');
        }
    } catch (error) {
        errorMessage.textContent = "Error de conexión";
        console.error(error);
        // Asegurarse de marcar como no admin si hay error
        localStorage.setItem('admin', 'false');
    }
});