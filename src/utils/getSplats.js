import { battleField_1 } from '../field'
import shootSound from '../sounds/shoot/HitEffectiveCommon02.wav';
import noInkSound from '../sounds/shoot/BulletHitNoDamage.wav';
import { getLineIntersection } from './getLineIntersection'

var fireAudio = new Audio(shootSound);
fireAudio.volume = 0.5;

var noInkAudio = new Audio(noInkSound);
noInkAudio.volume = 0.5;

// line = []
var lines = [];
var timeLog = 0;
export const getSplats = (state) => {
    const angle = state.playerAngle;
    const p_x = state.playerPosition.x;
    const p_y = state.playerPosition.y;
    const m_x = state.mousePosition.x;
    const m_y = state.mousePosition.y;

    var splats = [];
    var aimPoints = [];
    var bullets = [];
    var inkConsumption = 0;
    // find shoot line
    switch (state.playerWeapon.main.type) {
        case 0:
            var maxShootDistance = state.playerWeapon.main.maxShootDistance;
            var bulletSpeed = state.playerWeapon.main.bulletSpeed;
            var fireSpeed = state.playerWeapon.main.fireSpeed;
            var fireInkCost = state.playerWeapon.main.fireInkCost;
            var maxError = state.playerWeapon.main.maxError;
            var gunLength = state.playerWeapon.main.gunLength;
            var mouseLength = Math.pow(Math.pow(m_x - p_x, 2) + Math.pow(m_y - p_y, 2), 0.5);
            var shootDistance = Math.min(mouseLength, maxShootDistance);

            var d_x = p_x + Math.sin(angle / 180 * Math.PI) * shootDistance;
            var d_y = p_y - Math.cos(angle / 180 * Math.PI) * shootDistance;

            var [c_x_a, c_y_a] = checkFieldCollision(p_x, p_y, d_x, d_y);
            aimPoints.push([c_x_a, c_y_a]);

            d_x = p_x + Math.sin(angle / 180 * Math.PI) * shootDistance + (Math.random() - 0.5) * 2 * maxError;
            d_y = p_y - Math.cos(angle / 180 * Math.PI) * shootDistance + (Math.random() - 0.5) * 2 * maxError;

            var g_x = p_x + Math.sin(angle / 180 * Math.PI) * gunLength;
            var g_y = p_y - Math.cos(angle / 180 * Math.PI) * gunLength;

            var [c_x, c_y] = checkFieldCollision(g_x, g_y, d_x, d_y);
            var bullet_length = Math.pow(Math.pow(c_x - g_x, 2) + Math.pow(c_y - g_y, 2), 0.5);

            // line (type, current_point_x, current_point_y, end_point_x, end_point_y, d_x, d_y)
            if (state.keyStrokeState.space === 0 && state.mouseDownState === 1 && state.timeStamp - timeLog > fireSpeed) {
                timeLog = state.timeStamp;
                if (state.inkAmount - fireInkCost >= 0) {
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

    // update line and get bullet
    for (var l = 0; l < lines.length; ++l) {
        lines[l][1] += lines[l][5];
        lines[l][2] += lines[l][6];

        // bullet = [type, x, y]
        bullets.push([0, lines[l][1], lines[l][2]]);

        // check if create splat
        if (Math.abs(lines[l][1] - lines[l][3]) < Math.abs(lines[l][5]) || Math.abs(lines[l][2] - lines[l][4]) < Math.abs(lines[l][6])) {
            splats.push([lines[l][3], lines[l][4], 50]);

            lines.splice(l, 1);
            --l;
            continue;
        }
    }
    return [bullets, splats, aimPoints, inkConsumption];
}

export const checkFieldCollision = (p_x, p_y, d_x, d_y) => {
    const field = battleField_1;
    

    var c_x = d_x;
    var c_y = d_y;

    var realShootDistance = Math.pow(Math.pow(c_x - p_x, 2) + Math.pow(c_y - p_y, 2), 0.5);
    var tempShootDistance;
    // check rectobjects
    var objects = field.rectObjects;
    for (var j = 0; j < objects.length; ++j) {
        const o_x1 = objects[j][1];
        const o_y1 = objects[j][2];
        const o_x2 = objects[j][1] + objects[j][3];
        const o_y2 = objects[j][2] + objects[j][4];

        var interSections = [];

        interSections.push(getLineIntersection(p_x, p_y, c_x, c_y, o_x1, o_y1, o_x1, o_y2));
        interSections.push(getLineIntersection(p_x, p_y, c_x, c_y, o_x1, o_y1, o_x2, o_y1));
        interSections.push(getLineIntersection(p_x, p_y, c_x, c_y, o_x2, o_y1, o_x2, o_y2));
        interSections.push(getLineIntersection(p_x, p_y, c_x, c_y, o_x1, o_y2, o_x2, o_y2));

        for (var i = 0; i < interSections.length; ++i) {
            if (interSections[i] !== false) {
                tempShootDistance = Math.pow(Math.pow(interSections[i].x - p_x, 2) + Math.pow(interSections[i].y - p_y, 2), 0.5);
                if (tempShootDistance < realShootDistance) {
                    realShootDistance = tempShootDistance;
                    c_x = interSections[i].x;
                    c_y = interSections[i].y;
                }
            }
        }
    }
    
    // check polyobjects
    objects = field.polyObjects;
    for (var j = 0; j < objects.length; ++j) {
        const n  = objects[j].length;
        var interSection;

        for (var i = 1; i < n; ++i) {
            if(i === n-1){
                interSection = getLineIntersection(p_x, p_y, c_x, c_y, objects[j][i][0], objects[j][i][1], objects[j][1][0], objects[j][1][1]);
                if (interSection !== false) {
                    tempShootDistance = Math.pow(Math.pow(interSection.x - p_x, 2) + Math.pow(interSection.y - p_y, 2), 0.5);
                    if (tempShootDistance < realShootDistance) {
                        realShootDistance = tempShootDistance;
                        c_x = interSection.x;
                        c_y = interSection.y;
                    }
                }
            }else{
                interSection = getLineIntersection(p_x, p_y, c_x, c_y, objects[j][i][0], objects[j][i][1], objects[j][i+1][0], objects[j][i+1][1]);
                // console.log(interSection);

                if (interSection !== false) {
                    tempShootDistance = Math.pow(Math.pow(interSection.x - p_x, 2) + Math.pow(interSection.y - p_y, 2), 0.5);
                    if (tempShootDistance < realShootDistance) {
                        realShootDistance = tempShootDistance;
                        c_x = interSection.x;
                        c_y = interSection.y;
                    }
                }
            }
        }
    }

    // check fieldRange
    const o_x1 = field.fieldRange.xMin;
    const o_y1 = field.fieldRange.yMin;
    const o_x2 = field.fieldRange.xMax;
    const o_y2 = field.fieldRange.yMax;

    var interSections = [];

    interSections.push(getLineIntersection(p_x, p_y, c_x, c_y, o_x1, o_y1, o_x1, o_y2));
    interSections.push(getLineIntersection(p_x, p_y, c_x, c_y, o_x1, o_y1, o_x2, o_y1));
    interSections.push(getLineIntersection(p_x, p_y, c_x, c_y, o_x2, o_y1, o_x2, o_y2));
    interSections.push(getLineIntersection(p_x, p_y, c_x, c_y, o_x1, o_y2, o_x2, o_y2));

    for (var i = 0; i < interSections.length; ++i) {
        if (interSections[i] !== false) {
            const tempShootDistance = Math.pow(Math.pow(interSections[i].x - p_x, 2) + Math.pow(interSections[i].y - p_y, 2), 0.5);
            if (tempShootDistance < realShootDistance) {
                realShootDistance = tempShootDistance;
                c_x = interSections[i].x;
                c_y = interSections[i].y;
            }
        }
    }

    return [c_x, c_y];
}