document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const canvas = document.getElementById('whiteboard');
    const context = canvas.getContext('2d');

    let current = {
        color: 'black',
        size: 5
    };
    let drawing = false;

    const drawLine = (x0, y0, x1, y1, color, size, emit) => {
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = color;
        context.lineWidth = size;
        context.stroke();
        context.closePath();
        if(!emit) { return; }
        const w = canvas.width;
        const h = canvas.height;

        socket.emit('drawing', {
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w, 
            y1: y1 / h,
            color: color,
            size: size
        });
    };

    function onMouseDown(e) {
        drawing = true;
        current.x = e.clientX;
        current.y = e.clientY;
    }

    function onMouseMove(e) {
        if (!drawing) { return; }
        drawLine(current.x, current.y, e.clientX, e.clientY, current.color, current.size, true);
        current.x = e.clientX;
        current.y = e.clientY;
    }

    function onMouseUp(e) {
        if(!drawing) { return; }
        drawing = false;
        drawLine(current.x, current.y, e.clientX, e.clientY, current.color, current.size, true);
    }

    window.changeColor = (color) => {
        current.color = color;
    };

    canvas.addEventListener('mousedown',onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);


   socket.on('drawing', (data) => {
    const w = canvas.width;
    const h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.size, false);
});
});
document.getElementById('saveDrawing').addEventListener('click', function() {
    const drawingData = getDrawingData(); // Function to collect data from canvas
    const drawingName = "My Drawing"; // This could be dynamic or user-defined

    fetch('/saveDrawing', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: drawingName, data: drawingData })
    })
    .then(response => response.json())
    .then(data => {
        if(data.message) {
            alert(data.message); // Show success or error message
        }
    })
    .catch(error => console.error('Error saving the drawing:', error));
});

function getDrawingData() {
    // Collect all the drawing data from the canvas
    // This needs to match the data structure expected by your backend
    return canvas.toJSON(); // Example if using fabric.js or similar; adapt based on your setup
}
document.getElementById('loadDrawing').addEventListener('click', function() {
    const drawingId = document.getElementById('drawingId').value;
    if (!drawingId) {
        alert('Please enter a drawing ID.');
        return;
    }

    fetch(`/loadDrawing/${drawingId}`)
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else {
            renderDrawing(data.data); // Function to render loaded drawing on the canvas
        }
    })
    .catch(error => console.error('Error loading the drawing:', error));
});

function renderDrawing(drawingData) {
    // Clear the current drawing
    canvas.clear(); // Example if using fabric.js; adapt based on your setup

    // Redraw all points from the loaded drawing
    drawingData.forEach(point => {
        // Use your existing function or method to add a point to the canvas
        // This should match how points are drawn when they are created initially
        drawPoint(point); // You would need to define this function
    });
}
