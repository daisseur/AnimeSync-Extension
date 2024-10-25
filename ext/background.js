let socket = null;
let roomId = null;
let protocol = "wss";
let host = "aserver.daisseur.online";
let port = "0";
let url = null;

const supported_urls = ["*://*.anime-sama.fr/*", "*://v5.voiranime.com/*", "*://vidmoly.to/embed*", "*://video.sibnet.ru/shell.php?videoid=*", "*://sendvid.com/embed/*"];

const militaryAlphabet = [
  'alpha',
  'bravo',
  'charlie',
  'delta',
  'echo',
  'foxtrot',
  'golf',
  'hotel',
  'india',
  'juliett',
  'kilo',
  'lima',
  'mike',
  'november',
  'oscar',
  'papa',
  'quebec',
  'romeo',
  'sierra',
  'tango',
  'uniform',
  'victor',
  'whiskey',
  'x-ray',
  'yankee',
  'zulu'
];

async function getRoomUrl(url) {
  const api = `${protocol == "wss" ? "https" : "http"}://${host}${port == "0" ? "" : `:${port}`}/listRooms${url ? `?url=${encodeURIComponent(url)}` : ''}`;
  console.log(api);
  const response = await fetch(api);
  const data = await response.json();
  if (!url) {
    return Array.from(data);
  }
  if (data.length > 0) {
    return data[0].roomId;
  } else {
    return null;
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(`Receiving..`, message, sender);
  switch (message.action) {
    case 'changeProtocol':
      protocol = message.protocol;
      break;

    case 'changeHost':
      host = message.host;
      break;

    case 'changePort':
      port = message.port;
      break;

    case 'createRoom':
      roomId = generateRoomId();
      initializeSocket(roomId);
      sendResponse({ roomId });
      break;

    case 'joinRoom':
      roomId = message.roomId;
      initializeSocket(roomId, url);
      break;

    case 'autoRoom':
      {
        let autoRoomUrl = await getRoomUrl(url);
        if (autoRoomUrl) {
          roomId = autoRoomUrl;
        } else {
          roomId = generateRoomId();
        }
        initializeSocket(roomId, url);
        sendResponse({ roomId });
        break; 
      }
    
    case 'listRooms':
      {
        const rooms = await getRoomUrl(url);
        chrome.tabs.query({ url: ["*://*.anime-sama.fr/*"] }, (tabs) => {
          if (tabs.length > 0) {
            console.log(JSON.stringify(tabs, null, 2));
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "listRooms",
              rooms: rooms
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
        break;
      }

    case 'protocol':
      sendResponse({ protocol });
      break;

    case 'host':
      sendResponse({ host });
      break;

    case 'port':
      sendResponse({ port });
      break;

    case 'url':
      url = message.url;
      break;


    case 'play':
    case 'pause':
    case 'seek':
      if (socket && roomId) {
        const data = JSON.stringify({
          action: message.action,
          currentTime: message.currentTime,
          roomId: roomId,
          url: url,
          timestamp: message.timestamp,
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

    case 'redirect':
      console.log('Redirecting to:', message.url);
      chrome.tabs.update(sender.tab.id, { url: message.url });
      break;
    default:
      console.warn(`Unknown action: ${message.action}`);
  }
});


// Génère un ID de room aléatoire
function generateRoomId() {
  const value = Math.random().toFixed(2) * 100;
  const letters = Math.random().toString(26).substring(2, 4).toUpperCase();
  return letters + "-" + militaryAlphabet[value % 25] || "prince";
}

// Initialise la connexion WebSocket avec le serveur
function initializeSocket(roomId, url) {
  if (socket) {
    socket.close();  // Ferme toute connexion WebSocket précédente avant d'en ouvrir une nouvelle
  }

  socket = new WebSocket(`${protocol}://${host}${port==="0"?"":`:${port}`}`);

  socket.addEventListener('open', () => {
    const joinMessage = JSON.stringify({ action: 'joinRoom', roomId: roomId, url: url });
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
    notifyContentScript(`sync${capitalize(data.action)}`, data.currentTime, data.timestamp);
  }
}

function notifyContentScript(action, currentTime = null, timestamp = null) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: action,
        currentTime: currentTime,
        timestamp: timestamp
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
