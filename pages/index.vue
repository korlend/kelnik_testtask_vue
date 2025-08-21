<template>
  <div class="apartments-page">
    <div class="apartments-page__content">
      <div class="apartments-page__content-main">
        <h1 class="apartments-page__content-main__label">Квартиры</h1>
        <apartments-list-block
          :apartments="loadedApartments"
          @sort-change="sortChange" />
        <div
          class="apartments-page__content-load-more"
          v-if="loadedApartments.length < totalApartments"
          @click="loadMore"
          @touchend="loadMore">
          Загрузить еще
        </div>
      </div>
      <apartments-filters-block
        class="apartments-page__content-filters"
        :area="{ min: 15, max: 120 }"
        :price="{ min: 10000, max: 100000 }"
        @change="filtersChanged" />
    </div>
    <scroll-top></scroll-top>
  </div>
</template>

<script setup lang="ts">
import Pagination from "~/core/Pagination";
import Sorting from "~/core/Sorting";
import {
  ApartmentsFilters,
  useApartmentsStore,
  type Apartment,
  type ApartmentsSortingKeys,
} from "~/store/apartments";

const route = useRoute("index");
const router = useRouter();

const apartmentsStore = useApartmentsStore();

const activePagination = ref(new Pagination());
const activeFilters = ref(new ApartmentsFilters());
const activeSorting = ref(new Sorting<ApartmentsSortingKeys>());

const isLoading = ref(true);

const defaultLimit = 5;
const loadMoreStep = 5;

watch(route, () => {
  reloadApartments();
});

await useAsyncData(() => {
  return apartmentsStore.loadApartments();
});

const reloadApartments = async () => {
  isLoading.value = true;
  await apartmentsStore.loadApartments(
    activePagination.value,
    activeSorting.value,
    activeFilters.value
  );
  isLoading.value = false;
};

const filtersChanged = debounce((newFilters: ApartmentsFilters) => {
  activeFilters.value = newFilters;
  activePagination.value = new Pagination(0, defaultLimit);
  reloadApartments();
}, 50);

const sortChange = debounce((newSorting: Sorting<ApartmentsSortingKeys>) => {
  activeSorting.value = newSorting;
  reloadApartments();
}, 20);

const loadMore = () => {
  activePagination.value = new Pagination(
    0,
    activePagination.value.limit + loadMoreStep
  );
  reloadApartments();
};

const loadedApartments = computed((): Array<Apartment> => {
  return apartmentsStore.getApartments;
});

const totalApartments = computed((): number => {
  return apartmentsStore.getTotal;
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as mixins;

.apartments-page {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  margin: 100px 0px;

  &__content {
    display: flex;
    justify-content: space-between;
    width: 852px;

    @include mixins.respond-from(xl) {
      width: 1280px;
    }

    &-main {
      box-sizing: border-box;
      width: 506px;

      @include mixins.respond-from(xl) {
        width: 801px;
      }

      &__label {
        margin: 0 0 30px 0;
        @include mixins.font-size-get(apartments-page-label);
      }
    }

    &-filters {
      position: sticky;
      top: 20px;
      box-sizing: border-box;
      width: 318px;

      @include mixins.respond-from(xl) {
        width: 399px;
      }
    }

    &-load-more {
      width: fit-content;
      margin-top: 48px;
      padding: 8px 24px;
      cursor: pointer;
      border: 1px solid #0b173933;
      border-radius: 25px;

      @include mixins.font-size-get(apartments-page-load-more-label);
    }
  }
}
</style>
