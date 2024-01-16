import axios from "axios";
import { AuthToken } from "../models/auth.model";

export async function getAuthToken(authCode: string, clientId: string) {
  const authTokenReqBody = {
    code: authCode,
    client_id: clientId,
  };
  const res = await axios.post<AuthToken>("http://localhost:8080/api/auth/token", authTokenReqBody);
  return res.data;
}
