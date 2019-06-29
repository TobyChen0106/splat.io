
import shootSound from '../sounds/shoot/HitEffectiveCommon02.wav';
import noInkSound from '../sounds/shoot/BulletHitNoDamage.wav';

import { GAME_STATE, PLAYER_STATUS } from '../enum'

import { checkFieldCollision, checkPlayerCollision } from './index';

var fireAudio = new Audio(shootSound);
fireAudio.volume = 0.5;

var noInkAudio = new Audio(noInkSound);
noInkAudio.volume = 0.5;

// line = []
var lines = [];
var timeLog = 0;
export const getSplats = (playerData, localPlayerData, otherPlayers) => {
    const angle = playerData.playerAngle;
    const p_x = playerData.playerPosition.x;
    const p_y = playerData.playerPosition.y;
    const m_x = localPlayerData.mousePosition.x;
    const m_y = localPlayerData.mousePosition.y;

    var splats = [];
    var aimPoints = [];
    var bullets = [];
    var inkConsumption = 0;

    if (localPlayerData.gameState === GAME_STATE.GAMING) {
        // find shoot line
        switch (playerData.playerWeapon.main.type) {
            case 0:
                var maxShootDistance = playerData.playerWeapon.main.maxShootDistance;
                var bulletSpeed = playerData.playerWeapon.main.bulletSpeed;
                var fireSpeed = playerData.playerWeapon.main.fireSpeed;
                var fireInkCost = playerData.playerWeapon.main.fireInkCost;
                var maxError = playerData.playerWeapon.main.maxError;
                var gunLength = playerData.playerWeapon.main.gunLength;
                var mouseLength = Math.pow(Math.pow(m_x - p_x, 2) + Math.pow(m_y - p_y, 2), 0.5);
                var shootDistance = Math.min(mouseLength, maxShootDistance);

                var d_x = p_x + Math.sin(angle / 180 * Math.PI) * shootDistance;
                var d_y = p_y - Math.cos(angle / 180 * Math.PI) * shootDistance;

                var fieldCheckPos_a = checkFieldCollision(p_x, p_y, d_x, d_y);
                var playerCheckPos_a = checkPlayerCollision(p_x, p_y, fieldCheckPos_a[0], fieldCheckPos_a[1], otherPlayers); 
       
                aimPoints.push([playerCheckPos_a[0], playerCheckPos_a[1]]);

                d_x = p_x + Math.sin(angle / 180 * Math.PI) * shootDistance + (Math.random() - 0.5) * 2 * maxError;
                d_y = p_y - Math.cos(angle / 180 * Math.PI) * shootDistance + (Math.random() - 0.5) * 2 * maxError;

                var g_x = p_x + Math.sin(angle / 180 * Math.PI) * gunLength;
                var g_y = p_y - Math.cos(angle / 180 * Math.PI) * gunLength;

                var fieldCheckPos = checkFieldCollision(g_x, g_y, d_x, d_y);
                var playerCheckPos = checkPlayerCollision(g_x, g_y, fieldCheckPos[0], fieldCheckPos[1], otherPlayers); 
                var c_x = playerCheckPos[0];
                var c_y = playerCheckPos[1];

                var bullet_length = Math.pow(Math.pow(c_x - g_x, 2) + Math.pow(c_y - g_y, 2), 0.5);

                // line (type, current_point_x, current_point_y, end_point_x, end_point_y, d_x, d_y)
                if (localPlayerData.keyStrokeState.space === 0 && localPlayerData.mouseDownState === 1 && localPlayerData.timeStamp - timeLog > fireSpeed) {
                    timeLog = localPlayerData.timeStamp;
                    if (localPlayerData.inkAmount - fireInkCost >= 0) {
                        inkConsumption = fireInkCost;
                        lines.push([0, g_x, g_y, c_x, c_y,
                            (c_x - g_x) / bullet_length * bulletSpeed, (c_y - g_y) / bullet_length * bulletSpeed]);
                        fireAudio.currentTime = 0;
                        fireAudio.play();
                    } else {
                        noInkAudio.currentTime = 0;
                        noInkAudio.play();
                    }
                }
                break;
            case 1:

                break;
            default:
                break;
        }
    }
    // update line and get bullet
    for (var l = 0; l < lines.length; ++l) {
        lines[l][1] += lines[l][5];
        lines[l][2] += lines[l][6];

        // bullet = [type, x, y]
        bullets.push([0, lines[l][1], lines[l][2]]);

        // check if create splat
        if (Math.abs(lines[l][1] - lines[l][3]) < Math.abs(lines[l][5]) || Math.abs(lines[l][2] - lines[l][4]) < Math.abs(lines[l][6])) {
            var splat_angle = (Math.random() - 0.5) * 2 * Math.PI; // -Pi to Pi
            var splatSize = playerData.playerWeapon.main.splatSize;
            var splatDamage = playerData.playerWeapon.main.splatDamage;
            var splatShapeId = playerData.playerWeapon.main.splatShapeId[Math.floor(Math.random() * playerData.playerWeapon.main.splatShapeId.length)];
            var splatColorID = playerData.playerColorID;

            // splat [splatShapeId, pos_x, pos_y, splatAngle, splatSize, splatDamage]
            splats.push([splatShapeId, lines[l][3], lines[l][4], splat_angle, splatSize, splatDamage, splatColorID]);
            lines.splice(l, 1);
            --l;
            continue;
        }
    }

    playerData.bullets = bullets;
    playerData.splats = splats;
    return [aimPoints, inkConsumption];
}