import {participacion, dpdparticipacion} from "./firebase.js"

export const verParticipacion = async (id, idant) => {
    //const id = new URLSearchParams(window.location.search).get('id')
    
    let html = ''
    let datahtml = ''
    console.log(idant)
    let contenidoInterno = document.getElementById('page-wrap2')
    const ambitos = id
    if(id == "Nacionales" || id == "Extranjero")
    {
        let querySnap = await participacion(id)
        querySnap.forEach(doc =>{
            let ambito = doc.data()
            datahtml += `
                <tr onclick="location.href='./participacion_total.html?id=${ambito.DPD}'" onmouseover="this.style.cursor = &quot;pointer&quot;; this.style.color = &quot;grey&quot;" onmouseout="this.style.color = &quot;black&quot;" style="cursor: pointer; color: black;">
                    <td>${ambito.DPD}</td>
                    <td>${ambito.TV}</td>
                    <td>${ambito.PTV}</td>
                    <td>${ambito.TA}</td>
                    <td>${ambito.PTA}</td>
                    <td>${ambito.EH}</td>
                </tr>
            `
        })
    }
    else
    {
        let querySnap = await dpdparticipacion(idant, id)
        
        const datosAmbito = querySnap.docs[0].data();
        datosAmbito.departamento.forEach((doc, i) =>{
            datahtml += `
                <tr onclick="location.href='./participacion_total.html?id=${doc.DPD}'" onmouseover="this.style.cursor = &quot;pointer&quot;; this.style.color = &quot;grey&quot;" onmouseout="this.style.color = &quot;black&quot;" style="cursor: pointer; color: black;">
                    <td>${doc.DPD}</td>
                    <td>${doc.TV}</td>
                    <td>${doc.PTV}</td>
                    <td>${doc.TA}</td>
                    <td>${doc.PTA}</td>
                    <td>${doc.EH}</td>
                </tr>
            `
        })
    }
    
    

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
    contenidoInterno.innerHTML = html
}
/*
if(path.startsWith("/public/participacion_total.html")){
    await verParticipacion()
}*/


