import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex gradient-primary rounded-2xl px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {/* Left Side */}
      <motion.div
        className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            Book Appointment
          </motion.p>
          <motion.p
            className="mt-4 text-yellow-300"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            With 100+ Trusted Servicers
          </motion.p>
        </motion.div>

        <motion.button
          onClick={() => {
            navigate("/login");
            scrollTo(0, 0);
          }}
          className="group bg-white text-sm sm:text-base text-gray-700 px-8 py-4 rounded-full mt-6 font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 hover-glow"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="group-hover:tracking-wide transition-all duration-300">
            Create Account
          </span>
        </motion.button>
      </motion.div>

      {/* Right Side */}
      <motion.div
        className="hidden md:block md:w-1/2 lg:w-[370px] relative"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <motion.img
          className="w-[110%] absolute bottom-0 right-0 max-w-md shadow-2xl"
          src={assets.banner1}
          alt="Trusted servicers"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
        />

        {/* Decorative floating elements */}
        <motion.div
          className="absolute top-8 right-8 w-12 h-12 bg-yellow-300 rounded-full opacity-30"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-16 left-4 w-8 h-8 bg-white rounded-full opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Banner;
