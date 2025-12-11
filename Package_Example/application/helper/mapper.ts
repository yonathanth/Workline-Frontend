import { TravelPackage } from "@/features/core/application/SDK/PACKAGE-SDK/models/travel-package";
import { Packages } from "../../domain/entity/Packages";
import { Attractions } from "@/features/core/application/SDK/PACKAGE-SDK";
import { Attractions as AttractionsEntity } from "@/features/Package/domain/entity/Attractions";
const getImageUrl = (imgUrl: string) => {
  if (!imgUrl) return '/images/placeholder.png';

  try {
    return `https://asset.flyzagol.com/prod/${imgUrl}?`;
  } catch (error) {
    console.warn('Failed to construct image URL:', error);
    return '/images/placeholder.png';
  }
};

const getMediaUrl = (imgUrl: string) => {
  if (!imgUrl) return '/images/placeholder.png';

  try {
    const baseUrl = "https://asset.flyzagol.com/";
    return `${baseUrl}${imgUrl}`;
  } catch (error) {
    console.warn('Failed to construct media URL:', error);
    return '/images/placeholder.png';
  }
};

export function PackageMapper(travelPackage: TravelPackage): Packages {
  return {
    id: travelPackage.id,
    title: travelPackage.title,
    galleryImgs: travelPackage.images.map(getImageUrl),
    address: `${travelPackage.city}, ${travelPackage.country}`,
    priceAdt: travelPackage.priceAdt.toString(),
    priceChd: travelPackage.priceChd ? travelPackage.priceChd.toString() : null,
    priceInf: travelPackage.priceInf ? travelPackage.priceInf.toString() : null,
    saleOff: travelPackage.discount ? travelPackage.discount.toString() : null,
    showPrice: travelPackage.showPrice,
    activities: travelPackage.activities,
    description: travelPackage.description,
    includes: travelPackage.services ? travelPackage.services : [],
    country: travelPackage.country,
  };
}

export function AttractionMapper(attraction: Attractions): AttractionsEntity {
  const baseUrl = "https://asset.flyzagol.com/";
const suffix = ''
  return {
    id: attraction.id,
    name: attraction.title,
    thumbnail: `${baseUrl}${attraction.images[0]}${suffix}`,
    Images: attraction.images.map((imgUrl) => `${baseUrl}${imgUrl}${suffix}`),
    Blog: attraction.description,
  };
}
