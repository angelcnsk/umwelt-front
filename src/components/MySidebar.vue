<template>
  <q-drawer
    show-if-above
    v-model="drawerOpen"
    side="left"
    bordered
    :mini="miniState"
    class="bg-white text-primary"
  >
    <q-scroll-area class="fit">
      <q-list>
        <q-item clickable @click="toggleMini" class="q-pt-md q-pb-md">
          <q-item-section avatar>
            <q-icon name="menu" />
          </q-item-section>
          <q-item-section v-if="!miniState">
            <q-item-label>Collapse</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item-label header class="q-ml-md" v-if="!miniState">
          Navigation
        </q-item-label>

        <q-item
          v-for="link in links"
          :key="link.label"
          clickable
          v-ripple
          :active="link.label === current"
          active-class="bg-primary text-white"
          @click="setActive(link.label)"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section v-if="!miniState">
            <q-item-label>{{ link.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue'

const drawerOpen = ref(true)
const miniState = ref(false)
const current = ref('Home')

const links = [
  { label: 'Home', icon: 'home' },
  { label: 'Customers', icon: 'groups' },
  { label: 'Library', icon: 'photo_library' },
  { label: 'Settings', icon: 'settings' },
  { label: 'Calendar', icon: 'event' },
  { label: 'Cards', icon: 'credit_card' },
  { label: 'Charts', icon: 'bar_chart' },
  { label: 'Login', icon: 'login' },
  { label: 'Profile', icon: 'person' },
  { label: 'Dashboard 1', icon: 'dashboard' },
  { label: 'Recent Orders', icon: 'shopping_cart' }
]

function setActive(label) {
  current.value = label
}

function toggleMini() {
  miniState.value = !miniState.value
}
</script>

<style scoped>
.q-drawer {
  width: 260px;
}
</style>
