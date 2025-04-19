import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { Pill, BookMarked, FlaskConical, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardProps {
  data: {
    fdaApprovedCount: number;
    clinicalTrialsCount: number;
    significantGenesCount: number;
    totalGenesCount: number;
    expressionDistribution: Array<{ name: string; value: number; color: string }>;
    druggabilityDistribution: Array<{ name: string; count: number; color: string }>;
    topPublications: Array<{ gene: string; count: number }>;
  };
}

const mockExpressionAnalysis = {
  timeSeriesData: [
    { timepoint: "0h", SubtypeA: 1.2, SubtypeB: 0.8, SubtypeC: 0.3 },
    { timepoint: "12h", SubtypeA: 2.1, SubtypeB: 1.5, SubtypeC: 0.7 },
    { timepoint: "24h", SubtypeA: 2.8, SubtypeB: 1.9, SubtypeC: 1.1 },
    { timepoint: "48h", SubtypeA: 3.2, SubtypeB: 2.3, SubtypeC: 1.8 },
    { timepoint: "72h", SubtypeA: 2.9, SubtypeB: 2.0, SubtypeC: 1.5 }
  ],
  subtypeDistribution: [
    { subtype: "SubtypeA", upregulated: 145, downregulated: 98, unchanged: 257 },
    { subtype: "SubtypeB", upregulated: 122, downregulated: 134, unchanged: 244 },
    { subtype: "SubtypeC", upregulated: 167, downregulated: 89, unchanged: 244 }
  ]
};

const mockDruggabilityData = {
  druggabilityScores: [
    { category: "Small Molecule", high: 125, medium: 234, low: 141 },
    { category: "Antibody", high: 87, medium: 198, low: 215 },
    { category: "Other", high: 45, medium: 167, low: 288 }
  ],
  structuralAnalysis: [
    { feature: "Binding Pockets", count: 287, percentage: 57 },
    { feature: "Known Domains", count: 342, percentage: 68 },
    { feature: "Active Sites", count: 198, percentage: 40 },
    { feature: "Allosteric Sites", count: 156, percentage: 31 }
  ]
};

const mockDashboardData = {
  fdaApprovedCount: 12,
  clinicalTrialsCount: 37,
  significantGenesCount: 125,
  totalGenesCount: 500,
  expressionDistribution: [
    { name: "Up-regulated", value: 187, color: "#ef4444" },
    { name: "Down-regulated", value: 152, color: "#3b82f6" },
    { name: "No change", value: 161, color: "#9ca3af" },
  ],
  druggabilityDistribution: [
    { name: "High (8-10)", count: 89, color: "#16a34a" },
    { name: "Medium (5-7)", count: 217, color: "#eab308" },
    { name: "Low (1-4)", count: 194, color: "#d1d5db" },
  ],
  topPublications: [
    { gene: "BRCA1", count: 1250 },
    { gene: "TP53", count: 950 },
    { gene: "EGFR", count: 840 },
    { gene: "HER2", count: 720 },
    { gene: "KRAS", count: 680 },
  ]
};

const GeneInsightsDashboard = ({ data = mockDashboardData }: Partial<DashboardProps>) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expression">Expression Analysis</TabsTrigger>
          <TabsTrigger value="druggability">Druggability</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover-scale transition-all">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-4">
                  <Pill className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-3xl font-bold">{data.fdaApprovedCount}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">FDA Approved Genes</p>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-4 font-medium">
                  {Math.round((data.fdaApprovedCount / data.totalGenesCount) * 100)}% of total
                </div>
              </CardContent>
            </Card>

            <Card className="hover-scale transition-all">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mb-4">
                  <FlaskConical className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-3xl font-bold">{data.clinicalTrialsCount}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">In Clinical Trials</p>
                <div className="text-xs text-green-600 dark:text-green-400 mt-4 font-medium">
                  {Math.round((data.clinicalTrialsCount / data.totalGenesCount) * 100)}% of total
                </div>
              </CardContent>
            </Card>

            <Card className="hover-scale transition-all">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3 mb-4">
                  <BookMarked className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-3xl font-bold">{data.significantGenesCount}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Significant Expression</p>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-4 font-medium">
                  {Math.round((data.significantGenesCount / data.totalGenesCount) * 100)}% of total
                </div>
              </CardContent>
            </Card>

            <Card className="hover-scale transition-all">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-3 mb-4">
                  <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-3xl font-bold">2.3K</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Related Publications</p>
                <div className="text-xs text-orange-600 dark:text-orange-400 mt-4 font-medium">
                  Avg 4.6 per gene
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expression Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.expressionDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.expressionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} genes`]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Genes by Publications</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={data.topPublications}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="gene" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} publications`]} />
                    <Bar dataKey="count" fill="#3b82f6" barSize={40} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expression">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expression Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockExpressionAnalysis.timeSeriesData}>
                      <XAxis dataKey="timepoint" />
                      <YAxis label={{ value: 'Expression Level (log2FC)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="SubtypeA" stroke="#ef4444" />
                      <Line type="monotone" dataKey="SubtypeB" stroke="#3b82f6" />
                      <Line type="monotone" dataKey="SubtypeC" stroke="#22c55e" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subtype Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockExpressionAnalysis.subtypeDistribution}>
                      <XAxis dataKey="subtype" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="upregulated" fill="#ef4444" stackId="a" />
                      <Bar dataKey="downregulated" fill="#3b82f6" stackId="a" />
                      <Bar dataKey="unchanged" fill="#9ca3af" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="druggability">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Druggability Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockDruggabilityData.druggabilityScores}>
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="high" fill="#16a34a" stackId="a" name="High Score" />
                      <Bar dataKey="medium" fill="#eab308" stackId="a" name="Medium Score" />
                      <Bar dataKey="low" fill="#d1d5db" stackId="a" name="Low Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Structural Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {mockDruggabilityData.structuralAnalysis.map((feature) => (
                    <Card key={feature.feature}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{feature.feature}</span>
                          <Badge variant="outline">{feature.percentage}%</Badge>
                        </div>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${feature.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {feature.count} genes
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeneInsightsDashboard;
