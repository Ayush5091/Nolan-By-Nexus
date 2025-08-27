'use client';

import { useEffect } from 'react';
import { initPdfWorker } from '@/lib/pdf-worker';

// Initialize PDF.js only in the browser
let pdfjs: any = null;

if (typeof window !== 'undefined') {
  // Initialize PDF.js and worker
  const loadPdfJs = async () => {
    await initPdfWorker();
    return await import('pdfjs-dist');
  };

  // Initialize PDF.js
  loadPdfJs().then(module => {
    pdfjs = module;
  });
}

export async function extractTextFromPDF(file: File): Promise<string> {
  if (!pdfjs) {
    throw new Error('PDF.js is not initialized');
  }

  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }

      resolve(fullText.trim());
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      reject(new Error('Failed to extract text from PDF'));
    }
  });
}