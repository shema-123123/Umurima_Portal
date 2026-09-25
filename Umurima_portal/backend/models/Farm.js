const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmName: {
      type: String,
      required: [true, 'Izina ry\'umurima rirakenewe'],
      trim: true,
    },
    cropType: {
      type: String,
      required: [true, 'Ubwoko bw\'igihingwa burakenewe'],
      trim: true,
    },
    size: {
      type: Number,
      required: [true, 'Ingano irakenewe'],
      min: 0,
    },
    location: {
      type: String,
      required: [true, 'Aho umurima uherereye birakenewe'],
      trim: true,
    },
    soilType: {
      type: String,
      default: 'N/A',
    },
    plantingDate: {
      type: Date,
    },
    expectedHarvest: {
      type: Date,
    },
    treeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    treeTypes: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farm', farmSchema);