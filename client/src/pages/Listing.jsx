import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Navigation, Pagination, Scrollbar, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

import { FaShare } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa";
import { FaParking } from "react-icons/fa";
import { FaChair } from "react-icons/fa";

import { useSelector } from "react-redux";
import Contact from "../components/Contact.jsx";

const Listing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listing, setListing] = useState(null);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  const params = useParams();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && <p className="text-center my-7 font-semibold">Loading...</p>}
      {error && (
        <p className="text-center my-7 font-semibold">something went broke!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, EffectFade]}
            effect="fade"
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
          >
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[500px]"
                  style={{
                    background: `url(${url}) no-repeat center center / cover`,
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[20%] z-10 right-8 bg-slate-100 p-3 rounded-full w-14 h-14 items-center justify-center flex cursor-pointer">
            <FaShare
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
              className="text-slate-700 hover:scale-[1.5] text-xl transition duration-200 ease-in-out"
            />
          </div>
          {copied && (
            <p className="fixed top-[30%] right-8 z-10 bg-slate-100 rounded p-2 text-slate-700">
              Link Copied!
            </p>
          )}
          <div className="flex flex-col gap-4 p-3 max-w-4xl mx-auto">
            <p className="text-2xl font-bold text-black mt-7">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountedPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}{" "}
              {listing.type === "rent" && "/ month"}
            </p>
            <p className="flex items-center justify-start gap-2">
              <FaMapMarkerAlt className="text-green-700" />
              <span className="text-sm text-slate-700">{listing.address}</span>
            </p>
            <div className="flex whitespace-nowrap flex-wrap gap-3">
              <button
                className="bg-red-900 rounded text-white font-semibold text-lg w-full max-w-[150px] text-center sm:max-w-[200px]"
                type="button"
              >
                {listing.type === "rent" ? "For Rent" : "For Sell"}
              </button>
              {listing.offer && (
                <button
                  className="bg-green-900 rounded text-white font-semibold text-lg w-full max-w-[150px] text-center sm:max-w-[200px]"
                  type="button"
                >
                  $ {listing.regularPrice - listing.discountedPrice} discount
                </button>
              )}
            </div>
            <p>
              <span className="text-md font-semibold text-black">
                Description -{" "}
              </span>
              <span className="text-sm text-slate-700">
                {listing.description}
              </span>
            </p>
            <ul className="flex gap-3 flex-wrap mb-7">
              <li className="flex items-center gap-1 text-green-700 text-md font-semibold whitespace-nowrap">
                <FaBed />
                <span>
                  {listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}
                </span>
              </li>
              <li className="flex items-center gap-1 text-green-700 text-md font-semibold whitespace-nowrap">
                <FaBath />
                <span>
                  {listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}
                </span>
              </li>
              <li className="flex items-center gap-1 text-green-700 text-md font-semibold whitespace-nowrap">
                <FaParking />
                <span>{listing.parking > 1 ? "Parking" : "No Parking"}</span>
              </li>
              <li className="flex items-center gap-1 text-green-700 text-md font-semibold whitespace-nowrap">
                <FaChair />
                <span>
                  {listing.furnished > 1 ? "Furnished" : "Not Furnished"}
                </span>
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                className="bg-slate-700 p-3 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-50"
                onClick={() => setContact(true)}
                type="button"
              >
                Contact <span className="lowercase text-yellow-400">to</span>{" "}
                Landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
