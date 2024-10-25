// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import friendsMockHandlers from "./friends.mock";
import loginMockHandler from "./login.mock";
import plansMockHandlers from "./plans.mock";
import paymentMockHandlers from "./payments.mock";
import userMockHandlers from "./users.mock";

const worker = setupWorker(
  ...friendsMockHandlers,
  ...loginMockHandler,
  ...plansMockHandlers,
  ...paymentMockHandlers,
  ...userMockHandlers,
);

export default worker;