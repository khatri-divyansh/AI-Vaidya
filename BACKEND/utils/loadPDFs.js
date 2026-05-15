import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdfParse from "pdf-parse-new";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDFS_DIR = path.join(__dirname, "../pdfs");

/**
 * Reads all PDF files from the BACKEND/pdfs/ folder and extracts their text.
 * Returns a concatenated string of all PDF content.
 */
export async function loadPDFsFromFolder() {
  let combinedText = "";

  if (!fs.existsSync(PDFS_DIR)) {
    console.log("📂 No pdfs/ folder found. Skipping PDF loading.");
    return combinedText;
  }

  const files = fs.readdirSync(PDFS_DIR).filter((f) => f.endsWith(".pdf"));

  if (files.length === 0) {
    console.log("📂 No PDF files found in pdfs/ folder.");
    return combinedText;
  }

  console.log(`📚 Loading ${files.length} PDF(s) from pdfs/ folder...`);

  for (const file of files) {
    const filePath = path.join(PDFS_DIR, file);
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const parsed = await pdfParse(dataBuffer);
      combinedText += `\n\n--- Source: ${file} ---\n${parsed.text}`;
      console.log(`  ✅ Loaded: ${file} (${parsed.text.length} characters)`);
    } catch (err) {
      console.error(`  ❌ Failed to parse ${file}:`, err.message);
    }
  }

  return combinedText;
}
