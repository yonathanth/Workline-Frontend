import { Either } from "fp-ts/Either";
import { FilterLocationList, Packages } from "../entity/Packages";
import { Attractions } from "../entity/Attractions";
import { BookPackageRequestBody } from "../../../PackageCheckout/domain/entity/requestBody/BookPackageRequestBody";
import { BookingResponse } from "@/features/core/application/SDK/PACKAGE-SDK/models/booking-response";
export abstract class PackagesRepository {
  abstract getPackages(): Promise<Either<Error, Packages[]>>;
  abstract getAttractions(): Promise<Either<Error, Attractions[]>>;
  abstract bookPackage(
    requestBody: BookPackageRequestBody
  ): Promise<Either<Error, BookingResponse>>;
  //getFilteringLocations(): Promise<Either<Error, FilterLocationList[]>>;
}
