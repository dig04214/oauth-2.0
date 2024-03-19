import axios from "axios";
import { ENROLL_APP } from "./types";

export function enrollApp(dataToSubmit) {
  const request = axios.post("/console/enroll", dataToSubmit)
    .then((response) => response.data);

  return {
    type: ENROLL_APP,
    payload: request,
  };
}