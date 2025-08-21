<template>
  <div
    class="sort-switch"
    :class="classes"
    @click="switchClicked"
    @touchend="switchClicked">
    <div class="sort-switch__text">
      <slot />
    </div>
    <span class="sort-switch__arrows">
      <span class="sort-switch__arrows-top-arrowhead"></span>
      <span class="sort-switch__arrows-bottom-arrowhead"></span>
    </span>
  </div>
</template>

<script setup lang="ts">
import SortEnum from "~/core/SortEnum";

const model = defineModel<SortEnum>({
  type: String as PropType<SortEnum>,
  default: SortEnum.NONE,
});

const emit = defineEmits<{
  (e: "change", sort: SortEnum): void;
}>();

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const classes = computed(() => {
  const classesList = [];
  if (props.disabled) {
    classesList.push("disabled");
  }
  if (model.value === SortEnum.ASC) {
    classesList.push("asc");
  }
  if (model.value === SortEnum.DESC) {
    classesList.push("desc");
  }
  return classesList;
});

const switchClicked = (event: Event) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  if (model.value === SortEnum.NONE) {
    model.value = SortEnum.ASC;
  } else if (model.value === SortEnum.ASC) {
    model.value = SortEnum.DESC;
  } else {
    model.value = SortEnum.NONE;
  }
  emit("change", model.value);
};
</script>

<style lang="scss" scoped>
.sort-switch {
  display: flex;
  align-items: center;
  height: 20px;
  cursor: pointer;

  $switch: &;

  &.disabled {
    cursor: default;
  }

  &__text {
    margin-right: 7px;

    #{$switch}.asc & {
      color: #3eb57c;
    }

    #{$switch}.desc & {
      color: #3eb57c;
    }
  }

  &__arrows {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 10px;
    height: 10px;

    &-top-arrowhead {
      display: block;
      position: absolute;
      top: 0px;

      width: 4px;
      height: 4px;
      border-top: 1px solid #000;
      border-left: 1px solid #000;
      rotate: 45deg;
      opacity: 0.4;

      #{$switch}.asc & {
        border-color: #3eb57c;
        opacity: 1;
      }
    }

    &-bottom-arrowhead {
      display: block;
      position: absolute;
      top: 4px;

      width: 4px;
      height: 4px;
      border-bottom: 1px solid #000;
      border-right: 1px solid #000;
      rotate: 45deg;
      opacity: 0.4;

      #{$switch}.desc & {
        border-color: #3eb57c;
        opacity: 1;
      }
    }
  }
}
</style>
