// PDF.js configuration
export const PDF_CONFIG = {
  workerSrc: typeof window !== 'undefined' 
    ? `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${process.env.NEXT_PUBLIC_PDFJS_VERSION || '3.11.174'}/pdf.worker.min.js`
    : undefined,
  cMapUrl: 'https://unpkg.com/pdfjs-dist/cmaps/',
  cMapPacked: true,
}