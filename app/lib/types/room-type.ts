type Room = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type Reservation = {
  id: number;
  room: string;
  checkIn: Date;
  checkOut: Date;
};

export type { Room, Reservation };
