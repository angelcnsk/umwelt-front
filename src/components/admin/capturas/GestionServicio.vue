<template>
    <q-card class="q-pa-sm">
        <q-card-section>
            <div class="row">
                <q-btn class="q-mr-md" color="primary" outline label="guia general" @click="imprimir('guia general')" /> 
                <q-btn class="q-mr-md" color="primary" outline label="guia inspección" @click="imprimir('guia inspeccion')" /> 
                <q-btn class="q-mr-md" color="primary" outline label="acta" @click="imprimir('acta')" /> 
                <q-btn class="q-mr-md" color="primary" outline label="dictamen" @click="imprimir('dictamen')" /> 
                
            </div>
        </q-card-section>
    </q-card>
</template>

<script>
import {defineComponent, ref, computed, watch, onMounted, toRef, defineEmits} from 'vue';
import { useQuasar, date } from "quasar";
import { useUsers } from 'src/composables/useUsers.js'
import { useCapturas } from 'src/composables/useCapturas.js'

export default defineComponent({
    name: "gestionServicio",
    props:['secciones','service'],
    // emits: ['savePoints','async'],
    setup(props, ctx) {
        const storeCapturas = useCapturas();
        const { getServiceList, servicesList,
            currentService, saveCaptures, saveSectionFile
        } = storeCapturas

        const secciones = toRef(props,'secciones')
        const service = toRef(props,'service')
        const uploader = ref()
        const loading = ref(false)
        const inputFile = ref()
        const dialog = ref(false)

        const imprimir = (doc) => {
            let url = 'https:umwelt-admin.test/reportes/'
            switch (doc) {
                case 'guia general':
                    url = `${url}getGuiaDoc/?service_id=${service.value.id}`
                    break;
            
                case 'guia inspeccion':
                    url = `${url}getGuiaInspeccion/?service_id=${service.value.id}`
                break;
        
                case 'acta':
                    url = `${url}getActa/?service_id=${service.value.id}`
                break;

                default:
                    url = `${url}getDictamen/?service_id=${service.value.id}`
                    break;
            }

            window.open(url,'_blank')
        }

        return {
            imprimir
        }
    }
})

</script>