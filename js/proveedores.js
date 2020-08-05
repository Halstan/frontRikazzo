let URL = 'http://localhost:8000/proveedores';

const btnRegistrar = id("btnRegistrar");
const btnActualizar = id("btnActualizar");

const tblProductos = q("#tblProductos tbody");

document.addEventListener("click", ev => {
    if( (/\bbtnEditar/.test(ev.target.className)) ){
        actualizar(ev.target)
    }else if( (/\bbtnEliminar/.test(ev.target.className)) ){
        eliminar(ev.target)
    }else{
        return;
    }
});

window.onload = () => {
    listar();
}

const listar = () => {
    fetch(URL, {
        method: "GET"
    })
    .then(response => {
        log(response)
        return response.json()
    })
    .then(response => {
        log(response)
        tblProductos.innerHTML = "";
        response.forEach((item, i) => {
            tblProductos.innerHTML += `<tr>
                                        <td>${item.id_proveedor}</td>
                                        <td>${item.nombre}</td>
                                        <td>${item.ruc}</td>
                                        <td>${item.razonSoc}</td>
                                        <td>${item.direccion}</td>
                                        <td>
                                            <button class='btn btn-outline-success btnEditar' data-id='${item.id_proveedor}' data-proveedor='${JSON.stringify(item)}'>Editar</button>
                                            <button class='btn btn-outline-danger btnEliminar' data-id='${item.id_proveedor}'>Eliminar</button>
                                        </td>
                                    </tr>`;
        })
    })
    .catch(error => {
        log(error)
    });
}

btnRegistrar.onclick = () => {
    let proveedor = {
        nombre: id("txtNombre").value,
        ruc: id("txtRUC").value,
        razonSoc: id("txtRazon").value,
        direccion: id("txtDireccion").value
    }
    let data = JSON.stringify(proveedor)
    fetch(URL, {
        method: "POST",
        body: data
    })
    .then(response => {
        log(response)
        if(response.ok)
            listar()
        else
            alert("Ocurrión un problema")
    })
    .catch(error => {
        log(error)
    });
}

function limpiar(){
    id("txtNombre").value = "";
    id("txtRUC").value = "";
    id("txtRazon").value = "";
    id("txtDireccion").value = "";
}

const actualizar = elemento => {
    let proveedor = JSON.parse(elemento.getAttribute('data-proveedor'))
    id("txtNombre").value = proveedor.nombre
    id("txtRUC").value = proveedor.ruc
    id("txtRazon").value = proveedor.razonSoc
    id("txtDireccion").value = proveedor.direccion
    let id_proveedor = elemento.getAttribute('data-id')
    btnActualizar.setAttribute('data-id', id_proveedor);
}

btnActualizar.onclick = (ev) => {
    let proveedor = {
        id_proveedor: ev.target.getAttribute('data-id'),
        nombre: id("txtNombre").value,
        ruc: id("txtRUC").value,
        razonSoc: id("txtRazon").value,
        direccion: id("txtDireccion").value
    }
    let data = JSON.stringify(proveedor)
    fetch(URL, {
        method: "PUT",
        body: data
    })
    .then(response => {
        log(response)
        if(response.ok){
            limpiar()
            listar()
        }else{
            alert(response.text()) 
    }
    })
    .catch(error => {
        log(error)
    });
}

const eliminar = elemento => {
    let id_proveedor = elemento.getAttribute('data-id');
    fetch(URL+"/"+id_proveedor, {
        method: "DELETE"
    })
    .then(response => {
        log(response)
        if(response.ok)
            listar()
        else
            alert(response.text())
    })
    .catch(error => {
        log(error)
    });
}