import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "listing is not exist!"));
  if (req.user.id !== listing.userRef)
    return next(404, "You can only delete your own listings!");
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(201).json("listings has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404), "listing is not found");
  if (req.user.id !== listing.userRef)
    return next(errorHandler(404, "You can only update your own listings!"));

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(201).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(401, "listing is not exists!"));
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sell", "rent"] };
    }

    let searchTerm = req.query.searchTerm || " ";

    let sort = req.query.sort || "createdAt";

    let order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      parking,
      furnished,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    res.status(201).json(listings);
  } catch (error) {
    next(error);
  }
};
