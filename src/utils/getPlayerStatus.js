import { GAME_STATE, PLAYER_STATUS } from '../enum'
var dive_counter = 0;

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

export const getPlayerStatus = (c, playerData, localPlayerData) => {
    const ownColor = hexToRgb(playerData.playerColor.main);
    
    var context = c.getContext('2d');
    var p = context.getImageData(playerData.playerPosition.x - 25, playerData.playerPosition.y - 25, 51, 51).data;

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

    var field_property = 0;// 0 for in space, 1 for in enemy, 2 for in own
    if (empty_color_count / 121 < 0.5) {
        field_property = own_color_count < (121 - own_color_count - empty_color_count) ? 1 : 2;
    }

    switch (field_property) {
        case 0:
            if (localPlayerData.mouseDownState === 1) {
                playerData.playerStatus = PLAYER_STATUS.ATTACKING_SPACE;
            }
            else if (localPlayerData.keyStrokeState.space === 0) {
                if (localPlayerData.playerMoveDirection.x === 0 && localPlayerData.playerMoveDirection.y === 0) {
                    playerData.playerStatus = PLAYER_STATUS.STANDING_SPACE;
                } else {
                    playerData.playerStatus = PLAYER_STATUS.WALKING_SPACE;
                }
            } else {
                if (localPlayerData.playerMoveDirection.x === 0 && localPlayerData.playerMoveDirection.y === 0) {
                    playerData.playerStatus = PLAYER_STATUS.DIVING_SPACE;
                } else {
                    playerData.playerStatus = PLAYER_STATUS.SWIMMING_SPACE;
                }
            }
            break;
        case 1:
            if (localPlayerData.mouseDownState === 1) {
                playerData.playerStatus = PLAYER_STATUS.ATTACKING_ENEMY;
            }
            else if (localPlayerData.keyStrokeState.space === 0) {
                if (localPlayerData.playerMoveDirection.x === 0 && localPlayerData.playerMoveDirection.y === 0) {
                    playerData.playerStatus = PLAYER_STATUS.STANDING_ENEMY;
                } else {
                    playerData.playerStatus = PLAYER_STATUS.WALKING_ENEMY;
                }
            } else {
                if (localPlayerData.playerMoveDirection.x === 0 && localPlayerData.playerMoveDirection.y === 0) {
                    playerData.playerStatus = PLAYER_STATUS.DIVING_ENEMY;
                } else {
                    playerData.playerStatus = PLAYER_STATUS.SWIMMING_ENEMY;
                }
            }
            break;

        case 2:
            if (localPlayerData.mouseDownState === 1) {
                playerData.playerStatus = PLAYER_STATUS.ATTACKING_OWN;
            }
            else if (localPlayerData.keyStrokeState.space === 0) {
                if (localPlayerData.playerMoveDirection.x === 0 && localPlayerData.playerMoveDirection.y === 0) {
                    playerData.playerStatus = PLAYER_STATUS.STANDING_OWN;
                } else {
                    playerData.playerStatus = PLAYER_STATUS.WALKING_OWN;
                }
            } else {
                if (localPlayerData.playerMoveDirection.x === 0 && localPlayerData.playerMoveDirection.y === 0) {
                    playerData.playerStatus = PLAYER_STATUS.DIVING_OWN;
                } else {
                    playerData.playerStatus = PLAYER_STATUS.SWIMMING_OWN;
                }
            }
            break;
        default:
            break;
    }
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