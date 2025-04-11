
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Upload, SlidersHorizontal } from "lucide-react";
import WeightSliders, { Weights } from "./WeightSliders";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface GeneExplorerHeaderProps {
  weights: Weights;
  onWeightsChange: (weights: Weights) => void;
}

const GeneExplorerHeader = ({ weights, onWeightsChange }: GeneExplorerHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
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
        </div>
      </div>
      
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
