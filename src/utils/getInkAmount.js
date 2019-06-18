import { GAME_STATE, PLAYER_STATUS } from '../enum'
export const getInkAmount = (inkConsumption, state)=>{
    var new_inkAmount = state.inkAmount;
    new_inkAmount = new_inkAmount-inkConsumption;
    
    var restoreInk = 0;
    const new_player_status = state.playerStatus;

    switch(new_player_status){
        case PLAYER_STATUS.STANDING_OWN: restoreInk = 0.1; break;
        case PLAYER_STATUS.WALKING_OWN: restoreInk = 0.1; break;
        case PLAYER_STATUS.DIVING_OWN: restoreInk = 0.5; break;
        case PLAYER_STATUS.SWIMMING_OWN: restoreInk = 1; break;
        case PLAYER_STATUS.ATTACKING_OWN: restoreInk = 0.1; break;

        case PLAYER_STATUS.STANDING_SPACE: restoreInk = 0.1; break;
        case PLAYER_STATUS.WALKING_SPACE: restoreInk = 0.1; break;
        case PLAYER_STATUS.DIVING_SPACE: restoreInk = 0.1; break;
        case PLAYER_STATUS.SWIMMING_SPACE: restoreInk = 0.1; break;
        case PLAYER_STATUS.ATTACKING_SPACE: restoreInk = 0.1; break;

        case PLAYER_STATUS.STANDING_ENEMY: restoreInk = 0.1; break;
        case PLAYER_STATUS.WALKING_ENEMY: restoreInk = 0.1; break;
        case PLAYER_STATUS.DIVING_ENEMY: restoreInk = 0.1; break;
        case PLAYER_STATUS.SWIMMING_ENEMY: restoreInk = 0.1; break;
        case PLAYER_STATUS.ATTACKING_ENEMY: restoreInk = 0.1; break;
        default: restoreInk = 0; break;
    }

    new_inkAmount = new_inkAmount+restoreInk;
    new_inkAmount = Math.max(Math.min(new_inkAmount,100),0);

    return new_inkAmount;
}