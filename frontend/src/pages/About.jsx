import React from 'react'
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-primary">US</span>
        </p>
      </div>
      <div className="flex flex-col my-10 md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px] rounded-lg shadow-lg"
          src={assets.about1}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            At HomeServe, we understand the hassle of finding reliable home
            service professionals for your everyday needs. Whether it's
            plumbing, cleaning, electrical repairs, or any other household
            service, HomeServe makes the process simple, fast, and stress-free.
          </p>
          <p>
            We are dedicated to revolutionizing the way homeowners connect with
            trusted service providers. With an easy-to-use platform, real-time
            booking updates, and verified professionals, HomeServe ensures
            top-quality service at your convenience. Whether you're scheduling a
            quick fix or planning a major home improvement, we've got you
            covered.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            Our vision at HomeServe is to create a seamless and efficient way
            for users to book home services with confidence. We bridge the gap
            between homeowners and skilled professionals, ensuring reliable,
            affordable, and high-quality services—whenever you need them. Let
            HomeServe simplify your home maintenance, so you can focus on what
            matters most!
          </p>
        </div>
      </div>
      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row  mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b> Trusted Professionals</b>
          <p>
            All our service providers are verified, experienced, and
            background-checked to ensure high-quality service and customer
            satisfaction.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Quick & Easy Booking</b>
          <p>
            Book services instantly with just a few clicks. Get real-time
            updates and hassle-free scheduling at your convenience.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Satisfaction Guaranteed</b>
          <p>
            We prioritize customer satisfaction and ensure high-quality service.
            If you're not happy, we'll make it right!
          </p>
        </div>
      </div>
    </div>
  );
}

export default About
