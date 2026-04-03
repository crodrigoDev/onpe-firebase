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

// Funcion para las actas
export const verActas = async () => {
    let cdgoAmbito = document.getElementById('cdgoAmbito')
    let cdgoDep = document.getElementById('cdgoDep')
    let cdgoProv = document.getElementById('cdgoProv')
    let cdgoDist = document.getElementById('cdgoDist')
    let cdgoLocal = document.getElementById('actas_ubigeo')
    cdgoAmbito.addEventListener("change", async (event) => {
        limpiar("desdeAmbito")
        if(cdgoAmbito.value !== ""){
            lbl(event.target.value)
            cdgoDep.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
            cdgoDep.disabled = false
            const departamentos = await OnpeController("dpd", event.target.value)
            departamentos[1].forEach(doc => {
                let departamento = doc.data()
                cdgoDep.innerHTML += `
                    <option value="${departamento.idDepartamento}">${departamento.Detalle}</option>
                `
            })
        }
    })
    cdgoDep.addEventListener("change", async (event) => {
        limpiar("desdeDpto")
        if(cdgoDep.value !== ""){
            cdgoProv.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
            cdgoProv.disabled = false
            const provincias = await OnpeController("prov", event.target.value)
            provincias[1].forEach(doc => {
                let provincia = doc.data()
                cdgoProv.innerHTML += `
                    <option value="${provincia.idProvincia}">${provincia.Detalle}</option>
                `
            })
        }
    })
    cdgoProv.addEventListener("change", async (event) => {
        limpiar("desdeProv")
        if(cdgoProv.value !== ""){
            cdgoDist.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
            cdgoDist.disabled = false
            const distritos = await OnpeController("dist", event.target.value)
            distritos[1].forEach(doc => {
                let distrito = doc.data()
                cdgoDist.innerHTML += `
                    <option value="${distrito.idDistrito}">${distrito.Detalle}</option>
                `
            })
        }
    })
    cdgoDist.addEventListener("change", async (event) => {
        limpiar("desdeDist")
        if(cdgoDist.value !== ""){
            cdgoLocal.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
            cdgoLocal.disabled = false
            const locales = await OnpeController("localvotacion", event.target.value)
            locales[1].forEach(doc => {
                let local = doc.data()
                cdgoLocal.innerHTML += `
                    <option value="${local.idLocalVotacion}">${local.RazonSocial}</option>
                `
            })
        }
    })

    const limpiar = (accion) => {
        switch(accion){
            case "desdeAmbito":
                cdgoDep.disabled = true
                cdgoProv.disabled = true
                cdgoDist.disabled = true
                cdgoLocal.disabled = true
                cdgoProv.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                cdgoDist.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                cdgoLocal.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                cdgoDep.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`; break;
            case "desdeDpto":
                cdgoProv.disabled = true
                cdgoDist.disabled = true
                cdgoLocal.disabled = true
                cdgoProv.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                cdgoDist.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                cdgoLocal.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`; break;
            case "desdeProv":
                cdgoDist.disabled = true
                cdgoLocal.disabled = true
                cdgoDist.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                cdgoLocal.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`; break;
            case "desdeDist":
                cdgoLocal.disabled = true
                cdgoLocal.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`; break;
        }
    }

    const lbl = (id) => {
        const lblDep = document.getElementById("lblDepartamento")
        const lblProv = document.getElementById("lblProvincia")
        const lblDist = document.getElementById("lblDistrito")
        if(id == "1"){
            lblDep.innerHTML = "Departamento:"
            lblProv.innerHTML = "Provincia:"
            lblDist.innerHTML = "Distrito:"
        }
        else{
            lblDep.innerHTML = "Continente:"
            lblProv.innerHTML = "Pais:"
            lblDist.innerHTML = "Ciudad:"
        }
    }
    cdgoAmbito.dispatchEvent(new Event('change'))
}