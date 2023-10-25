document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');

    const video = document.getElementById('videoElement');
    

    const playPauseButton = document.getElementById('playPauseButton');
    const playIcon = document.getElementById('playIcon');
    const backwardButton = document.getElementById('backwardButton');
    const forwardButton = document.getElementById('forwardButton');
    const seekBar = document.getElementById('seekBar');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');

    //video.src = 'video.mp4';
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.classList.add('video');

    video.addEventListener('loadedmetadata', () => {
        const bolita = document.createElement('div');
        bolita.classList.add('bolita');
        bolita.style.left = '50%';
        bolita.style.top = '50%';
        document.querySelector('.video-container').appendChild(bolita);
        video.play();
    });
    let bolitaSpeedX = 3;
    let bolitaSpeedY = 3;
    let isMoving = true;


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
        //dibujando la bolita
        /*ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow'; // Puedes cambiar el color aquí
        ctx.fill();*/
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
    const bolita = document.querySelector('.bolita');

    function animateBolita() {
        if (isMoving) {
            let currentX = parseFloat(bolita.style.left) || 0;
            let currentY = parseFloat(bolita.style.top) || 0;

            let newX = currentX + bolitaSpeedX;
            let newY = currentY + bolitaSpeedY;

            newX = Math.min(Math.max(newX, 0), video.offsetWidth - 30);
            newY = Math.min(Math.max(newY, 0), video.offsetHeight - 30);

            bolita.style.left = newX + 'px';
            bolita.style.top = newY + 'px';
        }

        requestAnimationFrame(animateBolita);
    }

    animateBolita();
});
