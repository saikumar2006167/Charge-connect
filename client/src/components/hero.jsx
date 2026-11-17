import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaBolt,
  FaArrowRight,
  FaChargingStation,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaExclamationTriangle } from "react-icons/fa";

const evImages = [
  "/images/ev1.jpg",
  "/images/ev2.jpg",
  "/images/ev3.jpg",
  "/images/ev4.jpg",
  "/images/ev5.jpg",
  "/images/ev6.jpg",
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="relative min-h-screen overflow-hidden text-white bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(5,8,22,.82),rgba(5,8,22,.94)),url('/images/hero-bg.jpg')",
      }}
    >

      {/* Glow */}

      <div className="absolute w-[600px] h-[600px] rounded-full bg-green-500/20 blur-[180px] -left-44 -top-40"></div>

      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[180px] right-0 bottom-0"></div>

      <div className="relative max-w-7xl mx-auto px-8 pt-28 pb-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <motion.div
            initial={{
              opacity: 0,
              x: -60,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 1,
            }}
          >

            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2">

              <FaBolt className="text-yellow-400" />

              <span className="text-sm">
                India's Smart EV Charging Platform
              </span>

            </div>

            <h1 className="text-6xl lg:text-8xl font-black leading-tight mt-8">

              Charge

              <span className="block text-green-400">
                Smarter
              </span>

              <span className="block">
                Drive Further
              </span>

            </h1>

            <p className="text-xl text-gray-300 leading-9 mt-8 max-w-xl">

              Find nearby EV charging stations, reserve charging slots,
              navigate instantly and enjoy restaurants, cafés and hotels
              while your EV charges.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <button
  onClick={() => navigate("/stations")}
  className="bg-gradient-to-r from-green-500 to-emerald-400 px-10 py-5 rounded-2xl text-xl font-bold hover:scale-105 transition flex items-center gap-3"
>

                Find Station

                <FaArrowRight />

              </button>
                <button
  onClick={() => navigate("/route-planner")}
  className="border border-white/20 backdrop-blur-xl px-8 py-4 rounded-2xl text-lg hover:bg-white hover:text-black transition"
