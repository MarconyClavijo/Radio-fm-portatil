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
  }
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
  
];

let index = 0;
let playing = false;

const freq = document.getElementById("frequency");
const nameEl = document.getElementById("station");
const status = document.getElementById("status");
const audio = document.getElementById("audio");
const power = document.getElementById("power");

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
    
    if (playing) {
        if (status) {
            status.textContent = "Conectando…";
            status.classList.add("loading");
        }
        
        audio.pause();
        audio.src = stations[index].url; 
        audio.load(); 
        
        audio.play().catch(e => {
            // CORRECCIÓN CLAVE 1: Si la radio seleccionada está apagada, el botón general NO se apaga
            if (e.name !== 'AbortError') {
                if (status) {
                    status.textContent = "Sin señal";
                    status.classList.remove("loading");
                }
                // Mantenemos la interfaz en modo encendido para cambiar de dial libremente
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
    // CORRECCIÓN CLAVE 2: Si la radio está fuera del aire, el sistema no se rinde ni se congela.
    // Mantenemos 'playing = true' esperando a que el usuario pase de dial.
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

// Carga inicial obligatoria al abrir la web
updateUI();

// CONTROL DESDE EL TIMÓN DEL CARRO (Media Session API)
if ('mediaSession' in navigator) {
    // Registra el botón de "Siguiente" del timón o comandos de voz
    navigator.mediaSession.setActionHandler('nexttrack', () => {
        const nextBtn = document.getElementById("next");
        if (nextBtn) nextBtn.click(); // Simula físicamente presionar Siguiente en la web
    });

    // Registra el botón de "Atrás" del timón
    navigator.mediaSession.setActionHandler('previoustrack', () => {
        const prevBtn = document.getElementById("prev");
        if (prevBtn) prevBtn.click(); // Simula físicamente presionar Atrás en la web
    ```

### 🚨 Un último detalle importante para que se vea el nombre en el carro
Para que el auto pinte los textos en su pantalla cada vez que pases de estación, debemos decirle a las funciones que actualicen los datos del sistema. Busca tu función **`updateUI()`** en la mitad del código y agrega estas líneas adentro, justo debajo de donde dice `nameEl.textContent = stations[index].name;`:

```javascript
    // Envía el nombre y dial al tablero del carro por Bluetooth
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: stations[index].name,
            artist: stations[index].frequency + " MHz",
            album: "Radio FM Portátil",
            artwork: [{ src: stations[index].logo, sizes: '512x512', type: 'image/png' }]
        });
    }
