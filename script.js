const stations = [
  {
    name: "Radio Antena 10",
    frequency: "88.9",
    url: "http://IP_DE_ANTENA10:PUERTO/stream",
    logo: "img/antena10.png",
    facebook: "https://facebook.com",
    whatsapp: "https://wa.me"
  },
  {
    name: "Radio Stereo M",
    frequency: "101.5",
    url: "https://sonic.globalstream.pro/8108/stream",
    logo: "https://i.postimg.cc/L8bjb6K5/1687464033296.png",
    facebook: "https://www.facebook.com/share/1Dib9eQUFD/",
    whatsapp: "https://wa.me/51942883375"
  },
  {
    name: "Radio La Fuerte",
    frequency: "104.7",
    url: "http://IP_DE_LAFUERTE:PUERTO/live",
    logo: "img/lafuerte.png",
    facebook: "https://facebook.com",
    whatsapp: "https://wa.me"
  },
  {
    name: "Radio La Patrona",
    frequency: "96.3",
    url: "http://IP_DE_PATRONA:PUERTO/stream",
    logo: "img/lapatrona.png",
    facebook: "https://facebook.com",
    whatsapp: "https://wa.me"
  }
];

let index = 0;
let playing = false;

const freq = document.getElementById("frequency");
const nameEl = document.getElementById("station");
const status = document.getElementById("status");
const audio = document.getElementById("audio");
const power = document.getElementById("power");

function updateUI() {
    // Convertimos la frecuencia a número antes de usar toFixed para evitar errores
    const freqNum = parseFloat(stations[index].frequency);
    freq.textContent = isNaN(freqNum) ? stations[index].frequency : freqNum.toFixed(1);
    nameEl.textContent = stations[index].name;
    
    if (playing) {
        status.textContent = "Conectando…";
        status.classList.add("loading");
        
        audio.pause();
        audio.src = stations[index].url; // Corregido de .stream a .url
        audio.load(); 
        
        audio.play().catch(e => {
            if (e.name !== 'AbortError') {
                status.textContent = "Sin señal";
                status.classList.remove("loading");
                playing = false;
                power.classList.remove("playing");
            }
        });
    }
}

document.getElementById("prev").onclick = () => {
    index = (index - 1 + stations.length) % stations.length; // Corregido STATIONS a stations
    updateUI();
};

document.getElementById("next").onclick = () => {
    index = (index + 1) % stations.length; // Corregido STATIONS a stations
    updateUI();
};

power.onclick = () => {
    if (!playing) {
        playing = true;
        power.classList.add("playing");
        updateUI();
    } else {
        playing = false;
        power.classList.remove("playing");
        audio.pause();
        audio.src = ""; 
        status.textContent = "";
        status.classList.remove("loading");
    }
};

audio.onplaying = () => {
    status.textContent = "";
    status.classList.remove("loading");
};

audio.onerror = () => {
    if (playing && audio.src !== "") {
        status.textContent = "Sin señal";
        status.classList.remove("loading");
        power.classList.remove("playing");
        playing = false;
    }
};

// Carga inicial al entrar a la página
updateUI();
