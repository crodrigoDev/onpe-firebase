import { OnpeController} from "./firebase.js"

export const verParticipacion = async (id, ambito) => {
    //const id = new URLSearchParams(window.location.search).get('id')
    let querySnapCrudo = []
    let querySnap = null
    let accion = ""
    if(id == "Nacional" || id == "Extranjero"){
        querySnapCrudo = await OnpeController("participacion", id)
    }
    else if(ambito == "departamento"){
        querySnapCrudo = await OnpeController("provincia", id)
    }
    else if(ambito == "provincia"){
        querySnapCrudo = await OnpeController("distrito", id)
    }

    querySnap = querySnapCrudo[1]
    accion = querySnapCrudo[0]
    
    let html = ''
    let datahtml = ''
    let contenidoInterno = document.getElementById('page-wrap2')
    if(querySnap){
        querySnap.forEach(doc =>{
            let ambito = doc.data()
            datahtml += `
                <tr onclick="location.href='./participacion_total.html?id=${ambito.DPD}&&ambito=${accion}'" onmouseover="this.style.cursor = &quot;pointer&quot;; this.style.color = &quot;grey&quot;" onmouseout="this.style.color = &quot;black&quot;" style="cursor: pointer; color: black;">
                    <td>${ambito.DPD}</td>
                    <td>${ambito.TV}</td>
                    <td>${ambito.PTV}</td>
                    <td>${ambito.TA}</td>
                    <td>${ambito.PTA}</td>
                    <td>${ambito.EH}</td>
                </tr>
            `
        })
        
        

        html += `
            <table class="table21">
                <tbody id="resultados">
                    <tr class="titulo_tabla">
                        <td>DEPARTAMENTO</td>
                        <td>TOTAL ASISTENTES</td>
                        <td>% TOTAL ASISTENTES</td>
                        <td>TOTAL AUSENTES</td>
                        <td>% TOTAL AUSENTES</td>
                        <td>ELECTORES HÁBILES</td>
                    </tr>
                    ${datahtml}
                    <tr>
                        <td>TOTALES</td>
                        <td>17,953,367</td>
                        <td>81.543%</td>
                        <td>4,063,663</td>
                        <td>18.457%</td>
                        <td>22,017,030</td>
                    </tr>
                </tbody>
            </table>
        `
    } else {
        contenidoInterno.innerHTML = html
        return
    }
    
    contenidoInterno.innerHTML = html
}
/*
if(path.startsWith("/public/participacion_total.html")){
    await verParticipacion()
}*/


