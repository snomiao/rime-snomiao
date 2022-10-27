import { deploy } from "./deploy";

{
  await new Promise((r) => setTimeout(r, 5e3)); // wait 5s for debounce
  await deploy();
}
