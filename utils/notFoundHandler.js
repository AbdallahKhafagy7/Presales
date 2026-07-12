export default async (req, res, next) => {
  next(new Error("Endpoint not found!"));
};
