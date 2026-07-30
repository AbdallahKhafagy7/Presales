import fs from "fs/promises";
import path from "path";
import mammoth from "mammoth";
import pdf from "pdf-parse-new";

export async function extractTextFromFile(
    filePath
) {
    const ext = path.extname(filePath)
        .toLowerCase();
        
    try {
        switch (ext) {
            case ".txt":
                return await fs.readFile(
                    filePath,
                    "utf8"
                );
            case ".docx":
                const doc =
                    await mammoth.extractRawText({
                        path: filePath,
                    });

                return doc.value;

            case ".pdf":
                const buffer =
                    await fs.readFile(filePath);

                const pdfData =
                    await pdf.default(buffer);

                return pdfData.text;

            default:
                return null;
        }
    } catch (err) {
        console.error(
            `Failed to read ${filePath}`,
            err
        );

        return null;
    }
}