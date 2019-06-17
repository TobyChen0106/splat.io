import { battleField_1 } from '../field'

var lines = [];
export const getSplats = (state) => {
    const angle = state.playerAngle;
    const p_x = state.playerPosition.x;
    const p_y = state.playerPosition.y;
    const m_x = state.mousePosition.x;
    const m_y = state.mousePosition.y;

    const field = battleField_1;
    const objects = field.objects;

    var splats = [];
    var aimPoints = [];

    // find shoot line
    switch (state.playerEquipment.mainWeapon) {
        case 0:
            const mouseLength = Math.pow(Math.pow(m_x - p_x, 2) + Math.pow(m_y - p_y, 2), 0.5);
            const shootDistance = Math.min(mouseLength, 200);
            const d_x = p_x + Math.sin(angle / 180 * Math.PI) * shootDistance;
            const d_y = p_y - Math.cos(angle / 180 * Math.PI) * shootDistance;

            const l_x = (d_x - p_x) / shootDistance*5;
            const l_y = (d_y - p_y) / shootDistance*5;

            var c_x = p_x;
            var c_y = p_y;
            for (var i = 0; i < shootDistance/5; ++i) {
                c_x += l_x;
                c_y += l_y;

                // check filed range
                if (c_x > field.fieldRange.xMax || c_x < field.fieldRange.xMin || c_y > field.fieldRange.yMax || c_y < field.fieldRange.yMin)
                    break;

                // check objects
                var check_flag = 0;
                for (var j = 0; j < objects.length; ++j) {
                    const centerX = objects[j][1] + objects[j][3] / 2;
                    const centerY = objects[j][2] + objects[j][4] / 2;

                    if (Math.abs(c_x - centerX) < (objects[j][3]) / 2 && Math.abs(c_y - centerY) < (objects[j][4]) / 2){
                        check_flag=1;    
                        break;
                    } 
                }
                if (check_flag === 1) break;                
            }
            aimPoints.push([c_x, c_y]);


            splats.push([c_x, c_y, 50]);

            break;
        default:
            break;
    }
    return [splats, aimPoints];
}