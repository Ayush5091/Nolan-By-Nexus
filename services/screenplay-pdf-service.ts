import jsPDF from "jspdf"

// Add this type declaration to help TypeScript understand the extended jsPDF
declare module "jspdf" {
  interface jsPDF {
    autoTable: any
    lastAutoTable: any
  }
}

interface Scene {
  content: string
  title?: string
  image?: string
}

interface Screenplay {
  title: string
  author: string
  genre: string[]
  scenes: Scene[]
  theme?: string
  recommendations?: string[]
}

/**
 * Generates a PDF from a screenplay following Hollywood formatting standards
 */
export function generateScreenplayPDF(screenplay: Screenplay): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document with high quality settings
      const doc = new jsPDF({
        unit: "in",
        format: "letter", // 8.5 x 11 inches
        compress: true, // Enable compression for smaller file size
      })

      // Set font to Courier for screenplay format
      doc.setFont("courier")
      doc.setFontSize(12)

      // Add title page
      createTitlePage(doc, screenplay)

      // Add a new page for the screenplay content
      doc.addPage()

      // Process each scene with proper formatting and pagination
      let pageNumber = 1

      // Add page number to the first content page
      addPageNumber(doc, pageNumber)

      // Process each scene
      screenplay.scenes.forEach((scene, sceneIndex) => {
        // Format and add the scene content
        const formattedContent = formatSceneContent(scene.content || "")

        // Add the formatted content to the PDF
        addFormattedContent(doc, formattedContent, pageNumber, () => {
          pageNumber++
          addPageNumber(doc, pageNumber)
        })

        // Add a separator between scenes except for the last one
        if (sceneIndex < screenplay.scenes.length - 1) {
          doc.setFont("courier", "normal")
          const yPos = doc.internal.pageSize.height - 1
          // Use a safer check that doesn't rely on lastAutoTable
          const currentY = doc.lastAutoTable?.finalY || doc.internal.getCurrentPageInfo().pageNumber * 10
          if (doc.getTextDimensions("").h + currentY > yPos) {
            doc.addPage()
            pageNumber++
            addPageNumber(doc, pageNumber)
          }
        }
      })

      // Add recommendations if available
      if (screenplay.recommendations && screenplay.recommendations.length > 0) {
        doc.addPage()
        pageNumber++
        addPageNumber(doc, pageNumber)

        doc.setFont("courier", "bold")
        doc.text("AI RECOMMENDATIONS", 1, 1)
        doc.setFont("courier", "normal")

        let yPos = 1.5
        screenplay.recommendations.forEach((rec, index) => {
          const text = `${index + 1}. ${rec}`
          const splitText = doc.splitTextToSize(text, 6.5)

          // Check if we need a new page
          if (yPos + splitText.length * 0.2 > 10) {
            doc.addPage()
            pageNumber++
            addPageNumber(doc, pageNumber)
            yPos = 1
          }

          doc.text(splitText, 1, yPos)
          yPos += splitText.length * 0.2 + 0.2
        })
      }

      // Convert the PDF to a data URL
      const pdfDataUrl = doc.output("datauristring")
      resolve(pdfDataUrl)
    } catch (error) {
      console.error("Error generating PDF:", error)
      reject(error)
    }
  })
}

/**
 * Creates a professional title page for the screenplay
 */
function createTitlePage(doc: jsPDF, screenplay: Screenplay): void {
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  // Title (centered, 4 inches from top)
  doc.setFont("courier", "bold")
  doc.setFontSize(18)
  const title = screenplay.title || "Untitled Screenplay"
  const titleLines = doc.splitTextToSize(title, 6)
  doc.text(titleLines, pageWidth / 2, 4, { align: "center" })

  // "Written by" (centered, 1 inch below title)
  doc.setFont("courier", "normal")
  doc.setFontSize(12)
  doc.text("Written by", pageWidth / 2, 4 + titleLines.length * 0.25 + 1, { align: "center" })

  // Author (centered, 0.5 inches below "Written by")
  doc.setFont("courier", "normal")
  doc.text(screenplay.author || "Anonymous Writer", pageWidth / 2, 4 + titleLines.length * 0.25 + 1.5, {
    align: "center",
  })

  // Genre (centered, 1 inch below author)
  const genreText = screenplay.genre && screenplay.genre.length > 0 ? screenplay.genre.join(", ") : "Drama"
  doc.text(`Genre: ${genreText}`, pageWidth / 2, 4 + titleLines.length * 0.25 + 2.5, { align: "center" })

  // Date (centered, 0.5 inches below genre)
  doc.text(new Date().toLocaleDateString(), pageWidth / 2, 4 + titleLines.length * 0.25 + 3, { align: "center" })

  // Contact info (bottom right, 1 inch from bottom)
  doc.text("Contact:", pageWidth - 1, pageHeight - 1.5, { align: "right" })
  doc.text("NOLAN", pageWidth - 1, pageHeight - 1.25, { align: "right" })
  doc.text("nexus@sahyadri.edu.in", pageWidth - 1, pageHeight - 1, { align: "right" })
}

