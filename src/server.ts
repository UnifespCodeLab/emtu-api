import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger.json';
import cors from 'cors'

import { router } from './routes';

const app = express();

app.use(express.json());
app.use(cors())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.get("/", (req, res) => {
  return res.json({message: "EMTU-API"});
})

app.listen(3333, () => console.log("server is running on port 3333"));
