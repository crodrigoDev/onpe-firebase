import { OnpeController} from "./firebase.js"

export const verParticipacion = async (id, ambito) => {
    let querySnapCrudo = []
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
    let querySnap = querySnapCrudo[1]
    let accion = querySnapCrudo[0]
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
export const verActas = async (q) => {
    let html = document.getElementById('divDetalle1')
    let actaHtml = document.getElementById('divDetalle')
    if(q == 'ubigeo'){
        const cdgoAmbito = document.getElementById('cdgoAmbito')
        const cdgoDep = document.getElementById('cdgoDep')
        const cdgoProv = document.getElementById('cdgoProv')
        const cdgoDist = document.getElementById('cdgoDist')
        const cdgoLocal = document.getElementById('actas_ubigeo')

        const limpiarDesde = (cboslimpiar = []) => {
            if(cboslimpiar != []){
                cboslimpiar.forEach(cbo => {
                    cbo.disabled = true
                    cbo.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
                })
            }
            html.innerHTML = ''
            actaHtml.innerHTML = '';
        }
        const actualizarLabels = (id) => {
            const lblDep = document.getElementById("lblDepartamento")
            const lblProv = document.getElementById("lblProvincia")
            const lblDist = document.getElementById("lblDistrito")
            const lbls = [lblDep, lblProv, lblDist]
            const texto = id == "1" ? ["Departamento:", "Provincia:", "Distrito:"] : ["Continente:", "Pais:", "Ciudad:"]
            lbls.forEach((lbl, index) => {
                lbl.innerHTML = texto[index]
            })
        }
        const cargarCombos = async (cbo, metodo, cboLlenar) => {
            cboLlenar.innerHTML = `<option selected="selected" value="">--SELECCIONE--</option>`
            cboLlenar.disabled = false
            let option = ""
            const comboData = await OnpeController(metodo, cbo.value)
            comboData[1].forEach(doc => {
                let combo = doc.data()
                if(metodo == "dpd" || metodo == "prov") option = metodo == "dpd" ? `<option value="${combo.idDepartamento}">${combo.Detalle}</option>` : `<option value="${combo.idProvincia}">${combo.Detalle}</option>`
                if(metodo == "dist" || metodo == "localvotacion") option = metodo == "dist" ? `<option value="${combo.idDistrito}">${combo.Detalle}</option>` : `<option value="${combo.idLocalVotacion}">${combo.RazonSocial}</option>`
                cboLlenar.innerHTML += `${option}`
            })
        }
        cdgoAmbito.addEventListener("change", async () => {
            limpiarDesde([cdgoDep, cdgoProv, cdgoDist, cdgoLocal])
            if(cdgoAmbito.value !== ""){
                actualizarLabels(cdgoAmbito.value)
                cargarCombos(cdgoAmbito, "dpd", cdgoDep)
            }
        })
        cdgoDep.addEventListener("change", async () => {
            limpiarDesde([cdgoProv, cdgoDist, cdgoLocal])
            if(cdgoDep.value !== "") cargarCombos(cdgoDep, "prov", cdgoProv)
        })
        cdgoProv.addEventListener("change", async () => {
            limpiarDesde([cdgoDist, cdgoLocal])
            if(cdgoProv.value !== "") cargarCombos(cdgoProv, "dist", cdgoDist)
        })
        cdgoDist.addEventListener("change", async () => {
            limpiarDesde([cdgoLocal])
            if(cdgoDist.value !== "") cargarCombos(cdgoDist, "localvotacion", cdgoLocal)
        })
        cdgoLocal.addEventListener("change", async () => {
            limpiarDesde([])
            const idLocal = cdgoLocal.value;
            if (idLocal !== "") {
                const res = await OnpeController("grupovotacion", idLocal);
                const listaGrupos = res[1].docs;
                let contador = 0
                let filasHtml = ""
                let celdasAcumuladas = ""
                listaGrupos.forEach((doc, index) => {
                    const grupo = doc.data();
                    contador += 1
                    celdasAcumuladas += `
                        <td bgcolor="#C1C1C1" style="cursor:pointer; text-align:center; border:1px solid #fff">
                            <a href="#" id="grupovotacion">
                                ${grupo.idGrupoVotacion}
                            </a>
                        </td>`;
                    if ((index + 1) % 10 === 0 || index + 1 === listaGrupos.length) {
                        filasHtml += `<tr>${celdasAcumuladas}</tr>`;
                        celdasAcumuladas = "";
                    }
                });
                html.innerHTML = `
                    <div class="col-xs-12 pbot30">
                        <p class="subtitle">LISTADO DE MESAS</p>
                        <div id="page-wrap1">
                            <table class="table17" cellspacing="0" width="100%">
                                <tbody>
                                    ${filasHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-xs-12 cont-recto oculto-leyenda-color-fondo-mesas">
                        <div class="col-md-4"><img src="images/procesacon.jpg"> Procesada con imagen</div>
                        <div class="col-md-4"><img src="images/procesasin.jpg"> Procesada sin imagen</div>
                        <div class="col-md-4"><img src="images/sinprocesa.jpg"> Sin procesar</div>
                    </div>
                    <div class="row pbot30">
                        <div class="col-lg-8 centered">
                            <div class="col-xs-12 col-md-12 col-lg-12">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td colspan="10">
                                            <div class="conte-paginador">
                                                <span class="paginador-txt">Total de mesas: ${contador}</span>
                                            </div>
                                            </td>
                                        </tr>  
                                        <tr>
                                            <td>&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td colspan="10">Página: 
                                            <ul class="pagination">
                                                <li class="active"><a class="paginador-n1">1</a></li>
                                            </ul>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `
                html.hidden = false;
            }
        });
        cdgoAmbito.dispatchEvent(new Event('change'))
    }

    html.addEventListener("click", async (event) => {
        let enlace = ''
        let nroBuscar = ''
        if(q == 'ubigeo') enlace = event.target.closest("a[id='grupovotacion']");
        if (q == 'numero') {
            nroBuscar = document.getElementById('nroMesa')
            enlace = event.target.closest("button[id='btnBuscar']");
        }

        if (enlace) {
            event.preventDefault()
            const valor = q == 'ubigeo' ? enlace.textContent.trim() : nroBuscar.value
            if(!valor){
                alert("Debe ingresar un numero de Mesa: 000000") 
                return
            }
            let actadetalle = ''
            const actas = await OnpeController("actas", valor);
            if(!actas[1].docs[0]){
                actadetalle += `
                    <div class="contenido-resultados">
                        <p>&nbsp;</p>
                        <div class="row">
                            <div class="tab-info">EL NÚMERO DE MESA QUE HA INGRESADO NO EXISTE</div>
                        </div>
                    </div>
                `
                actaHtml.innerHTML = actadetalle;
                return
            }
            const detalle = actas[1].docs[0].data();
            const estado = detalle.idEstadoActa == "1" ? "ACTA ELECTORAL NORMAL" : "ACTA ELECTORAL RESUELTA"
            actadetalle += `
                <div class="contenido-resultados">
                    <button class="btn btn-primary pull-right" id="btn-regresar" type="button">
                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                        REGRESAR
                    </button>
                    <p>&nbsp;</p>
                    <div class="row">
                        <div class="tab-info">
                            <div class="tab-content">
                                <div id="detMesa">
                                    <div class="tab-content">
                                        <div role="tabpanel" class="tab-pane active" id="presidencial">
                                            <div class="tab-info-desc">
                                                <div class="row">
                                                    <div class="col-xs-3 col-md-4">
                                                        <div class="mesap01">
                                                            <img src="images/mp-sin.jpg" class="img-responsive">
                                                            Si requiere la imagen del acta, solicítela a través del procedimiento de acceso a la información pública.
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-9 col-md-8">
                                                        <div class="row">
                                                            <div class="col-xs-12">
                                                                <p class="subtitle1">ACTA ELECTORAL</p>
                                                                <div id="page-wrap">
                                                                    <table class="table13" cellspacing="0">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Mesa N°</th>
                                                                                <th>N° Copia</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>${detalle.idGrupoVotacion}</td>
                                                                                <td>${detalle.nCopia}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            <div class="col-xs-12">
                                                                <p class="subtitle1">INFORMACIÓN UBIGEO</p>
                                                                <div id="page-wrap">
                                                                    <table class="table14" cellspacing="0">
                                                                        <tbody>
                                                                            <tr class="titulo_tabla">
                                                                                <td id="lblDepartamento">Departamento</td>
                                                                                <td id="lblProvincia">Provincia</td>
                                                                                <td id="lblDistrito">Distrito</td>
                                                                                <td>Local de votación</td>
                                                                                <td>Dirección</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>${detalle.Departamento}</td>
                                                                                <td>${detalle.Provincia}</td>
                                                                                <td>${detalle.Distrito}</td>
                                                                                <td>${detalle.RazonSocial}</td>
                                                                                <td>${detalle.Direccion}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            <div class="col-xs-12">
                                                                <p class="subtitle1">INFORMACIÓN MESA</p>
                                                                <div id="page-wrap">
                                                                    <table class="table15" cellspacing="0">
                                                                        <tbody>
                                                                            <tr class="titulo_tabla">
                                                                                <td>Electores hábiles</td>
                                                                                <td>Total votantes</td>
                                                                                <td>Estado del acta</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>${detalle.ElectoresHabiles}</td>
                                                                                <td>${detalle.TotalVotantes}</td>
                                                                                <td>${estado} </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="col-xs-12 pbot30_acta">
                                                    <p class="subtitle1">LISTA DE RESOLUCIONES</p>
                                                    <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> No hay resoluciones para el acta seleccionada
                                                    <div id="page-wrap">
                                                        <div class="col-md-12 resolu"></div>
                                                    </div>
                                                    <!-- <p class="centro"># : El valor consignado en el acta presenta ilegibilidad.</p> -->
                                                </div>
                                            </div>
                                            <div>
                                                <div class="col-xs-12">
                                                    <p class="subtitle1">INFORMACIÓN DEL ACTA ELECTORAL</p>
                                                    <div id="page-wrap" class="cont-tabla1">
                                                        <table class="table06">
                                                            <tbody>
                                                                <tr class="titulo_tabla">
                                                                    <td colspan="2">Organización política</td>
                                                                    <td>Total de Votos</td>
                                                                </tr>
                                                                    <td>PERUANOS POR EL KAMBIO</td>
                                                                    <td><img width="40px" height="40px" src="images/simbolo_pkk.jpg"></td>
                                                                    <td>${detalle.P1}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>FUERZA POPULAR</td>
                                                                    <td><img width="40px" height="40px" src="images/simbolo_keyko.jpg"></td>
                                                                    <td>${detalle.P2}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td colspan="2">VOTOS EN BLANCO</td>
                                                                    <td>${detalle.VotosBlancos}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td colspan="2">VOTOS NULOS</td>
                                                                    <td>${detalle.VotosNulos}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td colspan="2">VOTOS IMPUGNADOS</td>
                                                                    <td>${detalle.VotosImpugnados}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td colspan="2">TOTAL DE  VOTOS EMITIDOS</td>
                                                                    <td>${detalle.TotalVotantes}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>			
                    </div>
                </div>
            `
            actaHtml.innerHTML = actadetalle;
            const regresar = document.getElementById("btn-regresar");
            if(q=='ubigeo') {
                html.hidden = true;
                regresar.addEventListener("click", ()=>{
                    actaHtml.innerHTML = '';
                    html.hidden = false;
                })
            }
            if(q == 'numero') regresar.remove()
        }
    });
}