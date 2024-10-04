"use client";

export default function ReservationLoading() {
  return (
    <div className="animate-pulse">
      <section className="grid md:grid-cols-3 gap-x-4 gap-y-4 m-28">
        <div className="col-span-1 w-full space-y-4">
          <div className="h-[80px] border border-white rounded-lg bg-white"></div>
          <div className="h-[80px] border border-white rounded-lg bg-white"></div>
          <div className="h-[80px] border border-white rounded-lg bg-white"></div>
          <div className="h-[80px] border border-white rounded-lg bg-white"></div>
        </div>
        <div className="col-span-2 h-[270px] w-full p-5 border border-white rounded-lg bg-white"></div>
      </section>
    </div>
  );
}
