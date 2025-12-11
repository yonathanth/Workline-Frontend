import { PackagesRepository } from "@/features/Package/domain/repository/PackagesRepository";
import { Packages } from "@/features/Package/domain/entity/Packages";
import { Either } from "fp-ts/lib/Either";
import { injectable } from "inversify";
@injectable()
export class GetPackagesUseCase {
  constructor(private packagesRepository: PackagesRepository) {}

  async execute(): Promise<Either<Error, Packages[]>> {
    return await this.packagesRepository.getPackages();
  }
}