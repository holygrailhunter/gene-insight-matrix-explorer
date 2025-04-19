import { useState } from "react";
import GeneHeatmap from "@/components/GeneExplorer/GeneHeatmap";
import GeneExplorerHeader from "@/components/GeneExplorer/GeneExplorerHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Star, BarChart3, MoveHorizontal } from "lucide-react";
import GeneInsightsDashboard from "@/components/GeneExplorer/Dashboard/GeneInsightsDashboard";
import GeneComparisonView from "@/components/GeneExplorer/CompareGenes/GeneComparisonView";
import FavoritesPanel from "@/components/GeneExplorer/Favorites/FavoritesPanel";
import { FavoriteGenesProvider } from "@/components/GeneExplorer/Favorites/FavoriteGenesContext";
import { generateMockGeneData } from "@/lib/mockData";

const Index = () => {
  const [weights, setWeights] = useState({
    fdaApproved: 10,
    clinicalStudies: 8,
    patents: 6,
    publications: 5,
    druggability: 9,
    expression: 7,
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showFavorites, setShowFavorites] = useState(false);
  const [mockGenes, setMockGenes] = useState(() => 
    generateMockGeneData(50, [
      "SubtypeA_vs_Control",
      "SubtypeB_vs_Control",
      "SubtypeC_vs_Control",
      "SubtypeA_vs_SubtypeB",
      "SubtypeB_vs_SubtypeC"
    ])
  );

  return (
    <FavoriteGenesProvider>
      <div className="container mx-auto p-4 max-w-7xl">
        <Card className="mt-2">
          <CardContent className="pt-6">
            <GeneExplorerHeader weights={weights} onWeightsChange={setWeights} />
            
            <div className="flex justify-between items-center mt-6 border-b pb-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="heatmap">Gene Heatmap</TabsTrigger>
                  <TabsTrigger value="compare">Compare Genes</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button
                variant={showFavorites ? "secondary" : "outline"}
                size="sm"
                onClick={() => setShowFavorites(!showFavorites)}
                className="ml-4 gap-2"
              >
                <Star className={`h-4 w-4 ${showFavorites ? "fill-amber-400 text-amber-400" : ""}`} />
                <span className="hidden sm:inline">Favorites</span>
              </Button>
            </div>

            <div className="mt-6 overflow-auto relative">
              {showFavorites && (
                <div className="absolute right-0 top-0 z-20 w-full md:w-[420px] lg:w-[500px] shadow-xl">
                  <FavoritesPanel
                    onViewGeneDetail={(geneId) => {
                      const gene = mockGenes.find(g => g.id === geneId);
                      console.log("View details for", gene?.symbol);
                      setShowFavorites(false);
                    }}
                    onClose={() => setShowFavorites(false)}
                  />
                </div>
              )}

              {activeTab === "dashboard" ? (
                <div className="animate-fade-in">
                  <GeneInsightsDashboard />
                </div>
              ) : activeTab === "compare" ? (
                <div className="animate-fade-in">
                  <GeneComparisonView 
                    availableGenes={mockGenes} 
                    onClose={() => setActiveTab("heatmap")} 
                  />
                </div>
              ) : (
                <GeneHeatmap weights={weights} />
              )}
            </div>
          </CardContent>
        </Card>
        
        <footer className="mt-6 text-center text-sm text-gray-500">
          <p>© 2025 Gene Insight Matrix Explorer - Target Discovery Platform</p>
          <p className="text-xs mt-1">Data shown is for demonstration purposes only.</p>
        </footer>
      </div>
    </FavoriteGenesProvider>
  );
};

export default Index;
