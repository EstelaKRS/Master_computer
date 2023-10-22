/*let canvas;
let ctx;

function initialize() {
    canvas = document.getElementById('canvasElement');
    ctx = canvas.getContext('2d');

    document.getElementById('fileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const objectURL = URL.createObjectURL(file);
        const image = new Image();
        image.src = objectURL;
        image.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el lienzo
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
    });


    //para poner a blanco y negro
    document.getElementById('processImageButton').addEventListener('click', function() {
        processImage();
    });
}
 function processImage() {
    let src = cv.imread(canvas);
    let dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.imshow(canvas, dst); 
    src.delete();
    dst.delete();
}

// para desenfoque
document.getElementById('applyBlurButton').addEventListener('click', function() {
    applyBlur();
});

function applyBlur() {
    let src = cv.imread(canvas);
    let dst = new cv.Mat();

    // Aplicar desenfoque gaussiano
    cv.GaussianBlur(src, dst, {width: 5, height: 5}, 0, 0, cv.BORDER_DEFAULT);
    

    cv.imshow(canvas, dst);
    
    src.delete();
    dst.delete();
}*/

/*document.addEventListener('DOMContentLoaded', function() {
    const videoInput = document.getElementById('videoInput');
    const video = document.getElementById("videoElement");
    const canvas = document.getElementById("canvasElement");

    videoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const objectURL = URL.createObjectURL(file);

        // Actualizar el elemento de video con el nuevo video seleccionado.
        video.src = objectURL;
        video.play();
    });

    (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        });

        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let cap = new cv.VideoCapture(video);

        video.srcObject = stream;
        video.play();

        const FPS = 30;
        function processVideo() {
            let begin = Date.now();
            cap.read(src);

            // Convertir a blanco y negro
            let gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

            cv.imshow("canvasElement", gray);

            let delay = 1000 / FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        }

        setTimeout(processVideo, 0);
    })();
});*/

/*document.addEventListener('DOMContentLoaded', function() {
    const videoInput = document.getElementById('videoInput');
    const video = document.getElementById("videoElement");
    const canvas = document.getElementById("canvasElement");

    videoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const objectURL = URL.createObjectURL(file);

        // Actualizar el elemento de video con el nuevo video seleccionado.
        video.src = objectURL;
        video.play();
    });

    (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        });

        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let cap = new cv.VideoCapture(video);

        video.srcObject = stream;
        video.play();

        const FPS = 30;
        function processVideo() {
            let begin = Date.now();
            cap.read(src);

            // Convertir a blanco y negro
            let gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

            cv.imshow("canvasElement", gray);

            let delay = 1000 / FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        }

        setTimeout(processVideo, 0);
    })();
});*/



document.addEventListener('DOMContentLoaded', function() {
    const videoInput = document.getElementById('videoFile');
    const video = document.getElementById("video-input");
    const canvas = document.getElementById("canvas-output");
    const changeColorButton = document.getElementById('changeColorButton'); // Agregado

  
    videoInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      const objectURL = URL.createObjectURL(file);
  
      // Actualizar el elemento de video con el nuevo video seleccionado.
      video.src = objectURL;
      video.play();
    });

    changeColorButton.addEventListener('click', function() {
        changeColor();
    });

    //para aplicar filtro de umbral
    /*async function changeColor() {
        let begin = Date.now();
        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let cap = new cv.VideoCapture(video);

        const FPS = 30;
        function processVideo() {
            cap.read(src);

            let gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

            let thresh = new cv.Mat();
            cv.threshold(gray, thresh, 90, 255, cv.THRESH_OTSU);

            let hierarchy = new cv.Mat();
            let contours = new cv.MatVector();

            cv.findContours(
                thresh,
                contours,
                hierarchy,
                cv.RETR_CCOMP,
                cv.CHAIN_APPROX_SIMPLE
            );

            for (let i = 0; i < contours.size(); ++i) {
                let color = new cv.Scalar(255, 0, 0);
                cv.drawContours(src, contours, i, color, 1, cv.LINE_8, hierarchy, 100);
            }

            cv.imshow("canvas-output", src);

            let delay = 1000 / FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        }

        setTimeout(processVideo, 0);
    }*/

    //Para convercion a blanco y negro
    /*async function changeColor() {
        let begin = Date.now();
        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let cap = new cv.VideoCapture(video);
    
        const FPS = 30;
        function processVideo() {
            cap.read(src);
    
            let gray = new cv.Mat();
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    
            cv.imshow("canvas-output", gray);
    
            let delay = 1000 / FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        }
    
        setTimeout(processVideo, 0);
    }*/

    async function changeColor() {
        let begin = Date.now();
        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let cap = new cv.VideoCapture(video);
    
        const FPS = 30;
        function processVideo() {
            cap.read(src);
    
            let blurred = new cv.Mat();
            cv.GaussianBlur(src, blurred, {width: 25, height: 25}, 0, 0, cv.BORDER_DEFAULT);
    
            cv.imshow("canvas-output", blurred);
    
            blurred.delete();
    
            let delay = 1000 / FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        }
    
        setTimeout(processVideo, 0);
    }
    
});



     

