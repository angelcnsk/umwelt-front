<template>
  <q-drawer
    show-if-above
    v-model="drawerOpen"
    side="left"
    bordered
    :mini="miniState"
    class="text-primary"
    :class="$q.dark.isActive ? 'q-dark' : 'q-light'"
  >
    <q-scroll-area class="fit">
      <q-list>
        <q-item clickable @click="toggleMini" class="q-pt-md q-pb-md">
          <q-item-section avatar v-if="miniState">
            <q-avatar square size="25px">
                <img :src="collapse" />
            </q-avatar>
          </q-item-section>
          <q-item-section v-if="!miniState" class="flex flex-center">
            <q-item-label><q-img :src="logo" width="150px" /></q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />
    
        <q-expansion-item
          v-for="(link,index) in links"
          :key="index"
          @click="setActive(index)"
          
          :icon="link.icon"
          class="item-expansion-menu text-grey-8" 
          :label="link.title"
          :model-value="current === index"
        >
            <q-list v-for="(item, i) in link.children" 
                :key="i"  
                class="q-pl-md"
            >
                <q-item :to="item.route"
                    clickable
                    v-ripple="{ early: true }"
                    :class="[
                        'q-item-no-link-highlighting',
                        route.path === item.route ? 'bg-selected text-white' : ''
                    ]"
                >
                    <q-item-section avatar>
                        <div class="row items-center q-gutter-sm">
                            <q-icon color="grey-8" size="12px"  name="
                                radio_button_unchecked"/>
                            <q-item-label>{{ item.title }}</q-item-label>
                        </div>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-expansion-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
import { computed, ref, toRef, watch } from 'vue'
import logo from 'src/assets/images/logo-umwelt.png';
import collapse from 'src/assets/images/icon-menu.png';
import { useRoute } from 'vue-router'

const props = defineProps({
    menus: Object,
});

const items = toRef(props, 'menus');
const drawerOpen = ref(true);
const miniState = ref(false);
const current = ref(null);
const links = computed(() => items.value);
const route = useRoute() // Saber la ruta actual
const basePath = computed(() => {
  const fullPath = route.fullPath
  const parts = fullPath.split('/').filter(p => p) // Quita strings vacíos
  if (parts.length >= 2) {
    return `/${parts[0]}/${parts[1]}`
  }
  return fullPath
})

function setActive(index) {
  current.value = current.value === index ? null : index
}

watch(links, () => {
    for (let i = 0; i < links.value.length; i++) {
        const link = links.value[i]
        
        if (link.children && link.children.some(child => child.route === basePath.value)) {
            current.value = i
            return i // el índice del menú que se va a expandir
        }
    }
}); 

function toggleMini() {
  miniState.value = !miniState.value
}

</script>

<style scoped>
.q-drawer {
  width: 260px;
}
.bg-selected {
  background: linear-gradient(90deg,rgba(147, 180, 58, 1) 0%, rgba(253, 134, 29, 1) 0%, rgba(252, 176, 69, 1) 100%);
}
</style>
