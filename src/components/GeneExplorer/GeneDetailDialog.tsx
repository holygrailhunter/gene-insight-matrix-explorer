
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gene } from "./GeneHeatmap";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GeneDetailDialogProps {
  gene: Gene;
  open: boolean;
  onClose: () => void;
  comparisons: string[];
}

const GeneDetailDialog = ({ gene, open, onClose, comparisons }: GeneDetailDialogProps) => {
  // Prepare data for the expression chart
  const expressionData = comparisons.map(comparison => {
    const expression = gene.subtypeExpressions[comparison] || { value: 0, pValue: 1 };
    return {
      name: comparison.replace('_vs_', ' vs '),
      value: expression.value,
      pValue: expression.pValue,
      significant: expression.pValue < 0.05
    };
  });

  // Prepare data for the druggability chart
  const druggabilityData = [
    { name: "Small Molecule", value: gene.targetTractability.smallMolecule },
    { name: "Antibody", value: gene.targetTractability.antibody },
    { name: "Other", value: gene.targetTractability.other }
  ];

  // Prepare data for the quality chart
  const qualityData = [
    { name: "Genetic Association", value: gene.targetQuality.geneticAssociation },
    { name: "Safety Risk", value: 10 - gene.targetQuality.safetyRisk }, // Invert so higher is riskier
  ];

  // For text badges based on druggability scores
  const getDruggabilityStatus = (score: number) => {
    if (score >= 8) return { label: "Highly Druggable", color: "bg-green-500" };
    if (score >= 5) return { label: "Moderately Druggable", color: "bg-yellow-500" };
    return { label: "Challenging Target", color: "bg-red-500" };
  };

  // Get color for expression bars
  const getExpressionColor = (value: number) => {
    return value >= 0 ? "#ef4444" : "#3b82f6"; // red for positive, blue for negative
  };
  
  // Get color for bars with significance
  const getSignificantColor = (entry: any) => {
    if (entry.value === 0) return "#9ca3af"; // gray
    return entry.value > 0 ? "#ef4444" : "#3b82f6"; // red for positive, blue for negative
  };
  
  // Get opacity for bars with significance
  const getSignificantOpacity = (entry: any) => {
    return entry.significant ? 1 : 0.5;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{gene.symbol}</DialogTitle>
              <p className="text-gray-500 mt-1">{gene.name}</p>
            </div>
            <div className="flex gap-2">
              {gene.fdaApproved && (
                <Badge className="bg-green-500">FDA Approved</Badge>
              )}
              {gene.clinicalStudies > 0 && (
                <Badge variant="outline" className="border-blue-500 text-blue-600">
                  {gene.clinicalStudies} Clinical {gene.clinicalStudies === 1 ? 'Study' : 'Studies'}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="expression" className="flex-1 flex flex-col mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="expression">Expression</TabsTrigger>
            <TabsTrigger value="tractability">Tractability</TabsTrigger>
            <TabsTrigger value="quality">Target Quality</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="expression" className="mt-4 p-4">
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Differential Expression Across Subtypes</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={expressionData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis label={{ value: 'Log2 Fold Change', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar 
                          dataKey="value"
                          fill={(entry) => getSignificantColor(entry)}
                          opacity={(entry) => getSignificantOpacity(entry)}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="flex gap-2 mt-4 text-xs text-gray-500 justify-center">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-sm opacity-100"></div>
                      <span>Significant Upregulation</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-sm opacity-50"></div>
                      <span>Non-significant Upregulation</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-sm opacity-100"></div>
                      <span>Significant Downregulation</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-sm opacity-50"></div>
                      <span>Non-significant Downregulation</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Patents</h4>
                    <p className="text-2xl font-bold">{gene.patents}</p>
                    <p className="text-sm text-gray-500 mt-1">Related patents filed</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Publications</h4>
                    <p className="text-2xl font-bold">{gene.publications}</p>
                    <p className="text-sm text-gray-500 mt-1">Research publications</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Clinical Relevance</h4>
                    <div className="flex gap-2 flex-wrap">
                      {gene.fdaApproved && <Badge className="bg-green-500">FDA Approved</Badge>}
                      {gene.clinicalStudies > 0 && (
                        <Badge variant="outline" className="border-blue-500 text-blue-600">
                          {gene.clinicalStudies} Clinical {gene.clinicalStudies === 1 ? 'Study' : 'Studies'}
                        </Badge>
                      )}
                      {!gene.fdaApproved && gene.clinicalStudies === 0 && (
                        <Badge variant="outline" className="border-gray-300 text-gray-500">
                          Pre-clinical
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tractability" className="mt-4 p-4">
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Target Tractability Assessment</h3>
                  <p className="text-sm text-gray-500 mb-4">Evaluation of how druggable this target is via different modalities</p>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={druggabilityData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 10]} label={{ value: 'Tractability Score (1-10)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-gray-500">Small Molecule</h4>
                      <div className="mt-2">
                        <span className="text-xl font-bold">{gene.targetTractability.smallMolecule}/10</span>
                        <Badge 
                          className={`ml-2 ${getDruggabilityStatus(gene.targetTractability.smallMolecule).color}`}
                        >
                          {getDruggabilityStatus(gene.targetTractability.smallMolecule).label}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-gray-500">Antibody</h4>
                      <div className="mt-2">
                        <span className="text-xl font-bold">{gene.targetTractability.antibody}/10</span>
                        <Badge 
                          className={`ml-2 ${getDruggabilityStatus(gene.targetTractability.antibody).color}`}
                        >
                          {getDruggabilityStatus(gene.targetTractability.antibody).label}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-gray-500">Other Modalities</h4>
                      <div className="mt-2">
                        <span className="text-xl font-bold">{gene.targetTractability.other}/10</span>
                        <Badge 
                          className={`ml-2 ${getDruggabilityStatus(gene.targetTractability.other).color}`}
                        >
                          {getDruggabilityStatus(gene.targetTractability.other).label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quality" className="mt-4 p-4">
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Target Quality Assessment</h3>
                  <p className="text-sm text-gray-500 mb-4">Evaluation of genetic evidence and safety profile</p>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={qualityData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-gray-500">Genetic Association</h4>
                      <div className="mt-2 flex items-center">
                        <span className="text-xl font-bold">{gene.targetQuality.geneticAssociation}/10</span>
                        <span className="ml-2 text-sm text-gray-500">
                          {gene.targetQuality.geneticAssociation >= 8 ? 'Strong evidence' : 
                           gene.targetQuality.geneticAssociation >= 5 ? 'Moderate evidence' : 'Limited evidence'}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Strength of genetic evidence linking this gene to disease
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-gray-500">Safety Profile</h4>
                      <div className="mt-2 flex items-center">
                        <span className="text-xl font-bold">{gene.targetQuality.safetyRisk}/10</span>
                        <Badge 
                          className={`ml-2 ${
                            gene.targetQuality.safetyRisk >= 8 ? "bg-green-500" : 
                            gene.targetQuality.safetyRisk >= 5 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                        >
                          {gene.targetQuality.safetyRisk >= 8 ? 'Favorable' : 
                           gene.targetQuality.safetyRisk >= 5 ? 'Moderate' : 'Concerning'}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Assessment of potential safety risks (higher is safer)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GeneDetailDialog;
