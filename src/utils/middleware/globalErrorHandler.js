import multer from "multer";
import { ZodError } from "zod";
export const globalErrorHandler = (err, req, res, next) => {
    if (
        err instanceof multer.MulterError
    ) {
        switch (err.code) {
            case "LIMIT_FILE_SIZE":
                return res.status(400).json({
                    message:
                        "File size must not exceed 5 MB",
                });
        }
    }
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Validation failed",
            errors: err.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }
    res.status(err.statusCode || 500).json({
        message: err.message || "Something went wrong",
    });
}