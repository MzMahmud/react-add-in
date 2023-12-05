export interface Gist {
  id: string;
  title: string;
  lastUpdated: Date;
  files: GistFile[];
}

type GistFile = {
  filename: string;
  language: string;
  content?: string;
};
