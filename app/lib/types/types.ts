type Reservation = {
  id: number;
  prefix: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  modeOfPayment: string;
  downpayment?: string | null;
  payment: string;
  reservationId: string;
  adult: string;
  children: string;
  pwd: string | null;
  checkIn: Date;
  checkOut: Date;
  nights?: number;
  status: string;
  // reviewId: string | null;
  updatedAt: Date;
  createdAt: Date;
};

type Review = {
  id: number;
  reviewId: string;
  firstName: string;
  lastName: string;
  message: string;
  rating: string;
  staff: string;
  valueForMoney: string;
  facilities: string;
  cleanliness: string;
  location: string;
  comfort: string;
  status: string;
  reservationId: string | null;
  isDeleted: boolean;
  reply?: any;
  addedByAdmin?: any;
  removedByAdmin?: any;
  updatedAt: Date;
  createdAt: Date;
};

type Profit = {
  id: number;
  profitId: string;
  profit: number;
  bookings: number;
  refund: number;
  month: string;
  year: string;
  updatedAt: Date;
  createdAt: Date;
};

type Admin = {
  name?: string;
  email: string;
  image?: string;
  adminId: string;
  username: string;
  role: string;
  loggedIn: Date | null;
  loggedOut: any;
  isDeleted: boolean;
  createdAt: Date;
  replies?: Reply[];
  repliests?: number;
  addedReplies?: Reply[];
  addedReviews?: Review[];
  addedSpecialPrices?: SpecialPrice[];
  addedVouchers?: Voucher[];
  removedSpecialPrices?: SpecialPrice[];
  removedVouchers?: Voucher[];
  removedReviews?: Review[];
  removedReplies?: Reply[];
  removedReservation?: Reservation[];
};

type Reply = {
  id?: number;
  replyId: string;
  message: string;
  author: string;
  reviewId: string;
  adminId?: string;
  updatedAt?: Date;
  createdAt?: Date;
};

type Voucher = {
  removedByAdmin?: any;
  isDeleted: boolean;
  id?: number | undefined;
  code: string;
  discountAmount: number | null;
  discountPercent: number | null;
  expiryDate: Date | null;
  isActive: boolean;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};

type SpecialPrice = {
  id: string;
  date: Date;
  price: number;
  isActive: boolean;
  isDeleted: boolean;
  removedByAdmin?: any;
  updatedAt?: Date;
};

type Image = {
  removedByAdmin?: any;
  addedByAdmin?: any;
  fileName: string;
  publicId: string;
  addedBy?: any;
  removedBy?: any;
  id: number;
  url: string;
  isDeleted: boolean;
  author: string;
  status: string;
  createdAt: Date;
};

export type {
  Reservation,
  Review,
  Profit,
  Admin,
  Voucher,
  SpecialPrice,
  Reply,
  Image,
};
