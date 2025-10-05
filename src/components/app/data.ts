import {Place, PlaceType} from "../../types/place.ts";

export const placesData: Place[] = [
  {
    placeImageSrc: "../../markup/img/apartment-01.jpg",
    isPremium: true,
    price: 120,
    starsCount: 4,
    isBookmarked: false,
    placeName: "Beautiful & luxurious apartment at great location",
    placeType: PlaceType.Apartment,
  },
  {
    placeImageSrc: "../../markup/img/room.jpg",
    isPremium: false,
    price: 80,
    starsCount: 4,
    isBookmarked: true,
    placeName: "Wood and stone place",
    placeType: PlaceType.Room,
  },
  {
    placeImageSrc: "../../markup/img/apartment-02.jpg",
    isPremium: false,
    price: 132,
    starsCount: 4,
    isBookmarked: false,
    placeName: "Canal View Prinsengracht",
    placeType: PlaceType.Apartment,
  },
  {
    placeImageSrc: "../../markup/img/apartment-03.jpg",
    isPremium: true,
    price: 180,
    starsCount: 5,
    isBookmarked: false,
    placeName: "Nice, cozy, warm big bed apartment",
    placeType: PlaceType.Apartment,
  },
  {
    placeImageSrc: "../../markup/img/room.jpg",
    isPremium: false,
    price: 80,
    starsCount: 4,
    isBookmarked: true,
    placeName: "Wood and stone place",
    placeType: PlaceType.Room,
  },
];
