<template>
  <div class="apartments-list">
    <!-- blocks -->
    <client-only>
      <div
        class="apartments-list__blocks"
        v-if="includeResolutions(ResolutionsEnum.XS, ResolutionsEnum.LG)">
        <div class="apartments-list__blocks-sorting">
          <sort-switch
            v-model="areaSort"
            @update:model-value="(sortType) => changeSort('area', sortType)"
            >S, м²</sort-switch
          >
          <sort-switch
            v-model="levelSort"
            @update:model-value="(sortType) => changeSort('level', sortType)"
            >Этаж</sort-switch
          >
          <sort-switch
            v-model="priceSort"
            @update:model-value="(sortType) => changeSort('price', sortType)"
            >Цена, ₽</sort-switch
          >
        </div>
        <div
          class="apartments-list__blocks-item"
          v-for="apartment in apartments">
          <div class="apartments-list__blocks-item__data">
            <div class="apartments-list__blocks-item__data-name">
              {{ apartment.name }}
            </div>
            <div class="apartments-list__blocks-item__data-other">
              <span>{{ apartment.area }} м²</span>
              <span>
                {{ apartment.level }}
                <span class="opacity-50">
                  из {{ apartment.level_total }} этаж
                </span>
              </span>
              <span>{{ apartment.price }} ₽</span>
            </div>
          </div>
          <div
            class="apartments-list__blocks-item__image"
            :style="imageStyle(apartment)"></div>
        </div>
      </div>
      <!-- table -->
      <table
        class="apartments-list__table"
        v-if="includeResolutions(ResolutionsEnum.XL)">
        <thead>
          <tr class="apartments-list__table-head-row">
            <th>Планировка</th>
            <th>Квартира</th>
            <th>Комнат</th>
            <th>
              <sort-switch
                v-model="areaSort"
                @update:model-value="(sortType) => changeSort('area', sortType)"
                >S, м²</sort-switch
              >
            </th>
            <th>
              <sort-switch
                v-model="levelSort"
                @update:model-value="
                  (sortType) => changeSort('level', sortType)
                "
                >Этаж</sort-switch
              >
            </th>
            <th>
              <sort-switch
                v-model="priceSort"
                @update:model-value="
                  (sortType) => changeSort('price', sortType)
                "
                >Цена, ₽</sort-switch
              >
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="apartments-list__table-data-row"
            v-for="apartment in apartments">
            <td
              class="apartments-list__table-data-row__image"
              :style="imageStyle(apartment)"></td>
            <td>{{ apartment.name }}</td>
            <td>{{ apartment.rooms }}</td>
            <td>{{ apartment.area }}</td>
            <td>
              {{ apartment.level }}
              <span class="opacity-50">из {{ apartment.level_total }}</span>
            </td>
            <td>{{ apartment.price }}</td>
          </tr>
        </tbody>
      </table>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import ResolutionsEnum from "~/core/ResolutionsEnum";
import SortEnum from "~/core/SortEnum";
import Sorting from "~/core/Sorting";
import type { Apartment, ApartmentsSortingKeys } from "~/store/apartments";

const props = defineProps({
  apartments: {
    type: Array<Apartment>,
    default: [],
  },
});

const emit = defineEmits<{
  (e: "sort-change", sorting: Sorting<ApartmentsSortingKeys>): void;
}>();

const areaSort = ref(SortEnum.NONE);
const levelSort = ref(SortEnum.NONE);
const priceSort = ref(SortEnum.NONE);

const { includeResolutions, currentResolution, windowSize, resolutionsValues } =
  useScreenResolution();

const changeSort = (sortBy: ApartmentsSortingKeys, sortDirection: SortEnum) => {
  areaSort.value = SortEnum.NONE;
  levelSort.value = SortEnum.NONE;
  priceSort.value = SortEnum.NONE;
  switch (sortBy) {
    case "area":
      areaSort.value = sortDirection;
      break;
    case "level":
      levelSort.value = sortDirection;
      break;
    case "price":
      priceSort.value = sortDirection;
      break;
    default:
      break;
  }
  emit("sort-change", new Sorting(sortBy, sortDirection));
};

const imageLink = (item: Apartment) => {
  return item.structure_image;
};

const imageStyle = (item: Apartment) => {
  const image = imageLink(item);
  return {
    "--image": `url("${image}")`,
  };
};
</script>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as mixins;

.opacity-50 {
  opacity: 0.5;
}

.apartments-list {
  width: 100%;

  &__blocks {
    display: flex;
    flex-flow: column;
    gap: 10px;
    @include mixins.font-size-get(apartments-page-blocks-text);

    &-sorting {
      display: flex;

      & > * {
        margin-right: 15px;
      }
    }

    &-item {
      display: flex;
      justify-content: space-between;
      border: 1px solid #0000001a;
      border-radius: 8px;
      padding: 20px 20px 20px 20px;

      &__data {
        display: flex;
        flex-flow: column;
        gap: 20px;
        padding-bottom: 20px;

        &-other {
          & > * {
            padding-right: 15px;
          }
        }
      }

      &__image {
        background-image: var(--image);
        width: 66px;
        background-repeat: no-repeat;
        background-position: 50% 50%;
      }
    }
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;

    &-head-row {
      border-bottom: 1px solid #0000001a;
      @include mixins.font-size-get(apartments-page-table-head-text);

      & > * {
        padding: 16px 20px 16px 0px;
        text-align: left;
        font-weight: normal;
      }
    }

    &-data-row {
      height: 120px;
      box-sizing: border-box;
      padding: 15px 5px;
      border-bottom: 1px solid #0000001a;
      @include mixins.font-size-get(apartments-page-table-data-text);

      & > * {
        padding: 16px 20px 16px 0px;
        text-align: left;
        vertical-align: top;
      }

      &__image {
        background-image: var(--image);
        width: 66px;
        background-repeat: no-repeat;
        background-position: 10% 24px;
      }
    }
  }
}
</style>
