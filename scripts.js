window.addEventListener('load', () => {
    const audio = document.getElementById('backgroundMusic');
    const candle = document.querySelector('.velas'); // Select the candle element
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let analyser = audioContext.createAnalyser();
    let microphone;

    // Function to play music
    function playMusic() {
        audio.play().then(() => {
            console.log('Music is playing.');
        }).catch((error) => {
            console.error('Error playing music:', error);
        });
    }

    // Initial attempt to play music
    playMusic();

    // Add event listener for user interaction
    document.body.addEventListener('click', () => {
        playMusic();
    });

    // Function to handle sound detection
    function detectSound() {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        const soundLevel = dataArray.reduce((a, b) => a + b) / bufferLength;

        // Adjust this threshold as necessary
        if (soundLevel > 50) { // Threshold for detecting a scream or blow
            blowOutCandle();
        }

        requestAnimationFrame(detectSound);
    }

    function blowOutCandle() {
        candle.classList.add('candle-blown-out'); // Add the animation class
        setTimeout(() => {
            candle.style.display = 'none'; // Hide the candle after animation
        }, 500); // Match this to the animation duration
        console.log('Candle blown out!');
    }

    // Get microphone input
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            analyser.fftSize = 2048;
            detectSound(); // Start detecting sound
        })
        .catch(error => {
            console.error('Error accessing microphone:', error);
        });
});