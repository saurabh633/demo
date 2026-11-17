import { Suspense } from "react";
import { BookingClient } from "@/app/booking/BookingClient";
import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/Skeleton";

function BookingFallback() {
  return (
    <div className="py-14">
      <Container className="max-w-3xl space-y-6">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-72 w-full" />
      </Container>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingFallback />}>
      <BookingClient />
    </Suspense>
  );
}
