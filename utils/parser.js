import fs from "fs/promises";
import docxParser from "docx-parser";
import pdf from "pdf-parse-fork";

// ===== text parser =====
async function extractFromTxt(filePath) {
  try {
    const text = await fs.readFile(filePath, "utf8");
    return text;
  } catch (error) {
    console.error("Error reading TXT:", error);
    throw error;
  }
}

// ===== pdf parser =====
async function extractFromPdf(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error reading TXT:", error);
    throw error;
  }
}

// ===== docx parser =====
// docx is callback based, doesnt have async/await syntax
function extractFromDocx(filePath) {
  return new Promise((resolve, reject) => {
    docxParser.parseDocx(filePath, (data) => {
      if (data === "error") reject("Failed to parse docx!");
      else resolve(data);
    });
  });
}

export { extractFromTxt, extractFromPdf, extractFromDocx };
