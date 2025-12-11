import {
  AttractionsApi,
  AttractionsResponse,
  BookingResponse,
  BookingsApi,
  CustomerApi,
  CustomerResponse,
  TravelPackagesApi,
  TravelPackagesResponse,
} from "@/features/core/application/SDK/PACKAGE-SDK";
import { BookPackageRequestBody } from "@/features/PackageCheckout/domain/entity/requestBody/BookPackageRequestBody";
import { CreateCustomerRequestBody } from "@/features/PackageCheckout/domain/entity/requestBody/CreateCustomerRequestBody";
import axios, { AxiosResponse } from "axios";
import { Either, right } from "fp-ts/lib/Either";
import { inject, injectable } from "inversify";
export abstract class PackageRemoteDatasource {
  abstract getPackageList(): Promise<TravelPackagesResponse>;
  abstract getAttractionsList(): Promise<AttractionsResponse>;
  abstract bookPackage(
    requestBody: BookPackageRequestBody
  ): Promise<Either<Error, BookingResponse>>;
  abstract createCustomer(
    requestBody: CreateCustomerRequestBody
  ): Promise<Either<Error, CustomerResponse>>;
}

@injectable()
export class PackageRemoteDatasourceImpl implements PackageRemoteDatasource {
  constructor(
    @inject(TravelPackagesApi)
    private readonly travelPackage: TravelPackagesApi,
    @inject(AttractionsApi) private readonly attractions: AttractionsApi,
    @inject(BookingsApi) private readonly bookingApi: BookingsApi,
    @inject(CustomerApi) private readonly customerApi: CustomerApi
  ) {}

  async getPackageList(): Promise<TravelPackagesResponse> {
    const response = await this.travelPackage.travelPackagesControllerFindAll();
    return response.data;
  }

  async getAttractionsList(): Promise<AttractionsResponse> {
    const response = await this.attractions.attractionsControllerFindAll();

    return response.data;
  }

  async bookPackage(
    requestBody: BookPackageRequestBody
  ): Promise<Either<Error, BookingResponse>> {
    try {
      const response: AxiosResponse<BookingResponse> =
        await this.bookingApi.bookingsControllerCreate(requestBody);
      this.customerApi.customerControllerCreate;
      return right(response.data);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  async createCustomer(
    requestBody: CreateCustomerRequestBody
  ): Promise<Either<Error, CustomerResponse>> {
    try {
      const response: AxiosResponse<CustomerResponse> =
        await this.customerApi.customerControllerCreate(requestBody);
      return right(response.data);
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  private handleApiError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const apiErrorMessage =
        error.response?.data?.message || "An error occurred";
      const statusCode = error.response?.status || "Unknown status";
      console.error(`API Error: ${statusCode} - ${apiErrorMessage}`);
      throw new Error(apiErrorMessage);
    }
    throw error instanceof Error
      ? error
      : new Error("error occurred, please try again");
  }
}
