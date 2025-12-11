import { inject, injectable } from "inversify";
import { CustomerRepository } from "../../../PackageCheckout/domain/repository/CustomerRepository";
import { CustomerResponse } from "@/features/core/application/SDK/PACKAGE-SDK";
import {Either, left} from "fp-ts/lib/Either";
import { CreateCustomerRequestBody } from "../../../PackageCheckout/domain/entity/requestBody/CreateCustomerRequestBody";
import axios from "axios";
import { PackageRemoteDatasource } from "../datasource/remote/package_remote_datasource";
@injectable()
export class CustomerRepositoryImpl implements CustomerRepository {
  constructor(
    @inject(PackageRemoteDatasource)
    private readonly remote: PackageRemoteDatasource
  ) {}

  async createCustomer(
    requestBody: CreateCustomerRequestBody
  ): Promise<Either<Error, CustomerResponse>> {
    try {
      return await this.remote.createCustomer(requestBody);
    } catch (error) {
      return this.handleError("createCustomer", error);
    }
  }

  private handleError(
    method: string,
    error: unknown
  ): Either<Error, CustomerResponse> {
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
