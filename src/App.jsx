/** @module App */
import { useState } from 'react';
import useCanvas from './hooks/canvasHook';
import Game from './Game';

const CanvasOptions = {
    id: 'gameboard-canvas',
    height: 500,
    width: 500,
    backgroundColor: '#000000',
    drawColor: '#ffffff',
};

const ColorIcon = ({color}) => (
    <span
        className="dot"
        style={{ backgroundColor: color }}
    />
);

const App = () => {
    const [commands, setCommands] = useState(['fillBackground()']);
    const [commandInput, setCommandInput] = useState('');
    const [activeCommand, setActiveCommand] = useState(0);
    const canvas = useCanvas(CanvasOptions);

    const run = () => {
        commands.forEach((com, i) => {
            try {
                const command = com.split('(')[0];
                const args = com.split('(')[1].split(')')[0].split(',');
                canvas[command](...args);
                setActiveCommand(i);
            } catch (e) {
                console.log('Invalid Command', e);
            }
            if (i === commands.length - 1) setActiveCommand(0);
        });
    };

    const addCommand = () => {
        setCommands([...commands, commandInput]);
        setCommandInput('');
    };

    return (
        <div id="app">
            <Game />
            <div id="top-row">
                <div id="state">
                    <h3>State</h3>
                    background color:&nbsp;
                    <ColorIcon color={canvas.backgroundColor} />
                    {canvas.backgroundColor}
                    <br />
                    draw color:&nbsp;
                    <ColorIcon color={canvas.drawColor} />
                    {canvas.drawColor}
                </div>
                <div id="canvas">
                    <h3>Canvas</h3>
                    <canvas 
                        id={CanvasOptions.id}
                        height={CanvasOptions.height}
                        width={CanvasOptions.width}
                    />
                </div>
                <div id="commands">
                    <h3>Commands</h3>
                    <div id="commands-list">
                        <ul>
                            {commands.map((command, i) => (
                                <li key={`${command}${i}`}>
                                    <button
                                        onClick={() => setCommands(commands.filter((c) => c !== command))}
                                    >
                                        X
                                    </button>
                                    {command}
                                    <b>{i === activeCommand && '  <--'}</b>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div id="playback-controls">
                        <button
                            onClick={() => setCommands([])}
                        >
                            Clear All
                        </button>
                        <button>
                            Pause
                        </button>
                        <button
                            onClick={run}
                        >
                            Play
                        </button>
                    </div>
                    <div id="command-input">
                        <input 
                            type="text"
                            value={commandInput}
                            onChange={(e) => setCommandInput(e.target.value)}
                            onKeyDown={(e) => { if(e.key === 'Enter') addCommand(); }}
                        />
                        <button
                            disabled={!commandInput.length}
                            onClick={addCommand}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
            <div id="bottom-row">
                <h3>Command Builder</h3>
                <p>
                    <b>changeBackgroundColor&#40;<i>color</i>&#41;</b>
                </p>
                <p>
                    <b>changeColor&#40;<i>color</i>&#41;</b>
                </p>
                <p>
                    <b>fillBackground&#40;&#41;</b>
                </p>
                <p>
                    <b>fillRectangle&#40;<i>x1, y1, x2, y2</i>&#41;</b>
                </p>
                <p>
                    <b>fillCircle&#40;<i>x1, y1, diameter</i>&#41;</b>
                </p>
                <p>
                    <b>drawRectangle&#40;<i>x1, y1, x2, y2</i>&#41;</b>
                </p>
                <p>
                    <b>drawCircle&#40;<i>x1, y1, diameter</i>&#41;</b>
                </p>
                <p>
                    <b>drawLine&#40;<i>x1, y1, x2, y2</i>&#41;</b>
                </p>
            </div>
        </div>
    );
};

export default App;
