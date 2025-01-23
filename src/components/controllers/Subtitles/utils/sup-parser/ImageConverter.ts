// Read RLE encoded bytes and return pixels
function readRleBytes(odsBytes: number[]): number[][] {
  const pixels: number[][] = [];
  let lineBuilder: number[] = [];
  let i = 0;

  while (i < odsBytes.length) {
    let incr = 1;
    let color: number, length: number;

    if (odsBytes[i]) {
      color = odsBytes[i];
      length = 1;
    } else {
      const check = odsBytes[i + 1];
      if (check === 0) {
        incr = 2;
        color = 0;
        length = 0;
        pixels.push(lineBuilder);
        lineBuilder = [];
      } else if (check < 64) {
        incr = 2;
        color = 0;
        length = check;
      } else if (check < 128) {
        incr = 3;
        color = 0;
        length = ((check - 64) << 8) + odsBytes[i + 2];
      } else if (check < 192) {
        incr = 3;
        color = odsBytes[i + 2];
        length = check - 128;
      } else {
        incr = 4;
        color = odsBytes[i + 3];
        length = ((check - 192) << 8) + odsBytes[i + 2];
      }
    }
    lineBuilder.push(...Array(length).fill(color));
    i += incr;
  }

  if (lineBuilder.length) {
  }

  return pixels;
}

// Convert YCbCr to RGB
function ycbcr2rgb(ar: number[][]): number[][] {
  const xform = [
    [1, 0, 1.402],
    [1, -0.34414, -0.71414],
    [1, 1.772, 0],
  ];

  const rgb = ar.map((row) => row.slice());

  // Subtracting by 128 the R and G channels
  for (let i = 0; i < rgb.length; i++) {
    rgb[i][1] -= 128;
    rgb[i][2] -= 128;
  }

  // Matrix multiplication
  for (let i = 0; i < rgb.length; i++) {
    const r = rgb[i];
    rgb[i] = [
      r[0] * xform[0][0] + r[1] * xform[0][1] + r[2] * xform[0][2],
      r[0] * xform[1][0] + r[1] * xform[1][1] + r[2] * xform[1][2],
      r[0] * xform[2][0] + r[1] * xform[2][1] + r[2] * xform[2][2],
    ];
  }

  // Clamping values to 0-255
  for (let i = 0; i < rgb.length; i++) {
    rgb[i] = rgb[i].map((val) => Math.max(0, Math.min(255, val)));
  }

  return rgb.map((row) => row.map((val) => Math.round(val)));
}

// Convert RLE pixels and palette data into RGB and alpha
function pxRgbA(ods: any, pds: any, swap: boolean) {
  const px = readRleBytes(ods.imgData);
  const maxWidth = ods.width;
  const pxArray = px.map((line) => [
    ...Array(maxWidth - line.length).fill(255),
    ...line,
  ]);

  let ycbcr: number[][];
  if (swap) {
    ycbcr = pds.palette.map((entry: any) => [entry.Y, entry.Cb, entry.Cr]);
  } else {
    ycbcr = pds.palette.map((entry: any) => [entry.Y, entry.Cr, entry.Cb]);
  }

  const rgb = ycbcr2rgb(ycbcr);

  const a = pds.palette.map((entry: any) => entry.Alpha);
  const aArray = pxArray.map((line: any) => line.map((px: any) => a[px]));

  return { px: pxArray, rgb, a: aArray };
}

// Make an image from the decoded data
export default function makeImage(
  ods: any,
  pds: any,
  swap: boolean = false
): Promise<Blob> {
  const { px, rgb, a } = pxRgbA(ods, pds, swap);

  const canvas = document.createElement("canvas");
  canvas.width = ods.width;
  canvas.height = px.length;
  const ctx = canvas.getContext("2d");

  // Create the image with indexed palette
  const imgData = ctx.createImageData(ods.width, px.length);

  // Fill in the pixel data
  for (let y = 0; y < px.length; y++) {
    for (let x = 0; x < px[y].length; x++) {
      const color = rgb[px[y][x]];
      const index = (y * ods.width + x) * 4;
      imgData.data[index] = color[0]; // Red
      imgData.data[index + 1] = color[1]; // Green
      imgData.data[index + 2] = color[2]; // Blue
      imgData.data[index + 3] = a[y][x]; // Alpha
    }
  }

  ctx.putImageData(imgData, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/png");
  });
}

export { makeImage };
