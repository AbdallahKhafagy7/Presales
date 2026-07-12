import mongoose from "mongoose";

const opportunityRequirementSchema = new mongoose.Schema(
  {
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
      unique: true,
    },
    requirementsText: {
      type: String,
      minLength: 10,
      trim: true,
      validate: {
        validator: (value) => {
          return value.trim().length > 0;
        },
        message: "Requirement text must not be empty!",
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model(
  "OpportunityRequirement",
  opportunityRequirementSchema,
);
