/** @module hooks/canvasHook */
import { useEffect, useState } from 'react';

const useCanvas = (initOptions) => {
    const [options, setOptions] = useState(initOptions);
    const [element, setElement] = useState(null);
    const [context, setContext] = useState(null);
    const [id, setId] = useState(null);
    const [height, setHeight] = useState(500);
    const [width, setWidth] = useState(500);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [drawColor, setDrawColor] = useState('#000000');

    useEffect(() => {
        if (initOptions) setOptions(initOptions);
        initCanvas();
    }, [initOptions]);

    const initCanvas = () => {
        if (options.id) setId(options.id);
        if (options.height) setHeight(options.height);
        if (options.width) setWidth(options.width);
        if (options.backgroundColor) setBackgroundColor(options.backgroundColor);
        if (options.drawColor) setDrawColor(options.drawColor);
        const canvasElement = document.getElementById(options.id);
        setElement(canvasElement);
        setContext(canvasElement.getContext('2d'));
        if (context) fillBackground();
    };

    const setFillStyle = (color) => {
        context.fillStyle = color;
    };

    const setStrokeStyle = (color) => {
        context.strokeStyle = color;
    }

    const fillRect = (x1, y1, x2, y2) => {
        context.fillRect(x1, y1, x2, y2);
    };

    const drawLine = (x1, y1, x2, y2) => {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineWidth = 1;
        context.stroke();
        context.closePath();
    };

    const drawRectangle = (x1, y1, x2, y2) => {
        context.moveTo(x1, y1);
        context.beginPath();
        context.lineTo(x1, y2);
        context.lineTo(x2, y2);
        context.lineTo(x2, y1);
        context.lineTo(x1, y1);
        context.stroke();
        context.closePath();
    };

    const drawCircle = (x1, y1, diameter) => {
        context.beginPath();
        context.arc(x1, y1, diameter, 0, 2*Math.PI);
        context.stroke();
        context.closePath();
    };

    const fillCircle = (x1, y1, diameter) => {
        drawCircle(x1, y1, diameter);
        context.fill();
    };

    const fillBackground = () => {
        setFillStyle(backgroundColor);
        fillRect(0, 0, height, width);
        setFillStyle(drawColor);
        setStrokeStyle(drawColor);
    };

    const changeColor = (color) => {
        setDrawColor(color);
        setFillStyle(color);
        setStrokeStyle(color);
    };

    const changeBackgroundColor = (color) => {
        setBackgroundColor(color);
    };

    const beginPath = () => context.beginPath();

    const lineTo = (x, y) => context.lineTo(x, y);

    const moveTo = (x, y) => context.moveTo(x, y);

    const closePath = () => context.closePath();

    const stroke = () => context.stroke();

    return {
        backgroundColor,
        drawColor,
        fillBackground,
        fillRect,
        fillRectangle: fillRect,
        fillCircle,
        drawCircle,
        drawLine,
        drawRectangle,
        changeColor,
        changeBackgroundColor,
        beginPath,
        lineTo,
        stroke,
        closePath,
        moveTo,
        options,
    };
};

export default useCanvas;