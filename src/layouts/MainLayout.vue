<template>
  <q-layout view="hHr LpR lFr">
    <q-header elevated class="bg-white text-dark">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
          color="orange"
        />
        <q-toolbar-title class="text-primary">
          <span class="text-bold">Umwelt</span>
          <!-- <q-avatar>
            <img src="~/assets/icon_greenlab.png">
          </q-avatar> -->
        </q-toolbar-title>
        <q-space/>
        <div class="q-gutter-sm row items-center no-wrap">
          <!-- <q-btn round dense flat color="white" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                 @click="$q.fullscreen.toggle()"
                 v-if="$q.screen.gt.sm">
          </q-btn> -->
          <!-- <q-btn round dense flat color="grey" :icon="icon" @click="setDarkMode" /> -->
          <!-- <q-btn round dense flat color="white" icon="notifications">
            <q-badge color="red" text-color="white" floating>
              5
            </q-badge>
            <q-menu
            >
              <q-list style="min-width: 100px">
                <messages></messages>
                <q-card class="text-center no-shadow no-border">
                  <q-btn label="View All" style="max-width: 120px !important;" flat dense
                         class="text-indigo-8"></q-btn>
                </q-card>
              </q-list>
            </q-menu>
          </q-btn> -->
          
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      elevated
      color="primary"
      class=" text-grey-8"
    >

      <div class="row justify-center q-mt-md">
        <q-btn round flat>
            <q-avatar size="56px" @click="$router.push('/admin/profile')">
              <!-- <img src="https://cdn.quasar.dev/img/boy-avatar.png"> -->
              <img :src="AppActiveUser.avatar" v-if="AppActiveUser.avatar != null">
              <img v-else src="~/assets/avatar-s-11.png" >
            </q-avatar>
            <q-menu class="text-green text-center"
            >
              <!-- <q-list style="min-width: 180px" class="text-center">
                <items-profile />
              </q-list> -->
            </q-menu>
          </q-btn>
      </div>
      <div class="row justify-center q-mt-sm">
        <p>{{ AppActiveUser.email }}</p>
      </div>
      <div class="row justify-center">
        <p class="text-caption text-primary">{{ AppActiveUser.role }}</p>
      </div>
      <q-list >
        <q-expansion-item v-for="(menu,index) in menus" :key="index" :icon="menu.icon" :label="menu.title" class="q-pa-sm" >
          <q-list v-for="(item, i) in menu.children" :key="i"  class="q-pl-lg">
            <q-item :to="item.route" active-class="q-item-no-link-highlighting">
            <q-item-section avatar>
              <q-icon name="arrow_right"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
            </q-item-section>
          </q-item>
          </q-list>
        </q-expansion-item>
        <q-item to="/logout" active-class="q-item-no-link-highlighting" class="q-pa-sm">
            <q-item-section avatar class="q-pa-md">
              <q-icon name="logout" :class="{'text-primary': darkMode, 'text-dark':!darkMode}" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Cerrar sesión</q-item-label>
            </q-item-section>
          </q-item>
      </q-list>
    </q-drawer>

    <q-page-container :class="{'bg-grey-5': darkMode, '':!darkMode}">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import EssentialLink from 'components/EssentialLink.vue'
import itemsProfile from 'components/Profile/ItemProfile.vue'
import { useQuasar } from 'quasar'

import { defineComponent, ref, onMounted } from 'vue'
import { useUsers } from 'src/composables/useUsers.js'


export default defineComponent({
  name: 'MainLayout',

  components: {
    // EssentialLink,
    itemsProfile
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const $q = useQuasar()
    const $store = useUsers();
    const {fetchUser, menus, AppActiveUser} = $store

    const icon = ref('')
    const darkMode = ref(JSON.parse(localStorage.getItem('darkMode')))
    const user = localStorage.getItem('userInfo')
    
    $q.dark.set(false)

    // console.log($q.dark)
    if(darkMode.value != null){
      icon.value = darkMode.value ? 'sunny' : 'bedtime'
      $q.dark.set(darkMode.value)
    }
    // console.log($q.dark)
    // calling here; equivalent to when component is created
    const setDarkMode = () => {
      darkMode.value = !darkMode.value
      icon.value = darkMode.value ? 'sunny' : 'bedtime'
      localStorage.setItem('darkMode', darkMode.value)
      $q.dark.set(darkMode.value)
    }

    onMounted(async() => {
      await fetchUser(user.id)
    })
    
    return {
      leftDrawerOpen,
      darkMode,
      icon,
      menus,
      AppActiveUser,
      setDarkMode,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
