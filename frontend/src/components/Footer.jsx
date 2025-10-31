import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const companyLinks = [
    { label: "Home", href: "/" },
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
    { label: "Privacy policy", href: "#" },
  ];

  const contactInfo = [
    { label: "+1-212-456-7890", href: "tel:+12124567890" },
    { label: "homeXpert@gmail.com", href: "mailto:homeXpert@gmail.com" },
  ];

  return (
    <motion.footer
      className="md:mx-10 bg-gradient-to-br from-gray-50 to-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Left Section */}
        <motion.div variants={itemVariants}>
          <motion.img
            className="mb-5 w-40 hover:scale-105 transition-transform duration-300"
            src={assets.logo2}
            alt="HomeXpert Logo"
            whileHover={{ scale: 1.05 }}
          />
          <p className="w-full md:w-2/3 text-gray-600 leading-7 text-base">
            HomeXpert connects you with trusted home service professionals. From
            plumbing to electrical work, we make it easy to find and book
            qualified servicers in your area. Experience hassle-free home
            services with our reliable platform.
          </p>

          {/* Social Media Icons */}
          <motion.div
            className="flex gap-4 mt-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {["Facebook", "Twitter", "Instagram", "LinkedIn"].map(
              (social, index) => (
                <motion.div
                  key={social}
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-xs font-semibold">{social[0]}</span>
                </motion.div>
              )
            )}
          </motion.div>
        </motion.div>

        {/* Center Section */}
        <motion.div variants={itemVariants}>
          <motion.h3
            className="text-xl font-bold mb-6 text-gray-800"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            COMPANY
          </motion.h3>
          <ul className="flex flex-col gap-3">
            {companyLinks.map((link, index) => (
              <motion.li
                key={link.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.a
                  href={link.href}
                  className="text-gray-600 hover:text-primary transition-colors duration-300 block py-1"
                  whileHover={{ x: 5 }}
                >
                  {link.label}
                </motion.a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right Section */}
        <motion.div variants={itemVariants}>
          <motion.h3
            className="text-xl font-bold mb-6 text-gray-800"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            GET IN TOUCH
          </motion.h3>
          <ul className="flex flex-col gap-3">
            {contactInfo.map((contact, index) => (
              <motion.li
                key={contact.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.a
                  href={contact.href}
                  className="text-gray-600 hover:text-primary transition-colors duration-300 flex items-center gap-2 py-1"
                  whileHover={{ x: 5 }}
                >
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  {contact.label}
                </motion.a>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      {/* Copyright Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <motion.hr
          className="border-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
        />
        <motion.p
          className="py-6 text-sm text-center text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          viewport={{ once: true }}
        >
          Copyright © 2025 HomeXpert - All Right Reserved.
        </motion.p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
