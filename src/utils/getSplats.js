import { battleField_1 } from '../field'

export const getSplats = (state) => {
    const angle = state.playerAngle;
    const p_x = state.playerPosition.x;
    const p_y = state.playerPosition.y;


    var splats = [];

    switch (state.playerEquipment.mainWeapon) {
        case 0:
            const shootDistance = 200;
            const d_x = p_x + Math.sin(angle / 180 * Math.PI) * shootDistance;
            const d_y = p_y - Math.cos(angle / 180 * Math.PI) * shootDistance;
            const l_x = (d_x - p_x)/5;
            const l_y = (d_y - p_y)/5;
            splats.push([p_x+l_x, p_y+l_y, 20]);
            splats.push([p_x+l_x*2, p_y+l_y*2, 20]);
            splats.push([p_x+l_x*3, p_y+l_y*3, 30]);
            splats.push([p_x+l_x*4, p_y+l_y*4, 40]);
            splats.push([p_x+l_x*5, p_y+l_y*5, 50]);


            break;
        default:
            break;
    }
    return splats;
}