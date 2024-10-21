const createRoomButton = document.getElementById('createRoom');
const joinRoomButton = document.getElementById('joinRoom');
const setUpButton = document.getElementById('setUp');
const roomIdInput = document.getElementById('roomId');
const roomInfoElement = document.getElementById('roomInfo');


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

document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ action: 'roomId' }, (response) => {
    if (response.roomId) roomInfoElement.textContent = `Current Room ID: ${response.roomId}`;
  });
});

