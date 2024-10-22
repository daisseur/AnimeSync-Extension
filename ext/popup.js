const createRoomButton = document.getElementById('createRoom');
const joinRoomButton = document.getElementById('joinRoom');
const autoRoomButton = document.getElementById('autoRoom');
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
    chrome.runtime.sendMessage({ action: 'createRoom', url: window.location.href }, (response) => {
      roomInfoElement.textContent = `Room created: ${response.roomId}`;
      createRoomButton.hidden = true;
    });
  });
  
joinRoomButton.addEventListener('click', () => {
  const roomId = roomIdInput.value;
  chrome.runtime.sendMessage({ action: 'joinRoom', roomId: roomId, url: window.location.href });
  roomInfoElement.textContent = `Joined Room: ${roomId}`;
});

setUpButton.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'ready' });
  roomInfoElement.textContent = 'Ready to sync';
  setUpButton.hidden = true;
});

autoRoomButton.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'autoRoom', url: window.location.href }, (response) => {
    roomInfoElement.textContent = 'Joined auto room';
    if (response.roomId) {
      roomInfoElement.innerHTML = `Auto Room ID: <strong>${response.roomId}</strong>`;
      roomIdInput.value = response.roomId;
    }
  });
});



// Initialize values
document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ action: 'roomId' }, (response) => {
    if (response.roomId) {
      roomInfoElement.innerHTML = `Current Room ID: <strong>${response.roomId}</strong>`;
      roomIdInput.value = response.roomId;
    }
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

