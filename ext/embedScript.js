function injectNewPageScript() {
  console.clear();
  console.log('Script injecté dans la nouvelle page');

  const state = injectUI();
  state.innerText = 'Loading...';

  // Load video
  const player = document.querySelector("#vplayer > div.jw-wrapper.jw-reset > div.jw-media.jw-reset > video");
  if (player) {
    player.click();
  }

  const video = document.querySelector("video");

  if (video) {
    console.log("Video loaded", video);
    video.pause();

    let syncPlayActive = false;
    let syncPauseActive = false;
    let syncSeekActive = false;

    chrome.runtime.sendMessage({ action: 'url', url: window.location.href });

    video.addEventListener('play', () => {
      if (!syncPlayActive) {
        chrome.runtime.sendMessage({ action: 'play', currentTime: video.currentTime, timestamp: Date.now() });
        console.log("play");
        state.innerText = 'Playing...';
      }
      syncPlayActive = false;
    });

    video.addEventListener('pause', () => {
      if (!syncPauseActive) {
        chrome.runtime.sendMessage({ action: 'pause', currentTime: video.currentTime, timestamp: Date.now() });
        console.log("pause");
        state.innerText = 'Paused';
      }
      syncPauseActive = false;
    });

    video.addEventListener('seeked', () => {
      if (!syncSeekActive) {
        chrome.runtime.sendMessage({ action: 'seek', currentTime: video.currentTime, timestamp: Date.now() });
        console.log("seek");
        state.innerText = 'Seek';
      }
      syncSeekActive = false;
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('Message received:', message);
      state.innerText = message.action;
      const delay = message.timestamp ? (Date.now() - message.timestamp) / 1000 : 0;

      switch(message.action) {
        
        case 'syncPlay':
          video.currentTime = message.currentTime + delay;
          video.play();
          syncPlayActive = true;
          sendResponse({ success: true });
          break;
        case 'syncPause':
          video.currentTime = message.currentTime + delay;
          video.pause();
          syncPauseActive = true;
          sendResponse({ success: true });
          break;
        case 'syncSeek':
          video.currentTime = message.currentTime + delay;
          syncSeekActive = true;
          sendResponse({ success: true });
          break;
        default:
          console.warn(`Unknown action: ${message.action}`);
      }
    });

    // Informer le background script que tout est prêt
    chrome.runtime.sendMessage({ action: 'videoReady' });
    
  } 
  // else {
  //   console.log("Video element not found, retrying...");
  //   setTimeout(injectNewPageScript, 500);
  // }

 
}

function injectUI() {
  const body = document.getElementsByTagName('body')[0];
  const container = document.createElement('div');
  const state = document.createElement('p');

  container.style = "position: absolute; top: 0; left: 0; display: flex; font-size: 1rem; font-weight: bold; font-family: Segoe UI; color: black; padding: 1rem; background-color: rgba(255, 255, 255, 0.8); border-radius: 0.5rem; border: 1px solid black; width: 10vw; height: 2vh; justify-content: center; align-items: center;";
  container.appendChild(state);
  body.appendChild(container);

  return state;
}

injectNewPageScript();