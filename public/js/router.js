import { verParticipacion, verActas} from "./onpe.js";

/*
Rutas para Local:
    /public/participacion_total.html
    /public/actas_ubigeo.html
    /public/actas_numero.html
*/ 

const inicializar = async () => {
    const path = window.location.pathname
    if(path.startsWith("/participacion_total.html")){
        const id = new URLSearchParams(window.location.search).get('id')
        const accion = new URLSearchParams(window.location.search).get('ambito')
        await verParticipacion(id, accion)
    }
    if(path.startsWith("/actas_ubigeo.html")){
        await verActas('ubigeo')
    }
    if(path.startsWith("/actas_numero.html")){
        await verActas('numero')
    }
}

inicializar()


