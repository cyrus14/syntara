import React from "react";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white py-8">
      <div className="container mx-auto text-center">
        {/* Middle Section: Features */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold uppercase tracking-wider">
              Privacy
            </h3>
            <p className="text-sm mt-1">
              Ensuring your data remains secure and confidential.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold uppercase tracking-wider">
              Encryption
            </h3>
            <p className="text-sm mt-1">
              Advanced encryption to safeguard sensitive information.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold uppercase tracking-wider">
              HIPAA Compliance
            </h3>
            <p className="text-sm mt-1">
              Adhering to the highest standards for healthcare data.
            </p>
          </div>
        </div>

        {/* Bottom Section: Links */}
        <div className="mt-6 border-t border-white/20 pt-4">
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="text-sm text-white hover:underline transition duration-300"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-sm text-white hover:underline transition duration-300"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-sm text-white hover:underline transition duration-300"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-white hover:underline transition duration-300"
            >
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-xs mt-4 text-white/80">
          © {new Date().getFullYear()} Syntara. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
