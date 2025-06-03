const { Readable } = require("stream");
const csv = require("csv-parser");

async function parseUploadedFile(fileBuffer, ext) {
  let parsedData = [];
  let parseError = null;

  if (ext === "json") {
    try {
      parsedData = JSON.parse(fileBuffer.toString());
      if (!Array.isArray(parsedData)) {
        throw new Error("JSON must contain an array of objects.");
      }
    } catch (e) {
      parseError = `Invalid JSON: ${e.message}`;
    }
  } else if (ext === "csv") {
    parsedData = await new Promise((resolve, reject) => {
      const results = [];
      Readable.from(fileBuffer)
        .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
        .on("data", (row) => results.push(row))
        .on("end", () => resolve(results))
        .on("error", (err) => reject(err));
    }).catch((e) => {
      parseError = `Invalid CSV: ${e.message}`;
    });
  } else {
    parseError = "Unsupported file type.";
  }

  return { parsedData, parseError };
}

module.exports = {
  parseUploadedFile,
};
