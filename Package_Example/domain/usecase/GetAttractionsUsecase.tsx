import { Attractions } from "@/features/Package/domain/entity/Attractions";
import { Either } from "fp-ts/lib/Either";
import { inject, injectable } from "inversify";
import { PackagesRepository } from "../repository/PackagesRepository";

@injectable()
export class GetAttractionsUseCase {
  constructor(@inject(PackagesRepository)   private attractionsRepository: PackagesRepository) {}

  async execute(): Promise<Either<Error, Attractions[]>> {
    return  this.attractionsRepository.getAttractions();
  }
}
