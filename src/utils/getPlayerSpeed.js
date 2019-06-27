import { GAME_STATE, PLAYER_STATUS } from '../enum'
export const getPlayerSpeed = (new_player_status, state)=>{
    var speed = state.playerMoveSpeed;
    switch(new_player_status){
        case PLAYER_STATUS.STANDING_OWN: speed = 4; break;
        case PLAYER_STATUS.WALKING_OWN: speed = 4; break;
        case PLAYER_STATUS.DIVING_OWN: speed = 8; break;
        case PLAYER_STATUS.SWIMMING_OWN: speed = 8; break;
        case PLAYER_STATUS.ATTACKING_OWN: speed = 2.5; break;

        case PLAYER_STATUS.STANDING_SPACE: speed = 3; break;
        case PLAYER_STATUS.WALKING_SPACE: speed = 3; break;
        case PLAYER_STATUS.DIVING_SPACE: speed = 1; break;
        case PLAYER_STATUS.SWIMMING_SPACE: speed = 1; break;
        case PLAYER_STATUS.ATTACKING_SPACE: speed = 1; break;

        case PLAYER_STATUS.STANDING_ENEMY: speed = 1.5; break;
        case PLAYER_STATUS.WALKING_ENEMY: speed = 1.5; break;
        case PLAYER_STATUS.DIVING_ENEMY: speed = 1.5; break;
        case PLAYER_STATUS.SWIMMING_ENEMY: speed = 1.5; break;
        case PLAYER_STATUS.ATTACKING_ENEMY: speed = 0.5; break;
        default: speed = 4; break;
    }
    return speed;
}