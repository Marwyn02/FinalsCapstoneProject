import { Review } from "../lib/types/types";

export const ratingTextMap: { [key: number]: string } = {
  0: "No Ratings yet",
  1: "Good",
  2: "Fair",
  3: "Average",
  4: "Great",
  5: "Very Good",
};

// Function to get the label description based on the average rating
export const getRatingText = (averageRating: number) => {
  const roundedRating = Math.round(averageRating);
  return ratingTextMap[roundedRating] || "No Ratings Yet";
};

// Function to calculate the total average rating across all categories
export const calculateOverallAverageRating = (
  reviews: Review[],
  properties: (keyof Review)[]
) => {
  const totalRatingsSum = reviews.reduce((acc, review) => {
    const totalForOneReview = properties.reduce(
      (sum, property) => sum + Number(review[property]),
      0
    );
    return acc + totalForOneReview;
  }, 0);

  const totalPropertiesCount = properties.length * reviews.length;
  return totalRatingsSum / totalPropertiesCount;
};

// Function to calculate the total rating for a single review
export const calculateSingleReviewTotal = (
  review: Review,
  properties: (keyof Review)[]
) => {
  const totalForOneReview = properties.reduce(
    (sum, property) => sum + Number(review[property]), // Summing up the ratings for the properties in the review
    0
  );
  const averageRatingForReview = totalForOneReview / properties.length; // Calculate the average rating for that review
  return averageRatingForReview; // Return the average rating of the single review
};

// Function to calculate the average rating for a specific property
export const calculateAverageRatingForProperty = (
  reviews: Review[],
  property: keyof Review
) => {
  const total = reviews.reduce(
    (acc, review) => acc + Number(review[property]),
    0
  );
  return total / reviews.length;
};