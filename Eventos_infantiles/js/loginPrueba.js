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
            // Ocultar formulario y mostrar datos del usuario
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('user-container').style.display = 'block';

            // Renderizar datos del usuario
            document.getElementById('avatar').src = data.image || 'https://i.imgur.com/6VBx3io.png'; // Imagen por defecto si no hay avatar
            document.getElementById('name').textContent = `${data.firstName} ${data.lastName}`;
            document.getElementById('accessToken').textContent = data.accessToken; 

        } else {
            errorMessage.textContent = data.message || "Error en el login";
        }
    } catch (error) {
        errorMessage.textContent = "Error de conexión";
        console.error(error);
    }
});