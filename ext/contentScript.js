console.log('SyncMedia API loaded');

const cssString = `
.room-panel {
  position: fixed;
  top: 10%;
  right: 0;
  width: 250px;
  max-height: 80%;
  background-color: rgba(255, 255, 255, 0.9);
  font-family: 'Segoe UI', sans-serif;
  padding: 10px;
  border-radius: 5px 0 0 5px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
  overflow-y: auto;
  z-index: 1000;
}

.room-panel.collapsed {
  transform: translateX(90%);
}

.room-list {
  padding: 0;
  margin: 0;
  list-style-type: none;
}

.room-item {
  margin-bottom: 5px;
}

.room-button {
  width: 100%;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.room-button:hover {
  background-color: #0056b3;
}

.toggle-button {
  top: 10px;
  left: -25px;
  width: 25px;
  height: 25px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  text-align: center;
  line-height: 25px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-button:hover {
  background-color: #0056b3;
}
`;


function initCss() {
  const style = document.createElement('style');
  style.textContent = cssString;
  document.head.appendChild(style);
}

// Fonction pour initialiser l'écouteur de messages
function initializeMessageListener() {
  chrome.runtime.onMessage.addListener((message) => {
    console.log('Message received:', message);
    
    switch(message.action) {
      case 'listRooms':
        createRoomPanel(message.rooms);
        break;
      case 'ready':
        { console.log('Ready to sync');
          let url= null;
        const playerDF = document.getElementById('playerDF');
        const iframe = document.querySelector("iframe");
        const customIframe = document.querySelector("#iframe-holder > iframe");
        console.log(customIframe);
        if (playerDF && playerDF.src) {
          // anime-sama
          url = new URL(playerDF.src);
        } else if (iframe && iframe.src && (!customIframe || !customIframe.src)) {
          // voiranime MyTV (vidmoly)
          url = new URL(iframe.src);

        } else if (customIframe && customIframe.src) {
          // voiranime: others
          url = new URL(customIframe.src);
          // if (window.location.hostname == 'v5.voiranime.com') {
          //   url.searchParams.set('referer', "v5.voiranime.com");
          // }
        } else {
          console.warn('playerDF not found or src not set');
        }
        console.log(url);
        chrome.runtime.sendMessage({ 
          action: 'redirect', 
          url: url.toString()
        });
        break; }
      default:
        console.warn('Unknown action:', message.action);
    }
  });
}

// Initialiser tout
function initialize() {
  initCss();
  initializeMessageListener();
  chrome.runtime.sendMessage({ action: 'listRooms' });
}

initialize();
document.addEventListener('DOMContentLoaded', initialize);

function createRoomPanel(rooms) {
  let panel = document.querySelector('.room-panel');
  let toggleButton;
  let roomList;

  // Si le panel n'existe pas, on le crée
  if (!panel) {
    panel = document.createElement('div');
    panel.classList.add('room-panel');

    // Bouton pour ouvrir/fermer le panel
    toggleButton = document.createElement('div');
    toggleButton.classList.add('toggle-button');
    toggleButton.innerHTML = '➔';

    toggleButton.addEventListener('click', () => {
      panel.classList.toggle('collapsed');
      toggleButton.innerHTML = panel.classList.contains('collapsed') ? '⬅' : '➔';
    });

    // Liste des salles
    roomList = document.createElement('ul');
    roomList.classList.add('room-list');

    // Ajout des éléments au panneau
    panel.appendChild(toggleButton);
    panel.appendChild(roomList);
    document.body.appendChild(panel);
  } else {
    // Récupérer les éléments existants si le panel existe déjà
    toggleButton = panel.querySelector('.toggle-button');
    roomList = panel.querySelector('.room-list');
    roomList.innerHTML = ''; // Vider la liste existante pour la mettre à jour
  }

  // Ajout des salles dans la liste
  rooms.forEach(room => {
    const roomItem = document.createElement('li');
    roomItem.classList.add('room-item');

    const roomButton = document.createElement('button');
    roomButton.classList.add('room-button');
    roomButton.textContent = room.roomId;
    roomButton.addEventListener('click', () => {
      window.location.href = room.url;
    });

    roomItem.appendChild(roomButton);
    roomList.appendChild(roomItem);
  });
}
