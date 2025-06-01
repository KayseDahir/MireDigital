import { expect } from "chai";
import * as adminController from "../controllers/admin.js";

describe("Admin Controller", () => {
  describe("adminLogin", () => {
    it("should return 401 if credentials are invalid", async () => {
      const req = { body: { email: "wrong@admin.com", password: "wrong" } };
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
      await adminController.adminLogin(req, res);
      expect(res.statusCode).to.equal(401);
      expect(res.data.success).to.be.false;
      expect(res.data.message).to.equal("Invalid credentials");
    });
  });

  describe("authAdmin", () => {
    it("should return 401 if adminToken is missing", () => {
      const req = { cookies: {} };
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
      adminController.authAdmin(req, res);
      expect(res.statusCode).to.equal(401);
      expect(res.data.success).to.be.false;
      expect(res.data.message).to.equal("Unauthorized");
    });
  });

  describe("adminLogout", () => {
    it("should not throw and should return 200", async () => {
      const res = {
        clearCookie() {
          this.cleared = true;
          return this;
        },
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.data = data;
          return this;
        },
      };
      await adminController.adminLogout({}, res);
      expect(res.statusCode).to.equal(200);
      expect(res.data.success).to.be.true;
    });
  });
});
