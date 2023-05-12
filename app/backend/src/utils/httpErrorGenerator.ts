interface HTTPError extends Error {
  status?: number;
}

const httpErrorGenerator = (status: number, message: string): HTTPError => {
  const error: HTTPError = new Error(message);
  error.name = 'HTTPError';
  error.status = status;
  return error;
};

export default httpErrorGenerator;
