
import { Gene } from "../components/GeneExplorer/GeneHeatmap";

// Generate random number between min and max
const randomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Generate random integer between min and max (inclusive)
const randomInt = (min: number, max: number) => {
  return Math.floor(randomNumber(min, max + 1));
};

// Random boolean with probability
const randomBoolean = (probability = 0.5) => {
  return Math.random() < probability;
};

// List of gene symbols for mock data
const geneSymbols = [
  "BRCA1", "TP53", "KRAS", "EGFR", "HER2", "PTEN", "AKT1", "PIK3CA", "BRAF", 
  "VEGFA", "MDM2", "CDKN2A", "MTOR", "JAK2", "STAT3", "MYC", "PD1", "PDL1", 
  "CTLA4", "CD19", "TNF", "IL6", "IL1B", "CXCR4", "CCR5", "MAPK1", "IGF1R", 
  "FGFR1", "ERBB3", "MET", "ALK", "ROS1", "RET", "KIT", "NOTCH1", "WNT1", 
  "GLI1", "HDAC1", "EZH2", "PARP1", "ATM", "BRCA2", "CDK4", "CDK6", "BTK", 
  "BCL2", "MCL1", "SOX2", "OCT4"
];

// List of gene names corresponding to the symbols
const geneNames = [
  "Breast cancer type 1 susceptibility protein", 
  "Cellular tumor antigen p53", 
  "GTPase KRas", 
  "Epidermal growth factor receptor", 
  "Receptor tyrosine-protein kinase erbB-2", 
  "Phosphatidylinositol 3,4,5-trisphosphate 3-phosphatase and dual-specificity protein phosphatase PTEN", 
  "RAC-alpha serine/threonine-protein kinase", 
  "Phosphatidylinositol 4,5-bisphosphate 3-kinase catalytic subunit alpha isoform", 
  "Serine/threonine-protein kinase B-raf", 
  "Vascular endothelial growth factor A", 
  "E3 ubiquitin-protein ligase Mdm2", 
  "Cyclin-dependent kinase inhibitor 2A", 
  "Serine/threonine-protein kinase mTOR", 
  "Tyrosine-protein kinase JAK2", 
  "Signal transducer and activator of transcription 3", 
  "Myc proto-oncogene protein", 
  "Programmed cell death protein 1", 
  "Programmed cell death 1 ligand 1", 
  "Cytotoxic T-lymphocyte protein 4", 
  "B-lymphocyte antigen CD19", 
  "Tumor necrosis factor", 
  "Interleukin-6", 
  "Interleukin-1 beta", 
  "C-X-C chemokine receptor type 4", 
  "C-C chemokine receptor type 5", 
  "Mitogen-activated protein kinase 1", 
  "Insulin-like growth factor 1 receptor", 
  "Fibroblast growth factor receptor 1", 
  "Receptor tyrosine-protein kinase erbB-3", 
  "Hepatocyte growth factor receptor", 
  "ALK tyrosine kinase receptor", 
  "Proto-oncogene tyrosine-protein kinase ROS", 
  "Proto-oncogene tyrosine-protein kinase receptor Ret", 
  "Mast/stem cell growth factor receptor Kit", 
  "Neurogenic locus notch homolog protein 1", 
  "Proto-oncogene Wnt-1", 
  "Zinc finger protein GLI1", 
  "Histone deacetylase 1", 
  "Enhancer of zeste homolog 2", 
  "Poly [ADP-ribose] polymerase 1", 
  "Serine-protein kinase ATM", 
  "Breast cancer type 2 susceptibility protein", 
  "Cyclin-dependent kinase 4", 
  "Cyclin-dependent kinase 6", 
  "Tyrosine-protein kinase BTK", 
  "Apoptosis regulator Bcl-2", 
  "Induced myeloid leukemia cell differentiation protein Mcl-1", 
  "Transcription factor SOX-2", 
  "POU domain, class 5, transcription factor 1"
];

export const generateMockGeneData = (count: number, comparisons: string[]): Gene[] => {
  const genes: Gene[] = [];
  
  // Ensure we don't try to get more genes than we have symbols for
  const actualCount = Math.min(count, geneSymbols.length);
  
  // Create a copy of the arrays to avoid mutating the originals
  const availableSymbols = [...geneSymbols];
  const availableNames = [...geneNames];
  
  for (let i = 0; i < actualCount; i++) {
    const randomIndex = randomInt(0, availableSymbols.length - 1);
    const symbol = availableSymbols.splice(randomIndex, 1)[0];
    const name = availableNames.splice(randomIndex, 1)[0];
    
    const fdaApproved = randomBoolean(0.2); // 20% chance of being FDA approved
    const clinicalStudies = randomInt(0, fdaApproved ? 20 : 10); // More clinical studies if FDA approved
    
    const subtypeExpressions: Record<string, { value: number; pValue: number }> = {};
    
    // Generate expression values for each comparison
    comparisons.forEach(comparison => {
      // Generate log2 fold change between -3 and 3
      const expressionValue = randomNumber(-3, 3);
      
      // P-values are more likely to be significant for extreme expression values
      const absExpressionValue = Math.abs(expressionValue);
      const pValueProbability = absExpressionValue > 1.5 ? 0.8 : absExpressionValue > 1 ? 0.5 : 0.2;
      const pValue = randomBoolean(pValueProbability) ? randomNumber(0.0001, 0.05) : randomNumber(0.05, 0.5);
      
      subtypeExpressions[comparison] = {
        value: expressionValue,
        pValue
      };
    });
    
    // Generate gene data
    const gene: Gene = {
      id: `gene_${i}`,
      symbol,
      name,
      fdaApproved,
      clinicalStudies,
      patents: randomInt(0, 50),
      publications: randomInt(50, 2000),
      druggability: randomInt(1, 10),
      subtypeExpressions,
      targetTractability: {
        smallMolecule: randomInt(1, 10),
        antibody: randomInt(1, 10),
        other: randomInt(1, 10)
      },
      targetQuality: {
        geneticAssociation: randomInt(1, 10),
        safetyRisk: randomInt(1, 10)
      }
    };
    
    genes.push(gene);
  }
  
  return genes;
};
