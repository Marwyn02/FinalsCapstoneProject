"use client";

type ErrorType = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: any) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
