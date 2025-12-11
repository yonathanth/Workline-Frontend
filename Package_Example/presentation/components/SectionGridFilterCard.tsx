import React, { FC, useState } from "react";
import Pagination from "@/features/core/shared/Pagination";
import Heading2 from "@/features/core/shared/Heading2";
import ExperiencesCard from "@/features/Home/presentation/components/OurPackages/ExperiencesCard";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { Packages } from "../../domain/entity/Packages";
export interface SectionGridFilterCardProps {
  className?: string;
  data: Packages[];
}

const ITEMS_PER_PAGE = 8;

const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
  className = "",
  data,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackageName, setSelectedPackageName] = useState<Packages>();
  const [selectedPrice, setSelectedPrice] = useState(0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const pathname = usePathname();
  const currentLocale = pathname?.split("/")[1] || "en";
  const queryClient = useQueryClient();
  const router = useRouter();
  const handleCardClick = (selectedpackage: Packages) => {
    setSelectedPackageName(selectedpackage);
    queryClient.setQueryData(["selectedPackage"], selectedpackage);
    router.push(`/${currentLocale}/package-checkout`);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (passengerDetails: {
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
  }) => {
    console.log(passengerDetails);
    setIsModalOpen(false);
  };

  return (
    <div className={`nc-SectionGridFilterCard ${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
          Our Packages
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore our package options below. Click on a package for more details
          and guidance through the booking process.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {paginatedData.map((stay) => (
          <div 
            key={stay.id} 
            onClick={() => handleCardClick(stay)}
            className="transform transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <ExperiencesCard data={stay} />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <div className="min-w-max">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(data.length / ITEMS_PER_PAGE)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionGridFilterCard;
