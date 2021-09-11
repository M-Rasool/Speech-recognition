init();
URL = window.URL || window.webkitURL;
var timer;
var interval;
var countdownValue = 5;
var gumStream;
//stream from getUserMedia() 
var recorder;
//WebAudioRecorder object 
// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us record
var input;
//MediaStreamAudioSourceNode we'll be recording var encodingType; 
//holds selected encoding for resulting audio (file) 
var encodeAfterRecord = true;
// when to encode 
var mic = document.getElementById("mic");
var closeDiv = document.getElementById("close");
var countdoun = document.getElementById("countdown");
var recognitionText = document.getElementById("recognition-text");
var retry = document.getElementById("retry");
retry.addEventListener("click", function() {
    retry.style.display = "none";
    startRecording();
});
mic.addEventListener("click", function() {
    mic.style.display = "none";
    retry.style.display = "none";
    document.getElementById("recognition-page").style.display = "block";
    startRecording();
});
closeDiv.addEventListener("click", function() {
    mic.style.display = "block";
    document.getElementById("recognition-page").style.display = "none";
    gumStream.getAudioTracks()[0].stop();
    clearTimeout(timer);
    clearInterval(interval);
    countdownValue = 5;
});

function startRecording() { 
    console.log("startRecording() called");
    var constraints = {
        audio: true,
        video: false
    }
    interval = setInterval(() => {
        countdown.innerHTML = "keep speaking for " + countdownValue + " s";
        if(countdownValue === 0) 
            recognitionText.innerHTML = "please wait ...";
        countdownValue--;
    }, 1000);
    timer = setTimeout(stopRecording, 6000);
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        //most of the code 
         //assign to gumStream for later use 
        audioContext = new AudioContext();
        gumStream = stream;
        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        //stop the input from playing back through the speakers 
        // input.connect(audioContext.destination) //get the encoding

        recorder = new WebAudioRecorder(input, {
            workerDir: "js/",
            numChannels:2,
            onEncoderLoading: function(recorder, encoding) {
                // show "loading encoder..." display 
                console.log("Loading "+encoding+" encoder...");
            },
            onEncoderLoaded: function(recorder, encoding) {
                // hide "loading encoder..." display
                console.log(encoding+" encoder loaded");
            }
        });

        recorder.onComplete = function(recorder, blob) {
            console.log("Encoding complete");
            createDownloadLink(blob, recorder.encoding);
        }

        recorder.setOptions({
            timeLimit: 120,
            encodeAfterRecord: encodeAfterRecord,
            ogg: {
                quality: 0.5
            },
            mp3: {
                bitRate: 160
            }
        });

        recorder.startRecording();
        console.log("Recording started");
    }).catch(function(err) {
        recognitionText.innerHTML = "Error expected"
    });
}

function stopRecording() {
    console.log("stopRecording() called");
    clearInterval(interval);
    countdownValue = 5;
    clearTimeout(timer);
    //stop microphone access 
    gumStream.getAudioTracks()[0].stop();
    //tell the recorder to finish the recording (stop recording + encode the recorded audio) 
    recorder.finishRecording();
}

function createDownloadLink(blob, encoding) {
    // console.log(blob);
    const reader = new window.FileReader();
    reader.readAsDataURL(blob);
    console.log(blob);
    reader.onloadend = () => {
        let base64 = reader.result;
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:8080/recognize", false);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(base64);
        const text = xhttp.responseText;
        recognitionText.innerHTML = text;
        xhttp.open("GET", "http://localhost:8080/getUrl?text=" + text, false);
        xhttp.send();
        if(xhttp.responseText !== "null")
            window.location.href = xhttp.responseText; 
        // console.log(base64);
        retry.style.display = "block";
    }
} 

function timerFunc(count) {
    x = setInterval(() => {
        expression.innerHTML = count;
        count--;
    }, 1000);
}

function init() {
    var mic = document.createElement("button");
    mic.className = "btn";
    mic.id = "mic";
    mic.style.position = "absolute";
    mic.style.right = "1%";
    mic.style.bottom = "1%";
    mic.style.width = "15%";

    var micIcon = document.createElement("i");
    micIcon.className = "material-icons";
    micIcon.innerHTML = "mic";

    mic.appendChild(micIcon);

    var div = document.createElement("div");
    div.id = "recognition-page";
    div.style.display = "none";
    div.style.position = "fixed";
    div.style.bottom = "1%";
    div.style.right = "1%";
    div.style.border = "3px solid #000000";
    div.style.zIndex = "9";
    div.style.height = "50%";
    div.style.width = "15%";

    var divCloseI = document.createElement("i");
    divCloseI.className = "material-icons";
    divCloseI.id = "close";
    divCloseI.style.float = "right";
    divCloseI.style.cursor = "pointer";
    divCloseI.innerHTML = "close";

    var countdownElement = document.createElement("h3");
    countdownElement.id = "countdown";

    var recognitionText = document.createElement("p");
    recognitionText.id = "recognition-text";

    var retryButton = document.createElement("button");
    retryButton.className = "btn";
    retryButton.id = "retry";
    retryButton.style.position = "absolute";
    retryButton.style.bottom = "0%";
    retryButton.style.width = "100%";
    retryButton.innerHTML = "Retry";

    div.appendChild(divCloseI);
    div.appendChild(countdownElement);
    div.appendChild(recognitionText);
    div.appendChild(retryButton);

    document.body.appendChild(mic);
    document.body.appendChild(div);
}
    




