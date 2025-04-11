<template>
    <q-editor
        class="q-editor-mb"
        v-model="textoActa"
        :dense="$q.screen.lt.md"
        :toolbar="getEditorProps($q).toolbarActa"
        :fonts="getEditorProps($q).fonts"
        :definitions="extraFn"
        filled
        clearable
        color="red-12"
        min-height="10rem"
        max-height="20rem"
        
    />
</template>

<script setup>
import {ref, inject, toRef, onMounted} from 'vue';
import { useQuasar } from "quasar";
import { useCapturas } from 'src/composables/useCapturas.js'
import { getEditorProps } from "./editorProps";
const $q = useQuasar();

const storeCapturas = useCapturas();
const {fetchActa, saveActa, textoActa, visitSelected} = storeCapturas;

const props = defineProps({
    service: Object,
    categorias: Object,
});

const visita = visitSelected;
const service = toRef(props,'service');
const categorias = toRef(props,'categorias');

const textoDocumental = ref('');
const textoFisica = ref('');

const textoExtra = ref('');

const textoEntrevistas = '<p>De la información arriba mencionada, la organización deberá presentar el requisito asentado y se da por enterada que cuenta con 60 días naturales para dar cumplimiento a la información solicitada en la presente minuta, contando que todo el proceso no excederá 90 días naturales, si en el último caso no se presenta dicha información se procede a cancelar el servicio. </p> <p>La empresa declara que toda la información presentada durante el proceso de inspección es verídica y actualizada.</p>'

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
    }).onOk(async () => {
        textoDocumental.value = '<br><span><strong> INSPECCIÓN DOCUMENTAL</span></strong><br>'
        textoFisica.value = '<br><span><strong>INSPECCIÓN FÍSICA</span></strong><br>'
        textoActa.value = ''
        textoExtra.value = ''
        
        categorias.value.forEach((categoria) => {
            if(categoria.documental == 1 ){
                //console.log('es documental')
                textoDocumental.value+= '<br><span><strong>'+categoria.texto+'</strong></span> <br>'
                textoDocumental.value+= categoria.observaciones
            } else {
                //console.log('es fisica')
                if(categoria.texto === 'En caso de ser de riesgo de incendio alto ¿Se cuenta con algunos de los siguientes documentos?'){
                    textoFisica.value+= '<br><span><strong>'+categoria.texto+'</strong></span> <br>'
                    textoFisica.value += categoria.observaciones    
                } else if(categoria.extra == 'entrevista'){
                    textoExtra.value+= '<br><span><strong>'+categoria.texto+'</strong></span> <br>'
                    textoExtra.value+= categoria.observaciones
                    textoExtra.value+= textoEntrevistas
                }
                else if(categoria.extra == 'declaracion'){
                    textoExtra.value+= '<br><span><strong>'+categoria.texto+'</strong></span> <br>'
                    textoExtra.value+= categoria.observaciones
                } 
                
                else {
                    textoFisica.value+= '<br><span><strong>'+categoria.texto+'</strong></span> <br>'
                    textoFisica.value += categoria.observaciones
                }
                
            }
        })

        textoActa.value = textoDocumental.value
        textoActa.value+= textoFisica.value
        textoActa.value+= textoExtra.value
    });
    
}

const saveTextActa = async () => {
    await saveActa({service_id:service.value.id, visita:visita.value.valor, data:textoActa.value});
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
        handler: saveTextActa
    }
})

onMounted(async() => {
    console.log('onMounted acta', visita.value)
    textoActa.value = await fetchActa({service_id:service.value.id, visita:visita.value.valor})
    textoActa.value = textoActa.value == null ? '' : textoActa.value
})

</script>
