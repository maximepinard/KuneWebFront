import { useRef, useEffect } from "react";

const Pixelify = ({
  src,
  width,
  height,
  pixelSize,
  centered,
  fillTransparencyColor,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
    const offscreenCtx = offscreenCanvas.getContext("2d");
    const ctx = canvas.getContext("2d");
    let img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      pixelSize = parseInt(pixelSize, 10);
      img.width = width ? width : img.width;
      img.height = height ? height : img.height;
      canvas.width = img.width;
      canvas.height = img.height;
      offscreenCanvas.width = img.width;
      offscreenCanvas.height = img.height;
      offscreenCtx.drawImage(img, 0, 0, img.width, img.height);
      paintPixels(
        offscreenCtx,
        img,
        pixelSize,
        centered,
        fillTransparencyColor,
      );
      ctx.drawImage(offscreenCanvas, 0, 0, img.width, img.height);
      img = null;
    };
  }, [src, width, height, pixelSize, centered, fillTransparencyColor]);

  const paintPixels = (
    ctx,
    img,
    pixelSize,
    centered,
    fillTransparencyColor,
  ) => {
    if (!isNaN(pixelSize) && pixelSize > 0) {
      for (let x = 0; x < img.width + pixelSize; x += pixelSize) {
        for (let y = 0; y < img.height + pixelSize; y += pixelSize) {
          let xColorPick = x;
          let yColorPick = y;

          if (x >= img.width) {
            xColorPick = x - (pixelSize - (img.width % pixelSize) / 2) + 1;
          }
          if (y >= img.height) {
            yColorPick = y - (pixelSize - (img.height % pixelSize) / 2) + 1;
          }

          const rgba = ctx.getImageData(xColorPick, yColorPick, 1, 1).data;
          ctx.fillStyle =
            rgba[3] === 0
              ? fillTransparencyColor
              : `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;

          if (centered) {
            ctx.fillRect(
              parseInt(x - (pixelSize - (img.width % pixelSize) / 2), 10),
              parseInt(y - (pixelSize - (img.height % pixelSize) / 2), 10),
              pixelSize,
              pixelSize,
            );
          } else {
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      }
    }
  };

  return <canvas ref={canvasRef} />;
};

export default Pixelify;
