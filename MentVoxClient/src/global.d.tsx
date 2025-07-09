export {};

interface Window {
    SpeechRecognition: any; // או תוכל להחליף ב- SpeechRecognition | undefined
    webkitSpeechRecognition: any; // או תוכל להחליף ב- webkitSpeechRecognition | undefined
  }
  
  interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
  }
  

//   https://models.readyplayer.me/67e045ef7f65c63ac726a25a.glb
// https://models.readyplayer.me/67e09ce5d4ed851a614c3c04.glb
//https://models.readyplayer.me/67e09cdde11c93725e3b90a2.glb
//https://models.readyplayer.me/67e09cdde11c93725e3b90a2.glb