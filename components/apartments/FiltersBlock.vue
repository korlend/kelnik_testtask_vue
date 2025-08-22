<template>
  <div class="apartments-filters">
    <div class="apartments-filters__rooms">
      <circle-button
        v-for="room of maxRooms"
        :active="roomsFilter.has(room)"
        @click="() => roomClicked(room)"
        @touchend="() => roomClicked(room)"
        >{{ room }}к</circle-button
      >
    </div>
    <number-slider
      v-model:left="priceMin"
      v-model:right="priceMax"
      :label="'Стоимость квартиры, ₽'"
      :min="price.min"
      :max="price.max"
      @change="priceChange"></number-slider>
    <div></div>
    <number-slider
      v-model:left="areaMin"
      v-model:right="areaMax"
      :label="'Площадь, м²'"
      :min="area.min"
      :max="area.max"
      @change="areaChange"></number-slider>
    <div></div>
    <div
      class="apartments-filters__clear"
      @click="clearFilters"
      @touchend="clearFilters">
      Сбросить параметры
      <span class="apartments-filters__clear-icon x-icon"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type MinMaxValues from "~/core/MinMaxValues";
import { ApartmentsFilters } from "~/store/apartments";

const props = defineProps({
  price: {
    type: Object as PropType<MinMaxValues>,
    required: true,
  },
  area: {
    type: Object as PropType<MinMaxValues>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "change", filters: ApartmentsFilters): void;
}>();

const priceMin: Ref<number> = ref(0);
const priceMax: Ref<number> = ref(0);
const areaMin: Ref<number> = ref(0);
const areaMax: Ref<number> = ref(0);

const roomsFilter: Ref<Set<number>> = ref(new Set());
const maxRooms = 4;

const roomClicked = (room: number) => {
  if (roomsFilter.value.has(room)) {
    roomsFilter.value.delete(room);
  } else {
    roomsFilter.value.add(room);
  }
  filtersChange();
};

const priceChange = () => {
  filtersChange();
};

const areaChange = () => {
  filtersChange();
};

const filtersChange = () => {
  emit(
    "change",
    new ApartmentsFilters(
      priceMin.value,
      priceMax.value,
      areaMin.value,
      areaMax.value,
      [...roomsFilter.value]
    )
  );
};

const clearFilters = () => {
  priceMin.value = props.price.min;
  priceMax.value = props.price.max;
  areaMin.value = props.area.min;
  areaMax.value = props.area.max;
  roomsFilter.value = new Set();
  filtersChange();
};
</script>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as mixins;

.apartments-filters {
  display: flex;
  flex-flow: column;
  height: fit-content;
  flex-wrap: wrap;
  padding: 20px 20px 30px 20px;
  gap: 20px;
  background: linear-gradient(
    135deg,
    rgba(174, 228, 178, 0.3) 0%,
    rgba(149, 208, 161, 0.3) 100%
  );
  border-radius: 10px;

  @include mixins.respond-from(xl) {
    padding: 40px;
  }

  &__rooms {
    display: flex;
    align-items: center;
    gap: 10px;

    &-icon {
      margin-left: 5px;
      width: 8px;
      height: 8px;
    }
  }

  &__clear {
    display: flex;
    align-items: center;
    padding-left: 15px;
    cursor: pointer;

    &-icon {
      margin-left: 5px;
      width: 8px;
      height: 8px;
    }
  }
}
</style>
