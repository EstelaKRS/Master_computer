document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvasElement');
    const ctx = canvas.getContext('2d');
    const video = document.createElement('video');
    
    canvas.width = 640;
    canvas.height = 400;

    // Establecer el estilo del texto
    //ctx.font = 'bold 25px Segoe UI';
    //ctx.fillStyle = 'black';   

    video.src = 'video.mp4';
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.classList.add('video');
    
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    let circleX = canvas.width / 2;
    let circleY = canvas.height / 2;
    const circleRadius = 14;
    let circleSpeedX = 3;
    let circleSpeedY = 3;
    let isMoving = true;



    video.addEventListener('play', () => {
        function draw() {
            if (!video.paused && !video.ended) {
                          
                const videoWidth = 400;
                const videoHeight = 250;
              
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(video, (canvas.width/2)-( videoWidth/2), (canvas.height/2)-(videoHeight/2), videoWidth, videoHeight);
               
                //dibujando la bolita
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
            

                requestAnimationFrame(draw);
                
            }
           
        }
        draw();
    });

    function updateCanvas() {
        const videoWidth = 400;
        const videoHeight = 250;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, (canvas.width/2)-( videoWidth/2), (canvas.height/2)-(videoHeight/2), videoWidth, videoHeight);
    }

    
    const playPauseButton = document.getElementById('playPauseButton');
    const playIcon = document.getElementById('playIcon');
    //let isPlaying = false;

    playPauseButton.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playIcon.src = 'pausess.png'; // Ruta de la imagen de play
            isMoving = true;
            } else {
                video.pause();
                playIcon.src = 'playy.png'; // Ruta de la imagen de pause
                isMoving = false;
            }
            //isPlaying = !isPlaying;
        });   


    const fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const objectURL = URL.createObjectURL(file);
        video.src = objectURL;
        video.load();
        video.play();
    });

    const backwardButton = document.getElementById('backwardButton');

    backwardButton.addEventListener('click', () => {
        video.currentTime -= 3; // Retrocede 3 segundos
    });

    console.log("valor de currentTime: "+video.currentTime);

    const forwardButton = document.getElementById('forwardButton');
    forwardButton.addEventListener('click', () => {
        video.currentTime += 3; // Avanza 3 segundos
    });
   
    //Para la linea de tiempo
    const seekBar = document.getElementById('seekBar');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    video.addEventListener('timeupdate', () => {
        seekBar.value = video.currentTime;
        updateCanvas(); // Llama a la función para actualizar el canvas
    });
    
    seekBar.addEventListener('input', () => {
        video.currentTime = seekBar.value;
        updateCanvas(); // Llama a la función para actualizar el canvas
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
        //dibujando la bolita
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow'; // Puedes cambiar el color aquí
        ctx.fill();
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
   

  
    console.log("valor de seelBar: "+seekBar.value);
    //funcion para  formatear el tiempo en segundos a formato mm:ss
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }


    const blurButton = document.getElementById('blurButton');
    blurButton.addEventListener('click', function() {
        blurColor();
    });
    async function blurColor() {
        let begin = Date.now();
        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let cap = new cv.VideoCapture(video);

        const FPS = 30;
        function processVideo() {
            cap.read(src);

            let blurred = new cv.Mat();
            cv.GaussianBlur(src, blurred, {width: 25, height: 25}, 0, 0, cv.BORDER_DEFAULT);
            cv.imshow(video, blurred);
            blurred.delete();

            let delay = 1000 / FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);

        
         }

     setTimeout(processVideo, 0);
    }

   
}); 