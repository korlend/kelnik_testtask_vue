import { defineStore } from "pinia";
import Pagination from "~/core/Pagination";
import SortEnum from "~/core/SortEnum";
import Sorting from "~/core/Sorting";

export interface Apartment {
  name: string;
  structure_image: string;
  area: number; // square metres
  rooms: number;
  level: number;
  level_total: number;
  price: number; // rubles
}

interface ApartmentsState {
  apartments: Array<Apartment>;
  total: number;
}

export type ApartmentsSortingKeys = "area" | "level" | "price";

export class ApartmentsFilters {
  constructor(
    public minPrice?: number,
    public maxPrice?: number,
    public minArea?: number,
    public maxArea?: number,
    public roomsCounts: Array<number> = []
  ) {}
}

export const useApartmentsStore = defineStore("apartments", {
  state: (): ApartmentsState => {
    return {
      apartments: [],
      total: 0,
    };
  },
  getters: {
    getApartments: (state): Array<Apartment> => {
      return state.apartments;
    },
    getTotal: (state) => {
      return state.total;
    },
  },
  actions: {
    async loadApartments(
      pagination = new Pagination(),
      sorting = new Sorting<ApartmentsSortingKeys>(),
      filters = new ApartmentsFilters()
    ): Promise<boolean> {
      const { $api } = useNuxtApp();
      let url = "/apartments.json";
      const response = await $api<Array<Apartment>>(url, {});
      if (!response) {
        return false;
      }
      let finalArray = [];

      // apply filters
      for (let i = 0; i < response.length; i++) {
        const item = response[i];
        if (filters.minPrice !== undefined && item.price < filters.minPrice) {
          continue;
        }
        if (filters.maxPrice !== undefined && item.price > filters.maxPrice) {
          continue;
        }
        if (filters.minArea !== undefined && item.area < filters.minArea) {
          continue;
        }
        if (filters.maxArea !== undefined && item.area > filters.maxArea) {
          continue;
        }
        if (
          filters.roomsCounts?.length &&
          !filters.roomsCounts.includes(item.rooms)
        ) {
          continue;
        }
        finalArray.push(item);
      }
      const total = finalArray.length;

      // apply sort
      if (sorting.sortBy && sorting.sortDirection !== SortEnum.NONE) {
        const { sortBy, sortDirection } = sorting;
        finalArray.sort((a, b) => {
          if (a[sortBy] < b[sortBy]) {
            return sortDirection === SortEnum.ASC ? -1 : 1;
          }
          if (a[sortBy] > b[sortBy]) {
            return sortDirection === SortEnum.ASC ? 1 : -1;
          }
          return 0;
        });
      }

      // apply pagination
      const from = pagination.from || 0;
      const limit = pagination.limit || 5;
      finalArray = finalArray.slice(from, from + limit);

      this.apartments = finalArray;
      this.total = total;
      return true;
    },
  },
});
