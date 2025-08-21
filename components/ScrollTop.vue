<template>
  <div
    class="scroll-top"
    v-if="scrollPos.y > 0"
    @click="scrollTopClicked"
    @touchend="scrollTopClicked">
    <div class="scroll-top__arrow-head"></div>
    <div class="scroll-top__arrow-shaft"></div>
  </div>
</template>

<script setup lang="ts">
const { scrollPos } = useScreenResolution();

const scrollTopClicked = () => {
  scroll({ top: 0, behavior: "smooth" });
};
</script>

<style lang="scss" scoped>
.scroll-top {
  position: fixed;
  right: 32px;
  bottom: 32px;
  width: 40px;
  height: 40px;
  background-color: #95d0a1;
  border-radius: 100%;
  cursor: pointer;

  &__arrow-head {
    position: absolute;
    top: 14px;
    left: 16px;
    width: 6px;
    height: 6px;
    border-top: 2px solid #ffffff;
    border-right: 2px solid #ffffff;
    rotate: -45deg;
  }

  &__arrow-shaft {
    position: absolute;
    top: 15px;
    left: 19px;
    width: 0px;
    height: 12px;
    border-left: 2px solid #ffffff;
  }
}
</style>
