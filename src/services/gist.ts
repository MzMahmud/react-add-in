import axios from "axios";
import { Gist } from "../models/gist.model";
import { AsyncResponse } from "../models/response.model";

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

export async function getGistWithContent(gistId: string): Promise<AsyncResponse<Gist>> {
  return axios
    .get<GistResponse>(`https://api.github.com/gists/${gistId}`)
    .then(({ data: gistResponse }) => ({ status: "SUCCESS" as const, value: mapGistResponseToGist(gistResponse) }))
    .catch((error) => ({ status: "ERROR" as const, message: `${error}` }));
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
