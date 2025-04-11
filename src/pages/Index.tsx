
import { useState } from "react";
import GeneHeatmap from "@/components/GeneExplorer/GeneHeatmap";
import GeneExplorerHeader from "@/components/GeneExplorer/GeneExplorerHeader";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const [weights, setWeights] = useState({
    fdaApproved: 10,
    clinicalStudies: 8,
    patents: 6,
    publications: 5,
    druggability: 9,
    expression: 7,
  });

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <Card className="mt-2">
        <CardContent className="pt-6">
          <GeneExplorerHeader weights={weights} onWeightsChange={setWeights} />
          
          <div className="mt-6 overflow-auto">
            <GeneHeatmap weights={weights} />
          </div>
        </CardContent>
      </Card>
      
      <footer className="mt-6 text-center text-sm text-gray-500">
        <p>© 2025 Gene Insight Matrix Explorer - Target Discovery Platform</p>
        <p className="text-xs mt-1">Data shown is for demonstration purposes only.</p>
      </footer>
    </div>
  );
};

export default Index;
