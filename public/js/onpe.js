import { OnpeController} from "./firebase.js"

export const verParticipacion = async (id, ambito) => {
    let querySnapCrudo = []
    let querySnap = null
    let accion = ""
    let tituloColumna = ''
    let html = ''
    let datahtml = ''
    let contenidoInterno = document.getElementById('page-wrap2')
    let contenidoAmbito = document.getElementById('ambito')

    if(ambito == "todos"){
        querySnapCrudo = await OnpeController("participacion", id)
        let _ = querySnapCrudo[1].docs[0].data()
        tituloColumna = _.ID == 'Nacional' ? 'Departamento' : 'Continente'
        contenidoAmbito.innerHTML = `Ambito: ${_.ID}`
    }
    else if(ambito == "departamento"){
        querySnapCrudo = await OnpeController("provincia", id)
        let _ = querySnapCrudo[1].docs[0].data()
        tituloColumna = _.ID == 'Nacional' ? 'Provincia' : 'Pais'
        let tAmbito = tituloColumna == 'Provincia' ? 'Departamento' : 'Continente'
        contenidoAmbito.innerHTML = `Ambito: ${_.ID}<br>${tAmbito}: ${_.Departamento}`
    }
    else if(ambito == "provincia"){
        querySnapCrudo = await OnpeController("distrito", id)
        let _ = querySnapCrudo[1].docs[0].data()
        tituloColumna = _.ID == 'Nacional' ? 'Distrito' : 'Ciudad'
        let tAmbito = tituloColumna == 'Distrito' ? 'Departamento' : 'Continente'
        let tAmbito2 = tAmbito == 'Departamento' ? 'Provincia' : 'Pais'
        contenidoAmbito.innerHTML = `Ambito: ${_.ID}<br>${tAmbito}: ${_.Departamento}<br>${tAmbito2}: ${_.Provincia}`
    }
    else if(ambito == "distrito"){
        querySnapCrudo = await OnpeController("post-distrito", id)
        let _ = querySnapCrudo[1].docs[0].data()
        tituloColumna = _.ID == 'Nacional' ? 'Distrito' : 'Ciudad'
        let tAmbito = tituloColumna == 'Distrito' ? 'Departamento' : 'Continente'
        let tAmbito2 = tAmbito == 'Departamento' ? 'Provincia' : 'Pais'
        contenidoAmbito.innerHTML = `Ambito: ${_.ID}<br>${tAmbito}: ${_.Departamento}<br>${tAmbito2}: ${_.Provincia}<br>${tituloColumna}: ${_.DPD}`
    }

    querySnap = querySnapCrudo[1]
    accion = querySnapCrudo[0]
    
    
    if(querySnap && ambito != 'distrito'){
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
            <p class="subtitle">Consulta de participación DETALLADO </p>
            <div id="page-wrap">
                <table class="table21">
                    <tbody id="resultados">
                        <tr class="titulo_tabla">
                            <td>${tituloColumna}</td>
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
            </div>
        `
    } else {
        contenidoInterno.innerHTML = html
        return
    }
    
    contenidoInterno.innerHTML = html
}