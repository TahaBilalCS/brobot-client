"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
//
// if (process.env.NODE_ENV !== 'production') {
//   dotenv.config();
// }
// const PORT = process.env.PORT || 3000;
// const app: Express = express();
//
// app.use(helmet());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
//
// app.get('/', (req: Request, res: Response) => {
//   res.send(`PORT455477 ${PORT}, NODE:${process.env.NODE_ENV}`)
//   // res.send('<h1>Hello from the TypeScript world! </h1>');
// });
//
// app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
var app = express_1.default();
app.use(express_1.default.static('public'));
app.listen(3000, function () { return console.log('Server running on port 3000'); });
