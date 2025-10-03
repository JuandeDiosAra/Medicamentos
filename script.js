let consultas = [];
let farmacia = [];
let editandoConsulta = null;
let editandoFarmacia = null;

function registrarConsulta() {
  const nombre = document.getElementById('nombreConsulta').value.trim();
  const dni = document.getElementById('dniConsulta').value.trim();
  const motivo = document.getElementById('motivoConsulta').value.trim();

  if (!validarCampos(nombre, dni, motivo)) return;

  if (editandoConsulta !== null) {
    // Modo edición
    consultas[editandoConsulta] = { nombre, dni, motivo };
    editandoConsulta = null;
    document.querySelector('#formConsulta button').textContent = 'Registrar Consulta';
  } else {
    // Modo registro nuevo
    consultas.push({ nombre, dni, motivo });
  }
  
  mostrarConsultas();
  actualizarListaPacientesFarmacia();
  limpiarCampos(['nombreConsulta', 'dniConsulta', 'motivoConsulta']);
}

function registrarFarmacia() {
  const nombre = document.getElementById('nombreFarmacia').value;
  const dni = document.getElementById('dniFarmacia').value.trim();
  const medicamento = document.getElementById('medicamento').value;

  if (!validarCampos(nombre, dni, medicamento)) return;

  if (editandoFarmacia !== null) {
    // Modo edición
    farmacia[editandoFarmacia] = { nombre, dni, medicamento };
    editandoFarmacia = null;
    document.querySelector('#formFarmacia button').textContent = 'Registrar Entrega';
  } else {
    // Modo registro nuevo
    farmacia.push({ nombre, dni, medicamento });
  }
  
  mostrarFarmacia();
  limpiarCampos(['nombreFarmacia', 'dniFarmacia', 'medicamento']);
  actualizarListaPacientesFarmacia();
}

function mostrarConsultas() {
  const tabla = document.getElementById('tablaConsulta');
  tabla.innerHTML = '';
  consultas.forEach((c, i) => {
    tabla.innerHTML += `<tr>
      <td>${c.nombre}</td>
      <td>${c.dni}</td>
      <td>${c.motivo}</td>
      <td>
        <button class="btn btn-warning btn-sm me-1" onclick="editarConsulta(${i})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarConsulta(${i})">Eliminar</button>
      </td>
    </tr>`;
  });
}

function mostrarFarmacia() {
  const tabla = document.getElementById('tablaFarmacia');
  tabla.innerHTML = '';
  farmacia.forEach((f, i) => {
    tabla.innerHTML += `<tr>
      <td>${f.nombre}</td>
      <td>${f.dni}</td>
      <td>${f.medicamento}</td>
      <td>
        <button class="btn btn-warning btn-sm me-1" onclick="editarFarmacia(${i})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarFarmacia(${i})">Eliminar</button>
      </td>
    </tr>`;
  });
}

function editarConsulta(index) {
  const consulta = consultas[index];
  document.getElementById('nombreConsulta').value = consulta.nombre;
  document.getElementById('dniConsulta').value = consulta.dni;
  document.getElementById('motivoConsulta').value = consulta.motivo;
  
  editandoConsulta = index;
  document.querySelector('#formConsulta button').textContent = 'Actualizar Consulta';
}

function editarFarmacia(index) {
  const farm = farmacia[index];
  document.getElementById('nombreFarmacia').value = farm.nombre;
  document.getElementById('dniFarmacia').value = farm.dni;
  document.getElementById('medicamento').value = farm.medicamento;
  
  editandoFarmacia = index;
  document.querySelector('#formFarmacia button').textContent = 'Actualizar Entrega';
}

function eliminarConsulta(index) {
  if (confirm('¿Estás seguro de que quieres eliminar esta consulta?')) {
    consultas.splice(index, 1);
    mostrarConsultas();
    actualizarListaPacientesFarmacia();
  }
}

function eliminarFarmacia(index) {
  if (confirm('¿Estás seguro de que quieres eliminar este registro de farmacia?')) {
    farmacia.splice(index, 1);
    mostrarFarmacia();
  }
}

function validarCampos(nombre, dni, campoExtra) {
  if (nombre === '' || dni === '' || campoExtra === '') {
    alert("Todos los campos son obligatorios.");
    return false;
  }
  if (dni.length !== 8 || isNaN(dni)) {
    alert("DNI inválido. Debe tener 8 dígitos numéricos.");
    return false;
  }
  return true;
}

function limpiarCampos(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el.tagName === 'SELECT') {
      el.selectedIndex = 0;
    } else {
      el.value = '';
    }
  });
  
  // Restaurar texto del botón si estaba en modo edición
  if (editandoConsulta !== null) {
    editandoConsulta = null;
    document.querySelector('#formConsulta button').textContent = 'Registrar Consulta';
  }
  if (editandoFarmacia !== null) {
    editandoFarmacia = null;
    document.querySelector('#formFarmacia button').textContent = 'Registrar Entrega';
  }
}

// Actualiza el SELECT con los nombres de los pacientes registrados
function actualizarListaPacientesFarmacia() {
  const select = document.getElementById('nombreFarmacia');
  select.innerHTML = '<option value="">Seleccione un paciente</option>';
  consultas.forEach(c => {
    const option = document.createElement('option');
    option.value = c.nombre;
    option.textContent = c.nombre;
    select.appendChild(option);
  });
}

// Al seleccionar paciente, completar automáticamente su DNI
function actualizarDniFarmacia() {
  const nombreSeleccionado = document.getElementById('nombreFarmacia').value;
  const paciente = consultas.find(c => c.nombre === nombreSeleccionado);
  document.getElementById('dniFarmacia').value = paciente ? paciente.dni : '';
}

// Inicializar tablas
mostrarConsultas();
mostrarFarmacia();