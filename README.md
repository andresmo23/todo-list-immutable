# Explicación de las funciones con mis palabras, el por qué de cada cosa

## 1. Referencias al DOM
- Como primer paso tomo las referencias necesarias de los elementos que voy a usar en el DOM, esto lo hago por medio de la selección de .querySelector ya que como en el index.html empecé a usar la metodologia BEM para el css tambien lo uso para el js y asi tener mejor escalabilidad y adaptabilidad por si el proyecto fuera a crecer.

## 2. Variable estado global
- Es un arreglo que será el corazón del programa, comienza siendo un arreglo vacio ya que contendrá los elementos que se vayan agregando, el scoope es global ya que las funciones y eventos podran acceder a ella para poder reasignarle su valor y aplicar la immutabilidad que es el objetivo de esta práctica.

## 3. Funciones puras

### 3.1 Función para agregar
- Esta funcion recibe texto (string) y se encarga de crear un objeto el cual tiene id (que es un numero random por medio de una propiedad crypto y su metodo randomUUID), el texto (que es el que recibe la funcion como argumento) y un booleano (que es false y es el que se encarga de saber en que estado está la tarea), despues de crear el objeto la función retorna un nuevo array copiando al array original más el nuevo objeto.

### 3.2 Función para remover
- La función aplica un filtro al estado actual comparando el id de cada objeto con el recibido por parámetro. Al no cumplir la condición, se excluye del nuevo arreglo. Esta operación es inmutable y produce un nuevo estado sin mutar el original. 

### 3.3 Función para cambiar el estado de la tarea
- Esta función recibe el taskId de una tarea y crea un nuevo arreglo usando .map(). Compara el id de cada objeto del arreglo con el taskId recibido. Si son iguales, devuelve una copia de ese objeto pero con la propiedad completed invertida (si era false, pasa a true, y viceversa). Si no son iguales, devuelve el objeto tal como está. Así logramos actualizar el estado sin modificar el array original.

### 3.4 Función para crear los botones que van dentro de los elementos

### voy a realizar dos versiones, la primera especializada en dos botones y la segunda como plantilla
Crearé y usaré la primera y despues refactorizaré y cambiaré a la segunda para tomarlo como practica para construir con intención desde cero, refactorizar sin romper funcionalidad

### 3.4.1 Versión especializada 
- Esta función recibe el taskId de una tarea y crea un contendor div que tendra como hijos dos botones los cuales se crean tambien dentro de la funcion, cada boton tiene su clase con BEM, un set atributo como buena practica, su name, su id y su icono, la funcion retorna el contenedor.

### 3.4.2 Versión genérica
- Esta separa la lógica de construcción de cada botón, y usa una función plantilla para crear cualquier botón que quiera. 

### 3.5 Función para editar texto 
- Esta funcionalidad permite modificar el texto de una tarea existente.
- - Al hacer clic en el botón  *Editar*, el texto de la tarea se convierte en un campo de entrada (`input`)
- El usuario puede escribir el nuevo texto directamente
- Para guardar los cambios, debe presionar la tecla *Enter*
- El sistema actualiza la tarea en el arreglo, guarda en `localStorage` y vuelve a renderizar la lista
- Si el campo queda vacío, no se guarda el cambio

## 3.6 Función parapPriorizar tarea
- Permite destacar una tarea importante, mostrándola al principio de la lista.
- Al hacer clic en el botón "Priorizar", la tarea seleccionada recibe la propiedad `prioritized: true`.
- El arreglo de tareas se actualiza y se ordena para que las tareas priorizadas aparezcan primero.
- Se guarda el nuevo orden en `localStorage` y se actualiza la vista.
- Se utiliza `.map()` para mantener la inmutabilidad y modificar solo la tarea elegida.
- Luego se utiliza `.sort()` para reorganizar el array según la propiedad `prioritized`.
- Esta estructura permite mantener un código limpio, predecible y fácil de escalar.
- La aplicación reordena las tareas automáticamente al priorizar o despriorizar:
- Las tareas con `prioritized: true` se muestran primero
- Las tareas sin prioridad se ordenan por fecha de creación, manteniendo el orden original
- Esto se logra usando una función comparadora en `.sort()` que considera ambas propiedades (`prioritized` y `createdAt`).

### 3.7 Funcion para guardar tareas en el localstorage
- Se usa la función `saveTasksToStorage()` para guardar el estado global `tasks` en `localStorage`.
- Convierte el array en texto con `JSON.stringify()` para que pueda almacenarse.
- Se ejecuta cada vez que se agrega, elimina o actualiza una tarea.

### 3.8 Funcion para cargar tareas del localstorage
- localStorage.getItem("tasks"): busca si hay algo guardado con la clave "tasks". Saved ? JSON.parse(saved) : []: si sí hay algo, lo convierte de string a objeto usando JSON.parse(). Si no hay nada guardado (como en tu primera carga), devuelve un array vacío.

### 4 Funciones UI

### 4.1 Funcion que renderiza lo que hay en el arreglo global
- Esta función se encarga de mostrar en pantalla lo que hay en el arreglo, limpia el contenedor ul para que cada vez que se agregue una nueva tarea no se duplique, despues por medio de un foreach recorre el arreglo y por cada elemento crea un li, un span para el texto, un span para el estatus y una referencia a lo que devuelve la funcion que crea los botones, todos estos elementos se agregan al li y el li se agrega como hijo al contenedor ul.

### 4.2 Función para mostrar mensaje de error

- Esta función recibe un texto (string) y se encarga de mostrarlo como un mensaje visual dentro del contenedor principal. Antes de crear el nuevo mensaje, verifica si ya existe uno anterior y lo elimina para que no se acumulen múltiples mensajes. El mensaje se crea como un párrafo (`<p>`) y se le asigna una clase BEM para poder estilizarlo fácilmente. 

### 5. Listener para el botón de agregar tarea

- Este evento se ejecuta al hacer clic sobre el botón “Agregar”. Primero toma el valor del input, lo limpia (elimina espacios al inicio/final) y verifica que no esté vacío. Si está vacío, llama a `showErrorMessage()` para mostrar un mensaje y no ejecuta más código. Si tiene contenido, llama a la función pura `addTask()` pasando el texto. Guarda el nuevo arreglo que retorna `addTask()` y lo reasigna a la variable global `tasks`. Finalmente renderiza todo el estado nuevo con `renderTasks()` y limpia el input para el próximo uso.

### 6. Delegación de eventos para los botones "Completar" y "Eliminar"

- Esta función escucha cualquier clic dentro del contenedor principal de tareas (`taskList`). Utiliza `event.target.closest("button")` para detectar si el clic fue sobre un botón o un ícono dentro de él. Si no se encuentra un botón, se finaliza la ejecución con `return;` para evitar errores. Si sí hay botón, se accede a su atributo `data-id` que contiene el `taskId`, y al atributo `data-name` que indica la acción: "delete" o "complete". Según la acción, se llama a la función pura correspondiente (`removeTaskById()` o `toggleTaskCompleted()`), se actualiza el estado global `tasks` y se renderiza todo nuevamente con `renderTasks()`. Se usa `return;` al final de cada bloque para evitar que se evalúe el otro condicional innecesariamente.