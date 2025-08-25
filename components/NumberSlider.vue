<template>
  <div class="number-slider" ref="sliderRefName" :style="styles">
    <div class="number-slider__label">{{ label }}</div>
    <div class="number-slider__numbers">
      <div>
        <span class="number-slider__numbers-label">от</span>
        <span class="number-slider__numbers-number">{{ left }}</span>
      </div>
      <div>
        <span class="number-slider__numbers-label">до</span>
        <span class="number-slider__numbers-number">{{ right }}</span>
      </div>
    </div>
    <div class="number-slider__slider">
      <div class="number-slider__slider-inactive-background"></div>
      <div class="number-slider__slider-active-background"></div>
      <div
        class="number-slider__slider-left-button"
        @touchstart="dragStartLeft"
        @mousedown="dragStartLeft"></div>
      <div
        class="number-slider__slider-right-button"
        @touchstart="dragStartRight"
        @mousedown="dragStartRight"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "change", values: { left: number; right: number }): void;
}>();

const left = defineModel<number>("left", { type: Number });
const right = defineModel<number>("right", { type: Number });

const sliderRef = useTemplateRef("sliderRefName");

const isDraggingLeft = ref(false);
const posLeft = ref(0);
const draggingLeftStartPosX = ref(0);
const draggingLeftEndPosX = ref(0);
const previousShiftLeft = ref(0);

const isDraggingRight = ref(false);
const posRight = ref(0);
const draggingRightStartPosX = ref(0);
const draggingRightEndPosX = ref(0);
const previousShiftRight = ref(0);

const minWidthShift = 0;

const sliderRect: Ref<DOMRect | undefined> = ref(undefined);

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
});

const { windowSize } = useScreenResolution();

watch(windowSize.value, () => {
  assignSliderRect();
  recalcSliderPositions();
});

watch(
  () => props.min,
  () => {
    left.value = props.min;
  }
);

watch(
  () => props.max,
  () => {
    right.value = props.max;
  }
);

watch(left, (newValue, prevValue) => {
  if (newValue) {
    recalcSliderPositions();
  }
});

watch(right, (newValue, prevValue) => {
  if (newValue) {
    recalcSliderPositions();
  }
});

onMounted(() => {
  assignSliderRect();
  left.value = props.min;
  right.value = props.max;
  posRight.value = maxWidthShift.value;
  recalcLeftRight(posLeft.value, posRight.value);
  window.addEventListener("touchend", dragEnd);
  window.addEventListener("mouseup", dragEnd);
  window.addEventListener("touchmove", dragEvent);
  window.addEventListener("mousemove", dragEvent);
});

onBeforeUnmount(() => {
  window.removeEventListener("touchend", dragEnd);
  window.removeEventListener("mouseup", dragEnd);
  window.removeEventListener("touchmove", dragEvent);
  window.removeEventListener("mousemove", dragEvent);
});

const assignSliderRect = () => {
  sliderRect.value = sliderRef?.value?.getBoundingClientRect();
};

const maxWidthShift = computed(() => {
  return sliderRect.value?.width || 0;
});

const styles = computed(() => {
  return {
    "--left-shift": `${posLeft.value}px`,
    "--right-shift": `${posRight.value}px`,
    "--active-background-width": `${posRight.value - posLeft.value}px`,
  };
});

const recalcSliderPositions = () => {
  const maxMinDiff = props.max - props.min;
  if (left.value) {
    const diffLeft = left.value - props.min;
    const fraction = diffLeft / maxMinDiff;
    const newShift = Math.round(fraction * maxWidthShift.value);
    posLeft.value = newShift;
  }
  if (right.value) {
    const diffLeft = right.value - props.min;
    const fraction = diffLeft / maxMinDiff;
    const newShift = Math.round(fraction * maxWidthShift.value);
    posRight.value = newShift;
  }
};

const recalcLeftRight = (newPosLeft: number, newPosRight: number) => {
  const maxMinDiff = props.max - props.min;
  const leftPercentage = newPosLeft / maxWidthShift.value;
  const rightPercentage = newPosRight / maxWidthShift.value;
  const minCalc = props.min + maxMinDiff * leftPercentage;
  const maxCalc = props.min + maxMinDiff * rightPercentage;
  const finalLeft = Math.round(minCalc);
  const finalRight = Math.round(maxCalc);
  if (left.value !== finalLeft || right.value !== finalRight) {
    left.value = finalLeft;
    right.value = finalRight;
    emit("change", {
      left: left.value,
      right: right.value,
    });
  }
};

