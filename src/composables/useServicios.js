import { storeToRefs } from 'pinia'
import { useServiciosStore } from '../stores/servicios'

export const useServicios = () => {
    const serviciosStore = useServiciosStore()
    const { 
        nuevoProducto, getProductos, getTableA1, newService, getServices, getService, generarOT, closeServiceStatus, saveDptoDB, getStaff, selectStaff, getFieldSheets, saveSectionFile, getSectionFile, getRecognitions, saveRecognition, saveCaratulaPayload, getDepartments, saveAreaPayload, getReport, getPdfFieldSheets, getSignatoryList, saveSignatory, removeFile, managePoints,getDevices
    } = serviciosStore
    const { productos,
        nuevoServicio,
        servicesList,
        serviceItem,
        staff,
        recognitions,
        recognitionItem,
        departmentsList,
        tableA1,
        signatoryList,
        areas,
        editArea,
        addStaff,
        sin_asignar,
        asignados,
        archivos,
        secciones,
        dispositivos,
        usuariosDevice
    } = storeToRefs(serviciosStore)
    

    return {
        productos,
        nuevoServicio,
        servicesList,
        serviceItem,
        staff,
        recognitions,
        recognitionItem,
        departmentsList,
        tableA1,
        signatoryList,
        areas,
        editArea,
        addStaff,
        sin_asignar,
        asignados,
        secciones,
        archivos,
        dispositivos,
        usuariosDevice,
        nuevoProducto, getProductos, getTableA1, newService, getServices, getService, generarOT, closeServiceStatus, saveDptoDB, getStaff, selectStaff, getFieldSheets, saveSectionFile, getSectionFile, getRecognitions, saveRecognition, saveCaratulaPayload, getDepartments, saveAreaPayload, getReport, getPdfFieldSheets, getSignatoryList, saveSignatory, removeFile, managePoints,getDevices
    }
}