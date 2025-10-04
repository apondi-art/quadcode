import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">About Weather Explorer</h1>
            <p className="text-xl text-muted-foreground">
              Understanding weather patterns through historical data analysis
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                Providing accurate historical weather probability data for informed decision making
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Weather Explorer leverages NASA EarthData to provide comprehensive historical weather
                analysis. Our platform helps users understand weather patterns and probabilities for
                any location and date.
              </p>
              <p>
                Using advanced algorithms and satellite data from GPM IMERG and MERRA-2, we deliver
                reliable insights for agriculture, travel, event planning, and research purposes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
              <CardDescription>
                Powered by NASA&apos;s most advanced earth observation systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>GPM IMERG:</strong> Global Precipitation Measurement Integrated Multi-satellite Retrievals</li>
                <li><strong>MERRA-2:</strong> Modern-Era Retrospective Analysis for Research and Applications, Version 2</li>
                <li><strong>NASA EarthData:</strong> Comprehensive earth observation data repository</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}