import { GAME_STATE, PLAYER_STATUS } from '../enum'
var dive_counter = 0;
export const getPlayerStatus = (c, state) => {
    var new_player_status = state.playerStatus;
    var ownColor = state.playerColor;
    var context = c.getContext('2d');
    var p = context.getImageData(state.playerPosition.x - 25, state.playerPosition.y - 25, 51, 51).data;

    var own_color_count = 0;
    var empty_color_count = 0;

    for (var i = 0; i < 11; ++i) {
        for (var j = 0; j < 11; ++j) {
            if (p[(51 * i * 5 + j * 5) * 4 + 3] !== 0) {
                // not empty
                if (p[(51 * i * 5 + j * 5) * 4] === ownColor[0] && p[(51 * i * 5 + j * 5) * 4 + 1] === ownColor[1] && p[(51 * i * 5 + j * 5) * 4 + 2] === ownColor[2]) {
                    own_color_count += 1;
                }
            } else {
                empty_color_count += 1;
            }
        }
    }
    // console.log(own_color_count, empty_color_count)

    var field_property = 0;// 0 for in space, 1 for in enemy, 2 for in own
    if (empty_color_count / 121 < 0.5) {
        field_property = own_color_count < (121 - own_color_count - empty_color_count) ? 1 : 2;
    }

    switch (field_property) {
        case 0:
            if (state.mouseDownState === 1) {
                new_player_status = PLAYER_STATUS.ATTACKING_SPACE;
            }
            else if (state.keyStrokeState.space === 0) {
                if (state.playerMoveDirection.x === 0 && state.playerMoveDirection.y === 0) {
                    new_player_status = PLAYER_STATUS.STANDING_SPACE;
                } else {
                    new_player_status = PLAYER_STATUS.WALKING_SPACE;
                }
            } else {
                if (state.playerMoveDirection.x === 0 && state.playerMoveDirection.y === 0) {
                    new_player_status = PLAYER_STATUS.DIVING_SPACE;
                } else {
                    new_player_status = PLAYER_STATUS.SWIMMING_SPACE;
                }
            }
            break;
        case 1:
            if (state.mouseDownState === 1) {
                new_player_status = PLAYER_STATUS.ATTACKING_ENEMY;
            }
            else if (state.keyStrokeState.space === 0) {
                if (state.playerMoveDirection.x === 0 && state.playerMoveDirection.y === 0) {
                    new_player_status = PLAYER_STATUS.STANDING_ENEMY;
                } else {
                    new_player_status = PLAYER_STATUS.WALKING_ENEMY;
                }
            } else {
                if (state.playerMoveDirection.x === 0 && state.playerMoveDirection.y === 0) {
                    new_player_status = PLAYER_STATUS.DIVING_ENEMY;
                } else {
                    new_player_status = PLAYER_STATUS.SWIMMING_ENEMY;
                }
            }
            break;

        case 2:
            if (state.mouseDownState === 1) {
                new_player_status = PLAYER_STATUS.ATTACKING_OWN;
            }
            else if (state.keyStrokeState.space === 0) {
                if (state.playerMoveDirection.x === 0 && state.playerMoveDirection.y === 0) {
                    new_player_status = PLAYER_STATUS.STANDING_OWN;
                } else {
                    new_player_status = PLAYER_STATUS.WALKING_OWN;
                }
            } else {
                if (state.playerMoveDirection.x === 0 && state.playerMoveDirection.y === 0) {
                    new_player_status = PLAYER_STATUS.DIVING_OWN;
                } else {
                    new_player_status = PLAYER_STATUS.SWIMMING_OWN;
                }
            }
            break;
        default:
            break;
    }
    // console.log(new_player_status);
    return new_player_status;
}

// export const PLAYER_STATUS = {
//     STANDING_OWN: 0,
//     WALKING_OWN: 1,
//     DIVING_OWN: 2,
//     SWIMMING_OWN: 3,
//     ATTACKING_OWN: 4,

//     STANDING_SPACE: 5,
//     WALKING_SPACE: 6,
//     DIVING_SPACE: 7,
//     SWIMMING_SPACE: 8,
//     ATTACKING_SPACE: 9,

//     STANDING_ENEMY: 10,
//     WALKING_ENEMY: 11,
//     DIVING_ENEMY: 12,
//     SWIMMING_ENEMY: 13,
//     ATTACKING_ENEMY: 14,
//   };