console.log('SyncMedia API loaded');

// Fonction pour initialiser l'écouteur de messages
function initializeMessageListener() {
  chrome.runtime.onMessage.addListener((message) => {
    console.log('Message received:', message);
    
    switch(message.action) {
      case 'listRooms':
        {
          const roomsList = message.rooms;
          const popup = document.createElement('div');
          popup.style.position = 'absolute';
          popup.style.left = '0';
          popup.style.top = '0';
          popup.style.backgroundColor = 'transparent';
          popup.style.fontFamily = 'Segoe UI';
          popup.style.padding = '5px';
          const ul = document.createElement('ul');
          roomsList.forEach((room) => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = room.url;
            button.addEventListener('click', () => {
              window.location.href = room.url;
            });
            li.appendChild(button);
            ul.appendChild(li);
          });
          popup.appendChild(ul);
          document.body.appendChild(popup);
          break;
        }
      case 'ready':
        { console.log('Ready to sync');
        const playerDF = document.getElementById('playerDF');
        if (playerDF && playerDF.src) {
          chrome.runtime.sendMessage({ 
            action: 'redirect', 
            url: playerDF.src 
          });
        } else {
          console.warn('playerDF not found or src not set');
        }
        break; }
      default:
        console.warn('Unknown action:', message.action);
    }
  });
}

// Initialiser tout
function initialize() {
  initializeMessageListener();
  chrome.runtime.sendMessage({ action: 'listRooms' });
}

initialize();
document.addEventListener('DOMContentLoaded', initialize);
