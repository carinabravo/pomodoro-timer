// Variables
let workTime = 25;
let breakTime = 5;
let seconds = 0;
let taskList = [];

// Función para iniciar el temporizador
let timerInterval;

function start() {
  // Ocultar botón de inicio y mostrar botón de reinicio
  document.getElementById("start").style.display = "none";
  document.getElementById("reset").style.display = "block";

  let workMinutes = workTime;
  let breakMinutes = breakTime;
  let breakCount = 0;

  // Función que se ejecuta cada segundo para actualizar el temporizador
  let timerFunction = () => {
    document.getElementById("minutes").innerHTML = `${workMinutes}`.padStart(
      2,
      "0"
    ); //agrega 2 ceros a los minutos
    document.getElementById("seconds").innerHTML = `${seconds}`.padStart(
      2,
      "0"
    ); //agrega 2 ceros a los segundos

    if (workMinutes === 0 && seconds === 0) {
      if (breakCount % 2 === 0) {
        // Inicia el descanso
        workMinutes = breakMinutes;
        breakCount++;
        document.getElementById("text").textContent = "¡Start break!";
        setTimeout(() => {
          document.getElementById("text").textContent = ""; // Elimina el contenido de "text" después de 3 segundos
        }, 2000);
      } else {
        // Continúa con el trabajo
        workMinutes = workTime;
        breakCount++;
        document.getElementById("start").style.display = "block";
        document.getElementById("reset").style.display = "none";
        if (breakCount % 2 === 0) {
          // Detiene el temporizador al finalizar el break
          clearInterval(timerInterval);
          document.getElementById("text").textContent = "¡End break!";
          setTimeout(() => {
            document.getElementById("text").textContent = ""; // Elimina el contenido de "text" después de 2 segundos
          }, 2000);
          return;
        }
      }
    }
    if (seconds === 0) {
      seconds = 59;
      workMinutes--;
    } else {
      seconds--;
    }
  };

  // Inicia el temporizador
  timerInterval = setInterval(timerFunction, 1000); // 1000 = 1 segundo
}

// Función para reiniciar el temporizador
function resetTimer() {
  // Detiene el temporizador actual
  clearInterval(timerInterval);

  seconds = 0;
  document.getElementById("minutes").innerHTML = workTime;
  document.getElementById("seconds").innerHTML = "00";

  // Muestra el botón de inicio y oculta el botón de reinicio
  document.getElementById("start").style.display = "block";
  document.getElementById("reset").style.display = "none";
}

// Función para agregar una tarea a la lista
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const task = taskInput.value.trim();

  if (task !== "") {
    taskList.push(task);
    renderTaskList();
    taskInput.value = "";
  }
}

// Función para eliminar una tarea de la lista
function deleteTask(index) {
  taskList.splice(index, 1);
  renderTaskList();
}

// Función para renderizar la lista de tareas
function renderTaskList() {
  const taskListElement = document.getElementById("taskList");
  taskListElement.innerHTML = "";

  taskList.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<button id="eliminar" class="button texto-medio eliminar" onclick="deleteTask(${index})">Delete task</button>${task}`;
    taskListElement.appendChild(listItem);
  });
}

// Función para reproducir audio
window.addEventListener("load", function () {
  document.getElementById("start").addEventListener("click", sonar);
  document.getElementById("reset").addEventListener("click", callar);
});

function sonar() {
  const sonido = document.createElement("iframe");
  sonido.setAttribute(
    "src",
    "./sound/musica-para-pensar-musica-relajante-para-estudiar-musica-para-reflexionar-pe_LXQLr7OQ.mp3"
  );
  document.body.appendChild(sonido);
  document.getElementById("start").removeEventListener("click", sonar);
}

function callar() {
  const iframe = document.getElementsByTagName("iframe");

  if (iframe.length > 0) {
    iframe[0].parentNode.removeChild(iframe[0]);
    document.getElementById("reset").addEventListener("click", callar);
  }
}
