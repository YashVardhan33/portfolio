
export interface Project{
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  technology: string[];
  liveDemoUrl?:string;
  githubRepoUrl?: string;
  imageUrl?: string;
}
