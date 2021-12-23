import * as express from 'express';
import { messageRouter, addressRouter, sessionRouter } from './routes';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

const app = express();

//TODO: Ask signature to check POST request

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/message', messageRouter);
app.use('/address', addressRouter);
app.use('/session', sessionRouter);

const port = process.env.port || 3001;

app.listen(port, () => {
  console.log(`The application is listening on port ${port}!`);
});
