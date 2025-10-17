import mammoth from 'mammoth';
import { Buffer } from 'buffer';
import { createRequire } from 'module';

// Use createRequire for CommonJS module in ESM context
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export interface ExtractedText {
  text: string;
  title: string;
}

export async function extractTextFromPDF(fileBuffer: Buffer): Promise<ExtractedText> {
  try {
    const data = await pdfParse(fileBuffer);
    
    // Clean up text
    const text = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    // Check if PDF contains very little text (likely images/scanned document)
    const wordCount = text.split(/\s+/).filter((word: string) => word.length > 0).length;
    
    if (wordCount < 50) {
      console.warn(`PDF contains very little text (${wordCount} words). Likely contains images or is scanned.`);
      
      if (wordCount === 0) {
        throw new Error(
          'Ce PDF semble contenir uniquement des images ou des pages scannées. ' +
          'Veuillez utiliser un PDF contenant du texte sélectionnable, ou convertir vos images en texte avant de téléverser.'
        );
      }
      
      // If there's some text but very little, we'll still use it but warn
      console.log('Extracting available text from image-heavy PDF...');
    }
    
    // Extract title from first line or use default
    const lines = text.split('\n').filter((line: string) => line.trim());
    const title = lines[0]?.substring(0, 100) || 'Document PDF';
    
    return { text, title };
  } catch (error) {
    console.error('PDF extraction error:', error);
    
    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('images') || error.message.includes('scannées')) {
        throw error; // Re-throw our custom error
      }
    }
    
    throw new Error(
      'Impossible d\'extraire le texte du PDF. ' +
      'Assurez-vous que le PDF contient du texte sélectionnable (non scanné).'
    );
  }
}

export async function extractTextFromWord(fileBuffer: Buffer): Promise<ExtractedText> {
  try {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    
    // Extract title from first line or use default
    const lines = result.value.split('\n').filter(line => line.trim());
    const title = lines[0]?.substring(0, 100) || 'Document Word';
    
    // Clean up text
    const text = result.value
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return { text, title };
  } catch (error) {
    console.error('Word extraction error:', error);
    throw new Error('Impossible d\'extraire le texte du document Word');
  }
}

export async function processUploadedFile(
  fileBuffer: Buffer,
  mimetype: string
): Promise<ExtractedText> {
  if (mimetype === 'application/pdf') {
    return extractTextFromPDF(fileBuffer);
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword'
  ) {
    return extractTextFromWord(fileBuffer);
  } else {
    throw new Error('Type de fichier non supporté. Utilise PDF ou Word (.docx)');
  }
}
