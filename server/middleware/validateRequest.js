export function requireFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === "";
    });

    if (missing.length > 0) {
      res.status(400);
      throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }

    next();
  };
}
