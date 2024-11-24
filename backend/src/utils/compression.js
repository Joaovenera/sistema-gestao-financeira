const zlib = require('zlib');
const fs = require('fs');
const { promisify } = require('util');

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const compression = {
  async compress(inputPath, outputPath) {
    try {
      const input = await fs.promises.readFile(inputPath);
      const compressed = await gzip(input);
      await fs.promises.writeFile(outputPath, compressed);
    } catch (error) {
      throw new Error(`Erro na compressão: ${error.message}`);
    }
  },

  async decompress(inputPath, outputPath) {
    try {
      const input = await fs.promises.readFile(inputPath);
      const decompressed = await gunzip(input);
      await fs.promises.writeFile(outputPath, decompressed);
    } catch (error) {
      throw new Error(`Erro na descompressão: ${error.message}`);
    }
  }
};

module.exports = compression; 