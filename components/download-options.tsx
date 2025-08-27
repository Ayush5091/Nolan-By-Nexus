"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { FileText, Film, X, FileIcon, BookOpen, Loader } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import FileSaver from "file-saver"

interface DownloadOptionsProps {
  content: string
  title: string
  onClose: () => void
  theme?: string
}

interface DownloadOptionComponentProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  disabled: boolean
  theme?: string
  isLoading: boolean
}

function DownloadOptionComponent({
  icon,
  title,
  description,
  onClick,
  disabled,
  theme,
  isLoading,
}: DownloadOptionComponentProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-between w-full p-3 rounded-md border border-gray-800 hover:border-gray-600 transition-colors duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="text-gray-400">{icon}</div>
        <div>
          <h3 className="text-lg font-medium metallic-text">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      {isLoading ? (
        <Loader className="w-6 h-6 animate-spin text-gray-400" />
      ) : (
        <div className="text-gray-400">{/* You can add an arrow icon here if you want */}</div>
      )}
    </button>
  )
}

export default function DownloadOptions({ content, title, onClose, theme }: DownloadOptionsProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDownload = useCallback(
    async (format: string) => {
      setSelectedFormat(format)
      setIsDownloading(true)

      try {
        let fileContent = content
        let fileExtension = "txt"

        if (format === "pdf") {
          // PDF generation logic would go here
          toast({
            title: "PDF Download Not Implemented",
            description: "PDF download is not implemented in this version.",
            variant: "destructive",
          })
          return
        } else if (format === "txt") {
          fileExtension = "txt"
        } else if (format === "fountain") {
          fileContent = `[${title}]

${content}`
          fileExtension = "fountain"
        } else if (format === "final-draft") {
          toast({
            title: "Final Draft Download Not Implemented",
            description: "Final Draft download is not implemented in this version.",
            variant: "destructive",
          })
          return
        }

        const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" })
        FileSaver.saveAs(blob, `${title}.${fileExtension}`)

        toast({
          title: "Download Started",
          description: `Downloading ${title}.${fileExtension}`,
        })
      } catch (error: any) {
        console.error("Download error:", error)
        toast({
          title: "Error",
          description: `Download failed. Please try again. ${error instanceof Error ? error.message : ""}`,
          variant: "destructive",
        })
      } finally {
        setIsDownloading(false)
        setSelectedFormat(null)
        onClose()
      }
    },
    [content, title, toast, onClose],
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
    >
      <div className="relative w-full max-w-md bg-black border border-gray-800 rounded-xl p-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 metallic-text">Download Options</h2>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <DownloadOptionComponent
            icon={<FileText size={24} />}
            title="Plain Text (.txt)"
            description="Simple text format readable by any text editor"
            onClick={() => handleDownload("txt")}
            disabled={isDownloading && selectedFormat === "txt"}
            theme={theme}
            isLoading={isDownloading && selectedFormat === "txt"}
          />

          <DownloadOptionComponent
            icon={<BookOpen size={24} />}
            title="Fountain (.fountain)"
            description="Screenwriting syntax for plain text editors"
            onClick={() => handleDownload("fountain")}
            disabled={isDownloading && selectedFormat === "fountain"}
            theme={theme}
            isLoading={isDownloading && selectedFormat === "fountain"}
          />

          <DownloadOptionComponent
            icon={<Film size={24} />}
            title="Final Draft (.fdx)"
            description="Industry standard screenwriting software format"
            onClick={() => handleDownload("final-draft")}
            disabled={isDownloading && selectedFormat === "final-draft"}
            theme={theme}
            isLoading={isDownloading && selectedFormat === "final-draft"}
          />

          <DownloadOptionComponent
            icon={<FileIcon size={24} />}
            title="PDF Document (.pdf)"
            description="Portable document format for sharing"
            onClick={() => handleDownload("pdf")}
            disabled={isDownloading && selectedFormat === "pdf"}
            theme={theme}
            isLoading={isDownloading && selectedFormat === "pdf"}
          />
        </div>

        <div className="text-xs text-gray-400 text-center">Choose a format to download your screenplay</div>
      </div>
    </motion.div>
  )
}

