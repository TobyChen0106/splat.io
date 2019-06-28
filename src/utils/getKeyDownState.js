export const getKeyDownState = (e, state) => {
    switch (e.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':

            state.playerMoveDirection.y = -1;
            state.keyStrokeState.up = 1;
            break;

        case 's':
        case 'S':
        case 'ArrowDown':

            state.playerMoveDirection.y = 1;
            state.keyStrokeState.down = 1;
            break;


        case 'a':
        case 'A':
        case 'ArrowLeft':

            state.playerMoveDirection.x = -1;
            state.keyStrokeState.left = 1;

            break;

        case 'd':
        case 'D':
        case 'ArrowRight':

            state.playerMoveDirection.x = 1;
            state.keyStrokeState.right = 1;

            break;
        case ' ':
            state.keyStrokeState.space = 1;
            break;
        default:
            break;
    }
}