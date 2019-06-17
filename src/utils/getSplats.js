import { battleField_1 } from '../field'

// line = []
var lines = [];
var timeLog = 0;
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
    var bullets = [];

    // find shoot line
    switch (state.playerEquipment.mainWeapon) {
        case 0:
            const maxShootDistance = 300;
            const bulletSpeed = 30;
            const fireSpeed = 200; // ms

            const mouseLength = Math.pow(Math.pow(m_x - p_x, 2) + Math.pow(m_y - p_y, 2), 0.5);
            const shootDistance = Math.min(mouseLength, maxShootDistance);
            const d_x = p_x + Math.sin(angle / 180 * Math.PI) * shootDistance;
            const d_y = p_y - Math.cos(angle / 180 * Math.PI) * shootDistance;

            const l_x = (d_x - p_x) / shootDistance * 5;
            const l_y = (d_y - p_y) / shootDistance * 5;

            var c_x = d_x;
            var c_y = d_y;

            const m = (d_y - p_y) / (d_x - p_x)
            var check_x_flag = 0;
            var check_y_flag = 0;
            for (var j = 0; j < objects.length; ++j) {
                const o_x1 = objects[j][1];
                const o_y1 = objects[j][2];

                const o_x2 = objects[j][1] + objects[j][3];
                const o_y2 = objects[j][2] + objects[j][4];

                const o_x = Math.abs(o_x1 - p_x) < Math.abs(o_x2 - p_x) ? o_x1 : o_x2;
                if ((o_x >= p_x && o_x <= d_x) || (o_x <= p_x && o_x >= d_x)) {
                    var cal_y = m * (o_x - p_x) + p_y;
                    if ((cal_y >= o_y1 && cal_y <= o_y2) || (cal_y <= o_y1 && cal_y >= o_y2)) {
                        check_x_flag = 1;
                        c_x = o_x;
                        if (check_y_flag === 0) c_y = cal_y;
                    }
                }

                const o_y = Math.abs(o_y1 - p_y) < Math.abs(o_y2 - p_y) ? o_y1 : o_y2;
                if ((o_y >= p_y && o_y <= d_y) || (o_y <= p_y && o_y >= d_y)) {
                    var cal_x = (o_y - p_y) / m + p_x;
                    if ((cal_x >= o_x1 && cal_x <= o_x2) || (cal_x <= o_x1 && cal_x >= o_x2)) {
                        check_y_flag = 1;
                        c_y = o_y;
                        if (check_x_flag === 0) c_x = cal_x;
                    }
                }
            }
            c_x = Math.min(Math.max(c_x, field.fieldRange.xMin), field.fieldRange.xMax);
            c_y = Math.min(Math.max(c_y, field.fieldRange.yMin), field.fieldRange.yMax);
            aimPoints.push([c_x, c_y]);
            // splats.push([c_x, c_y, 50]);
            // line (type, current_point_x, current_point_y, end_point_x, end_point_y, d_x, d_y)
            if(state.mouseDownState === 1 && state.timeStamp - timeLog > fireSpeed){
                timeLog = state.timeStamp;
                lines.push([0, p_x, p_y, c_x, c_y, 
                    Math.sin(angle / 180 * Math.PI) * bulletSpeed, Math.cos(angle / 180 * Math.PI) * bulletSpeed]);
            }
            
            break;
        default:
            break;
    }

    // update line and get bullet
    for ( var l = 0 ; l < lines.length ; ++l){
        lines[l][1]+=lines[l][5];
        lines[l][2]-=lines[l][6];

        // bullet = [type, x, y]
        bullets.push([0, lines[l][1], lines[l][2]]);
        
        // check if create splat
        if ( Math.abs(lines[l][1]-lines[l][3])< Math.abs(lines[l][5])  || Math.abs(lines[l][2]-lines[l][4])< Math.abs(lines[l][6])){
            console.log('splat',lines[l][3], lines[l][4])
            splats.push([lines[l][3], lines[l][4], 50]);
            
            lines.splice(l, 1);;
            --l;
            continue;
        }
    }
    console.log([bullets, splats, aimPoints]);
    return [bullets, splats, aimPoints];
}