/** @module hooks/gameHook */
import { useState } from 'react';
import useCanvas from './canvasHook';

const Player = {
    d: 10,
    color: 'tomato',
    startPos: [30, 990]
};

const useGame = (initOptions) => {
    const canvas = useCanvas(initOptions);
    const [mapAssets, setMapAssets] = useState([]);
    const [error, setError] = useState([]);
    const [playerPos, setPlayerPos] = useState([0, 0]);

    const drawPlayer = (pos) => {
        const tempColor = canvas.drawColor;
        canvas.changeColor(Player.color);
        canvas.fillCircle(pos[0], pos[1], Player.d);
        canvas.changeColor(tempColor);
    };

    const drawGrid = () => {
        const gridSize = Player.d * 2;
        const verticalLines = Math.floor(canvas.options.width / gridSize);
        const horizontalLines = Math.floor(canvas.options.height / gridSize);
        for (let i = 0; i < verticalLines; i += 1) {
            canvas.drawLine(i * gridSize, 0, i * gridSize, canvas.options.height);
        }
        for (let i = 0; i < horizontalLines; i += 1) {
            canvas.drawLine(0, i * gridSize, canvas.options.width, i * gridSize);
        }
    };

    const recursivelyMakeAssets2 = (currentPosition = [], path = [], visited = [], walkingPath = []) => {
        const gridSize = Player.d * 2;

        /** pick an available cell randomly */
        const pickRandomCell = (availCells) => {
            const max = availCells.length - 1;
            const min = 0;
            const index = Math.floor(Math.random() * (max - min + 1) + min);
            return availCells[index];
        };

        /** determine if given cell is off screen */
        const isOffScreen = (cell) => {
            const ax1 = cell[0][0];
            const ay1 = cell[0][1];
            const ax2 = cell[1][0];
            const ay2 = cell[1][1];
            if (ax1 <= 0 || ax1 >= canvas.options.width) return true;
            if (ax2 <= 0 || ax2 >= canvas.options.width) return true;
            if (ay2 <= 0 || ay2 >= canvas.options.height) return true;
            if (ay1 <= 0 || ay2 >= canvas.options.height) return true;
            return false;
        };

        /** calculate the cell between two other cells */
        const getCellBetween = (start, end) => {
            const result = [[],[]];

            const sx1 = start[0][0];
            const sy1 = start[0][1];
            const sx2 = start[1][0];
            const sy2 = start[1][1];

            const ex1 = end[0][0];
            const ey1 = end[0][1];
            const ex2 = end[1][0];
            const ey2 = end[1][1];

            if (sx1 > ex1) {
                // cell has moved to the left
                return [[sx1, sy1], [ex2, ey2]];
            } else if (sx1 < ex1) {
                // cell has moved to the right
                return [[sx2, sy2], [ex1, ey1]];
            } else if (sy1 > ey1) {
                // cell has moved down
                return [[sx1, sy1], [ex2, ey2]];
            } else if (sy1 < ey1) {
                // cell has moved up
                return [[sx2, sy2], [ex1, ey1]];
            }
        }

        /** determine if given cell has been visited */
        const hasBeenVisited = (cell) => visited.includes(JSON.stringify(cell));

        /** if the current position is not an appropriate cell location, return */
        if (!currentPosition.length === 2) return path;
        /** if the current position has not been marked as visited yet, mark it as visited */
        if (!hasBeenVisited(currentPosition)) visited.push(JSON.stringify(currentPosition));
        /** if current position is not in the walking path */
        if (!walkingPath.includes(JSON.stringify(currentPosition))) walkingPath.push(JSON.stringify(currentPosition));

        const x1 = currentPosition[0][0];
        const y1 = currentPosition[0][1];
        const x2 = currentPosition[1][0];
        const y2 = currentPosition[1][1];

        const leftCell = [[x1 - (gridSize * 2), y1],[x2 - (gridSize * 2), y2]];
        const rightCell = [[x1 + (gridSize * 2), y1],[x2 + (gridSize * 2), y2]];
        const topCell = [[x1, y1 - (gridSize * 2)], [x2, y2 - (gridSize * 2)]];
        const bottomCell = [[x1, y1 + (gridSize * 2)], [x2, y2 + (gridSize * 2)]];

        let availableCells = [leftCell, rightCell, topCell, bottomCell];

        /** filter out cells that have been visited and are off screen */
        availableCells = availableCells.filter((cell) => {
            if (isOffScreen(cell)) {
                return false;
            } else if (hasBeenVisited(cell)) {
                return false;
            } else {
                return true;
            }
        });

        /** are there unvisited, on-screen cells adjacent to us? */
        if (availableCells.length > 0) {
            // pick a cell
            const newCell = pickRandomCell(availableCells);
            // add that cell to the path
            path.push(newCell);
            // add the cell between that cell and our current cell to the path 
            path.push(getCellBetween(currentPosition, newCell));
            // go into that cell
            return recursivelyMakeAssets2(newCell, path, visited, walkingPath);
        } else {
            // can we walk back to an earlier cell
            if (walkingPath.length > 1) {
                const lastCell = walkingPath[walkingPath.length - 2];
                const newWalkingPath = walkingPath.filter((p, i) => i !== walkingPath.length - 1);
                return recursivelyMakeAssets2(JSON.parse(lastCell), path, visited, newWalkingPath);
                // return path;
            } else {
                // else return the path
                return path;
            }
        }

    };

    const makeAssets = () => {
        const { width, height } = canvas.options;
        const gridSize = Player.d * 2;
        /** recursively iterate cells to draw path through maze */
        const startingPos = [[gridSize, height - (gridSize)], [(gridSize) + gridSize, (height - (gridSize)) + gridSize]];
        const paths = recursivelyMakeAssets2(startingPos);
        paths.push(startingPos);
        return paths;
    };

    const drawGameBoard = (assets = mapAssets) => {
        canvas.fillBackground();
        assets.forEach((asset) => {
            const x1 = asset[0][0];
            const y1 = asset[0][1];
            const width = asset[1][0] - asset[0][0];
            const height = asset[1][1] - asset[0][1];
            canvas.fillRectangle(x1, y1, width, height);
        });
        drawGrid();
    }

    const initGame = () => {
        if (canvas) {
            const assets = makeAssets();
            setMapAssets(assets);
            setPlayerPos(Player.startPos);
            drawGameBoard(assets);
            drawPlayer(Player.startPos);
        }
    };

    /** we actually want to keep the player pos on the asset, since we drew a path instead of walls */
    const collisionDetection = (pos) => {
        const [x, y] = pos;
        for (let i = 0; i < mapAssets.length; i += 1) {
            const asset = mapAssets[i];
            const ax1 = asset[0][0];
            const ay1 = asset[0][1];
            const ax2 = asset[1][0];
            const ay2 = asset[1][1];

            const x1 = ax1 > ax2 ? ax1 : ax2;
            const x2 = ax1 > ax2 ? ax2 : ax1;
            const y1 = ay1 > ay2 ? ay1 : ay2;
            const y2 = ay1 > ay2 ? ay2 : ay1;

            const xCollide = x >= x2 && x <= x1;
            const yCollide = y >= y2 && y <= y1;
            if (xCollide && yCollide) return false;
            if (i === mapAssets.length - 1) return true;
        };
    };

    const movePlayer = (direction, len) => {
        const newPos = Object.assign([], playerPos);
        switch(direction) {
            case 'right':
                newPos[0] = newPos[0] + len;
                break;
            case 'left':
                newPos[0] = newPos[0] - len;
                break;
            case 'up':
                newPos[1] = newPos[1] - len;
                break;
            case 'down':
                newPos[1] = newPos[1] + len;
                break;
            default:
                break;
        }
        if (!collisionDetection(newPos)){
            setPlayerPos(newPos);
            drawGameBoard();
            drawPlayer(newPos);
        } else {
            setError([...error, `Collision detected at: ${JSON.stringify(newPos)}`]);
        }
    };

    const animateMovePlayer = (direction, len, i = 0) => {
        const movePlayerOne = () => movePlayer(direction, Player.d * 2);
        movePlayerOne();
        if (i < len) {
            setTimeout(() => {
                console.log('set timeout');
                animateMovePlayer(direction, len, i += 1);
            }, 400);
        }
    };

    return {
        commands: {},
        initGame,
        moveLeft: (len) => animateMovePlayer('left', len),
        moveRight: (len) => animateMovePlayer('right', len),
        moveUp: (len) => animateMovePlayer('up', len),
        moveDown: (len) => animateMovePlayer('down', len),
        error,
        setError,
    };
};

export default useGame;