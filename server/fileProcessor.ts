import mammoth from 'mammoth';
import { Buffer } from 'buffer';
import { createRequire } from 'module';

// Use createRequire for CommonJS module in ESM context
const require = createRequire(import.meta.url);
const { PDFParse: pdfParse } = require('pdf-parse');

export interface ExtractedText {
  text: string;
  title: string;
}

const MAX_PDF_BUFFER_SIZE = 50 * 1024 * 1024; // 50MB buffer limit

export async function extractTextFromPDF(fileBuffer: Buffer): Promise<ExtractedText> {
  if (fileBuffer.length > MAX_PDF_BUFFER_SIZE) {
    throw new Error(
      'Ce PDF est trop volumineux pour etre traite (>' + Math.round(MAX_PDF_BUFFER_SIZE / 1024 / 1024) + ' MB). ' +
      'Essayez de diviser le document en parties plus petites.'
    );
  }

  let parser: any = null;
  
  try {
    // Create parser instance with pdf-parse v2 API, with timeout
    parser = new pdfParse({ data: fileBuffer });
    
    // Extract text with a timeout to prevent hanging on very large documents
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('PDF_TIMEOUT')), 60000);
    });
    const result = await Promise.race([parser.getText(), timeoutPromise]);
    
    // Clean up text
    const text = result.text
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
    
    if (error instanceof Error) {
      if (error.message.includes('images') || error.message.includes('scannées') || error.message.includes('volumineux')) {
        throw error;
      }
      if (error.message === 'PDF_TIMEOUT') {
        throw new Error(
          'Le traitement de ce PDF a pris trop de temps. ' +
          'Le document est probablement trop long. Essayez de diviser le document en parties plus petites (moins de 200 pages).'
        );
      }
    }
    
    throw new Error(
      'Impossible d\'extraire le texte du PDF. ' +
      'Assurez-vous que le PDF contient du texte selectionnable (non scanne).'
    );
  } finally {
    // Clean up resources
    if (parser && typeof parser.destroy === 'function') {
      await parser.destroy();
    }
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

const MAX_CONTENT_CHARS = 200000;

function truncateExtractedText(result: ExtractedText): ExtractedText {
  if (result.text.length <= MAX_CONTENT_CHARS) {
    return result;
  }

  let truncated = result.text.substring(0, MAX_CONTENT_CHARS);
  const lastSentence = Math.max(
    truncated.lastIndexOf('. '),
    truncated.lastIndexOf('.\n'),
    truncated.lastIndexOf('? '),
    truncated.lastIndexOf('! ')
  );
  if (lastSentence > MAX_CONTENT_CHARS * 0.8) {
    truncated = truncated.substring(0, lastSentence + 1);
  }

  const notice = '\n\n[... Document tronque pour respecter les limites. Les ' +
    Math.round(MAX_CONTENT_CHARS / 1000) + ' premiers milliers de caracteres ont ete conserves.]';

  console.log(`Content truncated from ${result.text.length} to ${truncated.length} chars`);

  return {
    text: truncated + notice,
    title: result.title,
  };
}

export async function processUploadedFile(
  fileBuffer: Buffer,
  mimetype: string
): Promise<ExtractedText> {
  let result: ExtractedText;

  if (mimetype === 'application/pdf') {
    result = await extractTextFromPDF(fileBuffer);
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword'
  ) {
    result = await extractTextFromWord(fileBuffer);
  } else {
    throw new Error('Type de fichier non supporté. Utilise PDF ou Word (.docx)');
  }

  return truncateExtractedText(result);
}
