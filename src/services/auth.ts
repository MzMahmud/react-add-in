import axios from "axios";
import type { AuthToken } from "../models/auth.model";

export async function getAuthToken(authCode: string, clientId: string) {
  const authTokenReqBody = {
    code: authCode,
    client_id: clientId,
  };
  const res = await axios.post<AuthToken>("https://localhost:8080/api/auth/token", authTokenReqBody);
  return res.data;
}
