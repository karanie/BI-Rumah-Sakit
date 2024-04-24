<template>
  <div class="settings-cont">
    <div class="settings">

      <div class="settings__section">
        <div class="welcome">
          <div class="welcome__pp">
            <Icon name="material-symbols:account-circle" size="64px" />
          </div>
          <div class="welcome__content">
            <span class="welcome__content_msg">Selamat datang ke pengaturan, <span class="welcome__content__msg__fullname">{{ data?.nama_lengkap }}</span></span><br>
          </div>
        </div>
      </div>

      <div class="settings__section">
        <div class="section-title">Pengaturan</div>
        <Menu :model="settings">
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

    </div>
  </div>
</template>

<script setup lang="ts">
const { status, data, signOut } = useAuth();

const settings = ref([
  {
    nuxtIcon: "material-symbols:person-add",
    label: "Buat akun baru",
    route: "/register",
  },
  {
    nuxtIcon: "material-symbols:password-2",
    label: "Ganti password",
    route: "/settings/changepass",
  },
]);
</script>

<style lang="scss" scoped>
.settings-cont {
  display: flex;
  justify-content: center;
}

.settings {
  padding: 8px 0 8px 0;
  width: 100%;
  max-width: 800px;

  &__section {
    padding: 16px 0 0 0;

    &:first-child {
      padding: 0;
    }
  }
}

.section-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-color);
  padding-bottom: 0.5rem;
}

.welcome {
  display: flex;
  align-items: center;
  gap: 16px;

  &__content {
    &__msg {
      font-size: 1.25rem;
      &__fullname {
        font-weight: bold;
        color: var(--text-primary-color);
      }
    }
  }
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
