document.addEventListener('DOMContentLoaded', function() {
    /**
     * Lógica para activar el enlace de navegación correspondiente a la página actual.
     */
    const activarEnlaceNavegacion = () => {
        // Toma la ruta de la página actual desde la URL
        const paginaActualFull = window.location.pathname;
        
        // Extrae el nombre del archivo de la página actual
        // Maneja casos como "/", "/index.html", "/pages/institucional.html"
        let nombreArchivoPaginaActual = paginaActualFull.split('/').pop().split('\\').pop();
        
        // Si el nombre de archivo está vacío (ej. para http://localhost:xxxx/ o file:///C:/...),
        // asumimos que es 'index.html' para la comparación.
        if (nombreArchivoPaginaActual === '' || nombreArchivoPaginaActual === '/') {
            nombreArchivoPaginaActual = 'index.html';
        }

        // Selecciona todos los enlaces de la barra de navegación
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        navLinks.forEach(link => {
            const hrefDelEnlace = link.getAttribute('href');
            
            // Extrae solo el nombre del archivo del atributo href del enlace
            let nombreArchivoEnlace = hrefDelEnlace.split('/').pop().split('\\').pop();
            
            // Si el enlace es a la raíz (ej. href="/"), asumimos que es 'index.html'
            if (nombreArchivoEnlace === '' || nombreArchivoEnlace === '/') {
                nombreArchivoEnlace = 'index.html';
            }
            // Si el enlace tiene un query string (ej. index.html?param=value), removemos el query string
            if (nombreArchivoEnlace.includes('?')) {
                nombreArchivoEnlace = nombreArchivoEnlace.split('?')[0];
            }


            // Mensajes de depuración (nos sirven para para verificar funcionamiento del script)
            console.log("------------------------------------------");
            console.log(`Página actual (procesada): ${nombreArchivoPaginaActual}`);
            console.log(`Enlace: ${link.textContent.trim()} (href: ${hrefDelEnlace})`);
            console.log(`Nombre de archivo del enlace (procesado): ${nombreArchivoEnlace}`);
            console.log("------------------------------------------");

            // Lógica de comparación:
            // Compara los nombres de archivo normalizados
            if (nombreArchivoPaginaActual === nombreArchivoEnlace) {
                link.classList.add('active');
                console.log(`¡ACTIVO!: ${link.textContent.trim()}`); // Mensaje de éxito
            } else {
                link.classList.remove('active'); // Asegura que no tenga la clase si no es la activa
            }
        });
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

    // Ejecutar las funciones al cargar la página
    activarEnlaceNavegacion();
    actualizarAnioFooter();
});