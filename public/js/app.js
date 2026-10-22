// 1. Apenas se carga la página, pedimos las tareas al servidor de Render y las mostramos
document.addEventListener('DOMContentLoaded', cargarTareas);

async function cargarTareas() {
    try {
        const respuesta = await fetch('/api/tareas');
        const tareas = await respuesta.json();
        
        const lista = document.getElementById('listaTareas');
        lista.innerHTML = ''; // Limpiamos la lista por si acaso

        tareas.forEach(tarea => {
            const li = document.createElement('li');
            li.textContent = tarea.nombre;
            lista.appendChild(li);
        });
    } catch (error) {
        console.error('Error al cargar las tareas:', error);
    }
}

// 2. Función que se ejecuta cuando le das clic al botón "Agregar"
async function agregarTarea() {
    const input = document.getElementById('tareaInput');
    const nombreTarea = input.value.trim();

    if (!nombreTarea) {
        alert('Por favor escribe una tarea');
        return;
    }

    try {
        const respuesta = await fetch('/api/tareas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre: nombreTarea })
        });

        if (respuesta.ok) {
            input.value = ''; // Limpiamos la caja de texto
            cargarTareas();   // Recargamos la lista para que aparezca la nueva tarea
        } else {
            alert('Hubo un error al guardar la tarea');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('No se pudo conectar con el servidor');
    }
}