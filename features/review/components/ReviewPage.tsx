"use client";

import React, { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import ReviewInsert from "@/app/api/review/ReviewInsert";
import { CreateReply } from "@/features/reply/api/CreateReply";
import { Admin, Reply, Review } from "@/app/lib/types/types";
import {
  ratingTextMap,
  calculateAverageRatingForProperty,
  calculateOverallAverageRating,
  calculateSingleReviewTotal,
} from "@/app/utils/ReviewHelpers";
import {
  BadgeCheck,
  ChevronDown,
  LoaderCircle,
  Reply as ReplyIcon,
} from "lucide-react";

import { Rating } from "@mui/material";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

// Property label mapping
const propertyLabels: Record<keyof Review, string> = {
  rating: "",
  staff: "Staff",
  valueForMoney: "Value for money",
  facilities: "Facilities",
  location: "Location",
  cleanliness: "Cleanliness",
  comfort: "Comfort",
  id: "",
  reviewId: "",
  firstName: "",
  lastName: "",
  message: "",
  createdAt: "",
  updatedAt: "",
  reservationId: "",
  status: "",
  isDeleted: "",
  reply: "",
  addedByAdmin: "",
  removedByAdmin: "",
};

const formSchema = z.object({
  message: z.string(),
});

const reviewSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name must contain only letters and spaces.",
    }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Last name must contain only letters and spaces.",
    }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(500, { message: "Message must not exceed 500 characters." })
    .regex(/^[a-zA-Z0-9\s.,!?'"-]+$/, {
      message: "Message contains invalid characters.",
    }),
  staff: z
    .number({ required_error: "Staff rating is required." })
    .min(1, { message: "Rating must be at least 1." })
    .max(5, { message: "Rating cannot exceed 5." })
    .nullable()
    .transform((val) => val ?? 0),
  valueForMoney: z
    .number({ required_error: "Value for money rating is required." })
    .min(1, { message: "Rating must be at least 1." })
    .max(5, { message: "Rating cannot exceed 5." })
    .nullable()
    .transform((val) => val ?? 0),
  facilities: z
    .number({ required_error: "Facilities rating is required." })
    .min(1, { message: "Rating must be at least 1." })
    .max(5, { message: "Rating cannot exceed 5." })
    .nullable()
    .transform((val) => val ?? 0),
  cleanliness: z
    .number({ required_error: "Cleanliness rating is required." })
    .min(1, { message: "Rating must be at least 1." })
    .max(5, { message: "Rating cannot exceed 5." })
    .nullable()
    .transform((val) => val ?? 0),
  location: z
    .number({ required_error: "Location rating is required." })
    .min(1, { message: "Rating must be at least 1." })
    .max(5, { message: "Rating cannot exceed 5." })
    .nullable()
    .transform((val) => val ?? 0),
  comfort: z
    .number({ required_error: "Comfort rating is required." })
    .min(1, { message: "Rating must be at least 1." })
    .max(5, { message: "Rating cannot exceed 5." })
    .nullable()
    .transform((val) => val ?? 0),
});

