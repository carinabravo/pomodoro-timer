// Variables

const ESPERA = "ESPERA"; //stop
const FUNCIONANDO = "FUNCIONANDO"; //work
const DETENIDO = "DETENIDO"; //pause
const DESCANSO_CORTO = "DESCANSO_CORTO"; //short-break
const DESCANSO_LARGO = "DESCANSO_LARGO"; // long-break

const STATES = {
  ESPERA,
  FUNCIONANDO,
  DETENIDO,
  DESCANSO_CORTO,
  DESCANSO_LARGO,
};

let state = ESPERA;

let pomodoroTimer = {
  started: false, // Variable para almacenar el estado del temporizador (iniciado o detenido)
  minutes: 0, // Variable para almacenar los minutos restantes del temporizador
  seconds: 0, // Variable para almacenar los segundos restantes del temporizador
  fillerHeight: 0, // Variable para almacenar la altura del indicador de progreso
  fillerIncrement: 0, // Variable para almacenar el incremento de altura del indicador de progreso
  interval: null, // Variable para almacenar el identificador del intervalo de tiempo
  minutesDom: null, // Elemento del DOM que muestra los minutos restantes
  secondsDom: null, // Elemento del DOM que muestra los segundos restantes
  fillerDom: null, // Elemento del DOM que muestra el indicador de progreso

  init: function (onTimerComplete) {
    // Inicializa el temporizador
    let self = this;
    this.minutesDom = document.querySelector("#minutes");
    this.secondsDom = document.querySelector("#seconds");
    this.fillerDom = document.querySelector("#filler");
    this.onTimerComplete = onTimerComplete;

    this.interval = setInterval(function () {
      // Configura los controladores de eventos para los botones de inicio y parada
      self.intervalCallback.apply(self);
    }, 1000);
  },

  pauseOrResumeTimer: function () {
    // Pausa o reanuda el temporizador
    this.started = !this.started; // Cambia el estado del temporizador (pausado o reanudado)
    this.updateDom(); // Actualiza los elementos del DOM
  },

  resetVariables: function (mins, secs, started) {
    // Restablece las variables del temporizador a los valores especificados
    this.minutes = mins;
    this.seconds = secs;
    this.started = started;
    this.fillerIncrement = 200 / (this.minutes * 60);
    this.fillerHeight = 0;
  },

  startWork: function () {
    // Inicia el temporizador de trabajo (25 minutos)
    this.resetVariables(25, 0, true);
    this.updateDom();
  },

  startShortBreak: function () {
    // Inicia el temporizador de pausa corta (5 minutos)
    this.resetVariables(5, 0, true);
    this.updateDom();
  },

  startLongBreak: function () {
    // Inicia el temporizador de pausa larga (15 minutos)
    this.resetVariables(15, 0, true);
    this.updateDom();
  },

  stopTimer: function () {
    // Detiene el temporizador y restablece los valores iniciales
    this.resetVariables(25, 0, false);
    this.updateDom();
  },

  toDoubleDigit: function (num) {
    // Convierte un número en una cadena de dos dígitos
    if (num < 10) {
      return "0" + parseInt(num, 10);
    }
    return num;
  },

  updateDom: function () {
    // Actualiza los elementos del DOM para mostrar el tiempo restante y el indicador de progreso
    this.minutesDom.innerHTML = this.toDoubleDigit(this.minutes);
    this.secondsDom.innerHTML = this.toDoubleDigit(this.seconds);
    this.fillerHeight = this.fillerHeight + this.fillerIncrement;
  },

  intervalCallback: function () {
    // Callback que se ejecuta en cada intervalo de tiempo (cada segundo)
    if (!this.started) return false;
    if (this.seconds == 0) {
      if (this.minutes == 0) {
        this.timerComplete();
        return;
      }
      this.seconds = 59;
      this.minutes--;
    } else {
      this.seconds--;
    }
    this.updateDom();
  },

  timerComplete: function () {
    // Acciones a realizar cuando el temporizador ha finalizado
    this.started = false;
    this.fillerHeight = 0;

    this.onTimerComplete();

    const messageContainer = document.getElementById("messageContainer");

    switch (state) {
      case FUNCIONANDO:
        showMessage("Take a break!");
        setTimeout(() => {
          messageContainer.innerHTML = ""; // Elimina el mensaje después de 3 segundos
          this.onTimerComplete();
        }, 4000); // Espera 3 segundos antes de continuar al siguiente estado
        break;
      case DESCANSO_CORTO:
        showMessage("End of your short break!");
        setTimeout(() => {
          messageContainer.innerHTML = ""; // Elimina el mensaje después de 3 segundos
          this.onTimerComplete();
        }, 4000); // Espera 3 segundos antes de continuar al siguiente estado
        break;
      case DESCANSO_LARGO:
        showMessage("End of your long break!");
        setTimeout(() => {
          messageContainer.innerHTML = ""; // Elimina el mensaje después de 3 segundos
          this.onTimerComplete();
        }, 4000); // Espera 3 segundos antes de continuar al siguiente estado
        break;
      default:
        this.onTimerComplete();
    }
  },
};

