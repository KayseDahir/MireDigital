import React from "react";
import { FaTwitter, FaFacebook } from "react-icons/fa";

const ContactUs = () => (
  <div className="max-w-7xl mx-auto my-12 p-6 bg-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
    <h2 className="text-4xl font-extrabold mb-2 text-gray-800 tracking-tight text-center">
      Get in Touch
    </h2>
    <p className="text-gray-500 mb-8 text-lg text-center">
      We’d love to hear from you! Fill out the form and our team will get back
      to you soon.
    </p>
    <div className="flex flex-col md:flex-row gap-8">
      {/* Form Section */}
      <form className="flex-1 flex flex-col gap-4 mb-8 md:mb-0">
        <input
          type="text"
          placeholder="Your Name"
          required
          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <input
          type="email"
          placeholder="Your Email"
          required
          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <input
          type="text"
          placeholder="Subject"
          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <textarea
          placeholder="Your Message"
          required
          className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none min-h-[100px] transition"
        />
        <button
          type="submit"
          className="bg-primary text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow hover:scale-105"
        >
          Send Message
        </button>
        <div className="text-left space-y-3 mt-6">
          <div>
            <strong className="text-gray-700">Address:</strong>{" "}
            <span className="text-indigo-600">123 Main St, City, Country</span>
          </div>
          <div>
            <strong className="text-gray-700">Email:</strong>{" "}
            <span className="text-indigo-600">info@yourcompany.com</span>
          </div>
          <div>
            <strong className="text-gray-700">Phone:</strong>{" "}
            <span className="text-indigo-600">+1 234 567 890</span>
          </div>
          <div className="flex gap-4 mt-3">
            <a
              href="#"
              aria-label="Twitter"
              className="text-gray-400  transition-transform transform hover:scale-125"
            >
              <FaTwitter className="w-6 h-6" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="text-gray-400 hover:text-indigo-500 transition-transform transform hover:scale-125"
            >
              <FaFacebook className="w-6 h-6" />
            </a>
          </div>
        </div>
      </form>
      {/* Map Section */}
      <div className="flex-1 rounded-lg overflow-hidden shadow-md min-h-[300px]">
        <iframe
          title="Company Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.953735315904!3d-37.8162797420217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1f6e8e7%3A0x5045675218ce6e0!2s123%20Main%20St%2C%20Melbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2sus!4v1620211234567!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: 300 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full min-h-[300px]"
        ></iframe>
      </div>
    </div>
  </div>
);

export default ContactUs;
