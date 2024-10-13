console.log('SynMedia API loaded');
let video;

document.addEventListener('DOMContentLoaded', () => {
  const newSrc = document.getElementById('playerDF').src;


  // Réception des commandes de synchronisation
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'syncPlay') {
      video.currentTime = message.currentTime;
      video.play();
    } else if (message.action === 'syncPause') {
      video.currentTime = message.currentTime;
      video.pause();
    } else if (message.action === 'syncSeek') {
      video.currentTime = message.currentTime;
    } else if (message.action === 'ready') {
      console.log('Ready to sync');
      window.location.replace(newSrc);
    }
  });

});

// interval = setInterval(() => {
//   try {
//     video = document.getElementById("video_html5_wrapper_html5_api");
//   } catch (error) {
//     console.error("Error getting video element:", error);
//   }
//   if (video !== null) {
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
//     clearInterval(interval);
//   }
  
// }, 500)



