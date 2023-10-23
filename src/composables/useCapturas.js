import { storeToRefs } from 'pinia'
import { useCapturasStore } from '../stores/capturas'

export const useCapturas = () => {
    const capturasStore = useCapturasStore()
    const { 
        getServiceList, saveCaptures, eventSave, setDateCapture,
        saveSectionFile, getCategories
    } = capturasStore
    const { servicesList,currentService, categories
    } = storeToRefs(capturasStore)
    

    return {
        servicesList,currentService,categories,
        getServiceList, saveCaptures,  setDateCapture, saveSectionFile,
        getCategories
    }
}