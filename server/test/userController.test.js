import { expect } from "chai";
import * as userController from "../controllers/user.js";

describe("User Controller", () => {
  describe("signup", () => {
    it("should return 400 if required fields are missing", async () => {
      const req = { body: { name: "", email: "", password: "" } };
      const res = {
        status(code) { this.statusCode = code; return this; },
        json(data) { this.data = data; return this; }
      };
      await userController.signup(req, res);
      expect(res.statusCode).to.equal(400);
      expect(res.data.success).to.be.false;
    });
  });

  describe("login", () => {
    it("should return 400 if required fields are missing", async () => {
      const req = { body: { email: "", password: "" } };
      const res = {
        status(code) { this.statusCode = code; return this; },
        json(data) { this.data = data; return this; }
      };
      await userController.login(req, res);
      expect(res.statusCode).to.equal(400);
      expect(res.data.success).to.be.false;
    });
  });

  describe("isAuth", () => {
    it("should return 401 if userId is missing", async () => {
      const req = {}; // no userId
      const res = {
        status(code) { this.statusCode = code; return this; },
        json(data) { this.data = data; return this; }
      };
      await userController.isAuth(req, res);
      expect(res.statusCode).to.equal(401);
      expect(res.data.success).to.be.false;
    });
  });

  describe("logout", () => {
    it("should not throw if called", async () => {
      const res = {
        clearCookie() { this.cleared = true; return this; },
        status(code) { this.statusCode = code; return this; },
        json(data) { this.data = data; return this; }
      };
      await userController.logout({}, res);
      expect(res.statusCode).to.equal(200);
      expect(res.data.success).to.be.true;
    });
  });

  describe("verifyOtp", () => {
    it.skip("should return 400 if user not found", async () => {
      const req = { body: { email: "notfound@example.com", otp: "123456" } };
      const res = {
        status(code) { this.statusCode = code; return this; },
        json(data) { this.data = data; return this; }
      };
      // This will hit the real DB unless you mock User.findOne
      await userController.verifyOtp(req, res);
      // If you don't have a user with this email, this will pass
      expect(res.statusCode).to.equal(400);
      expect(res.data.success).to.be.false;
    });
  });
});