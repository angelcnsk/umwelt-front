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
                    :type="typeInput"
                    filled
                    v-model="user.password1"
                    label="Password"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  >
                    <template v-slot:append>
                      <q-btn @click="showPass" round dense flat :icon="iconVisivility" />
                    </template>
                  </q-input>
  
                  <q-input
                    :type="typeInput"
                    filled
                    v-model="user.password2"
                    label="Confirmar Password"
                    lazy-rules
                    @keyup.enter="onSubmit"
                    :rules="[val => !!val || 'Campo requerido']"
                  >
                    <template v-slot:append>
                      <q-btn @click="showPass" round dense flat :icon="iconVisivility" />
                    </template>
                  </q-input>
  
                  <div class="row">
                    <q-btn label="Actualizar contraseña" color="primary" @click="onSubmit"/>
                    <q-spinner-dots v-if="loading" class="q-ml-lg" color="primary" size="lg" />
                  </div>
                
                </q-card-section>
                <q-card-section v-if="msgSuccess">
                  <div class="text-subtitle1 text-center bg-green-2">
                    <span>Contraseña modificada correctamente</span> <br>
                    <router-link style="text-decoration: none;" :to="{ name: 'login'}">Iniciar sesión</router-link>
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
import {ref, onMounted} from 'vue'

import { useQuasar} from "quasar";
import { useRoute, useRouter } from "vue-router";
import { useUsers } from '../composables/useUsers.js'
import { confirmPassword } from "../composables/firebase/auth";
  
const $q = useQuasar();
const $route = useRoute();
const $router = useRouter();

const user = ref({})
const loading = ref(false)
const visivility = ref(false)
const iconVisivility = ref('')
const typeInput = ref('')

const msgSuccess = ref(false)


iconVisivility.value = visivility.value ? 'visibility_off' : 'visibility'
typeInput.value = visivility.value ? 'text' : 'password'

const showPass = () => {
visivility.value = !visivility.value
iconVisivility.value = visivility.value ? 'visibility_off' : 'visibility'
typeInput.value = visivility.value ? 'text' : 'password'
}


const onSubmit = async () => {
    loading.value = true
    
    if(user.value.password1 == '' || user.value.password1 == undefined || user.value.password2 == '' || user.value.password2 == undefined){
        $q.notify({
            position:'top',
            type: 'negative',
            message: 'Ingresa una contraseña válida'
        })
        loading.value = false
        return false
    }

    if(user.value.password1 !== user.value.password2){
        $q.notify({
            position:'top',
            type: 'negative',
            message: 'Contraseñas diferentes'
        })
        loading.value = false
        return false
    }
    user.value.code = $route.query.oobCode
    user.value.url = location.href
    
    const req = await confirmPassword(user.value)
    // console.log('cuando falla',req)
    if(req.status == 200){
        msgSuccess.value = true
        setTimeout(() => {
          loading.value = false
          $router.push({name:'salir'})
        // window.location.replace('/admin/dashboard')
        }, 5000);
        
    } else {
      console.log(req)
      $q.notify({
          position:'top',
          type: 'negative',
          message: req.error
      })
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
  
  /*@media screen and (max-width: 820px) {
    .col-card{
      margin: 0 auto;
    }
    .card-login{
      width: 90%;
      margin: 100px auto;
    }
  }*/
  
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
  