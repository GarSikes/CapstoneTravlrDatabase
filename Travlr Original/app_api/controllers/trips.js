const Trip = require('../models/travlr');

// GET: /trips - Retrieve list of all active trips
const tripsList = async (req, res) => {
  const q = await Trip.find({}).exec();

  if (!q) {
    return res
      .status(404)
      .json({ message: 'No trips found' });
  } else {
    return res
      .status(200)
      .json(q);
  }
};

// GET: /trips/:tripCode - Retrieve a single trip
const tripsFindByCode = async (req, res) => {
  const q = await Trip.find({ code: req.params.tripCode }).exec();

  if (!q) {
    return res
      .status(404)
      .json({ message: 'Trip not found' });
  } else {
    return res
      .status(200)
      .json(q);
  }
};

// POST: /trips - Add a new trip
const tripsAddTrip = async (req, res) => {
  try {
    const trip = await Trip.create({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });

    return res
      .status(201)
      .json(trip);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Error creating trip', error: err.message });
  }
};

// PUT: /trips/:tripCode - Update an existing trip
const tripsUpdateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { code: req.params.tripCode },
      {
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true }
    );

    if (!trip) {
      return res
        .status(404)
        .json({ message: 'Trip not found' });
    } else {
      return res
        .status(200)
        .json(trip);
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Error updating trip', error: err.message });
  }
};

// DELETE: /trips/:tripCode - Delete an existing trip
const tripsDeleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ code: req.params.tripCode });

    if (!trip) {
      return res
        .status(404)
        .json({ message: 'Trip not found' });
    } else {
      return res
        .status(200)
        .json({ message: 'Trip deleted successfully' });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Error deleting trip', error: err.message });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};