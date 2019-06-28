import { GAME_STATE } from '../enum'
import { battleField_1 } from '../field'
import { playerWidth, playerHeight } from '../draw'

export const updatePlayerPosition = (playerData, localPlayerData) => {
  const field = battleField_1;
  const objects = field.rectObjects;

  if (localPlayerData.gameState === GAME_STATE.GAMING) {
    const p_x = playerData.playerPosition.x;
    const p_y = playerData.playerPosition.y;

    var speed = localPlayerData.playerMoveSpeed;


    const d_x = localPlayerData.playerMoveDirection.x;
    const d_y = localPlayerData.playerMoveDirection.y;
    if (d_x !== 0 && d_y !== 0) {
      speed = speed / 1.414;
    }

    var new_x = p_x + d_x * speed;
    var new_y = p_y + d_y * speed;

    // check field range
    new_x = Math.min(Math.max(new_x, field.fieldRange.xMin + playerWidth / 2), field.fieldRange.xMax - playerWidth / 2)
    new_y = Math.min(Math.max(new_y, field.fieldRange.yMin + playerHeight / 2), field.fieldRange.yMax - playerHeight / 2)

    // check objects
    for (var i = 0; i < objects.length; ++i) {
      const centerX = objects[i][1] + objects[i][3] / 2;
      const centerY = objects[i][2] + objects[i][4] / 2;

      if (Math.abs(new_x - centerX) < (objects[i][3] + playerWidth) / 2 && Math.abs(new_y - centerY) < (objects[i][4] + playerHeight) / 2) {
        // collision occured
        const temp_new_x = p_x < centerX ? centerX - (objects[i][3] + playerWidth) / 2 : centerX + (objects[i][3] + playerWidth) / 2;
        const temp_new_y = p_y < centerY ? centerY - (objects[i][4] + playerHeight) / 2 : centerY + (objects[i][4] + playerHeight) / 2;

        if (Math.abs(temp_new_x - p_x) < Math.abs(temp_new_y - p_y)) {
          new_x = temp_new_x;
        } else if (Math.abs(temp_new_x - p_x) > Math.abs(temp_new_y - p_y)) {
          new_y = temp_new_y;
        } else {
          new_x = temp_new_x;
          new_y = temp_new_y;
        }

      }
    }

    playerData.playerPosition.x = new_x;
    playerData.playerPosition.y = new_y;
    return playerData.playerPosition;
  }
}