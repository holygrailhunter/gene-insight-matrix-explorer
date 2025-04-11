import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Info, ChevronUp, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GeneDetailDialog from "./GeneDetailDialog";
import { generateMockGeneData } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useFavoriteGenes } from "./Favorites/FavoriteGenesContext";
import { toast } from "sonner";

export interface Gene {
  id: string;
  symbol: string;
  name: string;
  fdaApproved: boolean;
  clinicalStudies: number;
  patents: number;
  publications: number;
  druggability: number; // 1-10 scale
  subtypeExpressions: Record<string, { value: number; pValue: number }>;
  targetTractability: {
    smallMolecule: number; // 1-10 scale
    antibody: number; // 1-10 scale
    other: number; // 1-10 scale
  };
  targetQuality: {
    geneticAssociation: number; // 1-10 scale
    safetyRisk: number; // 1-10 scale, higher is safer
  };
}

interface GeneHeatmapProps {
  weights: {
    fdaApproved: number;
    clinicalStudies: number;
    patents: number;
    publications: number;
    druggability: number;
    expression: number;
  };
  onCompareGenes?: () => void;
}

const GeneHeatmap = ({ weights, onCompareGenes }: GeneHeatmapProps) => {
  const [genes, setGenes] = useState<Gene[]>([]);
  const [selectedGene, setSelectedGene] = useState<Gene | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteGenes();

  const comparisons = [
    "SubtypeA_vs_Control",
    "SubtypeB_vs_Control",
    "SubtypeC_vs_Control",
    "SubtypeA_vs_SubtypeB",
    "SubtypeB_vs_SubtypeC"
  ];

  useEffect(() => {
    // Simulate API call to get gene data
    setIsLoading(true);
    const mockData = generateMockGeneData(50, comparisons);
    
    setTimeout(() => {
      setGenes(mockData);
      setIsLoading(false);
    }, 800);
  }, []);

  const calculateScore = (gene: Gene) => {
    return (
      (gene.fdaApproved ? 1 : 0) * weights.fdaApproved +
      gene.clinicalStudies * weights.clinicalStudies * 0.2 +
      gene.patents * weights.patents * 0.1 +
      gene.publications * weights.publications * 0.01 +
      gene.druggability * weights.druggability * 0.1 +
      Object.values(gene.subtypeExpressions).reduce(
        (sum, expr) => sum + Math.abs(expr.value), 0
      ) * weights.expression * 0.05
    ).toFixed(1);
  };

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });

    const sortedGenes = [...genes].sort((a, b) => {
      let aValue: any, bValue: any;
      
      if (key === 'score') {
        aValue = parseFloat(calculateScore(a));
        bValue = parseFloat(calculateScore(b));
      } else if (key.startsWith('expression_')) {
        const comparisonKey = key.replace('expression_', '');
        aValue = a.subtypeExpressions[comparisonKey]?.value || 0;
        bValue = b.subtypeExpressions[comparisonKey]?.value || 0;
      } else {
        aValue = a[key as keyof Gene];
        bValue = b[key as keyof Gene];
        
        if (typeof aValue === 'boolean') {
          aValue = aValue ? 1 : 0;
          bValue = bValue as boolean ? 1 : 0;
        }
      }

      if (direction === 'ascending') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setGenes(sortedGenes);
  };

  const handleGeneClick = (gene: Gene) => {
    setSelectedGene(gene);
    setIsDialogOpen(true);
  };

  const handleToggleFavorite = (event: React.MouseEvent, gene: Gene) => {
    event.stopPropagation();
    
    if (isFavorite(gene.id)) {
      removeFavorite(gene.id);
      toast.info(`${gene.symbol} removed from favorites`);
    } else {
      addFavorite(gene);
      toast.success(`${gene.symbol} added to favorites`);
    }
  };

  const getExpressionClass = (value: number) => {
    const absValue = Math.abs(value);
    
    if (absValue < 0.5) return 'bg-gray-100';
    if (value > 0) {
      if (absValue > 2) return 'bg-red-700 text-white';
      if (absValue > 1.5) return 'bg-red-500 text-white';
      if (absValue > 1) return 'bg-red-300';
      return 'bg-red-100';
    } else {
      if (absValue > 2) return 'bg-blue-700 text-white';
      if (absValue > 1.5) return 'bg-blue-500 text-white';
      if (absValue > 1) return 'bg-blue-300';
      return 'bg-blue-100';
    }
  };
  
  const renderSortIcon = (key: string) => {
    if (sortConfig?.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 inline" />;
    }
    
    return sortConfig.direction === 'ascending' 
      ? <ChevronUp className="ml-2 h-4 w-4 inline" />
      : <ChevronDown className="ml-2 h-4 w-4 inline" />;
  };

  return (
    <div className="w-full overflow-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <Table className="min-w-max">
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead 
                className="bg-white cursor-pointer hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900" 
                onClick={() => handleSort('symbol')}
              >
                Gene {renderSortIcon('symbol')}
              </TableHead>
              
              {comparisons.map((comparison) => (
                <TableHead 
                  key={comparison} 
                  className="bg-white cursor-pointer hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900"
                  onClick={() => handleSort(`expression_${comparison}`)}
                >
                  <div className="whitespace-nowrap">
                    {comparison.replace('_vs_', ' vs ')} {renderSortIcon(`expression_${comparison}`)}
                  </div>
                </TableHead>
              ))}
              
              <TableHead 
                className="bg-white cursor-pointer hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900"
                onClick={() => handleSort('fdaApproved')}
              >
                FDA {renderSortIcon('fdaApproved')}
              </TableHead>
              
              <TableHead 
                className="bg-white cursor-pointer hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900" 
                onClick={() => handleSort('clinicalStudies')}
              >
                Clinical Studies {renderSortIcon('clinicalStudies')}
              </TableHead>
              
              <TableHead 
                className="bg-white cursor-pointer hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900"
                onClick={() => handleSort('druggability')}
              >
                Druggability {renderSortIcon('druggability')}
              </TableHead>
              
              <TableHead 
                className="bg-white cursor-pointer hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900"
                onClick={() => handleSort('score')}
              >
                Score {renderSortIcon('score')}
              </TableHead>

              <TableHead className="bg-white dark:bg-gray-950 w-10">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {genes.map((gene) => (
              <TableRow 
                key={gene.id}
                className="hover:bg-blue-50/30 dark:hover:bg-blue-950/30 cursor-pointer"
                onClick={() => handleGeneClick(gene)}
              >
                <TableCell className="font-medium whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span>{gene.symbol}</span>
                    <Info className="w-4 h-4 text-blue-500" />
                  </div>
                </TableCell>
                
                {comparisons.map((comparison) => {
                  const expression = gene.subtypeExpressions[comparison] || { value: 0, pValue: 1 };
                  const expressionValue = expression.value;
                  const isPValueSignificant = expression.pValue < 0.05;
                  
                  return (
                    <TableCell 
                      key={comparison}
                      className={cn(
                        "text-center transition-colors",
                        getExpressionClass(expressionValue),
                        !isPValueSignificant && "opacity-60"
                      )}
                    >
                      {expressionValue.toFixed(2)}
                    </TableCell>
                  );
                })}
                
                <TableCell className="text-center">
                  {gene.fdaApproved ? (
                    <Badge className="bg-green-500">Yes</Badge>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </TableCell>
                
                <TableCell className="text-center">
                  {gene.clinicalStudies > 0 ? (
                    <Badge variant={gene.clinicalStudies > 5 ? "default" : "secondary"}>
                      {gene.clinicalStudies}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <div className="w-full max-w-[60px] bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${gene.druggability * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="font-medium">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "border-2",
                      parseFloat(calculateScore(gene)) > 10 ? "border-green-500" :
                      parseFloat(calculateScore(gene)) > 5 ? "border-blue-500" : 
                      "border-gray-300"
                    )}
                  >
                    {calculateScore(gene)}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => handleToggleFavorite(e, gene)}
                  >
                    <Star 
                      className={cn(
                        "h-4 w-4", 
                        isFavorite(gene.id) 
                          ? "fill-amber-400 text-amber-400" 
                          : "text-gray-400 hover:text-amber-400"
                      )} 
                    />
                    <span className="sr-only">
                      {isFavorite(gene.id) ? "Remove from favorites" : "Add to favorites"}
                    </span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {selectedGene && (
        <GeneDetailDialog 
          gene={selectedGene} 
          open={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)}
          comparisons={comparisons}
        />
      )}
    </div>
  );
};

export default GeneHeatmap;
