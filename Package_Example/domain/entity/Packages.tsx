import { StaticImageData } from "next/image";
export interface Activity {
  price: number | null;
  id: string;
  name: string;
  duration: string;
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
}
export interface Packages {
  id: string;
  country: string;
  title: string;
  galleryImgs: (StaticImageData | string)[];
  address: string;
  priceAdt: string;
  priceChd: string | null;
  priceInf: string | null;
  saleOff?: string | null;
  showPrice: boolean;
  activities?: Activity[];
  includes: Service[];
  description: string;
}

export class FilterLocationList {
  constructor(public id: string, public Location: string) {}
}
