import { expect } from "chai";
import sinon from "sinon";
import * as orderController from "../controllers/order.js";
import Address from "../models/Address.js";
import Zone from "../models/Zone.js";
import Product from "../models/Product.js";

describe("Order Controller", () => {
  afterEach(() => sinon.restore());

  describe("placeOrderCOD", () => {
    it("should return 401 if userId is missing", async () => {
      const req = { body: { items: [{}], address: "addressId" } }; // no userId
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
      await orderController.placeOrderCOD(req, res);
      expect(res.statusCode).to.equal(401);
      expect(res.data.success).to.be.false;
      expect(res.data.message).to.equal("Unauthorized. User ID is missing.");
    });

    it("should return 400 if address or items are missing", async () => {
      const req = { userId: "userId", body: { items: [], address: "" } };
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
      await orderController.placeOrderCOD(req, res);
      expect(res.statusCode).to.equal(400);
      expect(res.data.success).to.be.false;
      expect(res.data.message).to.equal("Address and items are required.");
    });

    it("should return 404 if address not found", async () => {
      sinon.stub(Address, "findById").resolves(null);
      const req = {
        userId: "userId",
        body: { items: [{}], address: "addressId" },
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
      await orderController.placeOrderCOD(req, res);
      expect(res.statusCode).to.equal(404);
      expect(res.data.success).to.be.false;
      expect(res.data.message).to.equal("Address not found.");
    });
  });

  describe("placeOrderOnline", () => {
    it("should return 400 if address or items are missing", async () => {
      const req = {
        userId: "userId",
        body: { items: [], address: "" },
        headers: {},
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
      await orderController.placeOrderOnline(req, res);
      expect(res.statusCode).to.equal(400);
      expect(res.data.success).to.be.false;
      expect(res.data.message).to.equal("Address and items are required.");
    });

    it("should return 400 if address not found", async () => {
      sinon.stub(Address, "findById").resolves(null);
      const req = {
        userId: "userId",
        body: { items: [{}], address: "addressId" },
        headers: {},
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
      await orderController.placeOrderOnline(req, res);
      expect(res.statusCode).to.equal(400);
      expect(res.data.success).to.be.false;
      expect(res.data.message).to.equal("Address not found.");
    });
  });
});
