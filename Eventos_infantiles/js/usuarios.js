document.addEventListener('DOMContentLoaded', async () => {
            try {
                // obtener un token
                const loginResponse = await fetch('https://dummyjson.com/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: 'emilys',
                        password: 'emilyspass',
                    })
                });

                if (!loginResponse.ok) {
                    throw new Error('Error al hacer login');
                }

                const loginData = await loginResponse.json();
                const token = loginData.token;

                const usersResponse = await fetch('https://dummyjson.com/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!usersResponse.ok) {
                    throw new Error('Error al obtener usuarios');
                }

                const usersData = await usersResponse.json();
                displayUsers(usersData.users);

            } catch (error) {
                console.error('Error:', error);
                document.getElementById('users-container').innerHTML = 
                    `<p style="color: red;">Error al cargar los usuarios: ${error.message}</p>`;
            }
        });

        function displayUsers(users) {
            const container = document.getElementById('users-container');
            
            if (!users || users.length === 0) {
                container.innerHTML = '<p>No se encontraron usuarios</p>';
                return;
            }
            
            users.forEach(user => {
                const userCard = document.createElement('div');
                userCard.className = 'user-card';
                
                userCard.innerHTML = `
                    <img class="user-avatar" src="${user.image}" alt="Avatar de ${user.firstName}">
                    <h1 class="user-name">${user.firstName} ${user.lastName}</h1>
                    
                    <div class="user-details">
                        <p><strong>Username:</strong> ${user.username}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Edad:</strong> ${user.age}</p>
                        <p><strong>Género:</strong> ${user.gender}</p>
                    </div>
                    
                    <div class="token-box">
                        <strong>ID:</strong>
                        <p>${user.id}</p>
                    </div>
                `;
                
                container.appendChild(userCard);
            });
        }