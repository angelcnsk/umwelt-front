<template>
    <q-card class="q-pa-sm">
        <q-card-section>
            <div class="row">
                <q-btn 
                    class="q-mr-md" 
                    color="primary" 
                    outline 
                    label="guia inspección" 
                    @click="imprimir('guia inspeccion')"
                    :disable="5<3"
                />                 
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
            let url = import.meta.env.VITE_api_host
            switch (doc) {
                case 'guia general':
                    url = `${url}reportes/getreport?service_id=${service.value.id}&reporte=1`
                    break;
            
                case 'guia inspeccion':
                    url = `${url}reportes/getreport?service_id=${service.value.id}&reporte=3`
                break;
        
                case 'acta':
                url = `${url}reportes/getreport?service_id=${service.value.id}&reporte=2`
                break;

                default:
                url = `${url}reportes/getreport?service_id=${service.value.id}&reporte=4`
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