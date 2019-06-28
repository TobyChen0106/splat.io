export const getMousePos = (event, state) => {
  state.mouseClient.x = event.clientX;
  state.mouseClient.y = event.clientY;
}

export const calculatePlayerAngle = (x1, y1, x2, y2) => {
  var comp = 0;
  if ( y2-y1 >= 0) {
      comp = 180;
  }
  const dividend = x2 - x1;
  const divisor = y2 - y1;
  const quotient = dividend / divisor;
  return radiansToDegrees(Math.atan(quotient)) * -1 + comp;
};

export const radiansToDegrees = radians => ((radians * 180) / Math.PI);