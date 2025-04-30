<template>
    <div>
        <q-btn flat round dense icon="notifications" color="primary">
            <q-badge color="red" floating>{{unread}}</q-badge>
        </q-btn>

        <!-- Panel de notificaciones -->
        <q-menu v-model="menu" anchor="bottom right" self="top right">
            <q-card style="width: 350px; max-height: 400px;" class="q-pa-sm scroll">
                <q-card-section class="q-pb-xs">
                <div class="text-subtitle1">Notificaciones</div>
                </q-card-section>

                <q-separator />

                <q-list separator>
                <q-item
                    v-for="notification in notifications"
                    :key="notification.id"
                    clickable
                    @click="viewNotify(notification)"
                    v-ripple
                >
                    <q-item-section avatar>
                    <q-avatar size="40px">
                        <img :src="notification.avatar" />
                    </q-avatar>
                    </q-item-section>

                    <q-item-section>
                    <q-item-label class="text-weight-medium">
                        Servicio:{{notification.service_id}} | Planta: {{ notification.planta }}
                    </q-item-label>
                    <q-item-label caption class="ellipsis">
                        {{ notification.notify }}
                    </q-item-label>
                    <q-item-label caption class="text-grey">
                        {{ notification.date }}
                    </q-item-label>
                    </q-item-section>

                    <q-item-section side v-if="!notification.view">
                        <q-icon name="circle" color="deep-purple" size="10px" />
                    </q-item-section>
                </q-item>
                </q-list>

                <q-separator />

                <q-card-actions align="center">
                    <q-btn flat label="View All Notifications" class="text-primary" />
                </q-card-actions>
            </q-card>
        </q-menu>
    </div>
</template>

<script setup>
import { watch, ref, inject } from 'vue';
import { listenToNotifications, setNotifyView } from 'src/composables/firebase/notificaciones';
const user = inject('currentUser');
const menu = ref(false);
const notifications = ref([]);
const unread = ref(0);

const viewNotify = async (item) => {
    if(unread.value === 0) return;
    await setNotifyView(item, user.value.id);
}

watch(
  () => user?.value?.id,
  async (newId) => {
    if (newId) {
        listenToNotifications(user.value.id, (data) => {
            notifications.value = data;
        });
    }
  },
  { immediate: true }
);

watch(
  () => notifications.value,
  (newVal) => {
    unread.value = newVal.filter((item) => !item.view).length;
  },
  { immediate: true }
);

</script>

<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 240px;
}
</style>