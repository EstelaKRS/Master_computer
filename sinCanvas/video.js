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
    const circleRadius = 20;
    let circleSpeedX = 20;
    let circleSpeedY = 20;
    let isMoving = true;

    function animateBall() {
        if (isBallVisible) {
            let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
            let dst = new cv.Mat();
    
            
    
            // Dibujar la bolita
            let center = new cv.Point(circleX, circleY);
            let color = new cv.Scalar(255, 255, 0, 255); // Amarillo
            cv.circle(src, center, circleRadius, color, -1, cv.LINE_AA, 0);
            

            // Aplicar efecto de enfoque
            /*if (isVideoFocused) {
                let kernel = new cv.Mat(3, 3, cv.CV_32F, [
                    -1, -1, -1,
                    -1,  9, -1,
                    -1, -1, -1
                ]);
                cv.filter2D(src, src, -1, kernel);
                kernel.delete();
            }
            /*if (isVideoFocused) {
                let blurred = new cv.Mat();
                cv.GaussianBlur(src, blurred, {width: 25, height: 25}, 0, 0, cv.BORDER_DEFAULT);
                blurred.copyTo(src);
                blurred.delete();
            }*/


            // Obtener una región alrededor de la bolita
            let regionX = circleX - circleRadius - 50; 
            let regionY = circleY - circleRadius - 50;
            let regionWidth = circleRadius * 2 + 100; 
            let regionHeight = circleRadius * 2 + 100;
    
            // Asegurarnos de que las coordenadas de la región no sean negativas
            if (regionX < 0) {
                regionX = 0;
            }
            if (regionY < 0) {
                regionY = 0;
            }
    
            // Convertir y mostrar la imagen con la bolita
            cv.imshow(canvas, src);
    
            src.delete();
            dst.delete();

    
            if (isMoving) {
                // Actualizar coordenadas
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
        isVideoFocused = true;
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



/*document.addEventListener('DOMContentLoaded', function() {
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
    const circleRadius = 20;
    let circleSpeedX = 20;
    let circleSpeedY = 20;
    let isMoving = true;

    function animateBall() {
        if (isBallVisible) {
            let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
            let dst = new cv.Mat();
    
            // Aplicar desenfoque al video
            if (isVideoBlurred) {
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
            } else {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
    
            // Dibujar la bolita
            let center = new cv.Point(circleX, circleY);
            let color = new cv.Scalar(255, 255, 0, 255); // Amarillo
            cv.circle(src, center, circleRadius, color, -1, cv.LINE_AA, 0);
    
            // Convertir y mostrar la imagen con la bolita
            cv.imshow(canvas, src);
    
            src.delete();
            dst.delete();
    
            if (isMoving) {
                // Actualizar coordenadas
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
    
});*/

