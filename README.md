
<h1 align="center">-Sitio Web: KidsParties Gestor-</h1>
<p align="center">
  <img src="https://github.com/user-attachments/assets/43550d80-bf31-40ec-8958-88e237e5dcde" width="350"/>
</p>

---

## 📝 Descripción :

La empresa IDW S.A., para la cual trabaja nuestro equipo, nos ha encargado  el desarrollo de un sitio web que optimizará la gestión de reservas de casas para cumpleaños infantiles. Este sitio tiene como finalidad servir como un catálogo que presenta los diferentes salones de eventos y servicios disponibles para contratar. Se facilita que, de esta manera,  los usuarios puedan obtener presupuestos personalizados de manera eficiente.

---

## 🎥 Video del Proyecto :

 [Ver video del proyecto en Google Drive](https://drive.google.com/drive/folders/1N5CISiHWohmRfxBY98L1rh4hlLMcueKz)

---

## ✨ Funcionalidades Destacadas

- **Catálogo Interactivo de Salones** Explora una gran variedad de salones con imágenes de alta calidad (integrado con Pexels) y algunos detalles. 
- **Filtros** Encuentra el salón perfecto filtrando por capacidad de personas o buscando por nombre.
- **Gestión de Sesiones Segura** Inicia y cierra sesión para acceder a funcionalidades personalizadas y de administración (autenticación simulada con DummyJSON).
- **Persistencia en localStorage** Las sesiones y reservas se guardan localmente en el navegador utilizando localStorage.
- **Presupuestador en Tiempo Real** Calcula instantáneamente el costo total de tu reserva, incluyendo los servicios adicionales seleccionados
- **Historial de Reservas** detallado con desglose de las mismas.
- **Diseño Responsivo**, adaptado a móvil, tablet y escritorio.

---

## 🧱 Estructura del Proyecto

El proyecto se ha estructurado de la siguiente manera: 

<p align="center">
  <img src="https://github.com/user-attachments/assets/a7782665-818e-48a4-bbcc-cb5c31ef4c21" width="900" alt="image"/>
</p>

---
## 🛠️ Tecnologías Utilizadas

- **HTML5** – Estructura semántica.
- **CSS3 & Bootstrap 5** – Estilos modernos y responsive.
- **JavaScript** – Lógica e interactividad.
- **LocalStorage API** – Persistencia del lado del cliente.
- **APIs REST**:
  - `dummyjson.com` – Simulación de usuarios y autenticación.
  - `api.pexels.com` – Imágenes de alta calidad.
  - `mockapi.io` – Datos simulados de salones.
- **SweetAlert2** – Alertas visuales.
- **Bootstrap** – Creación de un sitio web responsivo y adaptable
- **Bootstrap Icons** – Set de iconos para mejorar la interfaz visual.

---

## 💡 Explicación del Código (Puntos Clave)
- main.js: Catálogo, Filtros y Reservas
- fetchData(): Función asíncrona que utiliza Promise.all() para cargar simultáneamente imágenes de Pexels y datos de salones de MockAPI. Combina estos datos y los almacena en salonesDataGlobal para un acceso rápido.
- renderCatalog(data): Genera dinámicamente las tarjetas de salones en el HTML, iterando sobre salonesDataGlobal o los datos filtrados. Incluye manejo de errores de imagen (onerror).
- filtrarSalonesAvanzado(): Aplica filtros por capacidad, precio y nombre sobre salonesDataGlobal y re-renderiza el catálogo con los resultados.
- reservar(salonId, ...): Inicializa el modal de reserva con la información del salón seleccionado.
- calcularPrecioTotal(): Calcula el precio en tiempo real basándose en la cantidad de personas y servicios adicionales, validando la capacidad del salón.
- guardarReserva(reservaData): Persiste la nueva reserva en localStorage (bajo la clave 'reservas'), incluyendo un ID único y un desglose detallado del precio. Realiza validación de duplicados.
- login.js y nav.js: Autenticación y Navegación
- login.js:
- handleLogin(): Envía credenciales a dummyjson.com/auth/login. Al éxito, guarda token, username, userImage, y banderas de rol (admin, user) en localStorage. Dispara un evento updateUI para notificar a la navegación.
- handleLogout(): Limpia los datos de sesión de localStorage y también dispara updateUI.
- nav.js:
- updateNavbarVisibility(): Se ejecuta al cargar la página y escucha eventos de storage (para sincronización entre pestañas) y updateUI (desde login.js). Muestra/oculta elementos de la barra de navegación (ej., botón de login - avatar de usuario, enlaces de admin) según el estado de localStorage.
- reservas.js: Visualización de Reservas
- obtenerTodasLasReservas(): Recupera reservas de localStorage, con lógica de compatibilidad para dos posibles claves ('reservas' y 'reservas_historial').
- renderizarReservas(reservas): Ordena las reservas y genera dinámicamente tarjetas detalladas para cada reserva, mostrando cliente, detalles del evento, y precios.
- actualizarContadores(): Muestra el total de reservas y valores estimados en la interfaz.

---

## 💻 Cómo Ejecutar el Proyecto

Para poner en marcha este proyecto en tu entorno local, seguí estos pasos:

- Clonar el Repositorio:
 -- Bash
 -- git clone https://github.com/Gustaf02/KidsParties.git
 -- cd tu-repositorio
  
- Abrir con un Servidor Local:
 -- Simplemente abrí el archivo index.html en tu navegador, botón derecho, Open with Live Server. 

---

## 🛠️ Desarrolladores :
  
<h3 align="left">📂 \Integrantes del equipo</h3>
<p align="left">
</p>
     
       ┃━ ━📂 \Walter Frías 
    
       ┃━ ━📂 \Israel Leonardo Montiel  

       ┃━ ━📂 \Carlos Gustavo Ortiz
    
       ┃━ ━📂 \Azucena Prieto 

---


