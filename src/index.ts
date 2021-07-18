import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import * as process from "process";

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send(`PORT ${PORT}, NODE:${process.env.NODE_ENV}`)
  // res.send('<h1>Hello from the TypeScript world! </h1>');
});

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));

// const app = express()
// app.use(express.static('public'))
// app.listen(3000, () => console.log('Server running on portsss 3000'))