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
    url: "https://innovatestream.pe",
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

// Configuración inicial: Volumen al 100% de inmediato
audio.volume = 1.0; 
let volumeLevel = 0; 

function updateUI() {
    const freqNum = parseFloat(stations[index].frequency);
    if (freq) {
        freq.textContent = isNaN(freqNum) ? stations[index].frequency : freqNum.toFixed(1);
    }
    if (nameEl) {
        nameEl.textContent = stations[index].name;
    }
    
    if (playing) {
        if (status) {
            status.textContent = "Conectando…";
            status.classList.add("loading");
        }
        
        audio.pause();
        audio.src = stations[index].url; 
        audio.load(); 
        
        audio.play().catch(e => {
            if (e.name !== 'AbortError') {
                if (status) {
                    status.textContent = "Sin señal";
                    status.classList.remove("loading");
                }
                playing = false;
                if (power) power.classList.remove("playing");
            }
        });
    }
}

// Botones de Navegación (Flechas)
const prevBtn = document.getElementById("prev");
if (prevBtn) {
    prevBtn.onclick = () => {
        index = (index - 1 + stations.length) % stations.length;
        updateUI();
    };
}

const nextBtn = document.getElementById("next");
if (nextBtn) {
    nextBtn.onclick = () => {
        index = (index + 1) % stations.length;
        updateUI();
    };
}

// Botón de Encendido Central
if (power) {
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
            if (status) {
                status.textContent = "";
                status.classList.remove("loading");
            }
        }
    };
}

// Controladores de estado de reproducción
audio.onplaying = () => {
    if (status) {
        status.textContent = "Sonando...";
        status.classList.remove("loading");
    }
};

audio.onerror = () => {
    if (playing && audio.src !== "") {
        if (status) {
            status.textContent = "Sin señal";
            status.classList.remove("loading");
        }
        if (power) power.classList.remove("playing");
        playing = false;
    }
};

// El botón de arriba controla el Silencio (Mute)
const topMuteBtn = document.getElementById("mute-top");
if (topMuteBtn) {
    topMuteBtn.onclick = () => {
        audio.muted = !audio.muted;
        if (status) {
            status.textContent = audio.muted ? "Silenciado" : (playing ? "Sonando..." : "");
        }
    };
}

// El botón de abajo controla el volumen en 3 niveles (Máximo -> Medio -> Bajo)
const volBtnAbajo = document.getElementById("vol-toggle");
if (volBtnAbajo) {
    volBtnAbajo.onclick = () => {
        volumeLevel = (volumeLevel + 1) % 3; 
        
        if (volumeLevel === 0) {
            audio.volume = 1.0; 
            if (status) status.textContent = "Volumen: Máximo";
        } else if (volumeLevel === 1) {
            audio.volume = 0.6; 
            if (status) status.textContent = "Volumen: Medio";
        } else {
            audio.volume = 0.3; 
            if (status) status.textContent = "Volumen: Bajo";
        }
        
        setTimeout(() => {
            if (playing && status && status.textContent.includes("Volumen")) {
                status.textContent = "Sonando...";
            }
        }, 2000);
    };
}

// Carga inicial obligatoria
updateUI();
