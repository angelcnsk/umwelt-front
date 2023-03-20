<template>
    <q-page class="q-pa-lg">
        <div class="q-pa-md q-gutter-sm">
            <q-breadcrumbs>
                <q-breadcrumbs-el icon="home" :to="{name:'index-admin'}" />
                <q-breadcrumbs-el label="Perfil" icon="person" />
            </q-breadcrumbs>
        </div>
        <q-card rounded>
            <q-card-section>
                <div class="row justify-betweem">
                    <div class="bg-grey-2 square-box text-center col-xs-12 col-md-3 col-sm-4 ">
                        <q-avatar size="120px" @click="$refs.update_avatar_input.click()">
                            <img :src="userData.avatar">
                            <input type="file" id="input_img" class="hidden" ref="update_avatar_input" @change="update_avatar" accept="image/*">  
                        </q-avatar>
                        <p class="text-dark q-mt-md text-weight-bold">{{ userData.name }}</p>
                    </div>
                    <div class="col-xs-12 col-sm-7 col-md-3 text-grey-7 ficha-datos">
                        <div class="q-mt-md">
                            <q-input v-model="userData.name" label="Nombre" />
                        </div>
                        <div class="q-mt-md">
                            <q-input 
                                v-model="userData.email" 
                                type="email" 
                                :rules="[
                                    val => !!val || '* Campo obligatorio',
                                    (val, rules) => rules.email(val) || 'Ingresa un e-mail válido',
                                ]"
                                label="E-mail" 
                            />
                        </div>

                        <div class="q-mt-md">
                            
                            <q-input 
                                bottom-slots
                                :type="typeInput"
                                v-model="userData.password" 
                                lazy-rules 
                                label="Password" 
                                :rules="[val => !!val || 'Campo requerido']"
                            >
                                 <template v-slot:append>
                                    <q-btn @click="showPass" round dense flat :icon="iconVisivility" />
                                </template>
                                <template v-slot:prepend>
                                    <q-icon name="help" class="cursor-pointer" color="orange" >
                                        <q-tooltip class="bg-orange">Ingresa una contraseña sólo si deseas cambiarla</q-tooltip>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                    </div>
                </div>
                <div class="q-mt-md">
                    <div class="row">
                        <p class="row text-h4">Firma </p>
                    </div>
                    <q-separator spaced />
                    <div v-if="userData.signature === null">
                        <signature-pad 
                            :width="600"
                            :height="300"
                            :customStyle="{ border: 'black 1px solid',display:'block',margin:'0 auto' }"
                            ref="signaturePad"
                            :options="{onBegin: () => {$refs.signaturePad.resizeCanvas()}}"
                        >
                        </signature-pad>
                            <div class="row q-mt-md justify-center">
                                <div class="col  text-center">
                                <q-btn class="q-mr-sm" color="primary" @click="save">Guardar</q-btn>
                                <q-btn class="q-mr-sm" color="primary" @click="clearSignature">Deshacer</q-btn>
                                <q-btn class="q-mr-sm" color="primary" @click="savePng">Guardar PNG</q-btn>
                                </div>
                            </div>
                    </div>
                    <div v-else class="text-center">
                        <img :src="`data:image/png;base64,${srcSignature}`" width="600" class="signatureSrc" />
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script>
  import {defineComponent, onMounted, ref, computed, watch} from 'vue'
  import { useUsers } from 'src/composables/useUsers';
  import SignaturePad from "vue3-signature-pad";
  import { Notify, useQuasar } from "quasar";


  export default defineComponent({
    components: {
        SignaturePad,
    },
    name: "EditProfile",
    setup() {
        const $q = useQuasar()
        const {AppActiveUser, updateImgProfile, saveSignature, fetchUser} = useUsers()
        
        const userData = computed(() => {
            return AppActiveUser.value
        })

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

        const update_avatar = () => {
            const imgProfile = document.getElementById('input_img').files
            const foto = new FormData
            foto.append('file', imgProfile[0])
            const upload = updateImgProfile(foto)

            if(upload.status == 200){
                $q.notify({
                    position:'top',
                    type: 'positive',
                    message: `La foto de perfil se actualizó con éxito`
                })
            } else {
                $q.notify({
                    position:'top',
                    type: 'negative',
                    message: `Error contacta al administrador`
                })
            }
        }

        const signaturePad = ref(null);
        const srcSignature = ref('')

        const save = () => {
            $q.dialog({
                title: 'Guardar firma',
                message: 'Se guardará la firma y no será posible modificarla',
                // prompt: {
                //   model: password,
                //   isValid: val => val.length > 5,
                //   type: 'password' // optional
                // },
                ok: {
                push: true,
                label:'Guardar'
                },
                cancel: {
                push: true,
                color: 'dark',
                label:'Cancelar'
                },
                persistent: true
            }).onOk(async data => {
                const sign = getSignature()
            
                // const firma = new FormData
                // firma.append('file', sign)
                const guardar = await saveSignature({file:JSON.stringify(sign.data)})

                if (guardar.data.msg === 'success'){
                await fetchUser(userData.value.id)
                $q.notify({
                    position:'top',
                    type: 'positive',
                    message: `La firma se guardó con éxito`
                })
                console.log(userData.value, AppActiveUser.value)
                } else {
                    $q.notify({
                        position:'top',
                        type: 'negative',
                        message: `Hubo un error al guardar la firma`
                    })
                }

            }).onCancel(() => {
                // console.log('>>>> Cancel')
            }).onDismiss(() => {
                // console.log('I am triggered on both OK and Cancel')
            })
        }
    
        const savePng = () => {
            const { saveSignature } = getSignaturePad()
            const sign = saveSignature()

            if (!sign.isEmpty) {
                var dataURL = sign.data
                    
                const downloadLink = document.createElement("a");
                const fileName = 'firma.png';
                downloadLink.href = dataURL;
                downloadLink.download = fileName;
                downloadLink.click();
            //   download(dataURL, "signature.png");
            } 
        }

        const getSignaturePad = () => {
            if (!signaturePad.value) {
                throw new Error("No signature pad ref could be found");
            }
            return signaturePad.value;
        };

        const clearSignature = () => {
            getSignaturePad().clearSignature();
        };

        const getSignature = () => {
            const signature = getSignaturePad().saveSignature();
            return signature;
        };

        watch(userData, (data) => {
            console.log('SE ACTUALIZÓ',data)
            if(data.signature != null) srcSignature.value = data.signature.split(',')[1]; 
        })

        onMounted(() => {
            if(userData.value.signature != null) srcSignature.value = userData.value.signature.split(',')[1]; 
        })

        
      return {
        userData,
        showPass,
        update_avatar,
        iconVisivility,
        typeInput,
        signaturePad,
        srcSignature,
        save,
        savePng,
        clearSignature
      }
    }
  })
  </script>

<style>
.square-box{
    padding: 25px;
}
.signatureSrc{
  max-width: 75%;
}

@media screen and (min-width: 600px) {
  .ficha-datos{
    margin-left: 30px;
  }
}

</style>