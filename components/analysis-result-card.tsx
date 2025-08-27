"use client"

import { CheckCircle, AlertCircle } from "lucide-react"
import FadeInText from "@/components/fade-in-text"

interface AnalysisResultCardProps {
  category: string
  score: number
  scoreRating: string
  scoreColor: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  detailedAnalysis: string
}

export default function AnalysisResultCard({
  category,
  score,
  scoreRating,
  scoreColor,
  strengths,
  weaknesses,
  recommendations,
  detailedAnalysis,
}: AnalysisResultCardProps) {
  return (
    <div className="bg-black/20 rounded-lg p-4 border border-white/10">
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2 capitalize flex items-center">
          {category} Analysis
          <span className={`ml-2 text-sm ${scoreColor}`}>
            {score}/100 - {scoreRating}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Strengths */}
          <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/30 glass-card-3d">
            <h4 className="font-medium text-green-400 mb-3 flex items-center text-lg">
              <CheckCircle size={18} className="mr-2" />
              <span className="metallic-text-subtle">Strengths</span>
            </h4>
            <ul className="space-y-3">
              {strengths.map((strength, i) => (
                <li key={i} className="text-sm flex items-start">
                  <span className="text-green-400 mr-2 text-lg">•</span>
                  <span className="text-white/90 font-medium">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/30 glass-card-3d">
            <h4 className="font-medium text-red-400 mb-3 flex items-center text-lg">
              <AlertCircle size={18} className="mr-2" />
              <span className="metallic-text-subtle">Areas for Improvement</span>
            </h4>
            <ul className="space-y-3">
              {weaknesses.map((weakness, i) => (
                <li key={i} className="text-sm flex items-start">
                  <span className="text-red-400 mr-2 text-lg">•</span>
                  <span className="text-white/90 font-medium">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30 glass-card-3d mb-4">
          <h4 className="font-medium text-blue-400 mb-3 text-lg metallic-text-subtle">Recommendations</h4>
          <ul className="space-y-3">
            {recommendations.map((recommendation, i) => (
              <li key={i} className="text-sm flex items-start">
                <span className="text-blue-400 mr-2 text-lg">→</span>
                <span className="text-white/90 font-medium">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Detailed analysis with line-by-line fade in */}
        <div className="mt-4">
          <h4 className="font-medium mb-2 text-lg metallic-text-subtle">Detailed Analysis</h4>
          <div className="bg-white/5 p-4 rounded-lg max-h-72 overflow-y-auto custom-scrollbar-enhanced border border-white/10">
            <FadeInText
              text={detailedAnalysis}
              lineDelay={0.1}
              className="text-sm text-white/90"
              enableFormatting={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

