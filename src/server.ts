import 'dotenv/config';

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger.json';

import { router } from './routes';

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.get("/", (req, res) => {
  return res.json({message: `EMTU-API (${process.env.ENV})`});
})

app.listen(process.env.PORT || 3333, () => console.log(`server is running on port ${process.env.PORT || 3333}`));
