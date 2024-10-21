console.log('SynMedia API loaded');
let video;


// Fonction pour initialiser l'écouteur de messages
function initializeMessageListener() {
  chrome.runtime.onMessage.addListener((message) => {
    console.log('Message received:', message);
    
    switch(message.action) {
      case 'syncPlay':
        video.currentTime = message.currentTime;
        video.play();
        break;
      case 'syncPause':
        video.currentTime = message.currentTime;
        video.pause();
        break;
      case 'syncSeek':
        video.currentTime = message.currentTime;
        break;
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
}

initialize();
document.addEventListener('DOMContentLoaded', initialize);