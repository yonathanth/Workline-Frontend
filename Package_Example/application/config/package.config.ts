import { ContainerModule } from "inversify";
import {
  PackageRemoteDatasource,
  PackageRemoteDatasourceImpl,
} from "../../data/datasource/remote/package_remote_datasource";
import { PackagesRepository } from "../../domain/repository/PackagesRepository";
import { PackagesRepositoryImpl } from "../../data/repository/package_repository_impl";
import { GetPackagesUseCase } from "../../domain/usecase/GetPackagesUsecase";
import { GetAttractionsUseCase } from "../../domain/usecase/GetAttractionsUsecase";
import { BookPackagUsecase } from "../../../PackageCheckout/domain/usecase/BookPackagUsecase";
import { CreateCustomerUsecase } from "../../../PackageCheckout/domain/usecase/CreateCustomerUsecase";
import { CustomerRepository } from "../../../PackageCheckout/domain/repository/CustomerRepository";
import { CustomerRepositoryImpl } from "../../data/repository/customer_repository_impl";
const PackageModules = new ContainerModule(({ bind }) => {
  bind<PackageRemoteDatasource>(PackageRemoteDatasource).to(
    PackageRemoteDatasourceImpl
  );

  bind<PackagesRepository>(PackagesRepository).to(PackagesRepositoryImpl);
  bind<CustomerRepository>(CustomerRepository).to(CustomerRepositoryImpl);

  bind<GetPackagesUseCase>(GetPackagesUseCase).toSelf();
  bind<GetAttractionsUseCase>(GetAttractionsUseCase).toSelf();
  bind<BookPackagUsecase>(BookPackagUsecase).toSelf();
  bind<CreateCustomerUsecase>(CreateCustomerUsecase).toSelf();
});
export default PackageModules;
