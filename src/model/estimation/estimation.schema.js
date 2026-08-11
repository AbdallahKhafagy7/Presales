import mongoose, { Schema } from "mongoose";

const estimationRowSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    feature: {
      type: String,
      required: true,
    },

    subFeature: {
      type: String,
      required: true,
    },

    backendMd: {
      type: Number,
      required: true,
      min: 0,
    },

    frontEndMd: {
      type: Number,
      required: true,
      min: 0,
    },

    apis: {
      type: String,
      default: "",
    },

    pluginsPackagesCost: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const estimationSectionSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    rows: {
      type: [estimationRowSchema],
      required: true,
    },
  },
  { _id: false }
);

const estimationSchema = new Schema(
  {
    opportunityId: {
      type: Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    table: {
      columns: {
        type: [Schema.Types.Mixed],
        required: true,
      },

      sections: {
        type: [estimationSectionSchema],
        required: true,
      },
    },

    summary: {
      totalBackendMd: {
        type: Number,
        required: true,
      },

      totalFrontEndMd: {
        type: Number,
        required: true,
      },

      totalMd: {
        type: Number,
        required: true,
      },

      totalPluginsPackagesCost: {
        type: Number,
        required: true,
      },

      estimatedDurationWeeks: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Estimation", estimationSchema);