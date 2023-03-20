<template>
<div class="q-ma-md" style="margin-top: 50px;">
    <q-card>
        <q-card-section>
            <div class="text-h6 text-grey-8">Gestión</div>
            <q-separator spaced />
            <div class="text-subtitle text-grey-8">Signatarios y destinatarios</div>
            <q-separator spaced />
            <div class="row q-pa-sm">
                <div class="col-xs-12 col-md-3">
                    <q-select v-model="signatario.elabora" :options="signatoryList.signatario" label="Elaboró" class="q-pa-sm">
                        <template v-slot:prepend>    
                            <q-icon name="help" color="orange" >
                                <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                                    Responsable que aparece en carátula
                                </q-tooltip>
                            </q-icon>
                        </template>
                    </q-select>
                </div>
                <div class="col-xs-12 col-md-3">
                    <q-select v-model="signatario.revisa" :options="signatoryList.aprueba" label="Revisó" class="q-pa-sm">
                        <template v-slot:prepend>    
                            <q-icon name="help" color="orange" >
                                <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                                    Responsable que aparece en carátula
                                </q-tooltip>
                            </q-icon>
                        </template>
                    </q-select>
                </div>
                <div class="col-xs-12 col-md-3">
                    <q-input label="Dirigido a" v-model="signatario.dirigido_a" class="q-pa-sm" />
                </div>
                <div class="col-xs-12 col-md-3">
                    <q-input label="Representante legal" v-model="signatario.representante" class="q-pa-sm" />
                </div>
                <div class="col-xs-12 col-md-2">
                    <q-btn label="guardar" color="primary" class="q-mt-lg q-ml-md" @click="addSignatory"/>
                </div>
            </div>
        </q-card-section>
        
        <q-card-section>
            <q-separator spaced />
                <div class="text-subtitle text-grey-8">Archivos</div>
            <q-separator spaced />
            <archivos :servicio_id="props.servicio_id" />
        </q-card-section>
        <q-card-section style="margin-bottom: 100px;">
            <q-separator spaced />
            <div class="text-subtitle text-grey-8">Reporte y control</div>
            <q-separator spaced />

            <div class="row q-pa-md bg-orange q-mt-md justify-center" v-if="serviceItem.status_report == 'en proceso'">
                <span class="text-subtitle2 text-center text-white" 
                >
                    El reporte aún está en proceso, por favor recarga la pantalla en unos minutos.
                </span>
            </div>

            <div class="row q-pa-md">
                <q-btn label="Capturas" color="green-4" class="q-mr-md" @click="downloadFieldSheets">
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        Descarga archivo de excel con los datos que han sido capturados hasta el momento
                    </q-tooltip>
                </q-btn>
                <q-btn label="Hojas de campo" 
                    color="green-4" 
                    class="q-mr-md" 
                    @click="downloadPdfFieldSheets"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        Descarga formato de hojas de campo con capturas
                    </q-tooltip>
                </q-btn>
                <q-btn label="Generar reporte" 
                    color="green-4" 
                    class="q-mr-md" 
                    @click="generarReporte"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        Comienza creación de reporte, todos los datos deberán estar completos
                    </q-tooltip>
                </q-btn>
                <q-btn label="Descargar reporte" 
                    color="green-4" 
                    class="q-mr-md" 
                    :disable="serviceItem.reporte_url == null"
                    :href="serviceItem.reporte_url"
                    target="_blank"
                >
                    <q-tooltip max-width="200px" self="top middle" :offset="[20, 10]">
                        Descarga reporte de informe de resultados
                    </q-tooltip>
                </q-btn>
            </div>

        </q-card-section>
    </q-card>
</div>
</template>


<script>
import {defineComponent, ref, computed, watch, onMounted, toRef} from 'vue';
import { useQuasar } from "quasar";
import { useServicios } from 'src/composables/useServicios.js'
import { useUsers } from 'src/composables/useUsers.js'

