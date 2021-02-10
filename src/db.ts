import { connect } from 'mongoose';

console.log(`Connecting to ${process.env.DB_CONNECTION_URL}`);
//ping
connect(`${process.env.DB_CONNECTION_URL}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    })
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.error(`Error connecting to DB: ${err}`);
    });
