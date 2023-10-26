document.addEventListener('DOMContentLoaded', function() {
    let isBallVisible = false;
    let isVideoBlurred = false;
    let cap;
    const fileInput = document.getElementById('fileInput');
    const video = document.getElementById('videoElement');
    const playPauseButton = document.getElementById('playPauseButton');
    const playIcon = document.getElementById('playIcon');
    const backwardButton = document.getElementById('backwardButton');
    const forwardButton = document.getElementById('forwardButton');
    const seekBar = document.getElementById('seekBar');
    const canvas = document.getElementById('canvasElement');
    const ctx = canvas.getContext('2d');
    const changeColorButton = document.getElementById('changeColorButton');

    const showBallButton = document.getElementById('showBallButton');

    
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.classList.add('video');

    video.addEventListener('loadedmetadata', () => {
        video.play();
    });

    canvas.width = video.width;
    canvas.height = video.height;

    let circleX = canvas.width / 2;
    let circleY = canvas.height / 2;
    const circleRadius = 14;
    let circleSpeedX = 5;
    let circleSpeedY = 5;
    let isMoving = true;

    function animateBall() {
        if (isBallVisible) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            // Aplicar desenfoque al video
            if (isVideoBlurred) {
                let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
                let cap = new cv.VideoCapture(video);
                let blurred = new cv.Mat();
                cv.GaussianBlur(src, blurred, { width: 25, height: 25 }, 0, 0, cv.BORDER_DEFAULT);
                cv.imshow(canvas, blurred);
                blurred.delete();
            } else {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
    
            // Dibujar la bolita
            ctx.beginPath();
            ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'yellow';
            ctx.fill();
    
            if (isMoving) {
                circleX += circleSpeedX;
                circleY += circleSpeedY;
    
                if (circleX - circleRadius <= 0 || circleX + circleRadius >= canvas.width) {
                    circleSpeedX = -circleSpeedX;
                }
    
                if (circleY - circleRadius <= 0 || circleY + circleRadius >= canvas.height) {
                    circleSpeedY = -circleSpeedY;
                }
            }
    
            requestAnimationFrame(animateBall);
        }
    }
    

    showBallButton.addEventListener('click', () => {
        isBallVisible = !isBallVisible;
        isMoving = isBallVisible;
        if (isBallVisible) {
            animateBall();
        }
   
    });

    function applyBlur() {
        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let dst = new cv.Mat();

        let cap = new cv.VideoCapture(video);
        let FPS = 30;

        function processVideo() {
            cap.read(src);

            cv.GaussianBlur(src, dst, { width: 25, height: 25 }, 0, 0, cv.BORDER_DEFAULT);

            cv.imshow(canvas, dst);

            requestAnimationFrame(processVideo);
        }

        processVideo();
    }

    changeColorButton.addEventListener('click', function() {
        applyBlur();
    });

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const objectURL = URL.createObjectURL(file);

        video.src = objectURL;
        video.load();
        video.play();
    });

    playPauseButton.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playIcon.src = 'pausess.png';
        } else {
            video.pause();
            playIcon.src = 'playy.png';
        }
    });

    backwardButton.addEventListener('click', () => {
        video.currentTime -= 3;
    });

    forwardButton.addEventListener('click', () => {
        video.currentTime += 3;
    });

    video.addEventListener('timeupdate', () => {
        seekBar.value = video.currentTime;   
    });

    seekBar.addEventListener('input', () => {
        video.currentTime = seekBar.value;
        updatevideo();
    });

    video.addEventListener('loadedmetadata', () => {
        seekBar.max = video.duration;
    });

    video.addEventListener('timeupdate', () => {
        seekBar.value = video.currentTime;

        const currentTime = video.currentTime;
        const formattedCurrentTime = formatTime(currentTime);
        currentTimeStamp.textContent = formattedCurrentTime;
    });

    video.addEventListener('pause', () => {
        timeStampContainer.style.visibility = 'visible';
    });

    video.addEventListener('pause', () => {
        isMoving = false;
    });

    video.addEventListener('play', () => {
        isMoving = true;
    });

    seekBar.addEventListener('input', () => {
        video.currentTime = seekBar.value;
        draw();
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function processVideo() {
        cap.read(src);

        let blurred = new cv.Mat();
        cv.GaussianBlur(src, blurred, {width: 25, height: 25}, 0, 0, cv.BORDER_DEFAULT);

        let dataUrl = cv.matFromImageData(blurred).toDataURL();
        blurredVideo.src = dataUrl;

        blurred.delete();

        let delay = 1000 / FPS;
        setTimeout(processVideo, delay);
    }

    processVideo();
});


