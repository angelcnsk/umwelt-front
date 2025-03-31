import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useServicios } from 'src/composables/useServicios.js'
import { useCapturas } from 'src/composables/useCapturas.js'

export function useVisits(offline,servicio_id, visita) {
    const $q = useQuasar();
    const storeServicios = useServicios();
    const storeCapturas = useCapturas();
    const { newVisit, serviceItem } = storeServicios;
    const  {currentService, serviceAddVisit, visitas} = storeCapturas;
    
    const showAddVisit = ref(false);
    const newVisitObj = ref({});

    const toggleNuevaVisita = () => {
        showAddVisit.value = !showAddVisit.value;
    }

    const setDates = () => {
        visitas.value = currentService.value.fechas.map((item) => {return {id:item.id, texto:`Visita ${item.visita}`, valor:item.visita}});
    }

    const setServiceDates = () => {
        visitas.value = serviceItem.value.fechas.map((item) => {return {id:item.id, texto:`Visita ${item.visita}`, valor:item.visita}});
    }

    const validateConnection = () => {
        if (!offline.value) {
            $q.notify({
                position: 'top',
                type: 'warning',
                message: 'Para agregar una visita es necesario tener conexión a internet'
            });
            return false;
        }
        return true
    }

    const addVisitInspector = async () => {
        if(validateConnection()){
            $q.dialog({
                title: '¿Deseas agregar otra visita?',
                message: '',
                ok: { push: true, label: 'Continuar' },
                cancel: { push: true, color: 'dark', label: 'Cancelar' },
                persistent: true
            }).onOk(async () => {
                const addVisitResponse = await serviceAddVisit({
                    service_id: servicio_id,
                    visita: visita.value,
                });
    
                if (addVisitResponse.status === 200) {
                    if (addVisitResponse.data.msg) {
                        $q.notify({
                            position: 'top',
                            type: 'warning',
                            message: 'No es necesario agregar una visita, todos los puntos cumplen'
                        });
                    } else {
                        setDates();
                        $q.notify({
                            position: 'top',
                            type: 'positive',
                            message: 'Se agregó una nueva visita'
                        });
                    }
                }
            });
        }
    }

    const addVisit = async () => {
        console.log('newVisitObj.value', newVisitObj.value);
        console.log('serviceItem', serviceItem.value);  
        if(validateConnection()){
            if (!newVisitObj.value.owner_id) {
                $q.notify({
                    position: 'top',
                    type: 'negative',
                    message: 'Para continuar selecciona un responsable'
                });
                return false;
            }
    
            $q.dialog({
                title: '¿Deseas agregar otra visita?',
                message: '',
                ok: { push: true, label: 'Continuar' },
                cancel: { push: true, color: 'dark', label: 'Cancelar' },
                persistent: true
            }).onOk(async () => {
                const addVisitResponse = await newVisit(newVisitObj.value);
    
                if (addVisitResponse.status === 200) {
                    if (addVisitResponse.data.msg) {
                        $q.notify({
                            position: 'top',
                            type: 'warning',
                            message: 'No es necesario agregar una visita, todos los puntos cumplen'
                        });
                    } else {
                        setServiceDates();
                        $q.notify({
                            position: 'top',
                            type: 'positive',
                            message: 'Se agregó una nueva visita'
                        });
                    }
                }
            });
        }
    };

    return { addVisit, toggleNuevaVisita, addVisitInspector, setServiceDates,  showAddVisit, newVisitObj};
}