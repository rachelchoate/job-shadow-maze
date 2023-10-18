const state = {
    Player: {
        d: 10,
        color: 'tomato',
        startPos: [30, 990],
    },
    playerPos: [0, 0],
    getPlayerPos: () => { return state.playerPos },
    setPlayerPos: (arr) => { state.playerPos = arr; },
};


export default state;
