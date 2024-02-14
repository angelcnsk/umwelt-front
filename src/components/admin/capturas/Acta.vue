<template>
    <q-editor
        class="q-editor-mb"
        v-model="texto"
        :dense="$q.screen.lt.md"
        :toolbar="toolbar"
        :fonts="fonts"
        :definitions="extraFn"
        filled
        clearable
        color="red-12"
        
    />
</template>

<script setup>
import {ref, inject, toRef, watch, onMounted} from 'vue';
import { useQuasar } from "quasar";
import { useCapturas } from 'src/composables/useCapturas.js'

const $q = useQuasar();
const storeCapturas = useCapturas();
const {listener} = storeCapturas

const props = defineProps({
    service: Object
})

const visita = inject('currentVisit')
const service = toRef(props,'service')

const textoDocumental = ref('<h6> VERIFICACIÓN DOCUMENTAL</h6>')
const textoFisica = ref('<h6>INSPECCIÓN FÍSICA</h6>')
const texto = ref('')
const localData = ref(null)

const toolbar = ref([
    [
        {
            icon: $q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
        },
        
    ],
    ['save','load'],
    ['removeFormat',
          {
            label: $q.lang.editor.formatting,
            icon: $q.iconSet.editor.formatting,
            list: 'no-icons',
            options: [
              'p',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'code'
            ]
          },
          {
            label: $q.lang.editor.fontSize,
            icon: $q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7'
            ]
          },
    ],
    ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
    ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
    ['undo', 'redo'],
    
])
const fonts = ref({
    arial: 'Arial',
    arial_black: 'Arial Black',
    comic_sans: 'Comic Sans MS',
    courier_new: 'Courier New',
    impact: 'Impact',
    lucida_grande: 'Lucida Grande',
    times_new_roman: 'Times New Roman',
    verdana: 'Verdana'
})


const getLocalData = () => {
    localData.value = JSON.parse(localStorage.getItem(`service_${service.value.id}_categorias_visita_${visita.value.valor}`))
    //console.log('hace el get de la información', localData.value)
}

const setLocalData = () => {
    //console.log("antes de guardar cambios", localData.value)
    localStorage.setItem(`service_${service.value.id}_categorias_visita_${visita.value.valor}`, JSON.stringify(localData.value))
}

const configText = () => {
    $q.dialog({
        title: '¿Deseas continuar?',
        message: 'Se sobreescribirá el contenido actual con el contenido de las observaciones',
        ok: {
        push: true,
        label:'Continuar'
        },
        cancel: {
        push: true,
        color: 'dark',
        label:'Cancelar'
        },
        persistent: true,
        // options: {
        //   type: 'toggle',
        //   model: [],
        //   // inline: true,
        //   items: [
        //     { label: 'Cerrar servicio', value: 'cerrado', color: 'secondary' }
        //   ]
        // },
    }).onOk(async data => {
        //console.log('se ejecuta acción de escribir acta')
        getLocalData()
        textoDocumental.value = '<h6> VERIFICACIÓN DOCUMENTAL</h6>'
        textoFisica.value = '<h6>INSPECCIÓN FÍSICA</h6>'
        if(localData.value != null){
            localData.value.categorias.forEach((categoria) => {
                if(categoria.documental == 1 ){
                    //console.log('es documental')
                    textoDocumental.value+= categoria.observaciones
                } else {
                    //console.log('es fisica')
                    if(categoria.texto === 'En caso de ser de riesgo de incendio alto ¿Se cuenta con algunos de los siguientes documentos?'){
                        
                        textoFisica.value += categoria.observaciones
                        textoFisica.value+= localData.value.entrevistas
                        textoFisica.value+= localData.value.declaracion
                        
                    } else {
                        textoFisica.value += categoria.observaciones
                    }
                    
                }
            })
            texto.value = textoDocumental.value
            texto.value+= textoFisica.value
            localData.value.acta = texto.value
            setLocalData()
        }
    })
    
}

const saveActa = () => {
    getLocalData()
    
    if(localData.value != null){
        localData.value.acta = texto.value
        setLocalData()
    }
}

const extraFn = ref({
    load: {
        tip: 'Cargar texto acta',
        icon: 'autorenew',
        label: 'cargar acta',
        handler: configText
    },
    save: {
        tip: 'Guardar texto acta',
        icon: 'save',
        label: 'Guardar',
        handler: saveActa
    }
})

//cuando escriben una observación en cada categoría
// watch(listener, (newVal) => {
//     console.log('se editó una observación')
// })

//cuando editan el texto final del acta
// watch(texto, (newVal) => {
//     configText()
// })

onMounted(() => {
    getLocalData()
    if(localData.value != null && localData.value.acta != undefined) texto.value = localData.value.acta
})

