import React from "react";
import { motion } from "framer-motion";
import { specialityData } from "../assets/assets";
import { Link } from "react-router-dom";

const ServiceMenu = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      id="Services"
      className="flex flex-col items-center gap-6 py-16 text-gray-800"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.h1
        className="text-4xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Find Services
      </motion.h1>

      <motion.p
        className="sm:w-1/3 text-center text-gray-600 text-base leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        Simply explore our extensive list of trusted home service professionals
        and book your service hassle-free.
      </motion.p>

      <motion.div
        className="flex sm:justify-center gap-6 pt-8 w-full overflow-x-auto custom-scrollbar pb-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {specialityData.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.1,
              y: -10,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              onClick={() => window.scrollTo(0, 0)}
              className="group flex flex-col items-center text-xs cursor-pointer flex-shrink-0 p-4 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover-glow min-w-[100px]"
              to={`/servicers/${item.speciality}`}
            >
              <motion.div
                className="w-12 sm:w-16 mb-3 p-3 rounded-full bg-gradient-to-br from-primary/10 to-green-100 group-hover:from-primary/20 group-hover:to-green-200 transition-all duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  className="w-full h-full object-contain"
                  src={item.image}
                  alt={item.speciality}
                />
              </motion.div>
              <p className="font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300 text-center">
                {item.speciality}
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ServiceMenu;
