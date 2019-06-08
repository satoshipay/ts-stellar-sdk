export interface DataShowOptions {
  accountId: string;
  key: string;
}

export const dataShowProcessor = {
  options: (options: DataShowOptions) => {
    return { path: ["accounts", options.accountId, "data", options.key] };
  },
  response: (response: DataResponse) => response
};

export const dataShowProcessorSse = {
  options: dataShowProcessor.options,
  response: (response: string) => response
};

export interface DataResponse {
  value: string;
}
