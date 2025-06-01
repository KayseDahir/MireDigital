import { expect } from "chai";
import sinon from "sinon";
import * as productController from "../controllers/product.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

describe("Product Controller", () => {
  afterEach(() => sinon.restore());

  describe("addProduct", () => {
    it("should return 400 if category is invalid", async () => {
      sinon.stub(Category, "findOne").resolves(null);
      const req = {
        body: { productData: JSON.stringify({ category: "Invalid" }) },
        files: [],
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
      await productController.addProduct(req, res);
      expect(res.statusCode).to.equal(400);
      expect(res.data.success).to.be.false;
      expect(res.data.message).to.equal("Invalid category");
    });
  });

  describe("productById", () => {
    it("should return 404 if product not found", async () => {
      sinon.stub(Product, "findById").resolves(null);
      const req = { body: { id: "notfound" } };
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
      await productController.productById(req, res);
      expect(res.statusCode).to.equal(404);
      expect(res.data.success).to.be.false;
      expect(res.data.message).to.equal("Product not found");
    });
  });

  describe("changeStock", () => {
    it("should return 404 if product not found", async () => {
      sinon.stub(Product, "findByIdAndUpdate").resolves(null);
      const req = { body: { id: "notfound", inStock: false } };
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
      await productController.changeStock(req, res);
      expect(res.statusCode).to.equal(404);
      expect(res.data.success).to.be.false;
      expect(res.data.message).to.equal("Product not found");
    });
  });

  describe("deleteProduct", () => {
    it("should return 404 if product not found", async () => {
      sinon.stub(Product, "findByIdAndDelete").resolves(null);
      const req = { body: { id: "notfound" } };
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
      await productController.deleteProduct(req, res);
      expect(res.statusCode).to.equal(404);
      expect(res.data.success).to.be.false;
      expect(res.data.message).to.equal("Product not found");
    });
  });

  describe("updateProduct", () => {
    it("should return 404 if product not found", async () => {
      sinon.stub(Product, "findByIdAndUpdate").resolves(null);
      const req = { body: { id: "notfound", productData: {} } };
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
      await productController.updateProduct(req, res);
      expect(res.statusCode).to.equal(404);
      expect(res.data.success).to.be.false;
      expect(res.data.message).to.equal("Product not found");
    });
  });
});