function showMessage(message) {
  // Muestra el mensaje en el DOM
  const messageContainer = document.getElementById("messageContainer");
  messageContainer.innerHTML = `<div class="notification">${message}</div>`;
}

//función del estado de la reprodución de la música
const musicPlayer = {
  play: function () {
    //música encendida
    const sonido = document.createElement("audio");
    sonido.setAttribute(
      "src",
      "./sound/musica-para-pensar-musica-relajante-para-estudiar-musica-para-reflexionar-pe_LXQLr7OQ.mp3"
    );
    sonido.setAttribute("autoplay", "true");
    document.body.appendChild(sonido);
  },

  stop: function () {
    //música apagada
    const audioElements = document.getElementsByTagName("audio");

    if (audioElements.length > 0) {
      audioElements[0].parentNode.removeChild(audioElements[0]);
    }
  },
};

// Función para reproducir audio
function start() {
  if (state != ESPERA) {
    // si state no es espera
    return;
  }

  state = FUNCIONANDO; //asigno el valor funcionando en state

  musicPlayer.play();
  pomodoroTimer.startWork();
}

//Función para pausar audio
function pausar() {
  // cambio de estado
  if (state == FUNCIONANDO || state == DETENIDO) {
    // si state es igual a funcionando o state es igual a detenido
    if (state == FUNCIONANDO) {
      state = DETENIDO; //asigno el valor detenido en state
    } else if (state == DETENIDO) {
      state = FUNCIONANDO; //asigno el valor funcionando en state
    }
  } else {
    return;
  }

  if (state == FUNCIONANDO) {
    // si state es igual a funcionando
    pomodoroTimer.pauseOrResumeTimer();
    musicPlayer.play();
  } else if (state == DETENIDO) {
    pomodoroTimer.pauseOrResumeTimer();
    musicPlayer.stop();
  }
}

function shortBreak() {
  if (state == FUNCIONANDO) {
    state = DESCANSO_CORTO; //asigno el valor descanso_corto en state
  } else {
    return;
  }

  musicPlayer.stop();
  pomodoroTimer.startShortBreak();
}

function longBreak() {
  if (state == FUNCIONANDO) {
    state = DESCANSO_LARGO; //asigno el valor descanso_largo en state
  } else {
    return;
  }

  musicPlayer.stop();
  pomodoroTimer.startLongBreak();
}

function stop() {
  if (
    state == FUNCIONANDO ||
    state == DETENIDO ||
    state == DESCANSO_CORTO ||
    DESCANSO_LARGO
  ) {
    // si state es igual a funcionando o es igual a detenido o uno de los dos break
    state = ESPERA; //asigno el valor espera en state (estop)
  } else {
    return;
  }

  musicPlayer.stop();
  pomodoroTimer.stopTimer();
}

const tasksManager = {
  taskList: [],
  init: function () {},
  add: function () {
    // Agrega una tarea a la lista de tareas°
    const taskInput = document.getElementById("taskInput");
    const task = taskInput.value.trim();

    if (task !== "") {
      this.taskList.push(task);
      this.render();
      taskInput.value = "";
    }
  },
  delete: function (index) {
    // Elimina una tarea de la lista de tareas según el índice proporcionado
    this.taskList.splice(index, 1);
    this.render();
  },
  render: function () {
    // Renderiza la lista de tareas en el DOM
    const taskListElement = document.getElementById("taskList");
    taskListElement.innerHTML = "";

    this.taskList.forEach((task, index) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<button id="eliminar" class="button texto-medio eliminar" onclick="tasksManager.delete(${index})">Delete task</button>${task}`;
      taskListElement.appendChild(listItem);
    });

    const myTasksTitle = document.getElementById("myTasksTitle");
    if (this.taskList.length > 0) {
      myTasksTitle.style.display = "block"; // Si hay tareas en la lista, muestra el título
    } else {
      myTasksTitle.style.display = "none"; // Si no hay tareas en la lista, oculta el título
    }
  },
};

// Almacenar la lista de tareas en el almacenamiento local al salir de la página
window.onbeforeunload = function () {
  localStorage.setItem("taskList", JSON.stringify(tasksManager.taskList));
};

window.onload = function () {
  const storedTasks = localStorage.getItem("taskList"); // Restaurar la lista de tareas guardada en el almacenamiento local
  tasksManager.init();
  if (storedTasks) {
    tasksManager.taskList = JSON.parse(storedTasks);
  }
  tasksManager.render(); // Renderiza la lista de tareas al cargar la página

  pomodoroTimer.init(() => musicPlayer.stop()); // Inicia el temporizador Pomodoro cuando la ventana se haya cargado completamente

  musicPlayer.stop(); //la mósica no se reproduce al renderizar la página
};
//debugger;
