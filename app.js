// const recordingState = document.getElementById("recordingState");
// const startButton = document.getElementById("startButton");
// const stopButton = document.getElementById("stopButton");
// let isRecording = false;

// //様々なブラウザでマイクへのアクセス権を取得する
// navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

// //audioのみtrue。Web Audio APIが問題なく使えるのであれば、第二引数で指定した関数を実行する
// navigator.getUserMedia(
//   {
//     audio: true,
//     video: false,
//   },
//   successFunc,
//   errorFunc
// );

// function successFunc(stream) {
//   var recorder = new MediaRecorder(stream, {
//     mimeType: "video/webm;codecs=vp9",
//   });

//   //音を拾い続けるための配列。chunkは塊という意味
//   var chunks = [];

//   //集音のイベントを登録する
//   recorder.addEventListener("dataavailable", (ele) => {
//     if (ele.data.size > 0) {
//       chunks.push(ele.data);
//     }
//   });

//   // recorder.stopが実行された時のイベント
//   recorder.addEventListener("stop", () => {
//     var dl = document.querySelector("#dl");

//     //集音したものから音声データを作成する
//     dl.href = URL.createObjectURL(new Blob(chunks));
//     dl.download = "sample.wav";
//   });

//   recorder.start();

//   //10秒後に集音を終了する。
//   setTimeout(() => {
//     alert("stop");
//     recorder.stop();
//   }, 10000);
// }

// // Web Audio APIが使えなかった時
// function errorFunc(error) {
//   alert("error");
// }

// startButton.addEventListener("click", async () => {
//   isRecording = true;
//   console.log("録音を開始しました");
//   recordingState.textContent = "🔴 録音中";
//   startButton.setAttribute("disabled", true);
//   stopButton.removeAttribute("disabled");
// });

// stopButton.addEventListener("click", async () => {
//   isRecording = false;
//   console.log("録音を停止しました");
//   recordingState.textContent = "「開始」ボタンで録音を開始する";
//   startButton.removeAttribute("disabled");
//   stopButton.setAttribute("disabled", true);
// });

const record = document.querySelector(".record");
const stop = document.querySelector(".stop");
const soundClips = document.querySelector(".sound-clips");

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log("getUserMedia supported.");
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })

    .then(function (stream) {
      const mediaRecorder = new MediaRecorder(stream);

      record.onclick = () => {
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recorder started");
        record.style.background = "red";
        record.style.color = "black";
      };

      let chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      stop.onclick = () => {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");
        record.style.background = "";
        record.style.color = "";
      };

      mediaRecorder.onstop = (e) => {
        console.log("recorder stopped");

        const clipName = "sample redord";

        const clipContainer = document.createElement("article");
        const clipLabel = document.createElement("p");
        const audio = document.createElement("audio");
        const deleteButton = document.createElement("button");

        clipContainer.classList.add("clip");
        audio.setAttribute("controls", "");
        deleteButton.innerHTML = "Delete";
        clipLabel.innerHTML = clipName;

        clipContainer.appendChild(audio);
        clipContainer.appendChild(clipLabel);
        clipContainer.appendChild(deleteButton);
        soundClips.appendChild(clipContainer);

        const blob = new Blob(chunks, { type: "audio/wav" });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL;

        deleteButton.onclick = (e) => {
          let evtTgt = e.target;
          evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
        };
      };
    })

    .catch(function (err) {
      console.log("The following getUserMedia error occured: " + err);
    });
} else {
  console.log("getUserMedia not supported on your browser!");
}
