// Function to handles every guest count by adding and subtracting the number of guest count
export const guestCountHandler = (
  currentCount: number,
  setCount: React.Dispatch<React.SetStateAction<number>>,
  countChange: number,
  minLimit: number,
  maxLimit: number
) => {
  setCount(Math.max(minLimit, Math.min(maxLimit, currentCount + countChange)));
};

export const guestExceedTracker = (
  currentCount: number,
  baseLimit: number,
  extraChargePerHead: number,
  setBookingPrice: React.Dispatch<React.SetStateAction<number>>
) => {
  const excessCount = Math.max(0, currentCount - baseLimit);
  const totalAdditionalCharge = excessCount * extraChargePerHead;

  setBookingPrice((prevPrice) => {
    const previousExcessCount = Math.max(0, currentCount - baseLimit - 1); // Adjust for the previous state
    const previousCharge = previousExcessCount * extraChargePerHead;

    // Update the price by removing the previous excess charge and adding the current one
    return prevPrice - previousCharge + totalAdditionalCharge;
  });
};

// Function to calculate the total nights from check in to check out
export const computeNights = (checkIn: Date, checkOut: Date) => {
  const timeDifference = checkOut.getTime() - checkIn.getTime();

  // Convert the difference from milliseconds to days
  const nights = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return nights;
};

// Function to set prices for the months
export const setPricesForMonth = (specificDatePrices: {
  [key: string]: number;
}) => {
  // Setting prices for the dates
  const getStaticPriceForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];

    // Check if the date has a specific price
    if (specificDatePrices[dateString]) {
      return specificDatePrices[dateString];
    }

    let dayOfWeek = date.getDay();

    if (dayOfWeek === 6 || dayOfWeek === 5) {
      return 4000; // Fixed price for weekends
    }

    // Weekday Pricing (Monday to Friday)
    return 3000; // Fixed price for weekdays
  };

  // Setting prices for how many months
  const prices: { [key: string]: number } = {};
  const currentDate = new Date();
  currentDate.setDate(0);

  const endDate = new Date(currentDate);
  endDate.setMonth(endDate.getMonth() + 4);
  endDate.setDate(1);

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split("T")[0];
    prices[dateString] = getStaticPriceForDate(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return prices;
};

// Function to calculate the total price of the check in of the guest
export const calculateTotalDatePrice = (
  from: Date,
  to: Date,
  datePrices: { [key: string]: number }
) => {
  let totalPrice = 0;
  let currentDate = new Date(from);

  // Iterate over the date range and calculate total price
  while (currentDate < to) {
    const dateString = currentDate.toISOString().split("T")[0];
    if (datePrices[dateString]) {
      totalPrice += datePrices[dateString];
    }
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return totalPrice;
};
