<template>
  <div class="default-layout">
    <div class="default-layout__header">
      <div class="default-layout__header__content">
        <div class="default-layout__header__content__leading">
          <div class="website-logo">
            <Icon style="font-size: 24px" name="twemoji:hospital" />
            <span>BI Rumah Sakit</span>
          </div>
        </div>
        <div class="default-layout__header__content__trailing">
          <NuxtLink to="/">
            <Button label="Home" text plain />
          </NuxtLink>
          <NuxtLink to="/data">
            <Button label="Data" text plain />
          </NuxtLink>
          <NuxtLink to="/about">
            <Button label="About" text plain />
          </NuxtLink>
          <NuxtLink v-if="status == 'unauthenticated'" to="/login">
            <Button text plain>
              <template #icon><Icon name="material-symbols:login"/></template>
            </Button>
          </NuxtLink>
          <Button v-if="status != 'unauthenticated'" @click="e => profileOverlayLayout.toggle(e)" text plain>
            <template #icon><Icon name="material-symbols:person"/></template>
          </Button>
          <OverlayPanel ref="profileOverlayLayout">
            <div class="profile">
              <div class="profile__icon">
                <Icon name="material-symbols:account-circle" size="40px" />
              </div>
              <div class="profile__name">
                <span class="profile__name__fullname">{{ data?.nama_lengkap }}</span><br>
                <span class="profile__name__username">{{ data?.username }}</span>
              </div>
            </div>
            <Divider />
            <Menu :model="profileMenu" />
          </OverlayPanel>
        </div>
      </div>
    </div>
    <div class="default-layout__content">
      <div class="default-layout__content__main">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { status, data, signOut } = useAuth();

const profileOverlayLayout = ref();
const profileMenu = [
  {
    label: "Profile",
    command: profileMenuClickWrapper(() => navigateTo("/profile")),
  },
  {
    label: "Logout",
    command: profileMenuClickWrapper(() => signOut({ callbackUrl: "/login" })),
  },
];

function profileMenuClickWrapper(func: Function) {
  return () => {
    func();
    profileOverlayLayout.value.hide();
  }
}
</script>

<style scoped lang="scss">
.default-layout {
  display: flex;
  min-height: 100vh;
  min-height: 100dvh;
  flex-direction: column;

  &__content {
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;

    &__main {
      width: 90%;
    }
  }

  &__header {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 500;
    width: 100%;
    height: 55px;
    border-bottom: 1px solid #a0a0a050;
    background: rgba(var(--surface-ground), 0.8);
    align-items: center;
    justify-content: center;
    padding: 4px;
    backdrop-filter: blur(8px);

    &__content {
      display: flex;
      width: 90%;
      height: 100%;
      align-items: center;
      justify-content: space-between;

      &__leading {
        display: flex;
        height: 100%;
        gap: 8px;
        align-items: center;
        align-self: start;
      }

      &__trailing {
        display: flex;
        height: 100%;
        gap: 8px;
        align-items: center;
        align-self: end;
      }
    }
  }
}

.website-logo {
  display: flex;
  height: 100%;
  gap: 8px;
  align-items: center;
  align-self: start;
  user-select: none;
}

.profile {
  display: flex;
  align-items: center;
  gap: 8px;

  &__name {
    &__fullname {
      font-weight: bold;
      color: var(--text-primary-color);
    }

    &__username {
      font-size: 0.8rem;
      color: var(--text-secondary-color);
    }
  }
}
</style>
