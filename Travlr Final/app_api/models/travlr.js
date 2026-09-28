const mongoose = require('mongoose');

// Enhancements over the original:
// - perPerson changed from String to Number with a minimum of 0.

// - trim: true added to every string field so a stray leading/trailing
const tripSchema = new mongoose.Schema({
    code: { type: String, required: true, trim: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    length: { type: String, required: true, trim: true },
    start: { type: Date, required: true },
    resort: { type: String, required: true, trim: true },
    perPerson: { type: Number, required: true, min: [0, 'perPerson cannot be negative'] },
    image: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 2000 }
});

const Trip = mongoose.model('trips', tripSchema);
module.exports = Trip;
