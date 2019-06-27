// export const getLineIntersection = (l1_x1, l1_y1, l1_x2, l1_y2, l2_x1, l2_y1, l2_x2, l2_y2) => {
//     var l1_m = (l1_y2 - l1_y1) / (l1_x2 - l1_x1);
//     var l2_m = (l2_y2 - l2_y1) / (l2_x2 - l2_x1);
//     if (Number.isFinite(l1_m)) l1_m = 1e10;
//     if (Number.isFinite(l2_m)) l2_m = 1e10;
//     const cal_x = (l1_m * l1_x1 - l2_m * l2_x1 + l2_y1 - l1_y1) / (l1_m - l2_m);
//     const cal_y = (l1_y1 / l1_m - l2_y1 / l2_m + l2_x1 - l1_x1) / (1 / l1_m - 1 / l2_m);

//     // var cal_y = l1_m * (x - l1_x1) + l1_y1;
//     // var cal_x = (y - l1_y1) / l1_m + l1_x1;

//     // console.log("x:", x);
//     // console.log("y:", y);

//     // var cal_y = 0;
//     // var cal_x = 0;

//     var com_1_max = l1_x1 > l1_x2 ? l1_x1 : l1_x2;
//     var com_1_min = l1_x1 < l1_x2 ? l1_x1 : l1_x2;
//     var com_2_max = l1_y1 > l1_y2 ? l1_y1 : l1_y2;
//     var com_2_min = l1_y1 < l1_y2 ? l1_y1 : l1_y2;
//     if (cal_x <= com_1_max && cal_x >= com_1_min && cal_y <= com_2_max && cal_y >= com_2_min) {
//         // in line 1
//         com_1_max = l2_x1 > l2_x2 ? l2_x1 : l2_x2;
//         com_1_min = l2_x1 < l2_x2 ? l2_x1 : l2_x2;
//         com_2_max = l2_y1 > l2_y2 ? l2_y1 : l2_y2;
//         com_2_min = l2_y1 < l2_y2 ? l2_y1 : l2_y2;
//         if (cal_x <= com_1_max && cal_x >= com_1_min && cal_y <= com_2_max && cal_y >= com_2_min) {
//             // in line 2
//             return [cal_x, cal_y];
//         }
//     }
//     // return [null, null];
//     return [cal_x, cal_y];
// }

export const getLineIntersection = (x1, y1, x2, y2, x3, y3, x4, y4) =>  {

    // Check if none of the lines are of length 0
      if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
          return false;
      }
  
      var denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
  
    // Lines are parallel
      if (denominator === 0) {
          return false;
      }
  
      let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
      let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
  
    // is the intersection along the segments
      if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
          return false;
      }
  
    // Return a object with the x and y coordinates of the intersection
      let x = x1 + ua * (x2 - x1);
      let y = y1 + ua * (y2 - y1);
  
      return {x:x, y:y};
  }