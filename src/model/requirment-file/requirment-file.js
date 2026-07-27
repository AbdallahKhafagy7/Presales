import mongoose from "mongoose";

const requirementFileSchema = new mongoose.Schema(
  {
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    originalName: String,
    fileName: String,
    filePath: String,
    fileType: {
      type: String,
      enum: ["pdf", "docx", "txt"],
    },
    fileSize: {
      type: Number,
      validate: {
        validator: function (val) {
          // 5 MB in bytes is 5 * 1024 * 1024 = 5242880
          return val <= 5242880;
        },
        message: "File size exceeds the maximum limit of 5 MB",
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("RequirementFile", requirementFileSchema);
