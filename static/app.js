const form = document.querySelector("#formulario");
const button = document.querySelector("#enviar");
const result = document.querySelector("#resultado");
let preguntas = [];

async function cargarPreguntas() {
  const response = await fetch("/api/preguntas");
  if (!response.ok) return;
  preguntas = await response.json();
  if (!preguntas.length) return;
  const seccion = document.querySelector("#preguntas-adicionales");
  const contenedor = document.querySelector("#contenedor-preguntas");
  preguntas.forEach((pregunta, indice) => {
    const label = document.createElement("label");
    label.htmlFor = `pregunta-${pregunta.id}`;
    label.textContent = `${indice + 1}. ${pregunta.texto}`;
    let campo;
    if (pregunta.tipo === "textarea") {
      campo = document.createElement("textarea");
    } else if (pregunta.tipo === "opcion_multiple") {
      campo = document.createElement("select");
      const vacio = document.createElement("option");
      vacio.value = "";
      vacio.textContent = "Selecciona una opción";
      campo.append(vacio);
      pregunta.opciones.forEach(opcion => {
        const option = document.createElement("option");
        option.value = opcion;
        option.textContent = opcion;
        campo.append(option);
      });
    } else {
      campo = document.createElement("input");
      campo.type = "text";
    }
    campo.id = `pregunta-${pregunta.id}`;
    campo.dataset.preguntaId = pregunta.id;
    campo.required = pregunta.obligatorio;
    campo.maxLength = 1500;
    label.append(campo);
    contenedor.append(label);
  });
  seccion.hidden = false;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cv = form.elements.hoja_vida.files[0];
  if (cv && cv.size > 5 * 1024 * 1024) {
    result.className = "error";
    result.textContent = "El CV no puede superar 5 MB.";
    return;
  }
  button.disabled = true;
  result.className = "";
  result.textContent = "Enviando...";
  try {
    const datos = new FormData(form);
    const respuestas = preguntas.map(pregunta => ({
      pregunta_id: pregunta.id,
      respuesta: document.querySelector(`#pregunta-${pregunta.id}`).value,
    }));
    datos.append("respuestas_json", JSON.stringify(respuestas));
    const response = await fetch("/postular", { method: "POST", body: datos });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "No fue posible enviar la postulación.");
    form.reset();
    result.className = "ok";
    result.textContent = data.mensaje;
  } catch (error) {
    result.className = "error";
    result.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

cargarPreguntas();
