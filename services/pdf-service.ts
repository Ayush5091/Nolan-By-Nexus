/**
 * PDF generation service for screenplays
 * Follows Hollywood screenplay formatting standards
 */
export async function generateScreenplayPDF(screenplay: any): Promise<string> {
  // Create a more sophisticated PDF structure using HTML with theme-specific formatting
  const fontFamily =
    screenplay.theme === "cinematic" || screenplay.theme === "hollywood"
      ? "'Courier New', monospace"
      : screenplay.theme === "bbc"
        ? "'Arial', sans-serif"
        : "'Montserrat', sans-serif"

  const titleStyle =
    screenplay.theme === "cinematic" || screenplay.theme === "hollywood"
      ? "text-align: center; margin-bottom: 2in;"
      : screenplay.theme === "bbc"
        ? "text-align: left; margin-bottom: 1in; font-weight: bold;"
        : "text-align: center; margin-bottom: 1in;"

  const sceneHeadingStyle =
    screenplay.theme === "cinematic" || screenplay.theme === "hollywood"
      ? "text-transform: uppercase; font-weight: bold; margin-top: 2em; margin-bottom: 1em;"
      : screenplay.theme === "bbc"
        ? "font-weight: bold; margin-top: 1em; margin-bottom: 0.5em;"
        : "text-transform: uppercase; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em;"

  const characterStyle =
    screenplay.theme === "cinematic" || screenplay.theme === "hollywood"
      ? "text-transform: uppercase; margin-top: 1em; margin-bottom: 0; margin-left: 2in;"
      : screenplay.theme === "bbc"
        ? "font-weight: bold; margin-top: 1em; margin-bottom: 0;"
        : "font-weight: bold; margin-top: 0.5em; margin-bottom: 0;"

  const dialogueStyle =
    screenplay.theme === "cinematic" || screenplay.theme === "hollywood"
      ? "margin-top: 0; margin-bottom: 1em; margin-left: 1in; margin-right: 1in;"
      : screenplay.theme === "bbc"
        ? "margin-top: 0; margin-bottom: 1em; margin-left: 0.5in;"
        : "margin-top: 0; margin-bottom: 0.5em; margin-left: 0.5in;"

  let content = `
  <html>
    <head>
      <title>${screenplay.title || "Untitled Screenplay"}</title>
      <style>
        @page { size: 8.5in 11in; margin: 1in; }
        body { 
          font-family: ${fontFamily}; 
          font-size: 12pt; 
          line-height: 1.5;
          max-width: 6.5in;
          margin: 0 auto;
        }
        h1 { ${titleStyle} }
        .title-page { text-align: center; page-break-after: always; }
        .author { margin-top: 1in; }
        .scene-heading { ${sceneHeadingStyle} }
        .action { margin: 1em 0; }
        .character { ${characterStyle} }
        .dialogue { ${dialogueStyle} }
        .parenthetical {
          margin-top: 0;
          margin-bottom: 0;
          margin-left: 1.5in;
          margin-right: 1.5in;
          font-style: italic;
        }
        .transition {
          text-align: right;
          text-transform: uppercase;
          margin: 1em 0;
        }
        .scene-notes { 
          font-style: italic; 
          color: #666; 
          margin-top: 1em;
          border-left: 2px solid #666;
          padding-left: 1em;
        }
        .page-number {
          text-align: right;
          font-size: 10pt;
          margin-top: 0.5in;
        }
        .content {
          white-space: pre-wrap;
        }
        .recommendations {
          page-break-before: always;
          margin-top: 2em;
          border-top: 1px solid #ccc;
          padding-top: 1em;
        }
        .recommendation-item {
          margin-bottom: 0.5em;
        }
        .format-note {
          font-style: italic;
          color: #666;
          margin-top: 0.5em;
        }
      </style>
    </head>
    <body>
      <div class="title-page">
        <h1>${screenplay.title || "Untitled Screenplay"}</h1>
        <p class="author">by ${screenplay.author || "Anonymous Writer"}</p>
        <p>${(screenplay.genre || ["Drama"]).join(", ")}</p>
        <p>${new Date().toLocaleDateString()}</p>
        <p class="format-note">${
          screenplay.theme === "cinematic" || screenplay.theme === "hollywood"
            ? "Cinematic Format"
            : screenplay.theme === "bbc"
              ? "BBC Style Format"
              : "Short Form Format"
        }</p>
      </div>
`

  // If screenplay is a string (raw content), wrap it in a simple structure
  if (typeof screenplay === "string") {
    content += `
    <div class="scene">
      <div class="content">${formatScreenplayContent(screenplay)}</div>
    </div>
  `
  }
  // If screenplay is an array of scenes
  else if (Array.isArray(screenplay)) {
    screenplay.forEach((scene, index) => {
      const sceneContent = typeof scene === "string" ? scene : scene.content || ""
      content += `
      <div class="scene">
        <div class="page-number">SCENE ${index + 1}</div>
        <div class="content">${formatScreenplayContent(sceneContent)}</div>
      </div>
    `
    })
  }
  // If screenplay is an object with scenes
  else if (screenplay.scenes) {
    screenplay.scenes.forEach((scene, index) => {
      const sceneContent = typeof scene === "string" ? scene : scene.content || ""
      const sceneTitle = scene.title || `Scene ${index + 1}`

      content += `
      <div class="scene">
        <div class="page-number">SCENE ${index + 1}: ${sceneTitle}</div>
        <div class="content">${formatScreenplayContent(sceneContent)}</div>
      </div>
    `
    })
  }

  // Add recommendations if available
  if (screenplay.recommendations && screenplay.recommendations.length > 0) {
    content += `
    <div class="recommendations">
      <h2>AI Recommendations</h2>
      ${screenplay.recommendations
        .map(
          (rec, index) => `
        <div class="recommendation-item">${index + 1}. ${rec}</div>
      `,
        )
        .join("")}
    </div>
  `
  }

  content += `
    </body>
  </html>
`

  // Create a Blob from the HTML content
  const blob = new Blob([content], { type: "text/html" })
  const dataUrl = URL.createObjectURL(blob)

  return dataUrl
}

