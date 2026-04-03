import { verParticipacion, verActas} from "./onpe.js";

const inicializar = async () => {
    const path = window.location.pathname
    if(path.startsWith("/public/participacion_total.html")){
        const id = new URLSearchParams(window.location.search).get('id')
        const accion = new URLSearchParams(window.location.search).get('ambito')
        await verParticipacion(id, accion)
    }
    if(path.startsWith("/public/actas_ubigeo.html")){
        await verActas()
    }
}

inicializar()


