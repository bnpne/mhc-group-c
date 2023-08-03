export function getImgDims(widthRatio, planeRatio, canvasWidth) {
  const width = canvasWidth * widthRatio;
  const height = width / planeRatio;
  return { width, height };
}

export function getImgPosX(left, width, canvasWidth) {
  return (left / canvasWidth) * canvasWidth - canvas;
}
