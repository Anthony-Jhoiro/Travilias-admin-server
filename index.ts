import "module-alias/register";
import { PORT } from "@tas/environment";
import app from "./app";

const server = app.listen(PORT, () => {
  // @ts-ignore
  const port = server.address().port;
  console.log("App running on port", port);
});
