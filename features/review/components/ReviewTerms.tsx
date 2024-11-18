import React from "react";

const ReviewTerms = () => {
  return (
    <section className="order-1 bg-white">
      <div className="space-y-3">
        <h1 className="font-medium text-xl md:text-2xl bg-stone-800 px-4 py-4 uppercase md:p-5 text-white tracking-widest">
          Terms for submitting a Review
        </h1>

        <h3 className="font-semibold text-lg px-5">
          Welcome to Crisanto Transient House Reviews!
        </h3>

        <p className="font-medium px-5">
          Thank you for taking the time to share your experience. By leaving a
          review on our website, you agree to the following terms and
          conditions:{" "}
        </p>
        <div className="space-y-5 text-stone-800 text-[15px] px-8">
          <p>
            1. Reviews must reflect your genuine experience during your stay at
            Crisanto Transient House. False, misleading, or fraudulent reviews
            are strictly prohibited.
          </p>

          <p>
            2. Use respectful language and avoid inappropriate, offensive, or
            defamatory remarks. Reviews should aim to provide helpful and
            constructive feedback to enhance the experience for future guests.
          </p>

          <p>
            3. One Review Per Stay Guests are allowed to leave only one review
            per reservation. Once submitted, reviews cannot be edited or
            resubmitted.
          </p>

          <p>
            4. By submitting a review, you grant Crisanto Transient House the
            right to use, display, and share your feedback on our website,
            marketing materials, and social media platforms. You retain
            ownership of your content but grant us a non-exclusive, royalty-free
            license to use it as mentioned above.{" "}
          </p>

          <p>
            5. Your review must not include: Personal information about other
            guests or staff (e.g., names, contact details). Advertising,
            promotional material, or spam. Content unrelated to your stay at
            Crisanto Transient House.
          </p>

          <p>
            6. Moderation Crisanto Transient House reserves the right to
            moderate, edit, or remove reviews that violate these terms.
          </p>

          <p>
            7. Reviews are submitted voluntarily, and no compensation or
            incentives will be provided in exchange for leaving a review.
          </p>

          <p>
            8. Crisanto Transient House is not responsible for the opinions
            expressed in guest reviews.
          </p>

          <p>
            9. By submitting a review, you acknowledge that you have read,
            understood, and agreed to these terms.
          </p>
        </div>
        <p className="font-medium col-span-2 bg-stone-700 text-white px-5 py-2 md:py-5 mt-5">
          If you have any questions or concerns about submitting a review,
          please contact our support team at crisantotransienthouse@gmail.com.
          Thank you for helping us grow and improve! Crisanto Transient House
          Team
        </p>
      </div>
    </section>
  );
};

export default ReviewTerms;
