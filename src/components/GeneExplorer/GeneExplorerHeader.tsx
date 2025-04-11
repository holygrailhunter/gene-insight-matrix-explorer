
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Upload } from "lucide-react";
import WeightSliders, { Weights } from "./WeightSliders";

interface GeneExplorerHeaderProps {
  weights: Weights;
  onWeightsChange: (weights: Weights) => void;
}

const GeneExplorerHeader = ({ weights, onWeightsChange }: GeneExplorerHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gene Insight Matrix Explorer</h1>
          <p className="text-gray-500 text-sm mt-1">
            Analyze differential gene expression and target discovery metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            <span>Import Data</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export Results</span>
          </Button>
          <WeightSliders weights={weights} onWeightsChange={onWeightsChange} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex gap-2">
          <Input 
            placeholder="Search genes..." 
            className="w-full"
            icon={<Search className="h-4 w-4 opacity-50" />} 
          />
        </div>
        
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger>
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
            <SelectTrigger>
              <SelectValue placeholder="Expression threshold" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Expression Levels</SelectItem>
              <SelectItem value="high">High Expression (Log2FC > 1)</SelectItem>
              <SelectItem value="low">Low Expression (Log2FC < -1)</SelectItem>
              <SelectItem value="significant">Significant Only (p < 0.05)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Select defaultValue="score">
            <SelectTrigger>
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
      
      <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          <span>Upregulated</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <span>Downregulated</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
          <span>No Change</span>
        </div>
        <div className="ml-4 opacity-70">|</div>
        <div className="opacity-70">Click on any gene to view detailed information</div>
      </div>
    </div>
  );
};

export default GeneExplorerHeader;
