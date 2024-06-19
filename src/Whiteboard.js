import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

const Whiteboard = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current);
        // Adding a simple rectangle as a test
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'red',
            width: 60,
            height: 70,
            angle: 45
        });
        canvas.add(rect);
    }, []);

    return (
        <div>
            <h2>Whiteboard Area</h2>
            <canvas ref={canvasRef} width="800" height="600" style={{ border: '1px solid black' }} />
        </div>
    );
};

export default Whiteboard;