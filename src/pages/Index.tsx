
import { useState } from "react";
import GeneHeatmap from "@/components/GeneExplorer/GeneHeatmap";
import GeneExplorerHeader from "@/components/GeneExplorer/GeneExplorerHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Star, Filter, Search, Database } from "lucide-react";
import GeneInsightsDashboard from "@/components/GeneExplorer/Dashboard/GeneInsightsDashboard";
import GeneComparisonView from "@/components/GeneExplorer/CompareGenes/GeneComparisonView";
import FavoritesPanel from "@/components/GeneExplorer/Favorites/FavoritesPanel";
import { FavoriteGenesProvider } from "@/components/GeneExplorer/Favorites/FavoriteGenesContext";
import { generateMockGeneData } from "@/lib/mockData";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950">
        <div className="container mx-auto p-4 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Gene Insight Matrix Explorer
            </h1>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-white dark:bg-gray-800">Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] lg:grid-cols-2">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500 to-blue-700 p-6 no-underline outline-none focus:shadow-md"
                            href="#"
                          >
                            <Database className="h-6 w-6 text-white" />
                            <div className="mt-4 mb-2 text-lg font-medium text-white">
                              Datasets
                            </div>
                            <p className="text-sm leading-tight text-white/90">
                              Access reference datasets and import custom omics data for analysis.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 dark:hover:bg-blue-900">
                            <div className="text-sm font-medium leading-none">Documentation</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Learn how to use the Gene Insight Matrix Explorer effectively.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 dark:hover:bg-blue-900">
                            <div className="text-sm font-medium leading-none">API Access</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Programmatically access gene data through our REST API.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <a href="#" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 dark:hover:bg-blue-900">
                            <div className="text-sm font-medium leading-none">Pathway Analysis</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Explore biological pathways and gene interactions.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost" className="text-md" asChild>
                    <a href="#">Tools</a>
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button variant="ghost" className="text-md" asChild>
                    <a href="#">Support</a>
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <Card className="mt-2 border-none shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
            <CardContent className="pt-6">
              <GeneExplorerHeader weights={weights} onWeightsChange={setWeights} />
              
              <div className="flex justify-between items-center mt-6 border-b pb-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="bg-blue-50/50 dark:bg-gray-800/50 p-1 rounded-lg">
                    <TabsTrigger 
                      value="dashboard" 
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md transition-all"
                    >
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger 
                      value="heatmap" 
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md transition-all"
                    >
                      Gene Heatmap
                    </TabsTrigger>
                    <TabsTrigger 
                      value="compare" 
                      className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm rounded-md transition-all"
                    >
                      Compare Genes
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="hidden md:inline">Advanced Filter</span>
                  </Button>
                  
                  <Button
                    variant={showFavorites ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setShowFavorites(!showFavorites)}
                    className="gap-2 border-blue-200 dark:border-blue-800"
                  >
                    <Star className={`h-4 w-4 ${showFavorites ? "fill-amber-400 text-amber-400" : ""}`} />
                    <span className="hidden sm:inline">Favorites</span>
                  </Button>
                </div>
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
                  <div className="animate-fade-in">
                    <GeneHeatmap weights={weights} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <footer className="mt-8 text-center text-sm text-gray-500 py-4">
            <div className="flex justify-center space-x-4 mb-3">
              <a href="#" className="hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
              <a href="#" className="hover:text-blue-600 transition-colors">API</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <p>© 2025 Gene Insight Matrix Explorer - Advanced Target Discovery Platform</p>
            <p className="text-xs mt-1">Data shown is for demonstration purposes only.</p>
          </footer>
        </div>
      </div>
    </FavoriteGenesProvider>
  );
};

export default Index;
