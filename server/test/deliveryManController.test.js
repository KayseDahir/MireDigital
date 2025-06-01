import { expect } from "chai";
import sinon from "sinon";
import * as deliveryController from "../controllers/delivery.js";
import Zone from "../models/Zone.js";

describe("Delivery Controller", () => {
  afterEach(() => {
    sinon.restore(); // Restore all stubs after each test
  });

  describe("createDeliveryMan", () => {
    it("should return 400 if zone not found", async () => {
      sinon.stub(Zone, "findOne").resolves(null); // Mock DB call

      const req = {
        body: {
          name: "A",
          email: "a@b.com",
          password: "123",
          zone: "Nonexistent",
        },
      };
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
      await deliveryController.createDeliveryMan(req, res);
      expect(res.statusCode).to.equal(400);
      expect(res.data.success).to.be.false;
      expect(res.data.message).to.equal("Zone not found");
    });
  });
});
