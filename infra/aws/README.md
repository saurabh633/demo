# AWS API Gateway — single public HTTP entry

This stack exposes **one** public base URL for the Lumi Nails frontend.  
API Gateway HTTP API forwards all routes to a thin **BFF Lambda** that translates REST → gRPC microservices.

```
Browser / Next.js
        │  NEXT_PUBLIC_API_URL=https://{api}.execute-api.{region}.amazonaws.com
        ▼
 Amazon API Gateway (HTTP API)
        │  ANY /{proxy+}
        ▼
 Lambda BFF (services/src/lambda.ts)
        │  gRPC
        ├─ DesignsService   :50051
        ├─ CatalogService   :50056
        ├─ BookingsService  :50053
        ├─ ReviewsService   :50054
        └─ InquiriesService :50055
```

## Routes (same as `apps/lumi-nails/src/lib/api.ts`)

| Method | Path | Upstream gRPC |
|--------|------|----------------|
| GET | `/designs` | DesignsService.ListDesigns |
| GET | `/designs/{id}` | DesignsService.GetDesign |
| GET | `/categories` | DesignsService.ListCategories |
| GET | `/services` | CatalogService.ListServices |
| GET | `/slots?date=` | BookingsService.ListSlots |
| POST | `/bookings` | BookingsService.CreateBooking |
| GET | `/bookings/{id}` | BookingsService.GetBooking |
| POST | `/inquiries` | InquiriesService.CreateInquiry |
| GET | `/reviews` | ReviewsService.ListReviews |
| POST | `/reviews` | ReviewsService.CreateReview |

## Deploy (SAM)

Prerequisites: AWS CLI, SAM CLI, Node 22, gRPC services reachable from Lambda (VPC / Cloud Map / ECS).

```bash
cd services
npm install
npx tsc   # emit dist/ for Handler: dist/lambda.handler (or adjust packaging)

cd ../infra/aws
sam build
sam deploy --guided
```

Set frontend:

```bash
NEXT_PUBLIC_API_URL=https://xxxx.execute-api.region.amazonaws.com
```

## Local equivalent

You do **not** need AWS locally. The sibling project `lumi-nails-local-proxy` (or monorepo BFF on port **8080**) mimics this single entry.
