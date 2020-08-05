let URL = 'http://localhost:8000/metodos';

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
                                        <td>${item.id_metodo}</td>
                                        <td>${item.metodo}</td>
                                        <td>
                                            <button class='btn btn-outline-success btnEditar' data-id='${item.id_metodo}' data-metodo='${JSON.stringify(item)}'>Editar</button>
                                            <button class='btn btn-outline-danger btnEliminar' data-id='${item.id_metodo}'>Eliminar</button>
                                        </td>
                                    </tr>`;
        })
    })
    .catch(error => {
        log(error)
    });
}

btnRegistrar.onclick = () => {
    let metodo = {
        metodo: id("txtNombre").value,
    }
    let data = JSON.stringify(metodo)
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
}

const actualizar = elemento => {
    let metodo = JSON.parse(elemento.getAttribute('data-metodo'))
    id("txtNombre").value = metodo.metodo
    let id_metodo = elemento.getAttribute('data-id')
    btnActualizar.setAttribute('data-id', id_metodo);
}

btnActualizar.onclick = (ev) => {
    let metodo = {
        id_metodo: ev.target.getAttribute('data-id'),
        metodo: id("txtNombre").value,
    }
    let data = JSON.stringify(metodo)
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