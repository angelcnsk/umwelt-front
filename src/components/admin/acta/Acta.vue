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
        min-height="10rem"
        max-height="20rem"
        
    />
</template>

<script setup>
import {ref, inject, toRef, onMounted} from 'vue';
import { useQuasar } from "quasar";
import { useCapturas } from 'src/composables/useCapturas.js'

const $q = useQuasar();
const storeCapturas = useCapturas();
const {fetchActa, saveActa} = storeCapturas;

const props = defineProps({
    service: Object,
    categorias: Object,
});

const visita = inject('currentVisit');
const service = toRef(props,'service');
const categorias = toRef(props,'categorias');

// const textoDocumental = ref('<br><span><strong> VERIFICACIÓN DOCUMENTAL</strong></span><br>')
// const textoFisica = ref('<br><span><strong>INSPECCIÓN FÍSICA</span></strong><br>')

const textoDocumental = ref('');
const textoFisica = ref('');

const textoExtra = ref('');
const texto = ref('');
const localData = ref(null);

const textoEntrevistas = '<p>De la información arriba mencionada, la organización deberá presentar el requisito asentado y se da por enterada que cuenta con 60 días naturales para dar cumplimiento a la información solicitada en la presente minuta, contando que todo el proceso no excederá 90 días naturales, si en el último caso no se presenta dicha información se procede a cancelar el servicio. </p> <p>La empresa declara que toda la información presentada durante el proceso de inspección es verídica y actualizada.</p>'

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
        textoDocumental.value = '<br><span><strong> INSPECCIÓN DOCUMENTAL</span></strong><br>'
        textoFisica.value = '<br><span><strong>INSPECCIÓN FÍSICA</span></strong><br>'
        texto.value = ''
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
                    console.log('entra cuantas veces', categoria)
                    textoExtra.value+= '<br><span><strong>'+categoria.texto+'</strong></span> <br>'
                    textoExtra.value+= categoria.observaciones
                } 
                
                else {
                    textoFisica.value+= '<br><span><strong>'+categoria.texto+'</strong></span> <br>'
                    textoFisica.value += categoria.observaciones
                }
                
            }
        })

        texto.value = textoDocumental.value
        texto.value+= textoFisica.value
        texto.value+= textoExtra.value
    });
    
}

const saveTextActa = async () => {
    await saveActa({service_id:service.value.id, visita:visita.value.valor, data:texto.value});
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
    texto.value = await fetchActa({service_id:service.value.id, visita:visita.value.valor})
    texto.value = texto.value == null ? '' : texto.value
})

</script>
