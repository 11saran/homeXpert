import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopServicers = () => {
  const navigate = useNavigate();
  const { servicers, getImageUrl } = useContext(AppContext);

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

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-6 my-16 text-gray-900 md:mx-10"
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
        Top Servicers to Book
      </motion.h1>

      <motion.p
        className="sm:w-1/3 text-center text-gray-600 text-base leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        Simply explore our wide range of trusted home service professionals.
      </motion.p>

      <motion.div
        className="w-full grid grid-cols-auto gap-6 pt-8 px-3 sm:px-0"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {servicers.slice(0, 10).map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            onClick={() => {
              if (item.available) navigate(`/booking/${item._id}`);
            }}
            className={`group relative border border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 hover-lift shadow-lg hover:shadow-2xl
                ${
                  item.available
                    ? "cursor-pointer hover:scale-105"
                    : "cursor-not-allowed opacity-60"
                }`}
            whileHover={{
              scale: item.available ? 1.02 : 1,
              y: item.available ? -5 : 0,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative overflow-hidden">
              <motion.img
                src={
                  item.image
                    ? getImageUrl(item.image)
                    : "/placeholder-service.jpg"
                }
                alt={item.name}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Status Badge */}
              {/* <motion.div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm
                  ${
                    item.available
                      ? "bg-green-500/90 text-white"
                      : "bg-red-500/90 text-white"
                  }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {item.available ? "Available" : "Unavailable"}
              </motion.div> */}
            </div>

            <div className="p-6 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <motion.div
                  className={`w-3 h-3 rounded-full
                    ${item.available ? "bg-green-500" : "bg-red-500"}`}
                  animate={{
                    scale: item.available ? [1, 1.2, 1] : 1,
                    opacity: item.available ? [1, 0.7, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: item.available ? Infinity : 0,
                  }}
                />
                <span
                  className={`text-sm font-medium
                  ${item.available ? "text-green-600" : "text-red-600"}`}
                >
                  {item.available ? "Available Now" : "Not Available"}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                {item.name}
              </h3>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-semibold text-gray-700">District:</span>{" "}
                  {item.district}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Service:</span>{" "}
                  {item.speciality}
                </p>
              </div>

              {item.available && (
                <motion.div
                  className="mt-4 text-primary font-semibold text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  Click to book →
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        onClick={() => {
          navigate("/servicers");
          scrollTo(0, 0);
        }}
        className="group bg-gradient-to-r from-primary to-green-600 text-white px-12 py-4 rounded-full mt-10 font-bold text-lg hover:shadow-xl transition-all duration-300 hover-glow"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="group-hover:tracking-wide transition-all duration-300">
          View More Servicers
        </span>
      </motion.button>
    </motion.div>
  );
};

export default TopServicers;
