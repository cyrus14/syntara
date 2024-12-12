import React from "react";

function Footer() {
  return (
    <footer className="bg-white py-4 shadow-inner">
      <div className="container mx-auto text-center">
        <div className="flex justify-center items-center space-x-4">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Privacy
          </span>
          <span className="mx-2">•</span>
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Encryption
          </span>
          <span className="mx-2">•</span>
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            HIPAA Compliance
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Syntara ensures secure data sharing and analysis with advanced
          encryption.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
