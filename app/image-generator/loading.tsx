import { SimpleFilmRollLoader } from "@/components/simple-film-roll-loader"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <SimpleFilmRollLoader message="Preparing Image Generator..." />
    </div>
  )
}

