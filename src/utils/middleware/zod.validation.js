export const validate = (schema) => (req, res, next) => {
  const data = {
    ...req.body,
    ...req.params,
    ...req.query,
    ...req.file,
  };

  const result = schema.safeParse(data);

  if (!result.success) {
    return next(result.error);
  }
  next();
};
