import { battleField_1 } from '../field'
import { GAME_STATE, PLAYER_STATUS } from '../enum'

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}


export const getGameResult = (fieldRef, splatRef, playerData, localPlayerData)=>{
    if (localPlayerData.gameState === GAME_STATE.FREEZE) {

        var sxt = splatRef.getContext('2d');
        sxt.drawImage(fieldRef, 0, 0);

        const fildWidth = battleField_1.fieldRange.xMax - battleField_1.fieldRange.xMin;
        const fildHeight = battleField_1.fieldRange.yMax - battleField_1.fieldRange.yMin;
        var result = sxt.getImageData(battleField_1.fieldRange.xMin, battleField_1.fieldRange.yMin, fildWidth, fildHeight).data;

        var own_color = hexToRgb(playerData.playerColor.main);
        var enemyColor = hexToRgb(localPlayerData.enemyColor.main);
        
        var space_count = 0;
        var own_field_count = 0;
        var enemy_field_count = 0;

        for (var i = 0; i < fildHeight ; ++i){
            for (var j = 0; j < fildWidth ; ++j){
                // console.log([result[(i*fildWidth+j)*4], result[(i*fildWidth+j)*4+1], result[(i*fildWidth+j)*4+2], result[(i*fildWidth+j)*4+3] ])
                if( result[(i*fildWidth+j)*4] === 0 && result[(i*fildWidth+j)*4+1] === 0 && result[(i*fildWidth+j)*4+2] === 0&& result[(i*fildWidth+j)*4+3] === 0){
                    space_count +=1;
                }
                else if( result[(i*fildWidth+j)*4] === own_color[0] && result[(i*fildWidth+j)*4+1] === own_color[1] && result[(i*fildWidth+j)*4+2] === own_color[2]){
                    own_field_count+=1;
                }else if( result[(i*fildWidth+j)*4] === enemyColor[0] && result[(i*fildWidth+j)*4+1] === enemyColor[1] && result[(i*fildWidth+j)*4+2] === enemyColor[2]){
                    enemy_field_count+=1;
                }
            }
        }   
        console.log(space_count);
        console.log(own_field_count);
        console.log(enemy_field_count);
        
        const own_result  = own_field_count/(space_count+own_field_count+enemy_field_count);
        const enem_result  = enemy_field_count/(space_count+own_field_count+enemy_field_count);
        
        const teamA_result = playerData.playerTeam === 'A'? own_result:enem_result;
        const teamB_result = playerData.playerTeam === 'B'? own_result:enem_result;
        return { A:teamA_result,  B:teamB_result};
    }
}

 // var output = this.splatRef.toDataURL();
        // var image = this.splatRef.toDataURL("image/png").replace("image/png", "image/octet-stream"); 