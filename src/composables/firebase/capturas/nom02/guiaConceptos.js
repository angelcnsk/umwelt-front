import { getData, readData, saveData } from '../../firebaseService';

export async function getCategories(params) {
    try {
        let path = params.product_id == 1 ? 'catalogos/nom02/' : 'catalogos/nom020/' 
        
        if(params.visita >1) path = `servicios/${params.service_id}/visita_${params.visita}/categories`
        
        const categorias = await getData(path);
        
        categorias.forEach((cat) => {
            if(cat.conceptos){
                cat.conceptos.forEach((concept) => {
                    concept.value = [];
                })
            }
        })
        return categorias
    } catch (error) {
        console.log('error al obtener categorías', error)
    }
}

export async function getResult(params) {
    try {
        return await readData(`servicios/${params.service_id}/visita_${params.visita}/result`);
    } catch (error) {
        console.log('error al obtener resultados', error)
    }
}

export async function getObservations(params) {
    try {
        return await readData(`servicios/${params.service_id}/visita_${params.visita}/observaciones`);
    } catch (error) {
        console.log('error al obtener observaciones', error)
    }
}

export async function getActa(params) {
    try {
        return await readData(`servicios/${params.service_id}/visita_${params.visita}/acta`);
    } catch (error) {
        console.log('error al obtener acta', error)
    }
}

export async function setConceptsValues(params) {
    try {
        return await saveData(`servicios/${params.service_id}/visita_${params.visita}/result`, params.data)
    } catch (error) {
        console.log('error al guardar lista de conceptos', error)
    }
}

