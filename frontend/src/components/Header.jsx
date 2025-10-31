import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap gradient-primary rounded-2xl px-6 md:px-10 lg:px-20 shadow-2xl overflow-hidden">
      {/*-------Left Side------*/}
      <motion.div
        className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.p
          className="text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight md:leading-tight lg:leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Book Services <br />
          <span className="text-yellow-300">With Trusted Professionals</span>
        </motion.p>

        <motion.div
          className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.img
            className="w-28 animate-float"
            src={assets.group_profiles}
            alt="Trusted professionals"
          />
          <p className="text-gray-100">
            Easily explore our wide range of trusted professionals,
            <br className="hidden sm:block" />
            book your appointments effortlessly.
          </p>
        </motion.div>

        <motion.a
          className="group flex items-center gap-2 bg-white px-8 py-4 rounded-full text-gray-700 font-semibold text-sm m-auto md:m-0 hover:scale-105 hover:shadow-xl transition-all duration-300 hover-glow"
          href="#Services"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Book Appointment
          <motion.img
            className="w-3 group-hover:translate-x-1 transition-transform duration-300"
            src={assets.arrow_icon}
            alt="Arrow"
          />
        </motion.a>
      </motion.div>

      {/*-------Right Side------*/}
      <motion.div
        className="md:w-1/2 relative"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <motion.img
          className="w-full md:absolute bottom-0 h-auto rounded-lg shadow-2xl"
          src={assets.header1}
          alt="Professional services"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        />
        {/* Decorative elements */}
        <motion.div
          className="absolute top-4 right-4 w-20 h-20 bg-yellow-300 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-4 w-16 h-16 bg-white rounded-full opacity-10"
          animate={{
            y: [0, -10, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default Header;
