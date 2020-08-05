let URL = 'http://localhost:8000/talla';

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
                                        <td>${item.id_talla}</td>
                                        <td>${item.talla}</td>
                                        <td>
                                            <button class='btn btn-outline-success btnEditar' data-id='${item.id_talla}' data-talla='${JSON.stringify(item)}'>Editar</button>
                                            <button class='btn btn-outline-danger btnEliminar' data-id='${item.id_talla}'>Eliminar</button>
                                        </td>
                                    </tr>`;
        })
    })
    .catch(error => {
        log(error)
    });
}

btnRegistrar.onclick = () => {
    let talla = {
        talla: id("txtNombre").value,
    }
    let data = JSON.stringify(talla)
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
    let talla = JSON.parse(elemento.getAttribute('data-talla'))
    id("txtNombre").value = talla.talla
    let id_talla = elemento.getAttribute('data-id')
    btnActualizar.setAttribute('data-id', id_talla);
}

btnActualizar.onclick = (ev) => {
    let talla = {
        id_talla: ev.target.getAttribute('data-id'),
        talla: id("txtNombre").value
    }
    let data = JSON.stringify(talla)
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
    let id_sexoR = elemento.getAttribute('data-id');
    fetch(URL+"/"+id_sexoR, {
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