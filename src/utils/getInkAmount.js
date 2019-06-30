import { PLAYER_STATUS } from '../enum'
export const getInkAmount = (inkConsumption, playerData, localPlayerData) => {
    var new_inkAmount = localPlayerData.inkAmount;
    var new_playerHealth = localPlayerData.playerHealth;

    new_inkAmount = new_inkAmount - inkConsumption;

    var restoreInk = 0;
    var restoreHP = 0;
    switch (playerData.playerStatus) {
        case PLAYER_STATUS.STANDING_OWN: restoreInk = 0.1; restoreHP = 0.2; break;
        case PLAYER_STATUS.WALKING_OWN: restoreInk = 0.1; restoreHP = 0.2; break;
        case PLAYER_STATUS.DIVING_OWN: restoreInk = 0.5; restoreHP = 0.8; break;
        case PLAYER_STATUS.SWIMMING_OWN: restoreInk = 1; restoreHP = 1.5; break;
        case PLAYER_STATUS.ATTACKING_OWN: restoreInk = 0.1; restoreHP = 0.2; break;

        case PLAYER_STATUS.STANDING_SPACE: restoreInk = 0.1; restoreHP = 0.1; break;
        case PLAYER_STATUS.WALKING_SPACE: restoreInk = 0.1; restoreHP = 0.1; break;
        case PLAYER_STATUS.DIVING_SPACE: restoreInk = 0.1; restoreHP = 0.1; break;
        case PLAYER_STATUS.SWIMMING_SPACE: restoreInk = 0.1; restoreHP = 0.1; break;
        case PLAYER_STATUS.ATTACKING_SPACE: restoreInk = 0.1; restoreHP = 0.1; break;

        case PLAYER_STATUS.STANDING_ENEMY: restoreInk = 0.1; restoreHP = 0; break;
        case PLAYER_STATUS.WALKING_ENEMY: restoreInk = 0.1; restoreHP = 0; break;
        case PLAYER_STATUS.DIVING_ENEMY: restoreInk = 0.1; restoreHP = 0; break;
        case PLAYER_STATUS.SWIMMING_ENEMY: restoreInk = 0.1; restoreHP = 0; break;
        case PLAYER_STATUS.ATTACKING_ENEMY: restoreInk = 0.1; restoreHP = 0; break;
        default: restoreInk = 0; restoreHP = 0; break;
    }

    new_inkAmount = new_inkAmount + restoreInk;
    new_inkAmount = Math.max(Math.min(new_inkAmount, 100), 0);

    new_playerHealth = new_playerHealth + restoreHP;
    new_playerHealth = Math.max(Math.min(new_playerHealth, 100), 0);

    localPlayerData.inkAmount = new_inkAmount;
    localPlayerData.playerHealth = new_playerHealth;

    return [new_inkAmount, new_playerHealth];
}