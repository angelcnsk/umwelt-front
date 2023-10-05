<template>
  <q-layout>
    <q-page-container class="bg-light">
      <q-page>
        <div class="row justify-center">
          <!-- <div class="col-xs-12 col-sm-6 col-md-6 hidden-mobile">
            <img src="~/assets/login-nature.svg" class="img-login" alt="">
          </div> -->
          <div class="col-xs-12 col-sm-6 col-md-6 col-card">
            <q-card class="card-login">
              <q-card-section>
                <div class="text-center q-pt-lg">
                  <span class="q-ml-md text-primary text-h5 q-mt-sm">UMWELT</span>
                  <div class="col text-h6 ellipsis">
                    <!-- Un proyecto de Equilibra <br />
                    By Grupo Wess -->
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
              
                <q-input
                  filled
                  v-model="user.email"
                  type="email"
                  label="E-mail"
                  lazy-rules
                  :rules="[
                    val => !!val || '* Campo obligatorio',
                    (val, rules) => rules.email(val) || 'Ingresa un e-mail válido',
                  ]"
                />

                <q-input
                  :type="typeInput"
                  filled
                  v-model="user.password"
                  label="Password"
                  lazy-rules
                  @keyup.enter="onSubmit"
                  :rules="[val => !!val || 'Campo requerido']"
                >
                  <template v-slot:append>
                    <q-btn @click="showPass" round dense flat :icon="iconVisivility" />
                  </template>
                </q-input>

                <div class="row">
                  <q-btn label="Iniciar sesión" color="primary" @click="onSubmit"/>
                  <q-spinner-dots v-if="loading" class="q-ml-lg" color="primary" size="lg" />
                </div>
              
              </q-card-section>
            </q-card>
          </div>
        </div>  
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {ref} from 'vue'

import { useQuasar } from "quasar";
import { useUsers } from '../composables/useUsers.js'

const $q = useQuasar();
const $store = useUsers();
const {login} = $store
const user = ref({})
const loading = ref(false)
const visivility = ref(false)
const iconVisivility = ref('')
const typeInput = ref('')

iconVisivility.value = visivility.value ? 'visibility_off' : 'visibility'
typeInput.value = visivility.value ? 'text' : 'password'

const showPass = () => {
  visivility.value = !visivility.value
  iconVisivility.value = visivility.value ? 'visibility_off' : 'visibility'
  typeInput.value = visivility.value ? 'text' : 'password'
}


const onSubmit = async () => {
  loading.value = true
  if(user.value.email == '' || user.value.email == undefined || user.value.password == '' || user.value.password == undefined){
    $q.notify({
        position:'top',
        type: 'negative',
        message: 'Usuario o contraseña incorrectos'
    })
    loading.value = false
    return false
  }
  
  const req = await login(user.value)
  // console.log('cuando falla',req)
  if(req.data.error){
    $q.notify({
        position:'top',
        type: 'negative',
        message: 'Usuario o contraseña incorrectos'
    })
    loading.value = false
  } else {
    // $router.push({name:'index-admin'})
    setTimeout(() => {
      // console.log('después de 2 segundos')
      window.location.replace('/admin/dashboard')
      // $router.push({name:'index-admin'})
    }, 2000);
  }

};

</script>

<style>
.img-login{
  display: block;
  max-width: 65%;
  margin: 120px auto;
}
.main-logo{
  margin-top: 150px;
}
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
.card-login{
  margin: 190px auto;
  width: 65%;
}

@media screen and (max-width: 1180px) {
  .col-card{
    margin: 0 auto;
  }
  .card-login{
    width: 90%;
    margin: 100px auto;
  }
}

@media screen and (max-width: 768px) {
  .hidden-mobile{
    display: none;
  }
  .col-card{
    margin: 0 auto;
  }
  .card-login{
    width: 90%;
    margin: 100px auto;
  }
}
</style>
