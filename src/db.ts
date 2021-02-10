import { connect } from 'mongoose';

connect(`${process.env.DB_CONNECTION_URL}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        authMechanism: 'SCRAM-SHA-1',
        w: 'majority',
        tls: true,
        dbName: 'ajet-chess-app',
    })
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err: any) => {
        console.error(`Error connecting to DB: ${err}`);
    });
