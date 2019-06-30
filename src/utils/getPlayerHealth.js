import { playerWidth } from '../draw'
import {  PLAYER_STATUS } from '../enum'

export const getPlayerHealth = (playerData, localPlayerData, players) => {
    if (playerData.playerStatus !== PLAYER_STATUS.DEAD) {
        const p_x = playerData.playerPosition.x;
        const p_y = playerData.playerPosition.y;

        for (var p = 0; p < players.length; ++p) {
            if (players[p].playerTeam === playerData.playerTeam) continue;
            var splats = players[p].splats;
            for (var s = 0; s < splats.length; ++s) {
                var distance = Math.pow(Math.pow(p_x - splats[s][1], 2) + Math.pow(p_y - splats[s][2], 2), 0.5);
                var damage = 0;
                const minDistance = Math.abs(splats[s][4] - playerWidth / 2)
                const maxDistance = (splats[s][4] + playerWidth / 2);

                if (distance > maxDistance) {
                    damage = 0;
                } else if (distance < minDistance) {
                    damage = splats[s][5];
                } else {
                    damage = (distance - minDistance) / (maxDistance - minDistance) * splats[s][5];
                }
                localPlayerData.playerHealth = localPlayerData.playerHealth - damage;


            }
            if (localPlayerData.playerHealth <= 0) {
                //killed
                localPlayerData.playerHealth = 0;
                playerData.playerStatus = PLAYER_STATUS.DEAD;

                return { 
                    roomId: playerData.roomId,
                    killerUid: players[p].playerUid, 
                    killerName: players[p].playerName, 
                    killedUid: playerData.playerUid, 
                    killedName: playerData.playerName };
            }

        }
    }
    return null;
}