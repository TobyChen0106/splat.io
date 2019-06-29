import { playerWidth, playerHeight } from '../draw'
import { getLineIntersection } from './getLineIntersection'
import { battleField_1 } from '../field'

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
        const n = objects[j].length;
        var interSection;

        for (var i = 1; i < n; ++i) {
            if (i === n - 1) {
                interSection = getLineIntersection(p_x, p_y, c_x, c_y, objects[j][i][0], objects[j][i][1], objects[j][1][0], objects[j][1][1]);
                if (interSection !== false) {
                    tempShootDistance = Math.pow(Math.pow(interSection.x - p_x, 2) + Math.pow(interSection.y - p_y, 2), 0.5);
                    if (tempShootDistance < realShootDistance) {
                        realShootDistance = tempShootDistance;
                        c_x = interSection.x;
                        c_y = interSection.y;
                    }
                }
            } else {
                interSection = getLineIntersection(p_x, p_y, c_x, c_y, objects[j][i][0], objects[j][i][1], objects[j][i + 1][0], objects[j][i + 1][1]);
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

// players = [..., [pos_x, pos_y], ...]
export const checkPlayerCollision = (p_x, p_y, c_x, c_y, players, own_uid) => {
    for (var j = 0; j < players.length; ++j) {
        if (players[j].playerUid !== own_uid) {
            const o_x1 = players[j].playerPosition.x - playerWidth / 2;
            const o_y1 = players[j].playerPosition.y - playerHeight / 2;
            const o_x2 = players[j].playerPosition.x + playerWidth / 2;
            const o_y2 = players[j].playerPosition.y + playerHeight / 2;

            var interSections = [];
            interSections.push(getLineIntersection(p_x, p_y, c_x, c_y, o_x1, o_y1, o_x1, o_y2));
            interSections.push(getLineIntersection(p_x, p_y, c_x, c_y, o_x1, o_y1, o_x2, o_y1));
            interSections.push(getLineIntersection(p_x, p_y, c_x, c_y, o_x2, o_y1, o_x2, o_y2));
            interSections.push(getLineIntersection(p_x, p_y, c_x, c_y, o_x1, o_y2, o_x2, o_y2));

            var realShootDistance = 10000;
            for (var i = 0; i < interSections.length; ++i) {
                if (interSections[i] !== false) {
                    var tempShootDistance = Math.pow(Math.pow(interSections[i].x - p_x, 2) + Math.pow(interSections[i].y - p_y, 2), 0.5);
                    if (tempShootDistance < realShootDistance) {
                        realShootDistance = tempShootDistance;
                        c_x = interSections[i].x;
                        c_y = interSections[i].y;
                    }
                }
            }
        }
    }
    return [c_x, c_y];
}