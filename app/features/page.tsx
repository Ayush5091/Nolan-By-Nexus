import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Check } from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Features</h1>

      <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
        <Info className="h-4 w-4" />
        <AlertTitle>Sample Application</AlertTitle>
        <AlertDescription>
          This is a demonstration application that uses sample data. No external API calls are made.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Features</TabsTrigger>
          <TabsTrigger value="writing">Writing Tools</TabsTrigger>
          <TabsTrigger value="analysis">Analysis Tools</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Screenplay Writer</CardTitle>
                <CardDescription>Create Nolan-inspired screenplays</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our specialized screenplay writer helps you craft narratives with non-linear structures, complex
                  characters, and thought-provoking themes inspired by Nolan's work.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Industry-standard formatting</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Non-linear timeline tools</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Character development templates</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/writer" className="w-full">
                  <Button className="w-full">Try Writer</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Script Editor</CardTitle>
                <CardDescription>Refine and polish your screenplays</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Edit your scripts with tools designed specifically for screenplay formatting, structure analysis, and
                  dialogue refinement.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Advanced formatting options</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Structure visualization</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Dialogue analysis</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/editor" className="w-full">
                  <Button className="w-full">Open Editor</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Film Critic</CardTitle>
                <CardDescription>Analyze films using Nolan's techniques</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Learn to critique films through the lens of Nolan's filmmaking philosophy, analyzing narrative
                  structure, visual techniques, and thematic elements.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Scene breakdown tools</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Thematic analysis</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Visual technique identification</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/critic" className="w-full">
                  <Button className="w-full">Start Analyzing</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Directorial Insights</CardTitle>
                <CardDescription>Explore Nolan-inspired films</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Browse our collection of sample film data inspired by Nolan's style, with information on themes,
                  techniques, and critical reception.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Sample film database</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Thematic categorization</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Technique analysis</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/directorial-insights" className="w-full">
                  <Button className="w-full">Explore Films</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Trends</CardTitle>
                <CardDescription>Stay updated on cinema news</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Access sample news articles related to cinema, directors, and industry trends, with a focus on
                  storytelling techniques and directorial styles.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Sample news articles</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Categorized by topic</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Regularly updated content</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/media-related-trends" className="w-full">
                  <Button className="w-full">View Trends</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Profiles</CardTitle>
                <CardDescription>Track your progress and save your work</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Create a profile to save your screenplays, track your progress, and build a portfolio of your work
                  inspired by Nolan's techniques.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Secure authentication</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Progress tracking</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Project management</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/profile" className="w-full">
                  <Button className="w-full">View Profile</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="writing" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Screenplay Writer</CardTitle>
                <CardDescription>Create Nolan-inspired screenplays</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our specialized screenplay writer helps you craft narratives with non-linear structures, complex
                  characters, and thought-provoking themes inspired by Nolan's work.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Industry-standard formatting</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Non-linear timeline tools</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Character development templates</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/writer" className="w-full">
                  <Button className="w-full">Try Writer</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Script Editor</CardTitle>
                <CardDescription>Refine and polish your screenplays</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Edit your scripts with tools designed specifically for screenplay formatting, structure analysis, and
                  dialogue refinement.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Advanced formatting options</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Structure visualization</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Dialogue analysis</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/editor" className="w-full">
                  <Button className="w-full">Open Editor</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Film Critic</CardTitle>
                <CardDescription>Analyze films using Nolan's techniques</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Learn to critique films through the lens of Nolan's filmmaking philosophy, analyzing narrative
                  structure, visual techniques, and thematic elements.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Scene breakdown tools</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Thematic analysis</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Visual technique identification</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/critic" className="w-full">
                  <Button className="w-full">Start Analyzing</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Directorial Insights</CardTitle>
                <CardDescription>Explore Nolan-inspired films</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Browse our collection of sample film data inspired by Nolan's style, with information on themes,
                  techniques, and critical reception.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Sample film database</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Thematic categorization</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Technique analysis</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/directorial-insights" className="w-full">
                  <Button className="w-full">Explore Films</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Profiles</CardTitle>
                <CardDescription>Track your progress and save your work</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Create a profile to save your screenplays, track your progress, and build a portfolio of your work
                  inspired by Nolan's techniques.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Secure authentication</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Progress tracking</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Project management</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/profile" className="w-full">
                  <Button className="w-full">View Profile</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Trends</CardTitle>
                <CardDescription>Stay updated on cinema news</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Access sample news articles related to cinema, directors, and industry trends, with a focus on
                  storytelling techniques and directorial styles.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Sample news articles</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Categorized by topic</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span>Regularly updated content</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/media-related-trends" className="w-full">
                  <Button className="w-full">View Trends</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

