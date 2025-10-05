import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Cloud, Droplets, Wind, Gauge, Database, TrendingUp, Globe, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold tracking-tight">About QUADCODE</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Understanding weather patterns through historical data analysis powered by NASA EarthData
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Mission Section */}
          <Card className="border-l-4 border-primary">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Our Mission
              </CardTitle>
              <CardDescription>
                Providing accurate historical weather probability data for informed decision making
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                QUADCODE leverages NASA EarthData to provide comprehensive historical weather
                analysis. Our platform helps users understand weather patterns and probabilities for
                any location and date worldwide.
              </p>
              <p>
                Using advanced algorithms and satellite data from GPM IMERG and MERRA-2, we deliver
                reliable insights for agriculture, travel planning, event scheduling, and research purposes.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-primary" />
                  Weather Variables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Analyze temperature, precipitation, wind speed, and humidity with detailed historical trends
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Identify long-term patterns and climate trends using linear regression analysis
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-primary" />
                  Probability Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Calculate probabilities of extreme weather events based on custom thresholds
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Real-time Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get instant statistical insights with interactive charts and visualizations
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Data Sources */}
          <Card className="border-l-4 border-secondary">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Sources
              </CardTitle>
              <CardDescription>
                Powered by NASA&apos;s most advanced earth observation systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    GPM IMERG Final v07
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Global Precipitation Measurement Integrated Multi-satellite Retrievals for Earth (IMERG).
                    Provides high-resolution precipitation data from 2000 to present.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                    <Wind className="h-4 w-4 text-orange-500" />
                    MERRA-2 M2SDNXSLV v5.12.4
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Modern-Era Retrospective Analysis for Research and Applications, Version 2.
                    Delivers temperature, wind, and atmospheric data from 1980 onwards.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-green-500" />
                    NASA EarthData
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive earth observation data repository providing access to satellite imagery
                    and climate data from multiple NASA missions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Use Cases */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Use Cases</CardTitle>
              <CardDescription>How QUADCODE helps different industries and users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold">Agriculture</h4>
                  <p className="text-muted-foreground">Plan planting schedules based on historical precipitation and temperature patterns</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Event Planning</h4>
                  <p className="text-muted-foreground">Choose optimal dates for outdoor events using weather probability data</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Travel & Tourism</h4>
                  <p className="text-muted-foreground">Identify the best times to visit destinations based on climate patterns</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Research & Education</h4>
                  <p className="text-muted-foreground">Analyze climate trends and weather patterns for academic studies</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}