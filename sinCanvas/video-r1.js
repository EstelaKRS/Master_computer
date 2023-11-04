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

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const objectURL = URL.createObjectURL(file);

        video.src = objectURL;
        video.load();
        video.play();
        
    });

    video.addEventListener('loadedmetadata', () => {
        video.play();
    });

    canvas.width = video.width;
    canvas.height = video.height;

    let circleX = canvas.width /2;
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
 
            // Aplicar enfoque
             applyFocusEffect();
            
    
            // Convertir y mostrar la imagen con la bolita
            cv.imshow('canvasElement', src);
    
            src.delete();
            dst.delete();
    
            
            
            if (isMoving) {
                // Actualizar coordenadas usando una función senoidal
                circleX = canvas.width / 2 + Math.sin(Date.now() / 1000) * (canvas.width / 3);
                circleY = canvas.height / 2 + Math.cos(Date.now() / 1000) * (canvas.height / 3);
            }
            
    
            requestAnimationFrame(animateBall);
        }
    }

    function applyFocusEffect() {
        console.log("Aplicando efecto de enfoque");
        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let dst = new cv.Mat();
    
        // Obtener una región alrededor de la bolita
        let regionX = circleX - 2 * circleRadius;
        let regionY = circleY - 2 * circleRadius;
        let regionWidth = 4 * circleRadius;
        let regionHeight = 4 * circleRadius;
    
        // Asegurarnos de que las coordenadas de la región no sean negativas
        if (regionX < 0) {
            regionX = 0;
        }
        if (regionY < 0) {
            regionY = 0;
        }
    
        
          // Copiar la región del video a 'src'
          let region = src.roi(new cv.Rect(regionX, regionY, regionWidth, regionHeight));
      
          // Aplicar efecto de enfoque a la región
          let kernel = new cv.Mat(5, 5, cv.CV_32F);
          kernel.data32F.set([-1, -1, -1, -1, -1,
                     -1, -1, -1, -1, -1,
                     -1, -1, 26, -1, -1,
                     -1, -1, -1, -1, -1,
                     -1, -1, -1, -1, -1]);           
          
          cv.filter2D(region, dst, -1, kernel, new cv.Point(-1, -1), 0, cv.BORDER_DEFAULT);
  
          // Copiar la región enfocada de 'dst' de regreso a 'src'
          dst.copyTo(region);
  
          // Mostrar el video con el efecto de enfoque aplicado
          cv.imshow('canvasElement', src);
          // Liberar recursos
          kernel.delete();
          region.delete();
          src.delete();
          dst.delete();
         
      }
       
     
    showBallButton.addEventListener('click', () => {
        isBallVisible = !isBallVisible;
        isMoving = isBallVisible;
        if (isBallVisible) {
            
            applyFocusEffect();
            applyBlur();
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
 
            cv.imshow('canvasElement', dst);
            applyFocusEffect();
            //animateBall()
            
            

            requestAnimationFrame(processVideo);
        }

        processVideo();
    }

    /*changeColorButton.addEventListener('click', function() {
        applyBlur();
        //applyFocusEffect();
        
        
    });*/

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
   
});