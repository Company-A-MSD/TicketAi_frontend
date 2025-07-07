import * as React from "react";
import { Facebook, Instagram, Linkedin, Ticket, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#E8E8E8] text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center text-black gap-x-5">
            <div className="flex items-center space-x-2">
              <Ticket className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">TicketAI</span>
            </div>
            <p className="text-sm font-medium">
              Ticket AI Pvt. Ltd. All Rights Reserved.
            </p>
          </div>
          <p className="text-sm text-center text-gray-500">
            Hot Line | Terms of Service | Privacy Policy | Cookie Policy
          </p>
          <div className="flex flex-col items-start gap-2">
            <p className="font-bold text-black">Contact Us</p>
            <div className="flex gap-x-2">
              <Facebook className="w-6 h-6 text-black" />
              <Instagram className="w-6 h-6 text-black" />
              <Linkedin className="w-6 h-6 text-black" />
              <Twitter className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
