import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [sellListings, setSellListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSellListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSellListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sell&limit=4");
        const data = await res.json();
        setSellListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <section>
      {/* top */}
      <div className="flex flex-col gap-6 px-3 py-28 max-w-6xl mx-auto">
        <h1 className="text-slate-700 text-3xl lg:text-6xl font-semibold">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <p className="text-xs text-slate-400 lg:text-sm">
          Arafat Estate will help you find your home fast, easy and comfortable.{" "}
          <br />
          Our expert support are always available.
        </p>
        <Link
          to="/search"
          className="text-sm lg:text-lg text-blue-800 font-semibold"
        >
          Let&apos; Start now...
        </Link>
      </div>

      {/* swiper */}
      <Swiper
        modules={[Navigation, Pagination, Scrollbar]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) no-repeat center center / cover`,
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* listing result for offer, sell and rent */}
      <div className="flex flex-col gap-8 max-w-6xl mx-auto my-10 p-3">
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className="my-3">
              <h1 className="font-semibold text-2xl">Recent offers</h1>
              <Link
                to="/search?offer=true"
                className="text-sm hover:underline text-blue-700"
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="my-3">
              <h1 className="font-semibold text-2xl">Recent places for rent</h1>
              <Link
                to="/search?type=rent"
                className="text-sm hover:underline text-blue-700"
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {sellListings && sellListings.length > 0 && (
          <div>
            <div className="my-3">
              <h1 className="font-semibold text-2xl">Recent places for sell</h1>
              <Link
                to="/search?type=sell"
                className="text-sm hover:underline text-blue-700"
              >
                Show more places for sell
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
