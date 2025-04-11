
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, Info, Download, X } from "lucide-react";
import { useFavoriteGenes } from "./FavoriteGenesContext";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface FavoritesPanelProps {
  onViewGeneDetail: (geneId: string) => void;
  onClose: () => void;
}

const FavoritesPanel = ({ onViewGeneDetail, onClose }: FavoritesPanelProps) => {
  const { favoriteGenes, removeFavorite, clearFavorites } = useFavoriteGenes();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const handleClearFavorites = () => {
    clearFavorites();
    toast.success("All favorites have been cleared");
    setConfirmClearOpen(false);
  };

  const exportFavorites = () => {
    try {
      const exportData = favoriteGenes.map(gene => ({
        symbol: gene.symbol,
        name: gene.name,
        fdaApproved: gene.fdaApproved,
        clinicalStudies: gene.clinicalStudies,
        patents: gene.patents,
        publications: gene.publications,
        druggability: gene.druggability
      }));
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileName = `gene-favorites-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileName);
      linkElement.click();
      
      toast.success("Favorites exported successfully");
    } catch (error) {
      console.error("Failed to export favorites:", error);
      toast.error("Failed to export favorites");
    }
  };

  return (
    <>
      <Card className="shadow-lg animate-fade-in border-blue-100 dark:border-blue-900">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-t-lg border-b border-blue-100 dark:border-blue-900">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center text-blue-700">
                <Star className="h-5 w-5 text-amber-500 mr-2" />
                Favorite Genes
              </CardTitle>
              <p className="text-sm text-blue-600/70 dark:text-blue-400/70 mt-1">
                {favoriteGenes.length} saved gene{favoriteGenes.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {favoriteGenes.length > 0 ? (
            <div>
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead>Gene</TableHead>
                      <TableHead>FDA</TableHead>
                      <TableHead>Clinical</TableHead>
                      <TableHead>Druggability</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {favoriteGenes.map(gene => (
                      <TableRow key={gene.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20">
                        <TableCell className="font-medium">
                          {gene.symbol}
                          <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {gene.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          {gene.fdaApproved ? (
                            <Badge className="bg-green-500">Yes</Badge>
                          ) : (
                            <span className="text-sm text-gray-400">No</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {gene.clinicalStudies > 0 ? (
                            <Badge variant="outline">{gene.clinicalStudies}</Badge>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="w-full max-w-[60px] bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${gene.druggability * 10}%` }}
                            ></div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => onViewGeneDetail(gene.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Info className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => {
                              removeFavorite(gene.id);
                              toast.info(`${gene.symbol} removed from favorites`);
                            }}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-4 border-t flex justify-between items-center">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setConfirmClearOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={exportFavorites}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No favorite genes yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Click the star icon on any gene to add it to your favorites
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all favorites?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove all favorite genes from your list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearFavorites}>
              Yes, clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FavoritesPanel;