/**
 * Adds a page number to the current page
 */
function addPageNumber(doc: jsPDF, pageNumber: number): void {
  const pageWidth = doc.internal.pageSize.width
  doc.setFont("courier", "normal")
  doc.setFontSize(12)
  doc.text(`${pageNumber}.`, pageWidth - 1, 0.5, { align: "right" })
}

/**
 * Formats scene content according to Hollywood screenplay standards
 */
function formatSceneContent(content: string): Array<{
  type: string
  text: string
  indent?: number
}> {
  if (!content) return []

  // Split the content into lines
  const lines = content.split("\n")
  const formattedLines: Array<{
    type: string
    text: string
    indent?: number
  }> = []

  let inDialogue = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip empty lines but preserve spacing
    if (!line) {
      formattedLines.push({ type: "empty", text: "" })
      inDialogue = false
      continue
    }

    // Scene headings (INT./EXT.)
    if (line.match(/^(INT\.|EXT\.|INT\.\/EXT\.|I\/E)/i)) {
      formattedLines.push({ type: "scene-heading", text: line.toUpperCase(), indent: 0 })
      inDialogue = false
    }
    // Character names (all caps)
    else if (
      line === line.toUpperCase() &&
      line.length > 0 &&
      !line.includes(":") &&
      !line.match(/^(FADE|CUT|DISSOLVE|TRANSITION)/i)
    ) {
      formattedLines.push({ type: "character", text: line, indent: 2.5 })
      inDialogue = true
    }
    // Parentheticals
    else if (line.startsWith("(") && line.endsWith(")")) {
      formattedLines.push({ type: "parenthetical", text: line, indent: 2 })
    }
    // Transitions
    else if (line.match(/^(FADE|CUT|DISSOLVE|TRANSITION)/i) || line.endsWith("TO:")) {
      formattedLines.push({ type: "transition", text: line.toUpperCase(), indent: 5.5 })
      inDialogue = false
    }
    // Dialogue (follows a character name)
    else if (inDialogue) {
      formattedLines.push({ type: "dialogue", text: line, indent: 1.5 })
    }
    // Action (everything else)
    else {
      formattedLines.push({ type: "action", text: line, indent: 0 })
    }
  }

  return formattedLines
}

/**
 * Adds formatted content to the PDF with proper pagination
 */
function addFormattedContent(
  doc: jsPDF,
  formattedContent: Array<{ type: string; text: string; indent?: number }>,
  pageNumber: number,
  onNewPage: () => void,
): void {
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height
  const margin = 1 // 1 inch margins
  const lineHeight = 0.2 // Line height in inches

  let yPos = margin

  formattedContent.forEach((line) => {
    // Skip empty lines but preserve spacing
    if (line.type === "empty") {
      yPos += lineHeight
      return
    }

    // Set font based on line type
    if (line.type === "scene-heading") {
      doc.setFont("courier", "bold")
    } else if (line.type === "character") {
      doc.setFont("courier", "bold")
    } else {
      doc.setFont("courier", "normal")
    }

    // Calculate x position based on indent
    const xPos = margin + (line.indent || 0)

    // Split text to fit within page width
    const maxWidth = pageWidth - xPos - margin
    const splitText = doc.splitTextToSize(line.text, maxWidth)

    // Check if we need a new page
    if (yPos + splitText.length * lineHeight > pageHeight - margin) {
      doc.addPage()
      onNewPage()
      yPos = margin
    }

    // Add text to the page
    doc.text(splitText, xPos, yPos)

    // Update y position
    yPos += splitText.length * lineHeight

    // Add extra space after certain elements
    if (line.type === "scene-heading" || line.type === "transition") {
      yPos += lineHeight * 0.5
    }
  })
}

