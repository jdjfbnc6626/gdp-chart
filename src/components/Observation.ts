// axios - Promise based HTTP client for the browser and node.js
import axios, { AxiosResponse } from "axios";
// handling the api output around line 40 with snakecaseKeys
import snakecaseKeys from "snakecase-keys";
// querystring parser that supports nesting and arrays, with a depth limit
import { stringify } from "qs";

export type Observation = {
  realtimeStart?: string;
  realtimeEnd?: string;
  date: string;
  value: string;
};

type ObservationPayload = {
  realtimeStart: string;
  realtimeEnd: string;
  observationStart: string;
  observationEnd: string;
  units: "lin";
  outputType: number;
  fileType: "json";
  orderBy: "observation_date";
  sortOrder: "asc" | "desc";
  count: number;
  offset: number;
  limit: number;
  observations: Observation[];
};

type Options = {
  frequency?: "d" | "w" | "bw" | "m" | "q" | "sa" | "a";
  observationStart?: string;
  observationEnd?: string;
};

const endpointUrl = `/api/observations`;

export const fetchObservations = (seriesId: string, options: Options = {}) => {
  const urlParams = stringify(
    snakecaseKeys({
      seriesId,
      ...options,
    })
  );
  const url = `${endpointUrl}?${urlParams}`;

  return axios
    .get(url)
    .then(
      (response: AxiosResponse<ObservationPayload>) =>
        response.data.observations
    );
};