const dragEnd = (event?: MouseEvent | TouchEvent) => {
  if (event) {
    dragEvent(event);
  } else {
    if (isDraggingLeft.value) {
      previousShiftLeft.value = posLeft.value;
      recalcLeftShift();
    }
    if (isDraggingRight.value) {
      previousShiftRight.value = posRight.value;
      recalcRightShift();
    }
  }
  isDraggingLeft.value = false;
  isDraggingRight.value = false;
};

const dragEvent = (event: MouseEvent | TouchEvent) => {
  event.stopPropagation();
  event.preventDefault();
  let x;
  if (event instanceof MouseEvent) {
    x = event.x;
  } else if (event instanceof TouchEvent) {
    x = event?.touches?.[0]?.clientX;
  }
  if (x !== undefined) {
    if (isDraggingLeft.value) {
      draggingLeftEndPosX.value = x;
      recalcLeftShift();
    }
    if (isDraggingRight.value) {
      draggingRightEndPosX.value = x;
      recalcRightShift();
    }
  }
};

const dragStartLeft = (event: MouseEvent | TouchEvent) => {
  event.stopPropagation();
  event.preventDefault();
  let x = 0;
  if (event instanceof MouseEvent) {
    x = event.x;
  } else if (event instanceof TouchEvent) {
    x = event?.touches?.[0]?.clientX;
  }

  previousShiftLeft.value = posLeft.value;
  draggingLeftStartPosX.value = x;
  isDraggingLeft.value = true;
};

const recalcLeftShift = () => {
  applyLeftShift(
    previousShiftLeft.value +
      draggingLeftEndPosX.value -
      draggingLeftStartPosX.value
  );
};

const applyLeftShift = (newPos: number) => {
  if (newPos < minWidthShift) {
    left.value = props.min;
  } else if (newPos > posRight.value) {
    left.value = right.value;
  } else if (newPos > maxWidthShift.value) {
    left.value = props.max;
  } else {
    recalcLeftRight(newPos, posRight.value);
  }
};

const dragStartRight = (event: MouseEvent | TouchEvent) => {
  event.stopPropagation();
  event.preventDefault();
  let x = 0;
  if (event instanceof MouseEvent) {
    x = event.x;
  } else if (event instanceof TouchEvent) {
    x = event?.touches?.[0]?.clientX;
  }

  previousShiftRight.value = posRight.value;
  draggingRightStartPosX.value = x;
  isDraggingRight.value = true;
};

const recalcRightShift = () => {
  applyRightShift(
    previousShiftRight.value +
      draggingRightEndPosX.value -
      draggingRightStartPosX.value
  );
};

const applyRightShift = (newPos: number) => {
  if (newPos < posLeft.value) {
    right.value = left.value;
  } else if (newPos < minWidthShift) {
    right.value = props.min;
  } else if (newPos > maxWidthShift.value) {
    right.value = props.max;
  } else {
    recalcLeftRight(posLeft.value, newPos);
  }
};
</script>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as mixins;

.number-slider {
  display: flex;
  flex-flow: column;
  gap: 10px;

  &__label {
    @include mixins.font-size-get(slider-label);
  }

  &__numbers {
    display: flex;
    justify-content: space-between;

    &-label {
      opacity: 0.5;
      @include mixins.font-size-get(slider-from-to-label);
    }

    &-number {
      margin-left: 10px;
      @include mixins.font-size-get(slider-number);
    }
  }

  &__slider {
    margin-top: 5px;
    position: relative;

    &-inactive-background {
      position: absolute;
      z-index: 1;
      height: 3px;
      background: #cbdcd3;
      top: 0px;
      left: 0px;
      width: 100%;
    }

    &-active-background {
      position: absolute;
      z-index: 2;
      height: 3px;
      background: #3eb57c;
      top: 0px;
      left: var(--left-shift);
      width: var(--active-background-width);
    }

    &-left-button {
      position: absolute;
      z-index: 3;
      width: 14px;
      height: 14px;
      border-radius: 100%;
      background: #3eb57c;
      top: -5px;
      left: var(--left-shift);
      cursor: pointer;
    }

    &-right-button {
      position: absolute;
      z-index: 3;
      width: 14px;
      height: 14px;
      border-radius: 100%;
      background: #3eb57c;
      top: -5px;
      left: var(--right-shift);
      cursor: pointer;
    }
  }
}
</style>
