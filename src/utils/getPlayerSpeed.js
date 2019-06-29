import { GAME_STATE, PLAYER_STATUS } from '../enum'
export const getPlayerSpeed = (playerData, localPlayerData) => {
    switch (playerData.playerStatus) {
        case PLAYER_STATUS.STANDING_OWN: localPlayerData.playerMoveSpeed = 4; break;
        case PLAYER_STATUS.WALKING_OWN: localPlayerData.playerMoveSpeed = 4; break;
        case PLAYER_STATUS.DIVING_OWN: localPlayerData.playerMoveSpeed = 6; break;
        case PLAYER_STATUS.SWIMMING_OWN: localPlayerData.playerMoveSpeed = 6; break;
        case PLAYER_STATUS.ATTACKING_OWN: localPlayerData.playerMoveSpeed = 2.5; break;

        case PLAYER_STATUS.STANDING_SPACE: localPlayerData.playerMoveSpeed = 3; break;
        case PLAYER_STATUS.WALKING_SPACE: localPlayerData.playerMoveSpeed = 3; break;
        case PLAYER_STATUS.DIVING_SPACE: localPlayerData.playerMoveSpeed = 1; break;
        case PLAYER_STATUS.SWIMMING_SPACE: localPlayerData.playerMoveSpeed = 1; break;
        case PLAYER_STATUS.ATTACKING_SPACE: localPlayerData.playerMoveSpeed = 1; break;

        case PLAYER_STATUS.STANDING_ENEMY: localPlayerData.playerMoveSpeed = 1.5; break;
        case PLAYER_STATUS.WALKING_ENEMY: localPlayerData.playerMoveSpeed = 1.5; break;
        case PLAYER_STATUS.DIVING_ENEMY: localPlayerData.playerMoveSpeed = 1.5; break;
        case PLAYER_STATUS.SWIMMING_ENEMY: localPlayerData.playerMoveSpeed = 1.5; break;
        case PLAYER_STATUS.ATTACKING_ENEMY: localPlayerData.playerMoveSpeed = 0.5; break;
        case PLAYER_STATUS.DEAD: localPlayerData.playerMoveSpeed = 0; break;
        
        default: localPlayerData.playerMoveSpeed = 0; break;
    }
    switch (playerData.gameState) {
        case GAME_STATE.FREEZE: localPlayerData.playerMoveSpeed = 0; break;
        case GAME_STATE.FINISH: localPlayerData.playerMoveSpeed = 0; break;
        default: break;
    }
}