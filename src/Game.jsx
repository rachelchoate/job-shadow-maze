import React, { useEffect, useState } from 'react';
import useGame from './hooks/gameHook';
import state from './state';

const { Player, setPlayerPos } = state;

const CanvasOptions = {
    id: 'gameboard-canvas',
    height: 1000,
    width: 1000,
    backgroundColor: '#000000',
    drawColor: '#ffffff',
};

const Game = () => {
    const [commands, setCommands] = useState([]);
    const [commandInput, setCommandInput] = useState('');
    const game = useGame(CanvasOptions);

    const run = () => {
        console.log('RUNNING!');
        setPlayerPos(Player.startPos);
        let timer = 0;
        commands.forEach((com, i) => {
            try {
                const command = com.split('(')[0];
                const args = com.split('(')[1].split(')')[0].split(',');
                setTimeout(() => {
                    game[command](...args);
                }, timer += (args[0] * 20) + 500);
            } catch (e) {
                game.setError([...game.error, `Invalid command: ${e}`]);
            }
        });
    };

    const addCommand = () => {
        setCommands([...commands, commandInput]);
        setCommandInput('');
    };

    return(
        <div id="top-row">
            <div id="state">
                <h3>Error Log</h3>
                <ul>
                    {game.error.map((err, i) => (
                        <li key={i}>{err}</li>
                    ))}
                </ul>
            </div>
            <div id="canvas">
                <canvas 
                    id={CanvasOptions.id}
                    height={CanvasOptions.height}
                    width={CanvasOptions.width}
                />
            </div>
            <div id="commands">
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
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div id="playback-controls">
                        <button 
                            onClick={game.initGame}
                        >
                            Init Game
                        </button>
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
        </div>
    );
};

export default Game;