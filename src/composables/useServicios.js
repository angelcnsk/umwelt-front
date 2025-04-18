import { storeToRefs } from 'pinia'
import { useServiciosStore } from '../stores/servicios'

export const useServicios = () => {
    const serviciosStore = useServiciosStore()
    const { 
        nuevoProducto, getProductos, newService, getServices, getService, generarNumDictamen, closeServiceStatus, getStaff, selectStaff, getFieldSheets, saveSectionFile, getSectionFile, getReport, getPdfFieldSheets, getSignatoryList, saveSignatory, removeFile, newVisit, addContainers, getContainers, removeContainer
    } = serviciosStore
    const { productos,
        nuevoServicio,
        servicesList,
        serviceItem,
        staff,
        signatoryList,
        addStaff,
        sin_asignar,
        asignados,
        archivos,
        secciones,
        containers
    } = storeToRefs(serviciosStore)
    

    return {
        productos,
        nuevoServicio,
        servicesList,
        serviceItem,
        staff,
        signatoryList,
        addStaff,
        sin_asignar,
        asignados,
        secciones,
        archivos,
        containers,
        nuevoProducto, getProductos, newService, getServices, getService, generarNumDictamen, closeServiceStatus, getStaff, selectStaff, getFieldSheets, saveSectionFile, getSectionFile, getReport, getPdfFieldSheets, getSignatoryList, saveSignatory, removeFile,
        newVisit, addContainers, getContainers, removeContainer,
    }
}