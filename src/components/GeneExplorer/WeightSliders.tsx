
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings } from "lucide-react";

export interface Weights {
  fdaApproved: number;
  clinicalStudies: number;
  patents: number;
  publications: number;
  druggability: number;
  expression: number;
}

interface WeightSlidersProps {
  weights: Weights;
  onWeightsChange: (weights: Weights) => void;
}

const WeightSliders = ({ weights, onWeightsChange }: WeightSlidersProps) => {
  const [localWeights, setLocalWeights] = useState<Weights>(weights);
  
  const handleWeightChange = (key: keyof Weights, value: number[]) => {
    const newWeights = { ...localWeights, [key]: value[0] };
    setLocalWeights(newWeights);
  };
  
  const handleApply = () => {
    onWeightsChange(localWeights);
  };
  
  const handleReset = () => {
    const defaultWeights = {
      fdaApproved: 10,
      clinicalStudies: 8,
      patents: 6,
      publications: 5,
      druggability: 9,
      expression: 7,
    };
    setLocalWeights(defaultWeights);
    onWeightsChange(defaultWeights);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          <span>Adjust Weights</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Ranking Weights</h3>
          <p className="text-sm text-gray-500">Adjust the importance of each factor in the gene ranking algorithm.</p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">FDA Approval</label>
                <span className="text-sm">{localWeights.fdaApproved}</span>
              </div>
              <Slider
                defaultValue={[localWeights.fdaApproved]}
                max={10}
                step={1}
                onValueChange={(value) => handleWeightChange('fdaApproved', value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Clinical Studies</label>
                <span className="text-sm">{localWeights.clinicalStudies}</span>
              </div>
              <Slider
                defaultValue={[localWeights.clinicalStudies]}
                max={10}
                step={1}
                onValueChange={(value) => handleWeightChange('clinicalStudies', value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Patents</label>
                <span className="text-sm">{localWeights.patents}</span>
              </div>
              <Slider
                defaultValue={[localWeights.patents]}
                max={10}
                step={1}
                onValueChange={(value) => handleWeightChange('patents', value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Publications</label>
                <span className="text-sm">{localWeights.publications}</span>
              </div>
              <Slider
                defaultValue={[localWeights.publications]}
                max={10}
                step={1}
                onValueChange={(value) => handleWeightChange('publications', value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Druggability</label>
                <span className="text-sm">{localWeights.druggability}</span>
              </div>
              <Slider
                defaultValue={[localWeights.druggability]}
                max={10}
                step={1}
                onValueChange={(value) => handleWeightChange('druggability', value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Expression Levels</label>
                <span className="text-sm">{localWeights.expression}</span>
              </div>
              <Slider
                defaultValue={[localWeights.expression]}
                max={10}
                step={1}
                onValueChange={(value) => handleWeightChange('expression', value)}
              />
            </div>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WeightSliders;
