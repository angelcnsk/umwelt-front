<template>
    <q-page class="q-pa-lg">
        <div class="q-pa-md q-gutter-sm">
            <q-breadcrumbs>
                <q-breadcrumbs-el icon="home" :to="{name:'index-admin'}" />
                <q-breadcrumbs-el label="Usuarios" icon="group" :to="{name:'usuarios'}" />
                <q-breadcrumbs-el label="Usuario" icon="person" />
                
            </q-breadcrumbs>
        </div>
        <q-card rounded>
            <q-card-section>
                <div class="row justify-betweem">
                    <div class="bg-grey-2 square-box text-center col-xs-12 col-md-3 col-sm-4 ">
                        <q-avatar size="120px">
                            <img :src="userData.avatar">
                        </q-avatar>
                        <p class="text-dark q-mt-md text-weight-bold">{{ userData.name }}</p>
                    </div>
                    <div class="col-xs-12 col-sm-7  text-grey-7 q-ma-md">
                           <div class="q-pl-sm q-mt-md">
                            <q-icon name="mail" size="md" /> {{ userData.email }}
                           </div>
                           <div class="q-pl-sm q-mt-md">
                            <q-icon name="bookmark" size="md" /> 
                            <span :class="{'text-red': userData.role == null}">{{ userData.role != null? userData.role : 'Sin role asignado' }}</span>
                           </div>
                           <div class="q-pl-sm q-mt-md">
                            <q-toggle v-model="statusUser" val="calories" label="Inactivo / Activo" />
                           </div>
                           <div class="q-pl-md q-mt-md">
                            <q-btn size="md" color="primary" @click="resetPass" label="Reset password" />
                           </div>
                    </div>
                    
                </div>
                <div class="q-mt-md">
                    <div class="row">
                        <p class="row text-h4">Roles</p>
                    </div>
                    <q-separator spaced />
                    <q-toggle v-model="selectedRoles" v-for="role in roles" :key="role.id" :val="role.id" :label="role.role" />
                </div>
                <div class="row q-mt-md justify-end">
                    <q-btn size="md" color="primary" label="Guardar"  @click="confirmRoles"/>
                </div>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
  //seguir el mismo ejemplo para crear todo como componente
import { computed, onMounted, watch, ref} from 'vue'
import { useUsers } from 'src/composables/useUsers.js'
import { usePermisos } from 'src/composables/usePermisos.js'
import { useQuasar } from "quasar";
import { useRoute, useRouter } from 'vue-router';
import { recovery } from '../../../composables/firebase/auth'

const $q = useQuasar()
const route = useRoute()
const {fetchUser, setStatusUser, user_edit, AppActiveUser} = useUsers()
const { getRoles, roles, addRolesToUser } = usePermisos()
const userData = computed(() => user_edit.value)
const statusUser = ref(true)
const selectedRoles = ref([])

const assigmentRolesToUser = async () => {
    selectedRoles.value
    const addRole = await addRolesToUser({user_id: route.params.id, roles_ids:selectedRoles.value})
    if(addRole.status == 200){
        $q.notify({
            position:'top',
            type: 'positive',
            message: 'Se actualizaron los roles del usuario'
        })

        if (AppActiveUser.value.id === route.params.id) {
            //si el usuario que edita es el mismo que se editó, se actualiza la página para que tome los nuevos roles
            window.location.replace(`${location.href}`)
        }

    } else {
        const msg = addRole.response.data.message
        $q.notify({
            position:'top',
            type: 'negative',
            message: msg
        })
    }
}

const confirmRoles = () => {
    $q.dialog({
        title: '¿Seguro que quieres continuar?',
        message: 'Se actualizarán los roles seleccionados',
        cancel: {
            label:'cancelar',
            color:'dark'
        },
        persistent: true,
        ok:{
            label:'Aceptar',
            color:'primary'
        }
        
    }).onOk(() => {
        assigmentRolesToUser()
    }).onOk(() => {
        // console.log('>>>> second OK catcher')
    }).onCancel(() => {
        // console.log('>>>> Cancel')
    }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
    })
}

const resetPass = () => {
    const reset = recovery({email: userData.value.email, domain:`${origin}?email=${userData.value.email}`})

    if(reset){
        $q.notify({
            position:'top',
            type: 'positive',
            message: `Se envió correo de recuperación`
        })
    }
}

watch(statusUser, async (value) => {
    const msgStatus = value === false ? 'inactivó' : 'activó'
    const data = {id:userData.value.id, status:value}
    const setStatus = await setStatusUser(data)

    $q.notify({
        position:'top',
        type: 'positive',
        message: `Se ${msgStatus} al usuario`
    })

})

onMounted(async () => {
    await fetchUser(route.params.id)
    await getRoles()
    statusUser.value = userData.value.active == 1
    userData.value.roles.forEach((item) => {
        selectedRoles.value.push(item.id)
    })
}) 

</script>

<style>
.square-box{
    padding: 25px;
}
</style>