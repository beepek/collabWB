import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const response = await fetch('http://localhost:8080/auth-status', {
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.isAuthenticated) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Error fetching auth status:', error);
            }
        };

        fetchAuthStatus();

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
            {isAuthenticated ? (
                <div>
                    <p>You are authenticated and can draw.</p>
                    {/* Add your drawing tools here */}
                </div>
            ) : (
                <p>You can view the whiteboard, but you must log in to draw.</p>
            )}
        </div>
    );
};

export default Whiteboard;
