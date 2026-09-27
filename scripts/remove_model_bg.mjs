import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const modelsDir = path.resolve('public/models');
const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.png'));

files.forEach(file => {
  const filePath = path.join(modelsDir, file);
  const buffer = fs.readFileSync(filePath);
  const png = PNG.sync.read(buffer);

  // Sample top-left corner pixel color
  const bgR = png.data[0];
  const bgG = png.data[1];
  const bgB = png.data[2];

  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const r = png.data[idx];
      const g = png.data[idx + 1];
      const b = png.data[idx + 2];

      const diffR = Math.abs(r - bgR);
      const diffG = Math.abs(g - bgG);
      const diffB = Math.abs(b - bgB);

      // If near background grey, make alpha transparent (0)
      if (diffR < 40 && diffG < 40 && diffB < 40) {
        png.data[idx + 3] = 0;
      }
    }
  }

  const options = { fill: true };
  const packed = PNG.sync.write(png, options);
  fs.writeFileSync(filePath, packed);
  console.log(`Successfully cleared studio background for ${file}`);
});
