const createRoomButton = document.getElementById('createRoom');
const joinRoomButton = document.getElementById('joinRoom');
const setUpButton = document.getElementById('setUp');
const roomIdInput = document.getElementById('roomId');
const roomInfoElement = document.getElementById('roomInfo');
const protocolInput = document.getElementById('protocolInput');
const hostInput = document.getElementById('hostInput');
const portInput = document.getElementById('portInput');


protocolInput.addEventListener('change', () => {
  chrome.runtime.sendMessage({ action: 'changeProtocol', protocol: protocolInput.value });
});

hostInput.addEventListener('input', () => {
  chrome.runtime.sendMessage({ action: 'changeHost', host: hostInput.value });
});

portInput.addEventListener('input', () => {
  chrome.runtime.sendMessage({ action: 'changePort', port: portInput.value });
  if (portInput.value == 0) {
    protocolInput.value = 'wss';
  }
});

createRoomButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'createRoom' }, (response) => {
      roomInfoElement.textContent = `Room created: ${response.roomId}`;
      createRoomButton.hidden = true;
    });
  });
  
joinRoomButton.addEventListener('click', () => {
  const roomId = roomIdInput.value;
  chrome.runtime.sendMessage({ action: 'joinRoom', roomId: roomId });
  roomInfoElement.textContent = `Joined Room: ${roomId}`;
});

setUpButton.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'ready' });
  roomInfoElement.textContent = 'Ready to sync';
  setUpButton.hidden = true;
});


// Initialize values
document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ action: 'roomId' }, (response) => {
    if (response.roomId) roomInfoElement.textContent = `Current Room ID: ${response.roomId}`;
  });

  chrome.runtime.sendMessage({ action: 'protocol' }, (response) => {
    if (response.protocol) {
      protocolInput.value = response.protocol;
    }
  });

  chrome.runtime.sendMessage({ action: 'host' }, (response) => {
    if (response.host) {
      hostInput.value = response.host;
    }
  });

  chrome.runtime.sendMessage({ action: 'port' }, (response) => {
    if (response.port) {
      portInput.value = response.port;
    }
  });
});