>
                Explore

              </button>

     

            </div>

            <div className="grid grid-cols-3 gap-6 mt-14">

              <div>

                <h2 className="text-4xl font-black text-green-400">
                  500+
                </h2>

                <p className="text-gray-400 mt-2">
                  Charging Stations
                </p>

              </div>

              <div>

                <h2 className="text-4xl font-black text-cyan-400">
                  24/7
                </h2>

                <p className="text-gray-400 mt-2">
                  Availability
                </p>

              </div>

              <div>

                <h2 className="text-4xl font-black text-yellow-400">
                  50K+
                </h2>

                <p className="text-gray-400 mt-2">
                  Happy Users
                </p>

              </div>

            </div>

          </motion.div>

          {/* Right */}

          <motion.div
            initial={{
              opacity: 0,
              x: 60,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="relative"
          >
          

            <motion.div
              animate={{
                y: [0, 18, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="absolute bottom-8 -right-8 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl"
            >

              <div className="flex items-center gap-4">

                <FaMapMarkerAlt className="text-green-400 text-3xl" />

                <div>

                  <h3 className="font-bold text-lg">
                    Live Stations
                  </h3>

                  <p className="text-sm text-gray-300">
                    500+ Nearby
                  </p>

                </div>

              </div>

            </motion.div> 

            {/* Main Card */}

            <div className="relative overflow-hidden rounded-[35px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,.5)]">

              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-cyan-500/10"></div>

              <img
                src={evImages[0]}
                alt="EV Charging"
                className="relative w-full h-[470px] object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent">

                <h2 className="text-3xl font-black">
                  Premium EV Network
                </h2>

                <p className="text-gray-300 mt-3">
                  Reserve, Navigate & Charge with one tap.
                </p>

                <div className="grid grid-cols-3 gap-4 mt-8">

                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-center">

                    <h3 className="text-3xl font-black text-green-400">
                      45
                    </h3>

                    <p className="text-sm text-gray-300">
                      Available
                    </p>

                  </div>

                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-center">

                    <h3 className="text-3xl font-black text-cyan-400">
                      18
                    </h3>

                    <p className="text-sm text-gray-300">
                      Busy
                    </p>

                  </div>

                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 text-center">

                    <h3 className="text-3xl font-black text-yellow-400">
                      6
                    </h3>

                    <p className="text-sm text-gray-300">
                      Cities
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </motion.div>
        </div>

        {/* Infinite Image Slider */}

        <div className="mt-24 overflow-hidden relative">

        {/* Left Gradient */}
          <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#050816] to-transparent z-20"></div>

          {/* Right Gradient */}
          <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#050816] to-transparent z-20"></div>

          <motion.div
            className="flex gap-8 w-max"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: "linear",
            }}
          >

            {[...evImages, ...evImages].map((img, index) => (

              <motion.div
                key={index}
                whileHover={{
                  scale: 1.06,
                  y: -10,
                }}
                className="relative min-w-[360px] rounded-3xl overflow-hidden"
              >

                <img
                  src={img}
                  alt="EV Charging"
                  className="w-[360px] h-[240px] object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                <div className="absolute bottom-6 left-6">

                  <h3 className="text-2xl font-bold">
                    ChargeConnect
                  </h3>

                  <p className="text-gray-300 mt-2">
                    Smart EV Charging Platform
                  </p>

                </div>

              </motion.div>

            ))}

          </motion.div>

        </div>

        {/* Feature Cards */}

        <div className="grid md:grid-cols-3 gap-8 mt-28">

          <motion.div
            whileHover={{
              y: -12,
              scale: 1.02,
            }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
          >

            <FaChargingStation className="text-5xl text-green-400 mb-6" />

            <h2 className="text-2xl font-bold">
              Smart Booking
            </h2>

            <p className="text-gray-400 mt-5 leading-8">
              Reserve charging slots instantly and avoid waiting queues with real-time availability.
            </p>

          </motion.div>

          <motion.div
            whileHover={{
              y: -12,
              scale: 1.02,
            }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
          >

            <FaMapMarkerAlt className="text-5xl text-cyan-400 mb-6" />

            <h2 className="text-2xl font-bold">
              Live Navigation
            </h2>

            <p className="text-gray-400 mt-5 leading-8">
              Locate nearby charging stations with Google Maps integration and live directions.
            </p>

          </motion.div>

          <motion.div
            whileHover={{
              y: -12,
              scale: 1.02,
            }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
          >

            <FaBolt className="text-5xl text-yellow-400 mb-6" />

            <h2 className="text-2xl font-bold">
              Ultra Fast Charging
            </h2>

            <p className="text-gray-400 mt-5 leading-8">
              Experience lightning-fast charging with premium DC fast chargers across India.
            </p>

          </motion.div>

        </div>

        {/* CTA */}

        <motion.div
          initial={{
            opacity: 0,
            y: 80,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          viewport={{
            once: true,
          }}
          className="mt-28 text-center">

        <h2 className="text-5xl lg:text-6xl font-black leading-tight">

            Ready To

            <span className="block text-green-400">
              Charge Smarter?
            </span>

          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mt-8 leading-9">

            Experience the next generation EV charging platform with
            intelligent booking, live station availability, route planning,
            and seamless charging across India.

          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-12">

            <button
  onClick={() => navigate("/stations")}
  className="bg-gradient-to-r from-green-500 to-emerald-400 px-10 py-5 rounded-2xl text-xl font-bold hover:scale-105 transition flex items-center gap-3"
>
              Find Charging Station

              <FaArrowRight />

            </button>

            <button
  onClick={() => navigate("/contact")}
  className="border border-white/20 bg-white/5 backdrop-blur-xl px-10 py-5 rounded-2xl text-xl hover:bg-white hover:text-black transition"
>

              Learn More

            </button>

                     <button
  onClick={() => navigate("/emergency")}
  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-lg font-bold flex items-center gap-3 hover:scale-105 transition"
>
  <FaExclamationTriangle />
  Emergency
</button>

          </div>

        </motion.div>

      </div>

    </section>
  );
}