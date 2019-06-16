export const getKeyDownState = (e, state) => {
    var dir = state.playerMoveDirection;
    var key = state.keyStrokeState;

    switch (e.key) {
        case 'w':
        case 'W':
        case 'ArrowUp':

            dir.y = -1;
            key.up = 1;
            break;

        case 's':
        case 'S':
        case 'ArrowDown':

            dir.y = 1;
            key.down = 1;
            break;


        case 'a':
        case 'A':
        case 'ArrowLeft':

            dir.x = -1;
            key.left = 1;

            break;

        case 'd':
        case 'D':
        case 'ArrowRight':

            dir.x = 1;
            key.right = 1;

            break;

        default:
            break;
    }
    return {
        keyStrokeState: key,
        playerMoveDirection: dir
    };
}