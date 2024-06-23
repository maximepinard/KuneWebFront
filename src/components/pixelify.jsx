import { useEffect, useState } from 'react';

const lastPixelSize = { val: -1 };

const Pixelify = ({ src, width, height, pixelSize, centered, fillTransparencyColor }) => {
  const [img, setImg] = useState();

  useEffect(() => {
    const newIMG = new Image();
    newIMG.crossOrigin = 'anonymous';
    newIMG.src = src;
    newIMG.onload = () => {
      setImg(newIMG);
    };
  }, [src]);

  useEffect(() => {
    const canvas = document.getElementById('canvasPixel');
    if (canvas && pixelSize !== lastPixelSize.val && img) {
      lastPixelSize.val = pixelSize;
      const ctx = canvas.getContext('2d');
      const offscreenCanvas = new OffscreenCanvas(img.width, img.height);
      const offscreenCtx = offscreenCanvas.getContext('2d');
      pixelSize = parseInt(pixelSize, 10);
      img.width = width ? width : img.width;
      img.height = height ? height : img.height;
      canvas.width = img.width;
      canvas.height = img.height;
      offscreenCtx.drawImage(img, 0, 0, img.width, img.height);
      console.time('draw');
      paintPixels(offscreenCtx, img, pixelSize, centered, fillTransparencyColor);
      console.timeEnd('draw');
      console.log('pixelSize', pixelSize);
      ctx.drawImage(offscreenCanvas, 0, 0, img.width, img.height);
    }
  }, [img, width, height, pixelSize, centered, fillTransparencyColor, lastPixelSize]);

  const paintPixels = (offscreenCtx, img, pixelSize, centered, fillTransparencyColor) => {
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

          const rgba = offscreenCtx.getImageData(xColorPick, yColorPick, 1, 1).data;
          offscreenCtx.fillStyle =
            rgba[3] === 0 ? fillTransparencyColor : `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;

          if (centered) {
            offscreenCtx.fillRect(
              parseInt(x - (pixelSize - (img.width % pixelSize) / 2), 10),
              parseInt(y - (pixelSize - (img.height % pixelSize) / 2), 10),
              pixelSize,
              pixelSize
            );
          } else {
            offscreenCtx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      }
    }
  };

  return <canvas id="canvasPixel" />;
};

export default Pixelify;
