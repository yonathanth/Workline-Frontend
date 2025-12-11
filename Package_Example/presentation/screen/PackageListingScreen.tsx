"use client";
import React, { FC, useState, useEffect } from "react";
import SectionGridFilterCard from "../components/SectionGridFilterCard";
import { usePackageHooks } from "../../application/hooks/package.hooks";
import ExperiencesCard from "@/features/Home/presentation/components/OurPackages/ExperiencesCard";
import { ExperiencesCardSkeleton } from "@/features/Home/presentation/components/OurPackages/PackagesSkeleton";
import ErrorDisplayingComponent from "@/features/core/shared/ErrorDisplayingComponent";
import { Packages } from "../../domain/entity/Packages";
export interface ListingExperiencesPageProps {}

function PackageListingScreen() {
  const [showContent, setShowContent] = useState(false);
  const { getAllPackages } = usePackageHooks({});

  if (getAllPackages.isError || getAllPackages.data?._tag == "Left") {
    console.log(
      "Error",
      getAllPackages.data?._tag == "Left" && getAllPackages.data?.left.message
    );
  }
  let Packages: Packages[] = [];
  if (getAllPackages.isSuccess && getAllPackages.data?._tag === "Right") {
    Packages = (
      getAllPackages.data as {
        _tag: "Right";
        right: Packages[];
      }
    ).right;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {getAllPackages.isLoading ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto" />
            {/* Desktop grid */}
            <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <ExperiencesCardSkeleton key={index} />
              ))}
            </div>
            {/* Mobile grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
              {Array.from({ length: 4 }).map((_, index) => (
                <ExperiencesCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      ) : getAllPackages.data?._tag === "Left" || getAllPackages.isError ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-slate-50 dark:bg-neutral-800 rounded-2xl p-6 lg:p-8">
            <ErrorDisplayingComponent
              callback={getAllPackages}
              desc="Error loading the packages. Please try again."
            />
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SectionGridFilterCard 
            className="pb-12 lg:pb-16" 
            data={Packages} 
          />
        </div>
      )}
    </div>
  );
}

export default PackageListingScreen;
