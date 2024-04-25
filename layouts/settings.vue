<template>
  <NuxtLayout name="default">
  <div class="settings-cont">
    <div class="settings">
      <div class="settings__route-nav">
        <Breadcrumb :home="{ label: 'Pengaturan', route: '/settings' }" :model="routeNavs">
          <template #item="{ item, props }">
            <NuxtLink
              :to="item.route"
              class="breadcrumb-item"
              :class="{ 'breadcrumb-item--active': route.path == item.route }"
              v-bind="props.action">
              {{ item.label }}
            </NuxtLink>
          </template>
        </Breadcrumb>
      </div>

      <div class="settings__content">
        <slot />
      </div>
    </div>
  </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();

const routeNameMap: any = {
  "/settings/users": "User Management",
  "/settings/users/add": "Tambah User",
  "/settings/users/edit": "Edit User",
};

function setRouteNavs() {
  const paths = route.path.split("/").filter((i: string) => i != "");
  return paths
    .filter((i: string) => i != "" && i != "settings")
    .map((i: string, idx: number) => {
      const subpath = "/" + paths.slice(0, 2 + idx).reduce((a: string, b: string) => `${a}/${b}`);
      return {
        label: routeNameMap[subpath] || i,
        route: subpath,
      }
    })
}
const routeNavs: Ref<any> = ref(setRouteNavs());

watch(() => route.path, () => {
  routeNavs.value = setRouteNavs();
});
</script>

<style lang="scss" scoped>
.settings-cont {
  display: flex;
  justify-content: center;
}

.settings {
  padding: 0 0 8px 0;
  width: 100%;
  max-width: 800px;

  &__section {
    padding: 16px 0 0 0;

    &:first-child {
      padding: 0;
    }
  }
}

.breadcrumb-item {
  text-decoration: none;
  color: var(--text-color);

  &--active {
    color: var(--text-secondary-color);
  }
}
</style>
