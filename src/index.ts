import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { authsController } from "./controllers/auth.controller";
import { cors } from '@elysiajs/cors';

const app = new Elysia();
app.use(cors())
app.use(swagger());
app.get('/',() => {
  return "Hello There"
})
authsController(app);
app.listen(8080);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