import archivos from 'components/admin/servicios/Archivos.vue'
import { utils, writeFileXLSX } from 'xlsx';

export default defineComponent({
  name: "Gestion",
  components:{
    archivos
  },
  props:['servicio_id', 'signatory'],
  setup(props, ctx) {
    const $q = useQuasar();
    const storeUsers = useUsers();
    const storeServicios = useServicios();
    const { AppActiveUser } = storeUsers
    const { staff, managePoints, sin_asignar, asignados, serviceItem, 
        getSignatoryList, signatoryList,saveSignatory, 
        getFieldSheets,getPdfFieldSheets, getReport
    } = storeServicios

    
    const notify = (msg, type) => {
        $q.notify({
            position:'top',
            type,
            message:msg
        })
    }
    
    const signatory = computed(() =>{
        return props.signatory
    })
    
    const signatario = ref({elabora:'', revisa:''})

    watch(signatory, (value) => {
        if(value != null){
            signatario.value = JSON.parse(value)
        }
    })

    const downloadFieldSheets = async () => {
      const results = await getFieldSheets(props.servicio_id)
      
      if (results.data.capturas.points.length >= 1) {
        const ws = utils.json_to_sheet(results.data.capturas.points)
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "capturas_puntos_medicion");
        writeFileXLSX(wb,`Capturas_servicio_${props.servicio_id}.xlsx` );
        
      } else {
        
        notify('No hay información de capturas para descargar','warning') 
      }

    }

    const downloadPdfFieldSheets = async () => {
      const hojas = await getPdfFieldSheets(props.servicio_id)
      
      if(hojas.data){
        const linkSource = `data:application/pdf;base64,${hojas.data.hojas_campo}`;
        const downloadLink = document.createElement("a");
        const fileName = `${props.servicio_id}_hojas_campo.pdf`;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        return true
      } 

      notify('No hay información de capturas para descargar', 'negative') 
      
    }

    const addSignatory = async () => {
        if(signatario.value.elabora == '' || signatario.value.revisa == ''){
            notify('Por favor selecciona a un responsable', 'negative')
            return false
        }

        $q.dialog({
            title: '¿Deseas continuar?',
            message: '',
            ok: {
                push: true,
                label:'Continuar'
            },
            cancel: {
                push: true,
                color: 'dark',
                label:'Cancelar'
            },
            persistent: true
        }).onOk(async data => {
            
            const response = await saveSignatory({signatory:signatario.value, servicio_id:props.servicio_id})
            if (response.status == 200) {
                notify('Se agregaron los signatarios del proyecto', 'positive')
            } else {
                notify('Por favor contacta con el administrador','negative')
            }
        })
    }

    const generarReporte = async () => {
      if(!serviceItem.value.generar_reporte){
        $q.dialog({
            title: 'No es posible generar reporte',
            message:`Faltan ${serviceItem.value.total_puntos - serviceItem.value.puntos_cerrados} puntos por cerrar capturas`
        }).onOk(() => {
                // console.log('OK')
        })
          return false
      } 

      try {
        $q.loading.show()
        const reporte = await getReport(props.servicio_id)
        if (reporte.status == 200) {
            $q.loading.hide()
            $q.dialog({
                title: 'Reporte en proceso',
                message: 'El reporte terminará de crearse en unos minutos, por favor recarga la pantalla'
            }).onOk(() => {
                // console.log('OK')
            })
            serviceItem.value.status_report = 'en proceso'
          return true
        }
        
      } catch (error) {
        notify('Hubo un error al generar el reporte','negative')
        $q.loading.hide()
        console.log('mensaje falla', error)
      }
    
    }
    
    
    onMounted(() => {
        
    })
    return {
        props,
        signatoryList,
        signatario,
        serviceItem,
        addSignatory,
        downloadFieldSheets,
        downloadPdfFieldSheets,
        generarReporte,
    }
  }
})

</script>