let URL = 'http://localhost:8000/modelos';

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
                                        <td>${item.id_modelo}</td>
                                        <td>${item.nombre}</td>
                                        <td>
                                            <button class='btn btn-outline-success btnEditar' data-id='${item.id_modelo}' data-modelo='${JSON.stringify(item)}'>Editar</button>
                                            <button class='btn btn-outline-danger btnEliminar' data-id='${item.id_modelo}'>Eliminar</button>
                                        </td>
                                    </tr>`;
        })
    })
    .catch(error => {
        log(error)
    });
}

btnRegistrar.onclick = () => {
    let modelo = {
        nombre: id("txtNombre").value,
    }
    let data = JSON.stringify(modelo)
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
    let modelo = JSON.parse(elemento.getAttribute('data-modelo'))
    id("txtNombre").value = modelo.nombre
    let id_modelo = elemento.getAttribute('data-id')
    btnActualizar.setAttribute('data-id', id_modelo);
}

btnActualizar.onclick = (ev) => {
    let modelo = {
        id_modelo: ev.target.getAttribute('data-id'),
        nombre: id("txtNombre").value
    }
    let data = JSON.stringify(modelo)
    fetch(URL, {
        method: "PUT",
        body: data
    })
    .then(response => {
        log(response)
        if(response.ok){
            listar()
            limpiar()
        }else{
            alert(response.text()) 
    }
    })
    .catch(error => {
        log(error)
    });
}

const eliminar = elemento => {
    let id_modelo = elemento.getAttribute('data-id');
    fetch(URL+"/"+id_modelo, {
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