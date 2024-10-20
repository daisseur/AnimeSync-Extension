let socket = null;
let roomId = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`Receiving..`, message, sender);
  switch (message.action) {
    case 'createRoom':
      roomId = generateRoomId();
      initializeSocket(roomId);
      sendResponse({ roomId });
      break;

    case 'joinRoom':
      roomId = message.roomId;
      initializeSocket(roomId);
      break;

    case 'play':
    case 'pause':
    case 'seek':
      if (socket && roomId) {
        const data = JSON.stringify({
          action: message.action,
          currentTime: message.currentTime,
          roomId: roomId
        });
        socket.send(data);
      }
      break;

    case 'roomId':
      sendResponse({ roomId });
      break;

    case 'ready':
      notifyContentScript('ready');
      break;

    default:
      console.warn(`Unknown action: ${message.action}`);
  }
});

// Génère un ID de room aléatoire
function generateRoomId() {
  return Math.random().toString(36).substring(2, 10);
}

// Initialise la connexion WebSocket avec le serveur
function initializeSocket(roomId) {
  if (socket) {
    socket.close();  // Ferme toute connexion WebSocket précédente avant d'en ouvrir une nouvelle
  }

  socket = new WebSocket('ws://localhost:3000');

  socket.addEventListener('open', () => {
    const joinMessage = JSON.stringify({ action: 'joinRoom', roomId: roomId });
    socket.send(joinMessage);
    console.log('Joined room:', roomId);
  });

  socket.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      handleIncomingMessage(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  socket.addEventListener('close', () => {
    console.log('WebSocket connection closed.');
  });

  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

// Gère les messages entrants du serveur via WebSocket
function handleIncomingMessage(data) {
  if (data.action && data.currentTime !== undefined) {
    notifyContentScript(`sync${capitalize(data.action)}`, data.currentTime);
  }
}

function notifyContentScript(action, currentTime = null) {
  chrome.tabs.query({ url: "*://*.anime-sama.fr/*" }, (tabs) => {
    if (tabs.length > 0) {
      console.log(JSON.stringify(tabs, null, 2));
      chrome.tabs.sendMessage(tabs[0].id, {
        action: action,
        currentTime: currentTime
      }, () => {
        if (chrome.runtime.lastError) {
          console.warn('Error sending message:', chrome.runtime.lastError.message);
        } else {
          console.log('Message sent successfully');
        }
      });
    } else {
      console.warn('No matching tab found to send message.');
    }
  });
}

// Capitalise la première lettre d'une chaîne (ex: "play" -> "Play")
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'redirect') {
    chrome.tabs.update(sender.tab.id, { url: message.url }, (tab) => {
      // Attendre que la page soit chargée avant d'injecter le script
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (tabId === tab.id && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          
          // Injecter le script dans la nouvelle page
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: injectNewPageScript
          });
        }
      });
    });
  }
});

function injectNewPageScript() {
  console.log('Script injecté dans la nouvelle page');
  
  // Votre code pour la nouvelle page ici
  let video = document.getElementById("video_html5_wrapper_html5_api");
  if (video) {
    console.log("Video loaded", video);
    video.addEventListener('play', () => {
      chrome.runtime.sendMessage({ action: 'play', currentTime: video.currentTime });
    });

    video.addEventListener('pause', () => {
      chrome.runtime.sendMessage({ action: 'pause', currentTime: video.currentTime });
    });

    video.addEventListener('seeked', () => {
      chrome.runtime.sendMessage({ action: 'seek', currentTime: video.currentTime });
    });

    // Informer le background script que tout est prêt
    chrome.runtime.sendMessage({ action: 'videoReady' });
  }
}