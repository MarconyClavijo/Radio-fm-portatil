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
    name: "Radio La Patrona",
    frequency: "96.3",
    url: "https://sonic.globalstream.pro/8080/stream",
    logo: "img/lapatrona.png",
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
  }
];

let index = 0;
let playing = false;

const freq = document.getElementById("frequency");
const nameEl = document.getElementById("station");
const status = document.getElementById("status");
const audio = document.getElementById("audio");
const power = document.getElementById("power");
const starBtn = document.getElementById("star-toggle");

// Configuración inicial de volumen al 100% de inmediato
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

    // Mueve la aguja naranja en base a la frecuencia actual
    const totalFrecuencias = 108.0 - 87.5;
    const porcentaje = (freqNum - 87.5) / totalFrecuencias;
    const gradosRotacion = (porcentaje * 270) - 135; 
    const dialOuter = document.querySelector(".tuner-outer-circle");
    if (dialOuter) {
        dialOuter.style.setProperty('--rotation', gradosRotacion + 'deg');
    }

    // Envía el nombre y dial al tablero del carro por Bluetooth de forma automática
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: stations[index].name,
            artist: stations[index].frequency + " MHz",
            album: "Radio FM Portátil",
            artwork: [{ src: stations[index].logo, sizes: '512x512', type: 'image/png' }]
        });
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
                if (power) power.classList.add("playing"); 
            }
        });
    }
}

// Botones de Navegación de emisoras (Flechas)
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

// Controladores de estado del reproductor de audio
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
        if (power) power.classList.add("playing"); 
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

// El botón de abajo controla el volumen en 3 niveles decrecientes (Máximo -> Medio -> Bajo)
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

// CONTROL DESDE EL TIMÓN DEL CARRO (Media Session API)
if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('nexttrack', () => {
        const next = document.getElementById("next");
        if (next) next.click();
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
        const prev = document.getElementById("prev");
        if (prev) prev.click();
    });

    navigator.mediaSession.setActionHandler('play', () => {
        if (!playing) {
            const btnPower = document.getElementById("power");
            if (btnPower) btnPower.click();
        }
    });

    navigator.mediaSession.setActionHandler('pause', () => {
        if (playing) {
            const btnPower = document.getElementById("power");
            if (btnPower) btnPower.click();
        }
    });
}

// LÓGICA DE LOS 6 BOTONES DE FAVORITOS ABAJO
const favBoxes = document.querySelectorAll(".fav-box");
let favoritosGuardados = new Array(6).fill(null);

favBoxes.forEach((box, i) => {
    box.onclick = () => {
        if (favoritosGuardados[i] === null) {
            favoritosGuardados[i] = index; 
            box.querySelector(".fav-plus").textContent = stations[index].frequency;
            box.querySelector(".fav-plus").style.color = "#00a8cc";
        } else {
            index = favoritosGuardados[i];
            updateUI();
        }
    };
});

// LÓGICA DE LA ESTRELLA SUPERIOR
if (starBtn) {
    starBtn.onclick = () => {
        starBtn.classList.toggle("active");
        if (starBtn.classList.contains("active")) {
            starBtn.textContent = "★";
        } else {
            starBtn.textContent = "☆";
        }
    };
}

// Carga inicial obligatoria al abrir la web
updateUI();
