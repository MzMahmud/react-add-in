import { Gist } from "../models/gist.model";
import axios from "axios";

type GistResponseFile = {
  filename: string;
  language: string;
  content?: string;
};

type GistResponse = {
  id: string;
  files: Record<string, GistResponseFile>;
  updated_at: string;
  description: string;
};

export function getUserPublicGists(githubUserName: string): Promise<Gist[]> {
  return axios
    .get<GistResponse[]>(`https://api.github.com/users/${githubUserName}/gists`)
    .then(({ data: gistResponses }) => gistResponses.map(mapGistResponseToGist))
    .catch((error) => {
      console.error("error fetching public gists", error);
      return [];
    });
}

function mapGistResponseToGist(gistResponse: GistResponse): Gist {
  const gistFiles = Object.values(gistResponse.files);
  return {
    id: gistResponse.id,
    title: gistResponse.description,
    lastUpdated: new Date(gistResponse.updated_at),
    files: gistFiles,
  };
}
