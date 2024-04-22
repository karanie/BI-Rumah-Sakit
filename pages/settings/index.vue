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
        <Listbox :options="settings">
          <template #option="slotProps">
            <div class="list-box-item" @click="navigateTo(slotProps.option.url)">
              <Icon :name="slotProps.option.icon" />
              {{ slotProps.option.name }}
            </div>
          </template>
        </Listbox>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
const { status, data, signOut } = useAuth();

const settings = ref([
  {
    icon: "material-symbols:person-add",
    name: "Buat akun baru",
    url: "/register",
  },
  {
    icon: "material-symbols:password-2",
    name: "Ganti password",
    url: "/settings/changepass",
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
}
</style>
