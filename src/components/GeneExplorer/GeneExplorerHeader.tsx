
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Upload, SlidersHorizontal, FileText, Database, Filter, ChartBar } from "lucide-react";
import WeightSliders, { Weights } from "./WeightSliders";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GeneExplorerHeaderProps {
  weights: Weights;
  onWeightsChange: (weights: Weights) => void;
}

const GeneExplorerHeader = ({ weights, onWeightsChange }: GeneExplorerHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-950/30 dark:via-cyan-950/30 dark:to-blue-950/30 p-6 rounded-xl shadow-sm border border-blue-100/50 dark:border-blue-800/20">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800">v2.5</Badge>
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">PRO</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mt-2">
            Gene Insight Matrix Explorer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 max-w-md">
            Analyze differential gene expression and target discovery metrics with advanced visualization tools
          </p>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Weights</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-blue-700 dark:text-blue-400">
                  Adjust Target Discovery Weights
                </h4>
                <WeightSliders weights={weights} onWeightsChange={onWeightsChange} />
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" className="gap-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30">
            <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Import</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30">
            <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Export</span>
          </Button>
          <Button variant="default" size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
            <FileText className="h-4 w-4" />
            <span>Reports</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <TabsTrigger value="basic">Basic Filters</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex gap-2">
              <div className="relative w-full">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input 
                  placeholder="Search genes..." 
                  className="w-full pl-9 border-blue-100 dark:border-blue-800 focus-visible:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-full border-blue-100 dark:border-blue-800 focus:ring-blue-500">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genes</SelectItem>
                  <SelectItem value="fda">FDA Approved</SelectItem>
                  <SelectItem value="clinical">In Clinical Studies</SelectItem>
                  <SelectItem value="significant">Significant Expression</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-full border-blue-100 dark:border-blue-800 focus:ring-blue-500">
                  <SelectValue placeholder="Expression threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expression Levels</SelectItem>
                  <SelectItem value="high">High Expression (Log2FC &gt; 1)</SelectItem>
                  <SelectItem value="low">Low Expression (Log2FC &lt; -1)</SelectItem>
                  <SelectItem value="significant">Significant Only (p &lt; 0.05)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Select defaultValue="score">
                <SelectTrigger className="w-full border-blue-100 dark:border-blue-800 focus:ring-blue-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Overall Score</SelectItem>
                  <SelectItem value="expression">Expression Level</SelectItem>
                  <SelectItem value="fda">FDA Status</SelectItem>
                  <SelectItem value="clinical">Clinical Studies</SelectItem>
                  <SelectItem value="druggability">Druggability</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-0">
          <Card className="border-blue-100 dark:border-blue-900">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Database className="h-4 w-4 mr-1 text-blue-600" />
                    Data Source Filters
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="source-1" className="rounded border-gray-300" />
                      <label htmlFor="source-1">TCGA Dataset</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="source-2" className="rounded border-gray-300" />
                      <label htmlFor="source-2">GTEx Dataset</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="source-3" className="rounded border-gray-300" />
                      <label htmlFor="source-3">DrugBank</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="source-4" className="rounded border-gray-300" />
                      <label htmlFor="source-4">Clinical Trials DB</label>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Filter className="h-4 w-4 mr-1 text-blue-600" />
                    Expression Filters
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <label htmlFor="log2fc-min" className="block mb-1">Min Log2FC</label>
                      <Input type="number" id="log2fc-min" defaultValue="-2" step="0.1" className="h-8" />
                    </div>
                    <div>
                      <label htmlFor="log2fc-max" className="block mb-1">Max Log2FC</label>
                      <Input type="number" id="log2fc-max" defaultValue="2" step="0.1" className="h-8" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <ChartBar className="h-4 w-4 mr-1 text-blue-600" />
                    Statistical Thresholds
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <label htmlFor="p-value" className="block mb-1">Max P-Value</label>
                      <Input type="number" id="p-value" defaultValue="0.05" step="0.01" className="h-8" />
                    </div>
                    <div>
                      <label htmlFor="fdr" className="block mb-1">Max FDR</label>
                      <Input type="number" id="fdr" defaultValue="0.1" step="0.01" className="h-8" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button size="sm" variant="default" className="bg-blue-600">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex flex-wrap gap-4 items-center text-xs py-3 px-5 rounded-lg bg-gray-50 dark:bg-gray-900/50 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-700 dark:text-gray-300">Upregulated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-700 dark:text-gray-300">Downregulated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
          <span className="text-gray-700 dark:text-gray-300">No Change</span>
        </div>
        <div className="ml-2 text-gray-300 dark:text-gray-600">|</div>
        <div className="text-gray-600 dark:text-gray-400 italic">Click on any gene to view detailed information</div>
      </div>
    </div>
  );
};

export default GeneExplorerHeader;
