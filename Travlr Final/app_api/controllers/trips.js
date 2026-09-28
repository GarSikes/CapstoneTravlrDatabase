const Trip = require('../models/travlr');

// GET: /trips - Retrieve list of all active trips
const tripsList = async (req, res) => {
  const q = await Trip.find({}).exec();

  // Original check was `if (!q)`. Mongoose's find() always resolves to an
  // array, even when nothing matches (an empty array, never null or
  // undefined), and an empty array is truthy in JavaScript. So the original
  // "not found" branch could never actually run; a bad or empty result
  // always fell through to the 200 response below with an empty list.
  // Checking the array's length instead makes the "nothing found" case work
  // the way it was clearly meant to.
  if (!q || q.length === 0) {
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

  // Same fix as tripsList above: find() returns [] rather than null/undefined
  // when nothing matches, so check length instead of just truthiness.
  if (!q || q.length === 0) {
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
    // Original code sent err.message straight back to the client, which can
    // leak internal detail (schema field names, Mongoose/driver internals)
    // to whoever is calling the API. Log the full error server-side and
    // send back a generic message instead.
    console.error('Error creating trip:', err);
    return res
      .status(500)
      .json({ message: 'Error creating trip' });
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
      { new: true, runValidators: true }
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
    console.error('Error updating trip:', err);
    return res
      .status(500)
      .json({ message: 'Error updating trip' });
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
    console.error('Error deleting trip:', err);
    return res
      .status(500)
      .json({ message: 'Error deleting trip' });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};
