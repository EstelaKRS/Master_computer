document.addEventListener('DOMContentLoaded', function() {
    let isBallVisible = false;
    const fileInput = document.getElementById('fileInput');
    const video = document.getElementById('videoElement');
    const playPauseButton = document.getElementById('playPauseButton');
    const playIcon = document.getElementById('playIcon');
    const backwardButton = document.getElementById('backwardButton');
    const forwardButton = document.getElementById('forwardButton');
    const seekBar = document.getElementById('seekBar');
    const canvas = document.getElementById('canvasElement');
    const ctx = canvas.getContext('2d');
    const changeColorButton = document.getElementById('changeColorButton'); // Agregado

    const showBallButton = document.getElementById('showBallButton');
     //video.src = 'video.mp4';
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
    let circleSpeedX = 3;
    let circleSpeedY = 3;
    let isMoving = true;
  
   /* showBallButton.addEventListener('click', () => {
        isBallVisible = !isBallVisible; // Cambiar el estado de visibilidad de la bolita
        if (isBallVisible) {
            animateBall(); // Iniciar animación de la bolita si está visible
        }
    });*/
    showBallButton.addEventListener('click', () => {
        isBallVisible = !isBallVisible; // Cambiar el estado de visibilidad de la bolita
        isMoving = isBallVisible; // Iniciar o detener el movimiento de la bolita
        if (isBallVisible) {
            animateBall(); // Iniciar animación de la bolita si está visible
        }
    });

    function animateBall() {
        if (isBallVisible) {
            // Dibujando la bolita
            ctx.beginPath();
            ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'yellow'; // Puedes cambiar el color aquí
            ctx.fill();

            if (isMoving){
                circleX += circleSpeedX;
                circleY += circleSpeedY;

                if (circleX - circleRadius <= (canvas.width / 2) - (videoWidth / 2) || circleX + circleRadius >= (canvas.width / 2) + (videoWidth / 2)) {
                    circleSpeedX = -circleSpeedX;
                }
            
                if (circleY - circleRadius <= (canvas.height / 2) - (videoHeight / 2) || circleY + circleRadius >= (canvas.height / 2) + (videoHeight / 2)) {
                    circleSpeedY = -circleSpeedY;
                }
            }
            
            if (isVideoBlurred) {
                let blurred = new cv.Mat();
                cv.GaussianBlur(src, blurred, {width: 25, height: 25}, 0, 0, cv.BORDER_DEFAULT);
                cv.imshow(canvas, blurred);
                blurred.delete();
            } else {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }

            

            requestAnimationFrame(animateBall);
        }
    }


    function applyBlur() {
        isVideoBlurred = !isVideoBlurred; // Cambiar el estado de desenfoque
    }

    changeColorButton.addEventListener('click', function() {
        applyBlur(); // Llamar a la función de desenfoque al hacer clic en el botón
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
   //PARA LA LINEA DE TIEMPO
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
    
    video.addEventListener('play', () => {
        timeStampContainer.style.visibility = 'hidden';
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

   
    changeColorButton.addEventListener('click', function() {
        applyBlur(); // Llamar a la función de desenfoque al hacer clic en el botón
    });

   // Función para aplicar desenfoque
   function applyBlur() {
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let cap = new cv.VideoCapture(video);

    const FPS = 30;
    

    function processVideo() {
        cap.read(src);

        let blurred = new cv.Mat();
        cv.GaussianBlur(src, blurred, {width: 25, height: 25}, 0, 0, cv.BORDER_DEFAULT);
        
        cv.imshow(canvas, blurred);
        blurred.delete();

        let delay = 1000 / FPS;
        setTimeout(processVideo, delay);
    }

    processVideo();
}


});