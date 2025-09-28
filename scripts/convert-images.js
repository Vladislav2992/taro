import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

async function convertImages() {
  const sourceDir = './app/assets/img/cards';
  const files = fs.readdirSync(sourceDir);
  
  for (const file of files) {
    if (path.extname(file).toLowerCase() === '.png') {
      const inputPath = path.join(sourceDir, file);
      const outputName = path.parse(file).name + '.avif';
      const outputPath = path.join(sourceDir, outputName);
      
      console.log(`Конвертирую ${file} в ${outputName}`);
      
      await sharp(inputPath)
        .avif({ quality: 60, effort: 6 })
        .toFile(outputPath);
    }
  }
  
  console.log('Все изображения сконвертированы!');
}

convertImages().catch(console.error);