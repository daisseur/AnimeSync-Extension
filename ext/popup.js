const roomInfo = document.getElementById('roomInfo');

document.getElementById('createRoom').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'createRoom' }, (response) => {
      roomInfo.textContent = `Room created: ${response.roomId}`;
    });
  });
  
document.getElementById('joinRoom').addEventListener('click', () => {
  const roomId = document.getElementById('roomId').value;
  chrome.runtime.sendMessage({ action: 'joinRoom', roomId: roomId });
  roomInfo.textContent = `Joined Room: ${roomId}`;
});

document.getElementById('setUp').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'ready' });
  roomInfo.textContent = 'Ready to sync';
});

document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ action: 'roomId' }, (response) => {
    if (response.roomId) roomInfo.textContent = `Current Room ID: ${response.roomId}`;
  });
});
