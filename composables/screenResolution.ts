import { ref, onMounted, onUnmounted } from "vue";
import ResolutionsEnum from "~/core/ResolutionsEnum";

export function useScreenResolution() {
  const windowSize: Ref<{ height: number; width: number }> = ref({
    height: 0,
    width: 0,
  });

  const scrollPos: Ref<{ x: number; y: number }> = ref({
    x: 0,
    y: 0,
  });

  const resolutionsValues: Record<ResolutionsEnum, number> = {
    [ResolutionsEnum.XS]: 0,
    [ResolutionsEnum.SM]: 480,
    [ResolutionsEnum.MD]: 720,
    [ResolutionsEnum.SLG]: 960,
    [ResolutionsEnum.LG]: 1200,
    [ResolutionsEnum.XL]: 1440,
    [ResolutionsEnum.XXL]: 1920,
  };

  onBeforeMount(() => {
    setWindowSizes();
    window.addEventListener("resize", windowResize);
    window.addEventListener("scroll", onScroll);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", windowResize);
    window.removeEventListener("scroll", onScroll);
  });

  const onScroll = () => {
    scrollPos.value = { x: window.scrollX, y: window.scrollY };
  };

  const windowResize = () => {
    setWindowSizes();
  };

  const setWindowSizes = () => {
    windowSize.value.height = window.innerHeight;
    windowSize.value.width = window.innerWidth;
  };

  const includeResolutions = (from: ResolutionsEnum, to?: ResolutionsEnum) => {
    const resolutions = Object.values(ResolutionsEnum);
    const fromIndex = resolutions.findIndex((res) => from === res);
    const toIndex = to
      ? resolutions.findIndex((res) => to === res)
      : resolutions.length;
    const resolutionsSelection = resolutions.slice(fromIndex, toIndex + 1);
    return resolutionsSelection.includes(currentResolution.value);
  };

  const currentResolution = computed((): ResolutionsEnum => {
    const resolutions = Object.values(ResolutionsEnum);
    for (let i = resolutions.length - 1; i >= 0; i--) {
      const resolution = resolutions[i];
      if (resolutionsValues[resolution] <= windowSize.value.width) {
        return resolution;
      }
    }
    return resolutions[resolutions.length - 1];
  });

  return {
    currentResolution,
    windowSize,
    scrollPos,
    includeResolutions,
    resolutionsValues,
  };
}
