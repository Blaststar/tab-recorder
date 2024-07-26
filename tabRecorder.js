// ==UserScript==
// @name         Tab recorder
// @namespace    http://tampermonkey.net/
// @version      2024-07-26
// @description  Record current tab to webm format default hotkey is "F2"
// @author       Blaststar
// @match        https://*/*
// @icon         https://media.discordapp.net/attachments/1121204413042798715/1266229526514368615/record.png?ex=66a463a4&is=66a31224&hm=6a9f914f779b75009ec5c9eba856bcdb6affb332c9715fec3e988ea5a0448228&=&format=webp&quality=lossless
// @grant        none
// ==/UserScript==

(function() {
  var hotkey = "F2";
  var recording = false;
  var blob = null;
  var chunks = [];
  var mediaRecorder = null;
  var setRecording = () => {
    if (recording === false) recording = true;
    if (recording === true) recording = false;
  };

  function createFileName() {
    var date = new Date();
    var time = date.getDay() + "." + date.getMonth() + "." + date.getFullYear() + "_" + date.getHours() + "." + date.getMinutes() + "." + date.getMilliseconds();
    return String(`Screen_Capture_${time}`);
  }

  async function startRecording() {
    var stream = await navigator.mediaDevices.getDisplayMedia({preferCurrentTab: true, video: {mediaSource: "screen"}, audio: true});
    mediaRecorder = new MediaRecorder(stream, {mimeType: "video/webm"});
    mediaRecorder.ondataavailable = (e) => {
      if(e.data.size > 0) {
        chunks.push(e.data);
      }
    }
    mediaRecorder.onstop = () => {
      setRecording();
      if (chunks.length < 1) return;
      blob = new Blob(chunks, {type: "video/webm"});
      chunks = [];
      recording = false;
      var dataDownloadUrl = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = dataDownloadUrl;
      a.download = createFileName() + ".webm";
      a.click();
      URL.revokeObjectURL(dataDownloadUrl);
    }
    mediaRecorder.start(250);
  }

  document.addEventListener("keydown", (e) => {
    if (recording) return;
    if (e.key === hotkey) {
      startRecording();
      setRecording();
    }
  });
})();
