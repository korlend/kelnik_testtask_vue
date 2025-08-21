<template>
  <div
    class="circle-button"
    :class="classes"
    @click="circleClicked"
    @touchend="circleClicked">
    <div class="circle-button__text">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const classes = computed(() => {
  const classesList = [];
  if (props.active) {
    classesList.push("active");
  }
  if (props.disabled) {
    classesList.push("disabled");
  }
  return classesList;
});

const circleClicked = (event: Event) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
  }
};
</script>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as mixins;

.circle-button {
  width: 44px;
  height: 44px;
  background-color: #ffffff;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @include mixins.font-size-get(circle-button);

  $button: &;

  &:hover {
    box-shadow: 0 6px 20px 0px #ccc;
  }

  &.active {
    background-color: #3eb57c;
    color: #fff;

    &:hover {
      box-shadow: 0px 6px 20px 0px #95d0a1;
    }
  }

  &.disabled {
    cursor: default;
    &:hover {
      box-shadow: none;
    }
  }

  &__text {
    #{$button}.disabled & {
      opacity: 0.2;
    }
  }
}
</style>
