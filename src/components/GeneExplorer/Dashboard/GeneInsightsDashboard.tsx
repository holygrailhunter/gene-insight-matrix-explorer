
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, ScatterChart, Scatter, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from "recharts";
import { 
  Pill, BookMarked, FlaskConical, FileText, ChartBar, 
  ChartPie, Database, ChartLine, Microscope 
} from "lucide-react";  // Removed 'Molecule'
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

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
  ],
  tissueSpecificExpression: [
    { tissue: "Brain", expression: 8.7, significance: 0.01 },
    { tissue: "Liver", expression: 6.2, significance: 0.04 },
    { tissue: "Kidney", expression: 4.5, significance: 0.07 },
    { tissue: "Heart", expression: 2.1, significance: 0.25 },
    { tissue: "Lung", expression: 7.3, significance: 0.02 },
    { tissue: "Muscle", expression: 1.8, significance: 0.31 },
    { tissue: "Blood", expression: 5.9, significance: 0.05 }
  ],
  coexpressionNetwork: [
    { genePair: "BRCA1-TP53", correlation: 0.85, pValue: 0.001 },
    { genePair: "KRAS-EGFR", correlation: -0.62, pValue: 0.007 },
    { genePair: "HER2-PTEN", correlation: -0.55, pValue: 0.01 },
    { genePair: "MYC-CDK4", correlation: 0.75, pValue: 0.003 },
    { genePair: "AKT1-PIK3CA", correlation: 0.68, pValue: 0.005 }
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
  ],
  bindingSiteQuality: [
    { id: "Binding Pockets", pocket: 8, drugability: 7, conservation: 5, rigidity: 6 },
    { id: "Active Sites", pocket: 7, drugability: 9, conservation: 8, rigidity: 7 },
    { id: "Allosteric Sites", pocket: 6, drugability: 8, conservation: 4, rigidity: 5 },
    { id: "Protein-Protein", pocket: 5, drugability: 5, conservation: 7, rigidity: 3 },
    { id: "Cryptic Sites", pocket: 6, drugability: 6, conservation: 6, rigidity: 4 }
  ],
  predictionAccuracy: [
    { method: "ML-Based", accuracy: 78, recall: 76, precision: 81, f1Score: 79 },
    { method: "Structure-Based", accuracy: 82, recall: 79, precision: 85, f1Score: 82 },
    { method: "Homology", accuracy: 71, recall: 68, precision: 73, f1Score: 70 },
    { method: "Ensemble", accuracy: 86, recall: 84, precision: 89, f1Score: 87 }
  ]
};

