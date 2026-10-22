function agregarTarea() {

    let input = document.getElementById("tareaInput");

    let tarea = input.value;

    if (tarea === "") {
        alert("Escribe una tarea");
        return;
    }

    let lista = document.getElementById("listaTareas");

    let elemento = document.createElement("li");

    elemento.textContent = tarea;

    elemento.onclick = function() {
        elemento.remove();
    };

    lista.appendChild(elemento);

    input.value = "";
}