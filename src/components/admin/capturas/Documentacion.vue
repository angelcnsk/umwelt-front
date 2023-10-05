<template>
    <q-card class="q-pa-sm">
            <q-card-section>
                <q-list bordered class="rounded-borders" v-if="secciones.length>0">
                    <div class="row q-mb-md q-pa-sm">
                        <q-btn  color="white" text-color="primary" round icon="save" @click="autoSave('click')" />
                    </div>
                    <q-expansion-item
                        group="somegroup"
                        expand-separator
                        icon="ads_click"
                        header-class="text-primary"
                        :label="`${seccion.label}`" v-for="(seccion,i) in secciones" :key="i"
                        style="border: .2px solid gray"
                    >
                    <q-separator />
                        <div class="q-pa-md" v-for="(document,i) in seccion.documents" :key="i">
                            <div class="row d-inline-block">
                                <!-- <span>{{document.texto  }}</span> -->
                                <span class="text-justify text-caption"> {{ document.global }})
                                    <span class="text-body2" v-html="document.texto" />
                                </span>
                                
                            </div>
                            <div class="row q-pa-sm">
                                <q-radio v-model="document.filled_i" val="anexo" label="Se anexa" />
                                <q-radio v-model="document.filled_i" val="no_anexo" label="No anexa" />
                                <q-radio v-model="document.filled_i" val="no_cuenta" label="No se cuenta" />
                            </div>                                
                        </div>
                    </q-expansion-item>
                </q-list>
                <div class="q-pa-md" v-else>
                    <q-item style="max-width: 300px">
                    <q-item-section avatar>
                        <q-skeleton type="QAvatar" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>
                        <q-skeleton type="text" />
                        </q-item-label>
                        <q-item-label caption>
                        <q-skeleton type="text" width="65%" />
                        </q-item-label>
                    </q-item-section>
                    </q-item>

                    <q-item style="max-width: 300px">
                    <q-item-section avatar>
                        <q-skeleton type="QAvatar" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>
                        <q-skeleton type="text" />
                        </q-item-label>
                        <q-item-label caption>
                        <q-skeleton type="text" width="90%" />
                        </q-item-label>
                    </q-item-section>
                    </q-item>

                    <q-item style="max-width: 300px">
                    <q-item-section avatar>
                        <q-skeleton type="QAvatar" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>
                        <q-skeleton type="text" width="35%" />
                        </q-item-label>
                        <q-item-label caption>
                        <q-skeleton type="text" />
                        </q-item-label>
                    </q-item-section>
                    </q-item>
                </div>
            </q-card-section>
        </q-card>
        <q-dialog v-model="dialog" position="bottom">
        <q-card style="width: 350px">
            <q-linear-progress indeterminate color="primary" />

            <q-card-section class="row items-center no-wrap">
            <div>
                <div class="text-weight-bold">Guardando...</div>
            </div>

            <q-space />

            <q-btn flat round icon="check" color="green"/>
            
            </q-card-section>
        </q-card>
        </q-dialog>
</template>

<script setup>
import { ref, onMounted, toRef } from 'vue';
import { useCapturas } from 'src/composables/useCapturas.js'
import { updateRowDoc } from 'src/composables/firebase/capturas/nom02/documentos'

const props = defineProps({
    secciones: Array,
    service: Object
})

const storeCapturas = useCapturas();
const { currentService } = storeCapturas

const dialog = ref(false)
const secciones = toRef(props,'secciones')
const autoSave = async (type) => {
    
    if(type == 'click'){
        dialog.value = true
        const objUpdate = []
        currentService.value.secciones.forEach((seccion) => {
            seccion.documents.forEach((document) => {
                objUpdate.push(document)
            })
        })
        const update = await updateRowDoc(objUpdate)        
        setTimeout(() => {
            dialog.value = false
        }, 2000);
    } else {
        localStorage.setItem('serviceData', JSON.stringify(currentService.value))
    }
    
}

onMounted( async () => {
    setInterval(() => {
        if(secciones.value.length>0)autoSave()
    }, 60000);
})

</script>