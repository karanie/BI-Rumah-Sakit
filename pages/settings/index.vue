<template>
  <div class="settings__section">
    <Menu :model="getSettings">
      <template #item="{ item, props }">
        <NuxtLink :to="item.route" class="list-box-item" v-bind="props.action">
          <div class="list-box-item__leading">
            <span :class="props.icon" />
            <Icon :name="item.nuxtIcon" />
          </div>
          <div class="list-box-item__content">
            {{ item.label }}
          </div>
          <div class="list-box-item__trailing">
            <Icon name="material-symbols:navigate-next" />
          </div>
        </NuxtLink>
      </template>
    </Menu>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "settings",
});

const { status, data, signOut } = useAuth();

const settings = ref([
  {
    nuxtIcon: "material-symbols:person-add",
    label: "User Management",
    roles: ["admin"],
    route: "/settings/users",
  },
  {
    nuxtIcon: "material-symbols:password-2",
    label: "Ganti password",
    roles: ["admin", "non_admin"],
    route: "/settings/changepass",
  },
]);
const getSettings = computed(() => {
  return settings.value.filter((i: any) => i.roles.some((role: string) => role == data.value?.role));
});
</script>

<style lang="scss" scoped>
.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-color);
  padding-bottom: 0.5rem;
}

.list-box-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;

  &__trailing {
    margin: 0 0 0 auto;
  }
}

.no-underline {
  text-decoration: none;
}
</style>
