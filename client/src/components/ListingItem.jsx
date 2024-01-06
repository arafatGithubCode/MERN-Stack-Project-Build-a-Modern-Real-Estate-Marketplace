import PropTypes, { array, bool, number, string } from "prop-types";
import { Link } from "react-router-dom";

import { FaMapMarkerAlt } from "react-icons/fa";

const ListingItem = ({ listing }) => {
  return (
    <div className="bg-white rounded-lg hover:shadow-lg w-full sm:w-[330px] shadow-sm transition-shadow overflow-hidden">
      <Link to={`/listing/${listing._id}`}>
        <img
          className="w-full rounded-lg h-[320px] sm:h-[220px] object-cover hover:scale-105 transition-scale duration-200 ease-in-out"
          src={listing.imageUrls[0]}
          alt="Image"
        />
        <div className="flex flex-col gap-2 p-3 w-full">
          <p className="font-semibold text-xl text-slate-700">{listing.name}</p>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-green-700" />
            <p className="text-sm truncate">{listing.address}</p>
          </div>
          <p className="text-sm truncate overflow-hidden display: -webkit-box -webkit-box-orient: vertical -webkit-line-clamp: 2">
            {listing.description}
          </p>
          <p>
            $
            {listing.offer
              ? listing.discountedPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}{" "}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center gap-3 flex-wrap font-semibold text-sm">
            <span>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Beds`
                : `${listing.bedrooms} Bed`}
            </span>
            <span>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Baths`
                : `${listing.bathrooms} Bath`}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

ListingItem.propTypes = {
  listing: PropTypes.shape({
    name: string,
    imageUrls: array,
    address: string,
    description: string,
    offer: bool,
    discountedPrice: number,
    regularPrice: number,
    type: string,
    bedrooms: number,
    bathrooms: number,
    _id: string,
  }),
};

export default ListingItem;
