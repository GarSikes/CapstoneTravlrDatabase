const mongoose = require('mongoose');
const fs = require('fs');
const Trip = require('./travlr');

const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;

mongoose.connect(dbURI)
    .then(() => {
        console.log(`Connected to ${dbURI}`);
        seedData();
    })
    .catch(err => {
        console.log('Connection error: ', err);
    });

const seedData = async () => {
    try {
        const rawData = fs.readFileSync('./data/trips.json');
        const trips = JSON.parse(rawData);

        await Trip.deleteMany({});
        console.log('Existing trips removed');

        await Trip.insertMany(trips);
        console.log(`${trips.length} trips inserted`);
    } catch (err) {
        console.log('Error seeding data: ', err);
    } finally {
        mongoose.connection.close();
    }
};