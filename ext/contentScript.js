console.log('SyncMedia API loaded');

// Fonction pour initialiser l'écouteur de messages
function initializeMessageListener() {
  chrome.runtime.onMessage.addListener((message) => {
    console.log('Message received:', message);
    
    switch(message.action) {
      case 'listRooms':
        {
          console.log('List rooms');
          try {
            const roomsList = Array.from(message.rooms);
            // if (roomsList.length === 0) {
            //   console.log('No rooms found');
            //   break;
            // }
            const popup = document.createElement('div');
            popup.style.zIndex = '1000';
            popup.style.position = 'absolute';
            popup.style.right = '0';
            popup.style.top = '50%';
            popup.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            popup.style.fontFamily = 'Segoe UI';
            popup.style.padding = '10px';
            popup.style.borderRadius = '5px';
            const ul = document.createElement('ul');
            roomsList.forEach((room) => {
              const li = document.createElement('li');
              li.style = 'list-style-type: none; color: white; empty-cells: show; padding: 5px;';
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
            console.log(popup);
          } catch (error) {
            console.error('Error:', error);
          }
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
