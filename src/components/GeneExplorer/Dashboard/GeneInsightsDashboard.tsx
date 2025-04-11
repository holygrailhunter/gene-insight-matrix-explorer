
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Pill, BookMarked, FlaskConical, FileText } from "lucide-react";

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
          <Card>
            <CardHeader>
              <CardTitle>Expression Analysis Across Subtypes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                This dashboard will show detailed expression analysis across different subtypes.
                Configure the visualization in the settings panel.
              </p>
              <div className="h-[300px] flex items-center justify-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">Additional expression visualizations to be implemented</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="druggability">
          <Card>
            <CardHeader>
              <CardTitle>Druggability Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Evaluate target druggability metrics and tractability scores across the gene dataset.
              </p>
              <div className="h-[300px] flex items-center justify-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">Additional druggability metrics to be implemented</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeneInsightsDashboard;
