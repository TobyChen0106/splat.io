export const getKeyUpState = (e, state) => {
    switch (e.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':

            if (state.keyStrokeState.down === 1) state.playerMoveDirection.y = 1;
            else state.playerMoveDirection.y = 0;

            state.keyStrokeState.up = 0;
            break;

        case 's':
        case 'S':
        case 'ArrowDown':

            if (state.keyStrokeState.up === 1) state.playerMoveDirection.y = -1;
            else state.playerMoveDirection.y = 0;

            state.keyStrokeState.down = 0;
            break;

        case 'a':
        case 'A':
        case 'ArrowLeft':

            if (state.keyStrokeState.right === 1) state.playerMoveDirection.x = 1;
            else state.playerMoveDirection.x = 0;

            state.keyStrokeState.left = 0;
            break;

        case 'd':
        case 'D':
        case 'ArrowRight':
            if (state.keyStrokeState.left === 1) state.playerMoveDirection.x = -1;
            else state.playerMoveDirection.x = 0;

            state.keyStrokeState.right = 0;
            break;

        case ' ':
            state.keyStrokeState.space = 0;
            break;
        default:
            break;
    }
}