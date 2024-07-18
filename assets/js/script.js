const boton = document.querySelector("#convertir")
let datosMonedas = []
let grafica

async function getMonedas() {
    try {
        const res = await fetch("https://mindicador.cl/api/")
        let data = await res.json()
        datosMonedas = data
        return datosMonedas
    } catch (error) {
        alert(error)
    }
}

async function getDatosHistoricos(moneda) {
    try {
        const response = await fetch(`https://mindicador.cl/api/${moneda}`)
        const datos = await response.json()
        return datos.serie.slice(0, 10).reverse()
    } catch (error) {
        alert(error)
    }
}

async function renderGrafica(moneda) {
    const datosHistoricos = await getDatosHistoricos(moneda)
    const labels = datosHistoricos.map(datos => datos.fecha.split("T")[0])
    const valoresMonedas = datosHistoricos.map(datos => datos.valor)

    const chart = document.querySelector("#myChart")

    if (grafica) {
        grafica.destroy()
    }

    myChart.style.backgroundColor = "white"
    grafica = new Chart(chart, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: `Historial del valor ${moneda} últimos 10 días`,
                data: valoresMonedas,
                borderColor: "rgb(13,202,240)",
                borderWidth: 2,
                pointBackgroundColor: "white",
                pointBorderColor: "rgb(13,202,240)"
            }]
        }
    });
}

boton.addEventListener("click", () => {
    const valor = document.querySelector("#input-clp").value
    const moneda = document.querySelector("#select-monedas").value
    try {
        const valorConvertido = valor / datosMonedas[moneda].valor
        document.querySelector("#span-resultado").textContent = valorConvertido.toFixed(4)
    } catch (error) {
        alert(error)
    }

    renderGrafica(moneda)
});
getMonedas();

