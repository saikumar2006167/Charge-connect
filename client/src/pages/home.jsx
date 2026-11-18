import Navbar from "../components/navbar";
import Hero from "../components/hero";
import MapView from "../components/mapview";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      <Navbar />

      <Hero />

      <section className="py-24 bg-gradient-to-b from-[#071320] to-[#02060d]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center">
            Nearby Charging Stations
          </h2>

          <p className="text-center text-gray-400 mt-4 mb-10">
            Find fast, reliable EV charging stations around your location.
          </p>

          <MapView />
        </div>
      </section>
    </div>
  );
}