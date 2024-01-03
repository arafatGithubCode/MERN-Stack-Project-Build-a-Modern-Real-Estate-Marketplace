import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Navigation, Pagination, Scrollbar, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

import { FaShare } from "react-icons/fa6";

const Listing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listing, setListing] = useState(null);
  const [copied, setCopied] = useState(false);

  const params = useParams();

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
        </div>
      )}
    </main>
  );
};

export default Listing;
