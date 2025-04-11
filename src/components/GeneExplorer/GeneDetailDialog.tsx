import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Gene } from "./GeneHeatmap";
import { useFavoriteGenes } from "./Favorites/FavoriteGenesContext";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GeneDetailDialogProps {
  gene: Gene;
  open: boolean;
  onClose: () => void;
  comparisons: string[];
}

const GeneDetailDialog = ({ gene, open, onClose, comparisons }: GeneDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteGenes();
  
  const handleToggleFavorite = () => {
    if (isFavorite(gene.id)) {
      removeFavorite(gene.id);
    } else {
      addFavorite(gene);
    }
  };

  const renderExpressionChart = () => {
    const chartData = comparisons.map(comparison => {
      const expr = gene.subtypeExpressions[comparison] || { value: 0, pValue: 1 };
      return {
        name: comparison.replace('_vs_', ' vs '),
        value: expr.value,
        significant: expr.pValue < 0.05,
      };
    });

    const getBarColor = (entry: any) => {
      if (entry.value > 0) return "#ef4444"; // red
      if (entry.value < 0) return "#3b82f6"; // blue
      return "#9ca3af"; // gray
    };

    const getBarOpacity = (entry: any) => {
      return entry.significant ? 1 : 0.5;
    };

    return (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
          <YAxis label={{ value: 'Log2 FC', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(value: any) => [`${value.toFixed(2)} Log2 FC`]}
            labelFormatter={(label: any) => `${label}`}
          />
          <Bar 
            dataKey="value" 
            fill="#8884d8" 
            fillOpacity={0.8}
            strokeWidth={1}
            stroke="#000"
            // Custom fill based on value
            isAnimationActive={true}
          >
            {chartData.map((entry, index) => (
              <rect
                key={`rect-${index}`}
                fill={getBarColor(entry)}
                fillOpacity={getBarOpacity(entry)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                {gene.symbol}
                <Badge variant="outline" className="ml-2 text-xs">
                  {gene.fdaApproved ? "FDA Approved" : "Not FDA Approved"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 ml-2"
                  onClick={handleToggleFavorite}
                >
                  <Star 
                    className={cn(
                      "h-5 w-5", 
                      isFavorite(gene.id) 
                        ? "fill-amber-400 text-amber-400" 
                        : "text-gray-400 hover:text-amber-400"
                    )} 
                  />
                  <span className="sr-only">
                    {isFavorite(gene.id) ? "Remove from favorites" : "Add to favorites"}
                  </span>
                </Button>
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                {gene.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expression">Expression</TabsTrigger>
            <TabsTrigger value="druggability">Druggability</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Clinical Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">FDA Approved:</span>
                      <span className="font-medium">
                        {gene.fdaApproved ? (
                          <Badge variant="default" className="bg-green-500">Yes</Badge>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Clinical Studies:</span>
                      <span className="font-medium">{gene.clinicalStudies}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Patents:</span>
                      <span className="font-medium">{gene.patents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Publications:</span>
                      <span className="font-medium">{gene.publications}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Druggability Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Overall Score:</span>
                      <span className="font-medium">{gene.druggability}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Small Molecule:</span>
                      <span className="font-medium">{gene.targetTractability.smallMolecule}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Antibody:</span>
                      <span className="font-medium">{gene.targetTractability.antibody}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Other Modalities:</span>
                      <span className="font-medium">{gene.targetTractability.other}/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Target Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Genetic Association:</span>
                      <span className="font-medium">{gene.targetQuality.geneticAssociation}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Safety Risk:</span>
                      <span className="font-medium">{gene.targetQuality.safetyRisk}/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expression Summary</CardTitle>
                <CardDescription>
                  Log2 fold change across different comparisons
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderExpressionChart()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expression" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expression Details</CardTitle>
                <CardDescription>
                  Detailed expression values across all comparisons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Comparison</th>
                        <th className="text-left py-2">Log2 FC</th>
                        <th className="text-left py-2">p-value</th>
                        <th className="text-left py-2">Significance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisons.map(comparison => {
                        const expr = gene.subtypeExpressions[comparison] || { value: 0, pValue: 1 };
                        const isSignificant = expr.pValue < 0.05;
                        
                        return (
                          <tr key={comparison} className="border-b">
                            <td className="py-2">{comparison.replace('_vs_', ' vs ')}</td>
                            <td className="py-2">
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "font-mono",
                                  expr.value > 0 ? "border-red-500 bg-red-50" : 
                                  expr.value < 0 ? "border-blue-500 bg-blue-50" : 
                                  "border-gray-200 bg-gray-50"
                                )}
                              >
                                {expr.value.toFixed(3)}
                              </Badge>
                            </td>
                            <td className="py-2 font-mono">{expr.pValue.toExponential(2)}</td>
                            <td className="py-2">
                              {isSignificant ? (
                                <Badge variant="default" className="bg-green-500">Significant</Badge>
                              ) : (
                                <span className="text-gray-500">Not significant</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="druggability" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Druggability Assessment</CardTitle>
                <CardDescription>
                  Detailed druggability and tractability metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Target Tractability</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Small Molecule Tractability</span>
                          <span className="text-sm font-medium">{gene.targetTractability.smallMolecule}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${gene.targetTractability.smallMolecule * 10}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Antibody Tractability</span>
                          <span className="text-sm font-medium">{gene.targetTractability.antibody}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full" 
                            style={{ width: `${gene.targetTractability.antibody * 10}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Other Modalities</span>
                          <span className="text-sm font-medium">{gene.targetTractability.other}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: `${gene.targetTractability.other * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Target Quality Assessment</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Genetic Association</span>
                          <span className="text-sm font-medium">{gene.targetQuality.geneticAssociation}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-amber-600 h-2.5 rounded-full" 
                            style={{ width: `${gene.targetQuality.geneticAssociation * 10}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Safety Risk (higher is safer)</span>
                          <span className="text-sm font-medium">{gene.targetQuality.safetyRisk}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              gene.targetQuality.safetyRisk > 7 ? "bg-green-600" :
                              gene.targetQuality.safetyRisk > 4 ? "bg-amber-500" :
                              "bg-red-600"
                            }`}
                            style={{ width: `${gene.targetQuality.safetyRisk * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GeneDetailDialog;