/*

texto.value = '<p>Datos relativos a la actuación (relación pormenorizada de la visita).</p>'
texto.value+= "<p>En base a la visita realizada a las instalaciones de {EMPRESA} ubicada en {DOMICILIO}, se procedió a realizar la Inspección del cumplimiento de la Norma Oficial Mexicana NOM-002-STPS-2010, en donde se obtuvieron los siguientes resultados:</p>"
texto.value+="<h6>VERIFICACIÓN DOCUMENTAL</h6>"
texto.value+="<span><b>Clasificación del grado de riesgo de incendio.</b></span>"

const obCat1 = data.categorias.find((cat) => cat.id == 1)
texto.value+=obCat1.observaciones

texto.value+="<b> “A.T. 1. Determinación del grado de riesgo de incendio” </b> <br><br>"
texto.value+="<p><b>Plano de las instalaciones.</b></p>"

const obCat2 = data.categorias.find((cat) => cat.id == 2)
texto.value+=obCat2.observaciones

texto.value+="<b> “A.T.2. Plano de las instalaciones” </b> <br><br>"
texto.value+="<p><b>Instrucciones de Seguridad en las áreas de Trabajo.</b></p>"

const obCat3 = data.categorias.find((cat) => cat.id == 3)
texto.value+=obCat3.observaciones

texto.value+="<b> “A.T. 3. Instrucciones de seguridad” </b> <br><br>"
texto.value+="<p><b>Programa anual de revisión de extintores.</b></p><p>La empresa presenta el documento “Programa anual de extintores” en donde se considera la revisión mensual de los extintores, el mantenimiento anual, conforme lo establecido en el punto 7.2 de la NOM-002-STPS-2010. CONFORME.</p>"
texto.value+="<p><b>Revisión de extintores.</b></p>"

const obCat4 = data.categorias.find((cat) => cat.id == 4)
texto.value+=obCat4.observaciones

texto.value+="<b> “A.T.4. Programa, revisión de extintores y mantenimiento” </b> <br><br>"
texto.value+="<p><b>Programa anual de revisión, pruebas y mantenimiento de los equipos contra incendio, a los medios de detección, alarmas de detección y sistemas fijos contra incendio.</b></p>"

texto.value+="<b> “A.T.5. revisiones, pruebas y mantenimiento” </b> <br><br>"
texto.value+="<p><b>Capacitación.</b></p>"
texto.value+="<b> “A.T. 6. Capacitación personal vs incendio” </b> <br><br>"
texto.value+="<p><b>Programa anual de revisión instalaciones eléctricas.</b></p>"
texto.value+="<b> “A.T. 7. Programa de mantenimiento eléctrico”. </b> <br><br>"
texto.value+="<p><b>Registros de mantenimiento.</b></p>"
texto.value+="<b> “A.T. 8. Registros de mantenimiento eléctrico, capacitación y dictamen”. </b> <br><br>"
texto.value+="<p><b>Capacitación instalaciones eléctricas.</b></p>"
texto.value+="<b> “A.T. 8. Registros de mantenimiento eléctrico, capacitación y dictamen”. </b> <br><br>"
texto.value+="<p><b>Dictamen de instalaciones eléctricas.</b></p>"
texto.value+="<b> “A.T. 8. Registros de mantenimiento eléctrico, capacitación y dictamen”. </b> <br><br>"
texto.value+="<p><b>Programa de revisión instalaciones de Gas.</b></p>"
texto.value+="<p><b>Gas Natural.</b></p>"
texto.value+="<p><b>La empresa no cuenta con instalaciones de Gas Natural, por lo que este punto NO APLICA.</b></p>"


texto.value+="<p><b>Gas L.P.</b></p>"
texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"

texto.value+="<p><b>Registros revisiones gas L.P.</b></p>"
texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"

texto.value+="<p><b>Registros revisiones gas L.P.</b></p>"
texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"

texto.value+="<p><b>Capacitación.</b></p>"
texto.value+="<b> “A.T. 9. Programa, registros y capacitación de instalaciones de gas”. </b> <br><br>"

texto.value+="<p><b>Tierras físicas y continuidades.</b></p>"
texto.value+="<p><b>Pararrayos.</b></p>"
texto.value+="<b> “A.T.10. Tierras físicas y pararrayos”. </b> <br><br>"

texto.value+="<p><b>Plan de atención a emergencias de incendio.</b></p>"
texto.value+="<b> “A.T. 11. Plan Interno de Protección Civil y Plan de emergencias”. </b> <br><br>"
texto.value+="<b> “A.T. 12. Brigadas”. </b> <br><br>"

texto.value+="<p><b>Planeación de Simulacros.</b></p>"

texto.value+="<p><b>Reporte de simulacro.</b></p>"
texto.value+="<b> “A.T.13. Reportes de simulacros e hipótesis de simulacros”. </b> <br><br>"

texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"
texto.value+="<b> “A.T.14. Programa de simulacros 2022”. </b> <br><br>"

texto.value+="<p><b>Capacitación.</b></p>"
texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"
texto.value+="<b> “A.T.15 Capacitación”. </b> <br><br>"

texto.value+="<p><b>Programa de capacitación.</b></p>"
texto.value+="<b> “A.T. 16. Programa de capacitación”. </b> <br><br>"

texto.value+="<p><b>Memoria de Cálculo sistema contra incendio.</b></p>"
texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"
texto.value+="<b> “A.T.17. Sistema fijo vs incendio y seguridad”. </b> <br><br>"

texto.value+="<h6>INSPECCIÓN FÍSICA</h6>"
texto.value+="<p><b>Áreas identificadas en donde se manejan materiales inflamables.</b></p>"
texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"

texto.value+="<p><b>Rutas de evacuación.</b></p>"
texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"

texto.value+="<p><b>Salidas normales y/o de emergencia.</b></p>"
texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"

texto.value+="<p><b>Extintores en las áreas del centro de trabajo.</b></p>"
texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"

texto.value+="<p><b>Equipo de protección personal vs incendio.</b></p>"
texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"

texto.value+="<p><b>Sistemas de detección.</b></p>"
texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"

texto.value+="<p><b>Alarmas vs incendio.</b></p>"
texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"

texto.value+="<p><b>Sistema fijo vs incendio.</b></p>"
texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"

texto.value+="<p><b>Equipo de protección personal, equipo vs incendio y equipo de emergencia.</b></p>"
texto.value+="<p><b>Revisar que texto se inserta aquí.</b></p>"

texto.value+="<h6>VERIFICACIÓN ENTREVISTAS</h6>"*/
</script>