// Helper function to properly format screenplay content with correct indentation and formatting
function formatScreenplayContent(content: string): string {
  if (!content) return ""

  // Split the content into lines
  const lines = content.split("\n")
  let formattedContent = ""
  let inDialogue = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip empty lines but preserve spacing
    if (!line) {
      formattedContent += "<br>"
      inDialogue = false
      continue
    }

    // Scene headings (INT./EXT.)
    if (line.match(/^(INT\.|EXT\.|INT\.\/EXT\.|I\/E)/i)) {
      formattedContent += `<div class="scene-heading">${line}</div>`
      inDialogue = false
    }
    // Character names (all caps)
    else if (
      line === line.toUpperCase() &&
      line.length > 0 &&
      !line.includes(":") &&
      !line.match(/^(FADE|CUT|DISSOLVE|TRANSITION)/i)
    ) {
      formattedContent += `<div class="character">${line}</div>`
      inDialogue = true
    }
    // Parentheticals
    else if (line.startsWith("(") && line.endsWith(")")) {
      formattedContent += `<div class="parenthetical">${line}</div>`
    }
    // Transitions
    else if (line.match(/^(FADE|CUT|DISSOLVE|TRANSITION)/i) || line.endsWith("TO:")) {
      formattedContent += `<div class="transition">${line}</div>`
      inDialogue = false
    }
    // Dialogue (follows a character name)
    else if (inDialogue) {
      formattedContent += `<div class="dialogue">${line}</div>`
    }
    // Action (everything else)
    else {
      formattedContent += `<div class="action">${line}</div>`
    }
  }

  return formattedContent
}

