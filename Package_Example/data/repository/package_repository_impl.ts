import { inject, injectable } from "inversify";
import { PackagesRepository } from "../../domain/repository/PackagesRepository";
import { PackageRemoteDatasource } from "../datasource/remote/package_remote_datasource";
import { Either, left, right } from "fp-ts/lib/Either";
import { Attractions } from "../../domain/entity/Attractions";
import { Packages } from "../../domain/entity/Packages";
import {
  AttractionMapper,
  PackageMapper,
} from "../../application/helper/mapper";
import { BookingResponse } from "@/features/core/application/SDK/PACKAGE-SDK";
import { BookPackageRequestBody } from "../../../PackageCheckout/domain/entity/requestBody/BookPackageRequestBody";
@injectable()
export class PackagesRepositoryImpl implements PackagesRepository {
  constructor(
    @inject(PackageRemoteDatasource)
    private readonly remote: PackageRemoteDatasource
  ) {}

  getPackages(): Promise<Either<Error, Packages[]>> {
    return this.remote
      .getPackageList()
      .then((response) => {
        return right(response.data.map((packages) => PackageMapper(packages)));
      })
      .catch((error) => {
        return left(new Error("Failed to fetch packages: " + error.message));
      });
  }

  getAttractions(): Promise<Either<Error, Attractions[]>> {
    return this.remote
      .getAttractionsList()
      .then((response) =>
        right(response.data.map((at) => AttractionMapper(at)))
      )
      .catch((error) => {
        return left(new Error("Failed to fetch attractions: " + error.message));
      });
  }

  async bookPackage(
    requestBody: BookPackageRequestBody
  ): Promise<Either<Error, BookingResponse>> {
    try {
      return await this.remote.bookPackage(requestBody);
    } catch (error) {
      return this.handleError("bookPackage", error);
    }
  }

  private handleError(
    method: string,
    error: unknown
  ): Either<Error, BookingResponse> {
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      errorMessage = `An unknown error occurred in ${method}`;
    }
    console.error(`Repository Error [${method}]: ${errorMessage}`);
    return left(new Error(errorMessage));
  }
}
