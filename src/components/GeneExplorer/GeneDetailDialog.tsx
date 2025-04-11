
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Gene } from "./GeneHeatmap";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

interface GeneDetailDialogProps {
  gene: Gene;
  open: boolean;
  onClose: () => void;
  comparisons: string[];
}

const GeneDetailDialog = ({ gene, open, onClose, comparisons }: GeneDetailDialogProps) => {
  const chartData = comparisons.map(comparison => ({
    name: comparison.replace('_vs_', '\nvs\n'),
    value: gene.subtypeExpressions[comparison]?.value || 0,
    pValue: gene.subtypeExpressions[comparison]?.pValue || 1,
  }));

  const statusIndicator = (value: number, max: number = 10) => {
    if (value >= max * 0.8) return <CheckCircle className="text-green-500" />;
    if (value >= max * 0.5) return <AlertCircle className="text-amber-500" />;
    return <XCircle className="text-red-500" />;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {gene.symbol}
                {gene.fdaApproved && (
                  <Badge className="ml-2 bg-green-500">FDA Approved</Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-base">{gene.name}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="expression">Expression Data</TabsTrigger>
            <TabsTrigger value="details">Detailed Assessment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Key Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">FDA Status</h4>
                    {gene.fdaApproved ? (
                      <Badge className="bg-green-500">Approved</Badge>
                    ) : (
                      <Badge variant="outline">Not Approved</Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Clinical Studies</h4>
                    <span>{gene.clinicalStudies}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Publications</h4>
                    <span>{gene.publications}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Patents</h4>
                    <span>{gene.patents}</span>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Expression Profile</h4>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 5, left: -30, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip 
                          formatter={(value: number) => [`Log2FC: ${value.toFixed(2)}`, 'Expression']}
                        />
                        <Bar 
                          dataKey="value" 
                          fill={(entry) => entry.value > 0 ? '#ef4444' : '#3b82f6'}
                          shape={(props) => {
                            const { x, y, width, height, pValue } = props;
                            const opacity = props.pValue < 0.05 ? 1 : 0.5;
                            return (
                              <rect 
                                x={x} 
                                y={y} 
                                width={width} 
                                height={height} 
                                fill={props.fill} 
                                opacity={opacity}
                              />
                            );
                          }}
                        >
                          <LabelList 
                            dataKey="value" 
                            position="top" 
                            formatter={(value: number) => value.toFixed(1)} 
                            style={{ fontSize: '10px' }}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center items-center gap-6 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Upregulated</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Downregulated</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-gray-300 rounded opacity-50"></div>
                      <span>p &gt; 0.05</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="expression" className="space-y-4">
            <h3 className="text-lg font-medium">Expression Across Comparisons</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis label={{ value: 'Log2 Fold Change', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value: number) => [
                      `Log2FC: ${value.toFixed(2)}`,
                      'Expression'
                    ]}
                    labelFormatter={(label) => `Comparison: ${label.replace(/\n/g, ' ')}`}
                  />
                  <Bar 
                    dataKey="value" 
                    name="Log2 Fold Change"
                    fill={(entry) => {
                      const value = entry.value;
                      if (value === 0) return '#9ca3af';
                      return value > 0 ? '#ef4444' : '#3b82f6';
                    }}
                    opacity={(entry) => entry.pValue < 0.05 ? 1 : 0.5}
                  >
                    <LabelList 
                      dataKey="value" 
                      position="top" 
                      formatter={(value: number) => value.toFixed(2)}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Statistical Details</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comparison</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Log2FC</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P-Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Significance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comparisons.map((comparison) => {
                      const expression = gene.subtypeExpressions[comparison] || { value: 0, pValue: 1 };
                      const isPValueSignificant = expression.pValue < 0.05;
                      
                      return (
                        <tr key={comparison}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {comparison.replace('_vs_', ' vs ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {expression.value.toFixed(3)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {expression.pValue.toFixed(4)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {isPValueSignificant ? (
                              <Badge className="bg-green-500">Significant</Badge>
                            ) : (
                              <Badge variant="outline">Not Significant</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg border p-4 space-y-4">
                <h3 className="text-lg font-medium">Target Quality</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>Genetic Association</span>
                      <div className="text-gray-500 text-sm">(Strong evidence in literature)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusIndicator(gene.targetQuality.geneticAssociation)}
                      <span className="font-medium">{gene.targetQuality.geneticAssociation}/10</span>
                    </div>
                  </div>
                  <Progress value={gene.targetQuality.geneticAssociation * 10} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>Safety Assessment</span>
                      <div className="text-gray-500 text-sm">(Lower risk of side effects)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusIndicator(gene.targetQuality.safetyRisk)}
                      <span className="font-medium">{gene.targetQuality.safetyRisk}/10</span>
                    </div>
                  </div>
                  <Progress value={gene.targetQuality.safetyRisk * 10} className="h-2" />
                </div>
              </div>
              
              <div className="rounded-lg border p-4 space-y-4">
                <h3 className="text-lg font-medium">Target Tractability</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>Small Molecule</span>
                      <div className="text-gray-500 text-sm">(Likelihood of small molecule binding)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusIndicator(gene.targetTractability.smallMolecule)}
                      <span className="font-medium">{gene.targetTractability.smallMolecule}/10</span>
                    </div>
                  </div>
                  <Progress value={gene.targetTractability.smallMolecule * 10} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>Antibody</span>
                      <div className="text-gray-500 text-sm">(Antibody development potential)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusIndicator(gene.targetTractability.antibody)}
                      <span className="font-medium">{gene.targetTractability.antibody}/10</span>
                    </div>
                  </div>
                  <Progress value={gene.targetTractability.antibody * 10} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>Other Modalities</span>
                      <div className="text-gray-500 text-sm">(Antisense, PROTAC, etc.)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {statusIndicator(gene.targetTractability.other)}
                      <span className="font-medium">{gene.targetTractability.other}/10</span>
                    </div>
                  </div>
                  <Progress value={gene.targetTractability.other * 10} className="h-2" />
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-4">Research & Development Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Clinical Studies</h4>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500 w-24">Total:</span>
                    <Badge variant="outline" className="font-bold">{gene.clinicalStudies}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500 w-24">Phase 1:</span>
                    <Badge variant="outline">{Math.floor(gene.clinicalStudies * 0.4)}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-500 w-24">Phase 2:</span>
                    <Badge variant="outline">{Math.floor(gene.clinicalStudies * 0.3)}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 w-24">Phase 3+:</span>
                    <Badge variant="outline">{Math.floor(gene.clinicalStudies * 0.3)}</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Publications</h4>
                    <Badge variant="outline" className="font-bold">{gene.publications}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Patents</h4>
                    <Badge variant="outline" className="font-bold">{gene.patents}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Druggability Score</h4>
                    <Badge variant="outline" className="font-bold">{gene.druggability}/10</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Data last updated: April 11, 2025
          </div>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GeneDetailDialog;
