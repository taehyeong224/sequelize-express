export const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const syncMiddleware = (fn) => (req, res, next) => {
  try {
    fn(req, res, next);
  } catch (error) {
    next(error);
  }
};
