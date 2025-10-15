import mammoth from 'mammoth';
import { Buffer } from 'buffer';

export interface ExtractedText {
  text: string;
  title: string;
}

export async function extractTextFromPDF(fileBuffer: Buffer): Promise<ExtractedText> {
  try {
    // Dynamic import for CommonJS module
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(fileBuffer);
    
    // Extract title from first line or use default
    const lines = data.text.split('\n').filter((line: string) => line.trim());
    const title = lines[0]?.substring(0, 100) || 'Document PDF';
    
    // Clean up text
    const text = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return { text, title };
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Impossible d\'extraire le texte du PDF');
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
