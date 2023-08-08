import { storeToRefs } from 'pinia'
import { useCapturasStore } from '../stores/capturas'

export const useCapturas = () => {
    const capturasStore = useCapturasStore()
    const { 
        getServiceList, saveCaptures, eventSave, setDateCapture,
        saveSectionFile
    } = capturasStore
    const { servicesList,currentService, luxometro
    } = storeToRefs(capturasStore)
    

    return {
        servicesList,currentService,
        getServiceList, saveCaptures,  setDateCapture, saveSectionFile
    }
}