let canvas;
let ctx;
let center = { x: 100, y: 100 }; // Inicializa la posición del centro

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
    setInterval(moveBall, 100); // Llama a la función moveBall cada 100 milisegundos
}
function processImage() {
    let src = cv.imread(canvas);
    let dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.imshow(canvas, dst); 
    src.delete();
    dst.delete();
}

function moveBall() {
    // Actualiza la posición del centro de la "bolita" de forma automática
    center.x = (center.x + 2) % canvas.width; // Mueve la bolita hacia la derecha
    center.y = (center.y + 2) % canvas.height; // Mueve la bolita hacia abajo
    drawFilledCircle(center.x, center.y); // Dibuja la "bolita" con la nueva posición

}
function drawFilledCircle() {
    let src = cv.imread(canvas);

    // Definir el centro y radio del círculo
    let center = new cv.Point(canvas.width / 2, canvas.height / 2);
    let radius = 10;

    // Definir el color (en formato BGR)
    let color = new cv.Scalar(0, 255, 255, 255); // Negro en formato BGR
    //let color = [0, 255, 255, 255]; // Amarillo en formato BGR


    // Dibujar el círculo
    cv.circle(src, center, radius, color, -1, cv.LINE_AA, 0);

    // Mostrar la imagen con el círculo
    cv.imshow(canvas, src);

    src.delete(); // Liberar la memoria
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
    
}
document.getElementById('drawFilledCircleButton').addEventListener('click', function() {
    drawFilledCircle();
}); 