import container from "@/inversify.config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetPackagesUseCase } from "../../domain/usecase/GetPackagesUsecase";
import { GetAttractionsUseCase } from "../../domain/usecase/GetAttractionsUsecase";
import { BookPackageRequestBody } from "../../../PackageCheckout/domain/entity/requestBody/BookPackageRequestBody";
import { BookPackagUsecase } from "../../../PackageCheckout/domain/usecase/BookPackagUsecase";
import { CreateCustomerRequestBody } from "../../../PackageCheckout/domain/entity/requestBody/CreateCustomerRequestBody";
import { CreateCustomerUsecase } from "../../../PackageCheckout/domain/usecase/CreateCustomerUsecase";
interface PackageHooksProps {
  userForm?: any | null;
}
export const usePackageHooks = ({ userForm }: PackageHooksProps) => {
  const getAllPackages = useQuery({
    queryKey: ["packages"],
    queryFn: () => container.get(GetPackagesUseCase).execute(),
  });

  const getAllAttractions = useQuery({
    queryKey: ["attractions"],
    queryFn: () => container.get(GetAttractionsUseCase).execute(),
  });

  return { getAllAttractions, getAllPackages };
};

export const bookPackagetHooks = () => {
  const bookPackage = useMutation({
    mutationKey: ["bookPackage"],
    mutationFn: (data: BookPackageRequestBody) => {
      return container.get(BookPackagUsecase).execute(data);
    },
  });

  const createCustomer = useMutation({
    mutationKey: ["createCustomer"],
    mutationFn: (data: CreateCustomerRequestBody) => {
      return container.get(CreateCustomerUsecase).execute(data);
    },
  });

  return { bookPackage, createCustomer };
};
