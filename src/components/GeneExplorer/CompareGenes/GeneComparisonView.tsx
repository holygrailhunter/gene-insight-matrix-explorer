import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Gene } from "../GeneHeatmap";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface GeneComparisonViewProps {
  availableGenes: Gene[];
  onClose: () => void;
}

const GeneComparisonView = ({ availableGenes = [], onClose }: GeneComparisonViewProps) => {
  const [selectedGeneIds, setSelectedGeneIds] = useState<string[]>([]);
  
  const selectedGenes = useMemo(() => {
    return availableGenes.filter(gene => selectedGeneIds.includes(gene.id));
  }, [availableGenes, selectedGeneIds]);

  const handleAddGene = (geneId: string) => {
    if (selectedGeneIds.length < 4 && !selectedGeneIds.includes(geneId)) {
      setSelectedGeneIds([...selectedGeneIds, geneId]);
    }
  };

  const handleRemoveGene = (geneId: string) => {
    setSelectedGeneIds(selectedGeneIds.filter(id => id !== geneId));
  };

  const radarData = useMemo(() => {
    const metrics = [
      { name: "Druggability", fullMark: 10 },
      { name: "Publications", fullMark: 10 },
      { name: "Clinical Trials", fullMark: 10 },
      { name: "Patents", fullMark: 10 },
      { name: "Expression", fullMark: 10 },
      { name: "Target Quality", fullMark: 10 },
    ];

    return metrics.map(metric => {
      const result: { [key: string]: any } = { name: metric.name };
      
      selectedGenes.forEach(gene => {
        switch (metric.name) {
          case "Druggability":
            result[gene.symbol] = gene.druggability;
            break;
          case "Publications":
            result[gene.symbol] = Math.min(gene.publications / 100, 10);
            break;
          case "Clinical Trials":
            result[gene.symbol] = Math.min(gene.clinicalStudies, 10);
            break;
          case "Patents":
            result[gene.symbol] = Math.min(gene.patents / 2, 10);
            break;
          case "Expression":
            const avgExpr = Object.values(gene.subtypeExpressions).reduce(
              (sum, expr) => sum + Math.abs(expr.value), 
              0
            ) / Object.keys(gene.subtypeExpressions).length;
            result[gene.symbol] = Math.min(avgExpr * 2, 10);
            break;
          case "Target Quality":
            result[gene.symbol] = 
              (gene.targetQuality.geneticAssociation + gene.targetQuality.safetyRisk) / 2;
            break;
          default:
            result[gene.symbol] = 0;
        }
      });
      
      return result;
    });
  }, [selectedGenes]);

  const generateColorForGene = (index: number) => {
    const colors = [
      "#3b82f6", // blue
      "#ef4444", // red
      "#8b5cf6", // purple
      "#10b981", // green
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gene Comparison Tool</h2>
          <p className="text-sm text-muted-foreground">Compare up to 4 genes side by side</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Close Comparison
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="font-medium text-sm">Selected genes:</div>
            
            {selectedGenes.map((gene, index) => (
              <Badge 
                key={gene.id} 
                variant="outline" 
                className="py-1 pl-3 border-2 flex items-center gap-1"
                style={{ borderColor: generateColorForGene(index) }}
              >
                {gene.symbol}
                <button 
                  onClick={() => handleRemoveGene(gene.id)}
                  className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            
            {selectedGenes.length === 0 && (
              <div className="text-sm text-muted-foreground italic">No genes selected</div>
            )}
            
            {selectedGenes.length < 4 && (
              <div className="flex-grow">
                <Select 
                  onValueChange={handleAddGene}
                  value=""
                >
                  <SelectTrigger className="w-[200px] border-dashed">
                    <div className="flex items-center text-muted-foreground">
                      <Plus className="h-3.5 w-3.5 mr-2" />
                      <span>Add gene</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {availableGenes
                      .filter(gene => !selectedGeneIds.includes(gene.id))
                      .slice(0, 20)
                      .map(gene => (
                        <SelectItem key={gene.id} value={gene.id}>
                          {gene.symbol} - {gene.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {selectedGenes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gene Comparison Radar</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pt-0">
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={150} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} />
                    
                    {selectedGenes.map((gene, index) => (
                      <Radar
                        key={gene.id}
                        name={gene.symbol}
                        dataKey={gene.symbol}
                        stroke={generateColorForGene(index)}
                        fill={generateColorForGene(index)}
                        fillOpacity={0.1}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Side-by-Side Comparison</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium py-2">Metric</th>
                    {selectedGenes.map((gene, index) => (
                      <th 
                        key={gene.id} 
                        className="text-left font-medium py-2"
                        style={{ color: generateColorForGene(index) }}
                      >
                        {gene.symbol}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">FDA Approved</td>
                    {selectedGenes.map(gene => (
                      <td key={gene.id} className="py-2">
                        {gene.fdaApproved ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Yes</Badge>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Clinical Studies</td>
                    {selectedGenes.map(gene => (
                      <td key={gene.id} className="py-2">
                        {gene.clinicalStudies || '—'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Patents</td>
                    {selectedGenes.map(gene => (
                      <td key={gene.id} className="py-2">
                        {gene.patents || '—'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Publications</td>
                    {selectedGenes.map(gene => (
                      <td key={gene.id} className="py-2">
                        {gene.publications || '—'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Druggability Score</td>
                    {selectedGenes.map(gene => (
                      <td key={gene.id} className="py-2">
                        {gene.druggability}/10
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2">Tractability</td>
                    {selectedGenes.map(gene => (
                      <td key={gene.id} className="py-2">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <div className="w-20">Small mol:</div>
                            <div>{gene.targetTractability.smallMolecule}/10</div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-20">Antibody:</div>
                            <div>{gene.targetTractability.antibody}/10</div>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-900/50">
          <p className="text-muted-foreground">Select genes from the dropdown above to compare them</p>
        </div>
      )}
    </div>
  );
};

export default GeneComparisonView;
