import { expect } from "chai";
import sinon from "sinon";
import * as cartController from "../controllers/cart.js";
import User from "../models/User.js";

describe("Cart Controller", () => {
  afterEach(() => sinon.restore());

  describe("updateCart", () => {
    it("should return 404 if user not found", async () => {
      sinon.stub(User, "findByIdAndUpdate").resolves(null);
      const req = { body: { userId: "notfound", cartItems: [] } };
      const res = {
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.data = data;
          return this;
        },
      };
      await cartController.updateCart(req, res);
      expect(res.statusCode).to.equal(404);
      expect(res.data.success).to.be.false;
      expect(res.data.message).to.equal("User not found");
    });
  });
});