const mockPathwayData = {
  enrichedPathways: [
    { pathway: "MAPK Signaling", geneCount: 42, pValue: 0.0003, enrichmentScore: 3.7 },
    { pathway: "PI3K-Akt", geneCount: 39, pValue: 0.0005, enrichmentScore: 3.4 },
    { pathway: "Apoptosis", geneCount: 31, pValue: 0.001, enrichmentScore: 3.1 },
    { pathway: "Cell Cycle", geneCount: 28, pValue: 0.002, enrichmentScore: 2.9 },
    { pathway: "JAK-STAT", geneCount: 25, pValue: 0.004, enrichmentScore: 2.6 }
  ],
  geneSetOverlap: [
    { set: "Oncogenes", overlap: 78, uniqueA: 45, uniqueB: 32 },
    { set: "Tumor Suppressors", overlap: 56, uniqueA: 34, uniqueB: 41 },
    { set: "Drug Targets", overlap: 93, uniqueA: 57, uniqueB: 28 },
    { set: "Disease Genes", overlap: 112, uniqueA: 86, uniqueB: 67 }
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
  const [dashboardTab, setDashboardTab] = useState("overview");
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Gene Insights Dashboard
        </h2>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <ChartLine className="h-4 w-4" />
            <span>Export Reports</span>
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Database className="h-4 w-4" />
            <span>Data Sources</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={dashboardTab} onValueChange={setDashboardTab} className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6 inline-flex w-auto">
          <TabsTrigger value="overview" className="rounded-md text-sm">
            <ChartBar className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="expression" className="rounded-md text-sm">
            <ChartLine className="h-4 w-4 mr-2" />
            Expression Analysis
          </TabsTrigger>
          <TabsTrigger value="druggability" className="rounded-md text-sm">
            <Microscope className="h-4 w-4 mr-2" />
            Druggability
          </TabsTrigger>
          <TabsTrigger value="pathways" className="rounded-md text-sm">
            <Microscope className="h-4 w-4 mr-2" />
            Pathways
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-all border-l-4 border-l-blue-500">
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

            <Card className="hover:shadow-md transition-all border-l-4 border-l-green-500">
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

            <Card className="hover:shadow-md transition-all border-l-4 border-l-purple-500">
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

            <Card className="hover:shadow-md transition-all border-l-4 border-l-orange-500">
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
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ChartPie className="h-5 w-5 mr-2 text-blue-500" />
                  Expression Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.expressionDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
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
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ChartBar className="h-5 w-5 mr-2 text-blue-500" />
                  Top Genes by Publications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.topPublications}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="gene" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} publications`]} />
                      <Bar dataKey="count" fill="#3b82f6" barSize={40} radius={[4, 4, 0, 0]}>
                        {data.topPublications.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-md p-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ChartLine className="h-5 w-5 mr-2 text-blue-500" />
                Target Discovery Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { month: 'Jan', identified: 120, validated: 85, inDevelopment: 35 },
                      { month: 'Feb', identified: 132, validated: 91, inDevelopment: 41 },
                      { month: 'Mar', identified: 145, validated: 98, inDevelopment: 43 },
                      { month: 'Apr', identified: 165, validated: 110, inDevelopment: 45 },
                      { month: 'May', identified: 178, validated: 118, inDevelopment: 48 },
                      { month: 'Jun', identified: 196, validated: 125, inDevelopment: 52 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorIdentified" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.15}/>
                      </linearGradient>
                      <linearGradient id="colorValidated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.15}/>
                      </linearGradient>
                      <linearGradient id="colorDevelopment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffc658" stopOpacity={0.15}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="identified" stroke="#8884d8" fillOpacity={1} fill="url(#colorIdentified)" />
                    <Area type="monotone" dataKey="validated" stroke="#82ca9d" fillOpacity={1} fill="url(#colorValidated)" />
                    <Area type="monotone" dataKey="inDevelopment" stroke="#ffc658" fillOpacity={1} fill="url(#colorDevelopment)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expression" className="space-y-6 mt-0">
          <div className="grid gap-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartLine className="h-5 w-5 mr-2 text-blue-500" />
                  Time Series Expression Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockExpressionAnalysis.timeSeriesData}>
                      <XAxis dataKey="timepoint" />
                      <YAxis label={{ value: 'Expression Level (log2FC)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }} />
                      <Legend />
                      <Line type="monotone" dataKey="SubtypeA" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="SubtypeB" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="SubtypeC" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <ChartBar className="h-5 w-5 mr-2 text-blue-500" />
                    Subtype Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockExpressionAnalysis.subtypeDistribution}>
                        <XAxis dataKey="subtype" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }} />
                        <Legend />
                        <Bar dataKey="upregulated" fill="#ef4444" stackId="a" name="Upregulated" />
                        <Bar dataKey="downregulated" fill="#3b82f6" stackId="a" name="Downregulated" />
                        <Bar dataKey="unchanged" fill="#9ca3af" stackId="a" name="Unchanged" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Microscope className="h-5 w-5 mr-2 text-blue-500" />
                    Tissue-Specific Expression
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <XAxis type="category" dataKey="tissue" name="Tissue" />
                        <YAxis type="number" dataKey="expression" name="Expression Level" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }} />
                        <Scatter
                          data={mockExpressionAnalysis.tissueSpecificExpression}
                          fill="#8884d8"
                          shape={(props: any) => {
                            const { cx, cy } = props;
                            const significance = props.payload.significance;
                            const size = significance < 0.05 ? 10 : 6;
                            const fill = significance < 0.05 ? "#ef4444" : "#9ca3af";
                            return <circle cx={cx} cy={cy} r={size} fill={fill} />;
                          }}
                        />
                        <Legend content={() => (
                          <div className="flex justify-center mt-4 text-sm">
                            <div className="flex items-center mr-6">
                              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                              <span>Significant (p &lt; 0.05)</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                              <span>Not Significant</span>
                            </div>
                          </div>
                        )} />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChartBar className="h-5 w-5 mr-2 text-blue-500" />
                  Co-expression Network Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockExpressionAnalysis.coexpressionNetwork}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <XAxis type="number" domain={[-1, 1]} />
                      <YAxis dataKey="genePair" type="category" width={80} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }} />
                      <Bar dataKey="correlation" name="Correlation">
                        {mockExpressionAnalysis.coexpressionNetwork.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.correlation > 0 ? '#16a34a' : '#ef4444'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                  Pearson correlation coefficients between frequently co-expressed genes. Significant correlations (p &lt; 0.05) are shown.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="druggability" className="space-y-6 mt-0">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <ChartBar className="h-5 w-5 mr-2 text-blue-500" />
                    Druggability Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockDruggabilityData.druggabilityScores}>
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }} />
                        <Legend />
                        <Bar dataKey="high" fill="#16a34a" stackId="a" name="High Score" />
                        <Bar dataKey="medium" fill="#eab308" stackId="a" name="Medium Score" />
                        <Bar dataKey="low" fill="#d1d5db" stackId="a" name="Low Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Microscope className="h-5 w-5 mr-2 text-blue-500" />
                    Binding Site Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={mockDruggabilityData.bindingSiteQuality}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="id" />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} />
                        <Radar name="Pocket Size" dataKey="pocket" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                        <Radar name="Druggability" dataKey="drugability" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
                        <Radar name="Conservation" dataKey="conservation" stroke="#ffc658" fill="#ffc658" fillOpacity={0.2} />
                        <Radar name="Rigidity" dataKey="rigidity" stroke="#ff8042" fill="#ff8042" fillOpacity={0.2} />
                        <Legend />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FlaskConical className="h-5 w-5 mr-2 text-blue-500" />
                    Structural Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {mockDruggabilityData.structuralAnalysis.map((feature) => (
                      <Card key={feature.feature} className="bg-gray-50 dark:bg-gray-800 border-none">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{feature.feature}</span>
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30">
                              {feature.percentage}%
                            </Badge>
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
              
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <ChartBar className="h-5 w-5 mr-2 text-blue-500" />
                    Prediction Method Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockDruggabilityData.predictionAccuracy}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="method" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }} />
                        <Legend />
                        <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy" />
                        <Bar dataKey="recall" fill="#ef4444" name="Recall" />
                        <Bar dataKey="precision" fill="#16a34a" name="Precision" />
                        <Bar dataKey="f1Score" fill="#eab308" name="F1 Score" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="pathways" className="space-y-6 mt-0">
          <div className="grid gap-6">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Microscope className="h-5 w-5 mr-2 text-blue-500" />
                  Enriched Pathways
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={mockPathwayData.enrichedPathways}
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <XAxis type="number" domain={[0, 4]} />
                      <YAxis dataKey="pathway" type="category" width={90} />
                      <Tooltip 
                        formatter={(value, name) => [
                          `${value}${name === 'pValue' ? '' : ' genes'}`,
                          name === 'pValue' ? 'p-value' : name === 'geneCount' ? 'Gene Count' : 'Enrichment Score'
                        ]}
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }}
                      />
                      <Legend />
                      <Bar dataKey="enrichmentScore" fill="#3b82f6" name="Enrichment Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <ChartBar className="h-5 w-5 mr-2 text-blue-500" />
                    Gene Set Overlap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockPathwayData.geneSetOverlap}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="set" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }} />
                        <Legend />
                        <Bar dataKey="overlap" stackId="a" fill="#3b82f6" name="Overlapping Genes" />
                        <Bar dataKey="uniqueA" stackId="a" fill="#ef4444" name="Unique to Set A" />
                        <Bar dataKey="uniqueB" stackId="a" fill="#16a34a" name="Unique to Set B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FlaskConical className="h-5 w-5 mr-2 text-blue-500" />
                    Pathway Significance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <XAxis type="number" dataKey="geneCount" name="Gene Count" />
                        <YAxis 
                          type="number" 
                          dataKey="pValue" 
                          name="p-value" 
                          scale="log" 
                          domain={[0.0001, 0.01]} 
                          tickFormatter={(value) => value.toExponential(0)}
                        />
                        <Tooltip 
                          formatter={(value, name, props) => {
                            if (name === 'pValue') {
                              return [`${value.toExponential(4)}`, 'p-value'];
                            }
                            return [value, name];
                          }}
                          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }}
                        />
                        <Scatter 
                          name="Pathways" 
                          data={mockPathwayData.enrichedPathways} 
                          fill="#8884d8"
                        >
                          {mockPathwayData.enrichedPathways.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.pValue < 0.001 ? '#ef4444' : entry.pValue < 0.01 ? '#eab308' : '#3b82f6'} 
                            />
                          ))}
                        </Scatter>
                        <Legend />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeneInsightsDashboard;
