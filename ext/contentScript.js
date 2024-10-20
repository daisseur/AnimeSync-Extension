console.log('SynMedia API loaded');
let video;

// function initializeVideo() {
//   video = document.getElementById("video_html5_wrapper_html5_api");
//   if (video) {
//     console.log("Video loaded", video);
//     // Écouter les événements de lecture/pause et de positionnement
//     video.addEventListener('play', () => {
//       chrome.runtime.sendMessage({ action: 'play', currentTime: video.currentTime });
//     });

//     video.addEventListener('pause', () => {
//       chrome.runtime.sendMessage({ action: 'pause', currentTime: video.currentTime });
//     });

//     video.addEventListener('seeked', () => {
//       chrome.runtime.sendMessage({ action: 'seek', currentTime: video.currentTime });
//     });

//     // Informer le background script que tout est prêt
//     chrome.runtime.sendMessage({ action: 'videoReady' });
//   } else {
//     console.log("Video element not found, retrying...");
//     setTimeout(initializeVideo, 500);
//   }
// }

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
        console.log('Ready to sync');
        const playerDF = document.getElementById('playerDF');
        if (playerDF && playerDF.src) {
          chrome.runtime.sendMessage({ 
            action: 'redirect', 
            url: playerDF.src 
          });
        } else {
          console.warn('playerDF not found or src not set');
        }
        break;
      default:
        console.warn('Unknown action:', message.action);
    }
  });
}

// Initialiser tout
function initialize() {
  initializeMessageListener();
  // initializeVideo();
}

// Exécuter l'initialisation immédiatement et également après le chargement du DOM
initialize();
document.addEventListener('DOMContentLoaded', initialize);