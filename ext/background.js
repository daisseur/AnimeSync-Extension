let socket;
let roomId = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'createRoom') {
    roomId = generateRoomId();
    initializeSocket(roomId);
    sendResponse({ roomId });
  } else if (message.action === 'joinRoom') {
    roomId = message.roomId;
    initializeSocket(roomId);
  } else if (message.action === 'play' || message.action === 'pause' || message.action === 'seek') {
    if (socket && roomId) {
      const data = JSON.stringify({
        action: message.action,
        currentTime: message.currentTime,
        roomId: roomId
      });
      socket.send(data);
    }
  } else if (message.action === 'roomId') {
    sendResponse({ roomId });
  } else if (message.action === 'ready') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: `ready`
      });
    });
  }
});

function generateRoomId() {
  return Math.random().toString(36).substring(2, 10);
}

function initializeSocket(roomId) {
  socket = new WebSocket('ws://localhost:3000');

  socket.addEventListener('open', () => {
    const joinMessage = JSON.stringify({ action: 'joinRoom', roomId: roomId });
    socket.send(joinMessage);
  });

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.action && data.currentTime) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: `sync${data.action.charAt(0).toUpperCase() + data.action.slice(1)}`,
          currentTime: data.currentTime
        });
      });
    }
  });

  socket.addEventListener('close', () => {
    console.log('WebSocket connection closed.');
  });

  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
  });
}