export default function ReviewsPage({
  reviews = [],
  admin,
  replies,
}: {
  reviews?: Review[];
  admin: Admin;
  replies: Reply[];
}) {
  const [showReply, setShowReply] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewSubmit, setReviewSubmit] = useState(false);
  const [message, setMessage] = useState("Submit");
  const [currentReviewId, setCurrentReviewId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("mostRecent");
  const [filter, setFilter] = useState("Most Recent");

  const reviewForm = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      staff: 0,
      valueForMoney: 0,
      facilities: 0,
      cleanliness: 0,
      location: 0,
      comfort: 0,
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onReviewSubmit = async (values: z.infer<typeof reviewSchema>) => {
    setIsSubmit(true);

    const uuid = uuidv4().slice(0, 13).toUpperCase();

    const data = {
      reviewId: uuid,
      firstName: values.firstName.toLowerCase().toString(),
      lastName: values.lastName.toLowerCase().toString(),
      message: values.message,
      staff: values.staff.toString(),
      valueForMoney: values.valueForMoney.toString(),
      facilities: values.facilities.toString(),
      cleanliness: values.cleanliness.toString(),
      location: values.location.toString(),
      comfort: values.comfort.toString(),
      status: "pending",
    };

    if (data) {
      await ReviewInsert(data);
      setShowReview(false);
      setIsSubmit(false);
      setReviewSubmit(true);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmit(true);
      setMessage("Submitting your reply...");

      const uuid = uuidv4().slice(0, 13).toUpperCase();

      if (values && currentReviewId && admin.adminId) {
        const data = {
          replyId: uuid,
          message: values.message,
          author: admin.username,
          reviewId: currentReviewId,
          adminId: admin.adminId,
        };

        await CreateReply(data);
      }

      setMessage("Reply done");
    } catch (error) {
      setIsSubmit(false);
      setMessage("Reply submission failed");
    }
  };

  const properties: (keyof Review)[] = useMemo(
    () => [
      "staff",
      "valueForMoney",
      "facilities",
      "location",
      "cleanliness",
      "comfort",
    ],
    []
  );

  // Function to get the label description based on the average rating
  const getRatingText = (averageRating: number) => {
    const roundedRating = Math.round(averageRating);
    return ratingTextMap[roundedRating] || "No Ratings Yet";
  };

  // To compute the total for all reviews
  const overallAverageRating = useMemo(
    () => calculateOverallAverageRating(reviews, properties),
    [reviews, properties]
  );

  // To compute the total for a single review, you can call the function for that specific review
  const singleReviewTotal = useMemo(
    () => calculateSingleReviewTotal(reviews[0], properties), // Calculate for the first review
    [reviews, properties]
  );

  const toggleReplyMessage = (reviewId: string) => {
    setCurrentReviewId(reviewId);
    setShowReply(!showReply);
  };

  // Filtered reviews logic
  const filteredReviews = [...reviews].sort((a, b) => {
    if (filterType === "highRated") {
      return (Number(b.rating) ?? 0) - (Number(a.rating) ?? 0); // High rated first
    } else if (filterType === "lowRated") {
      return (Number(a.rating) ?? 0) - (Number(b.rating) ?? 0); // Low rated first
    } else if (filterType === "mostRecent") {
      return (
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
      ); // Most recent first
    }
    return 0;
  });

  useEffect(() => {
    if (filterType === "highRated") {
      setFilter("High Rated");
    } else if (filterType === "lowRated") {
      setFilter("Low Rated");
    } else if (filterType === "mostRecent") {
      setFilter("Most Recent");
    }
  }, [filterType]);

  const handleToggleReview = () => {
    setShowReview(!showReview);
  };
  return (
    <main className="py-5 md:py-10 px-5 lg:px-40 bg-white">
      <section>
        <div className="-space-y-1">
          <h2 className="text-4xl font-medium font-teko uppercase">Reviews</h2>
          <p>Hear what our guests have to say about their stay.</p>
        </div>

        <div className="pb-5 md:pb-8">
          <div className="flex flex-col justify-center items-center pb-8 pt-4 gap-y-2.5 text-center">
            <div>
              <p className="text-8xl font-bold">
                {overallAverageRating ? overallAverageRating.toFixed(1) : "0"}
              </p>

              <p className="text-lg font-semibold">
                {/* Labeled rating */}
                {overallAverageRating
                  ? getRatingText(overallAverageRating)
                  : "No ratings yet"}
              </p>
            </div>

            <Rating
              name="half-rating"
              defaultValue={Number(overallAverageRating.toFixed(1))}
              precision={0.5}
              readOnly
              size="large"
            />
          </div>

          <div className="mt-5 px-5 lg:px-0 grid grid-cols-2 lg:grid-cols-6 gap-y-2 gap-x-4">
            {/* Loop through each property and display the average rating and corresponding label */}
            {properties.map((property) => {
              const averageRating = calculateAverageRatingForProperty(
                reviews,
                property
              );
              return (
                <div key={property} className="border-r border-gray-400 py-1">
                  <p className="text-xl font-semibold">
                    {averageRating ? averageRating.toFixed(1) : "0.0"}
                  </p>
                  <h4 className="text-sm lg:text-base text-gray-700">
                    {propertyLabels[property]}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>

        <section className="mt-5 pt-6 border-t border-gray-400 space-y-3">
          <div className="flex justify-between items-start">
            <button
              className={`px-4 py-2 rounded-lg ${
                !showReview ? "bg-stone-100" : "bg-yellow-50 hover:bg-stone-50"
              } hover:bg-yellow-50 duration-300 text-[15px] font-medium flex items-center`}
              onClick={handleToggleReview}
            >
              Leave a review <ChevronDown className="h-4 w-4" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-min rounded-lg ring-0 outline-none bg-stone-100 flex items-center gap-x-1"
                >
                  <p>{filter}</p>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setFilterType("mostRecent")}
                  className={
                    filterType === "mostRecent"
                      ? "bg-gray-100 font-semibold"
                      : ""
                  }
                >
                  Most Recent
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterType("highRated")}
                  className={
                    filterType === "highRated"
                      ? "bg-gray-100 font-semibold"
                      : ""
                  }
                >
                  High Rated
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterType("lowRated")}
                  className={
                    filterType === "lowRated" ? "bg-gray-100 font-semibold" : ""
                  }
                >
                  Low Rated
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {showReview && (
            <section className="border rounded-lg p-5">
              <Form {...reviewForm}>
                <form
                  onSubmit={reviewForm.handleSubmit(onReviewSubmit)}
                  className="grid grid-cols-1 gap-y-5 md:gap-y-0 lg:grid-cols-3 gap-x-2 "
                >
                  <div className="space-y-4">
                    <FormField
                      control={reviewForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl className="text-start">
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={reviewForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="block lg:hidden">
                          <FormControl className="text-start">
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-x-2 justify-between px-4">
                      <FormField
                        control={reviewForm.control}
                        name="staff"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Staff</FormLabel>
                            <FormControl className="text-start">
                              <Rating
                                name="half-rating"
                                defaultValue={0}
                                precision={1}
                                size="large"
                                value={field.value}
                                onChange={(event, newValue) => {
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={reviewForm.control}
                        name="valueForMoney"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Value for Money</FormLabel>
                            <FormControl className="text-start">
                              <Rating
                                name="half-rating"
                                defaultValue={0}
                                precision={1}
                                size="large"
                                value={field.value}
                                onChange={(event, newValue) => {
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-between gap-x-2 px-4">
                      <FormField
                        control={reviewForm.control}
                        name="facilities"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Facilities</FormLabel>
                            <FormControl className="text-start">
                              <Rating
                                name="half-rating"
                                defaultValue={0}
                                precision={1}
                                size="large"
                                value={field.value}
                                onChange={(event, newValue) => {
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={reviewForm.control}
                        name="cleanliness"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Cleanliness</FormLabel>
                            <FormControl className="text-start">
                              <Rating
                                name="half-rating"
                                defaultValue={0}
                                precision={1}
                                size="large"
                                value={field.value}
                                onChange={(event, newValue) => {
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>{" "}
                  <div className="space-y-4">
                    {" "}
                    <FormField
                      control={reviewForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="hidden lg:block">
                          <FormControl className="text-start">
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-between gap-x-2 px-4">
                      <FormField
                        control={reviewForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Location</FormLabel>
                            <FormControl className="text-start">
                              <Rating
                                name="half-rating"
                                defaultValue={0}
                                precision={1}
                                size="large"
                                value={field.value}
                                onChange={(event, newValue) => {
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={reviewForm.control}
                        name="comfort"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Comfort</FormLabel>
                            <FormControl className="text-start">
                              <Rating
                                name="half-rating"
                                defaultValue={0}
                                precision={1}
                                size="large"
                                value={field.value}
                                onChange={(event, newValue) => {
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>{" "}
                  <div className="space-y-2">
                    <FormField
                      control={reviewForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl className="text-start">
                            <Textarea
                              placeholder="Enter your message here."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isSubmit || reviewSubmit}>
                      {!isSubmit ? (
                        "Submit"
                      ) : isSubmit ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : reviewSubmit ? (
                        "Review Submitted"
                      ) : (
                        ""
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </section>
          )}

          {reviewSubmit && (
            <section className="border rounded-lg p-5">
              <div>
                <p className="text-center">
                  Thank you for leaving your review!
                </p>
              </div>
            </section>
          )}

          <section className="h-screen overflow-scroll grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-8 md:pt-5">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((r: Review) => {
                const matchedReply = replies.find(
                  (reply: Reply) => reply.reviewId === r.reviewId
                );
                return (
                  <div
                    key={r.id}
                    className="h-auto w-full lg:w-[500px] space-y-2"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-yellow-700 font-semibold text-[17px] capitalize">
                          {r.firstName + " " + r.lastName}
                        </h4>
                      </div>

                      <div className="flex gap-x-3 items-center">
                        <Rating
                          name="half-rating"
                          defaultValue={Number(r.rating)}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                        <p className="text-[15px] text-gray-700">
                          {r.createdAt.toLocaleString("en-US", {
                            month: "long",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-5 rounded-lg">
                      <p>{r.message}</p>
                    </div>

                    {/* Reply */}
                    {matchedReply ? (
                      <div className="bg-stone-200 px-4 py-3 rounded-lg ml-6 md:ml-14">
                        <div className="space-y-3">
                          <div className="flex items-center gap-x-1.5">
                            <p className="font-medium capitalize">
                              {matchedReply.author}{" "}
                            </p>
                            <BadgeCheck className="h-5 w-5 text-green-500" />

                            <p className="text-sm font-light ml-1">
                              {matchedReply.createdAt?.toLocaleString("en-US", {
                                month: "long",
                                day: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>{" "}
                          <p>{matchedReply.message}</p>
                        </div>
                      </div>
                    ) : (
                      admin && (
                        <div>
                          <div className="flex justify-end">
                            <Button
                              variant={"ghost"}
                              className="w-min"
                              onClick={() => toggleReplyMessage(r.reviewId)}
                            >
                              <p className="flex items-center gap-x-1 text-sm">
                                Reply <ReplyIcon className="h-4 w-4" />
                              </p>
                            </Button>
                          </div>

                          {showReply && currentReviewId === r.reviewId && (
                            <Form {...form}>
                              <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-3"
                              >
                                <FormField
                                  control={form.control}
                                  name="message"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Message</FormLabel>
                                      <FormControl className="text-start">
                                        <Textarea
                                          placeholder="Enter your reply here."
                                          className="resize-none"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <Button type="submit" disabled={isSubmit}>
                                  {message}
                                </Button>
                              </form>
                            </Form>
                          )}
                        </div>
                      )
                    )}
                  </div>
                );
              })
            ) : (
              <p className="py-10 text-center">
                No reviews yet. Be the first to leave a review!
              </p>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
