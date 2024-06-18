import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const Whiteboard = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = new fabric.Canvas(canvasRef.current);
        // Add your Fabric.js logic here
    }, []);

    return <canvas ref={canvasRef} />;
};

export default Whiteboard;
