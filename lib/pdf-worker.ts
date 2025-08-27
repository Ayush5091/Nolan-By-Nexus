import { PDF_CONFIG } from './pdf-config';

// PDF.js worker initialization
let isWorkerInitialized = false;

export async function initPdfWorker() {
  if (typeof window === 'undefined' || isWorkerInitialized) {
    return;
  }

  try {
    const pdfjs = await import('pdfjs-dist');
    
    if (!isWorkerInitialized && PDF_CONFIG.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = PDF_CONFIG.workerSrc;
      isWorkerInitialized = true;
    }
  } catch (error) {
    console.error('Error initializing PDF worker:', error);
  }
}