document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const canvas = document.getElementById('whiteboard');
    const context = canvas.getContext('2d');

    let drawing = false;

    canvas.addEventListener('mousedown', (event) => {
        drawing = true;
        socket.emit('draw', { x: event.pageX, y: event.pageY, type: 'start' });
    });

    canvas.addEventListener('mousemove', (event) => {
        if (drawing) {
            socket.emit('draw', { x: event.pageX, y: event.pageY, type: 'draw' });
        }
    });

    canvas.addEventListener('mouseup', (event) => {
        drawing = false;
        socket.emit('draw', { x: event.pageX, y: event.pageY, type: 'stop' });
    });

    socket.on('draw', (data) => {
        if (data.type === 'start') {
            context.beginPath();
            context.moveTo(data.x, data.y);
        } else if (data.type === 'draw') {
            context.lineTo(data.x, data.y);
            context.stroke();
        } else if (data.type === 'stop') {
            context.closePath();
        }
    });
});