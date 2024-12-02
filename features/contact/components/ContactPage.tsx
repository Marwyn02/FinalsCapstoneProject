"use client";

import React from "react";
import { ParallaxBanner } from "react-scroll-parallax";

import ContactForm from "./ContactForm";

const ContactPage = () => {
  return (
    <>
      <ParallaxBanner
        layers={[{ image: "/image/room-2-1.jpg", speed: -15 }]}
        className="w-full h-[300px] object-cover brightness-75 contrast-125"
      />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-5">
        {/* Contact title */}
        <div className="space-y-5 px-5 md:ml-28 py-10">
          <div>
            <h1 className="text-6xl font-semibold font-teko">Contact us</h1>
            <p className="font-semibold">Get in Touch with Us</p>
          </div>

          <p>
            We’re here to help! Whether you have a question about our services,
            need assistance with a booking, or want to share feedback, feel free
            to reach out. Simply fill out the form below and a member of our
            team will get back to you as soon as possible. We aim to respond to
            all inquiries within 72 hours. We value your thoughts and look
            forward to assisting you!
            <br />
            <br />
            We value your thoughts and look forward to assisting you!
          </p>

          <div>
            <p className="font-medium font-teko">Our email address:</p>
            <p className="font-semibold">crisantotransienthouse@gmail.com</p>
          </div>
        </div>

        {/* Contact form */}
        <ContactForm />
      </section>
    </>
  );
};

export default ContactPage;
