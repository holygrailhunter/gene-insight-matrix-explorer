
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Gene } from "../GeneHeatmap";

interface FavoriteGenesContextType {
  favoriteGenes: Gene[];
  addFavorite: (gene: Gene) => void;
  removeFavorite: (geneId: string) => void;
  isFavorite: (geneId: string) => boolean;
  clearFavorites: () => void;
}

const FavoriteGenesContext = createContext<FavoriteGenesContextType | undefined>(undefined);

export const useFavoriteGenes = () => {
  const context = useContext(FavoriteGenesContext);
  if (!context) {
    throw new Error("useFavoriteGenes must be used within a FavoriteGenesProvider");
  }
  return context;
};

interface FavoriteGenesProviderProps {
  children: ReactNode;
}

export const FavoriteGenesProvider = ({ children }: FavoriteGenesProviderProps) => {
  const [favoriteGenes, setFavoriteGenes] = useState<Gene[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteGenes');
    if (storedFavorites) {
      try {
        setFavoriteGenes(JSON.parse(storedFavorites));
      } catch (error) {
        console.error('Failed to parse stored favorites:', error);
        localStorage.removeItem('favoriteGenes');
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteGenes', JSON.stringify(favoriteGenes));
  }, [favoriteGenes]);

  const addFavorite = (gene: Gene) => {
    if (!isFavorite(gene.id)) {
      setFavoriteGenes(prev => [...prev, gene]);
    }
  };

  const removeFavorite = (geneId: string) => {
    setFavoriteGenes(prev => prev.filter(gene => gene.id !== geneId));
  };

  const isFavorite = (geneId: string) => {
    return favoriteGenes.some(gene => gene.id === geneId);
  };

  const clearFavorites = () => {
    setFavoriteGenes([]);
  };

  const value: FavoriteGenesContextType = {
    favoriteGenes,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites
  };

  return (
    <FavoriteGenesContext.Provider value={value}>
      {children}
    </FavoriteGenesContext.Provider>
  );
};
