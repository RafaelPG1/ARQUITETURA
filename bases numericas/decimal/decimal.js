document.addEventListener("DOMContentLoaded", function () {
  let numeroDecimal = null
  let respostaCorreta = ""

  const maxNumberInput = document.getElementById("max-number")
  const resultInput = document.getElementById("result")
  const inputNumber = document.getElementById("input-number")
  const checkboxes = document.querySelectorAll(".checkbox")
  const labelResposta = document.createElement("label")
  const labelCalculo = document.createElement("div")
  const labelObs = document.createElement("div")

  // Configuração dos elementos de exibição
  labelResposta.innerText = "Resposta:"
  labelResposta.style.fontWeight = "bold"
  labelResposta.style.marginTop = "10px"
  labelResposta.style.color = "red"
  labelCalculo.style.fontWeight = "bold"
  labelCalculo.style.marginTop = "10px"
  labelCalculo.style.lineHeight = "1.8"
  labelCalculo.style.whiteSpace = "pre-line"
  labelObs.style.fontWeight = "bold"
  labelObs.style.marginTop = "10px"

  document.body.appendChild(labelResposta)
  document.body.appendChild(labelCalculo)
  document.body.appendChild(labelObs)

  // Função para validar número decimal
  function isValidDecimal(decStr) {
    return /^\d+$/.test(decStr)
  }

  // Função para sortear número (original mantida)
  function sortearNumero() {
    let checkedOption = obterOpcaoSelecionada()
    const maxNumber = parseInt(maxNumberInput.value, 10) || 100
    numeroDecimal = Math.floor(Math.random() * maxNumber) + 1
    resultInput.value = numeroDecimal
    inputNumber.value = ""
    labelResposta.textContent = "Resposta:"
    labelCalculo.textContent = ""
    labelObs.textContent = ""

    if (
      checkedOption &&
      checkedOption.nextSibling.textContent.includes("Decimal para binário")
    ) {
      respostaCorreta = numeroDecimal.toString(2)
    } else if (
      checkedOption &&
      checkedOption.nextSibling.textContent.includes("Decimal para Hexadecimal")
    ) {
      respostaCorreta = numeroDecimal.toString(16).toUpperCase()
    } else if (
      checkedOption &&
      checkedOption.nextSibling.textContent.includes("Decimal para Octal")
    ) {
      respostaCorreta = numeroDecimal.toString(8)
    }
  }

  // Função para obter o número decimal (digitado ou sorteado)
  function getDecimalNumber() {
    const digitado = resultInput.value.trim()

    if (digitado && !isValidDecimal(digitado)) {
      alert(
        "Por favor, digite um número decimal válido (apenas dígitos de 0-9)"
      )
      return null
    }

    return digitado ? parseInt(digitado, 10) : numeroDecimal
  }

  // Funções de cálculo originais mantidas
  function calcularBinario(numero) {
    let passos = ["Decimal para Binário:"]
    while (numero >= 2) {
      let quociente = Math.floor(numero / 2)
      let resto = numero % 2
      passos.push(`${numero} ÷ 2 = ${quociente} → resto = ${resto}`)
      numero = quociente
    }
    passos.push(`Último quociente (${numero}) → Primeiro dígito`)
    passos.push(
      `<span style="color: red;">Lemos:</span> <span style="color: white;">${numeroDecimal.toString(
        2
      )}<span style="font-size: 60%; vertical-align: bottom;">2</span></span>`
    )
    return passos.join("\n")
  }

  function calcularHexadecimal(numero) {
    let passos = []
    let restoArray = []
    let quociente = numero

    while (quociente >= 16) {
      let novoQuociente = Math.floor(quociente / 16)
      let resto = quociente % 16
      let restoHex = resto.toString(16).toUpperCase()
      let representacao =
        resto >= 10
          ? `- ${resto} é representado como ${restoHex} em hexadecimal.`
          : ""
      passos.push(
        `${quociente} ÷ 16 = ${novoQuociente} (quociente) → (16x${novoQuociente}) = ${
          novoQuociente * 16
        } - ${quociente} = ${resto} (resto) ${representacao}`
      )
      restoArray.push(restoHex)
      quociente = novoQuociente
    }

    let ultimoQuocienteHex = quociente.toString(16).toUpperCase()
    let representacaoFinal =
      quociente >= 10
        ? `${quociente} é representado como ${ultimoQuocienteHex} em hexadecimal.`
        : ""
    restoArray.push(ultimoQuocienteHex)
    passos.push(
      `Último quociente (${quociente}) → Primeiro dígito ${representacaoFinal}`
    )
    passos.push(
      "Observamos que a ordem que vai ficar começa por baixo (o último quociente) e vai até o resto (subindo)."
    )
    let resultadoHex = restoArray.reverse().join("")
    passos.push(
      `<span style="color: red;">Lemos:</span> <span style="color: white;">0x${resultadoHex}</span>`
    )

    return passos.join("\n")
  }

  function calcularOctal(numero) {
    let passos = []
    let restoArray = []
    let quociente = numero

    while (quociente >= 8) {
      let novoQuociente = Math.floor(quociente / 8)
      let resto = quociente % 8
      passos.push(
        `${quociente} ÷ 8 = ${novoQuociente} (quociente) → (8x${novoQuociente}) = ${
          novoQuociente * 8
        } - ${quociente} = ${resto} (resto)`
      )
      restoArray.push(resto)
      quociente = novoQuociente
    }

    restoArray.push(quociente)
    passos.push(`Último quociente (${quociente}) → primeiro dígito`)
    passos.push(
      "Observamos que a ordem que vai ficar começa por baixo (o último quociente) e vai até o resto (subindo)."
    )
    let resultadoOctal = restoArray.reverse().join("")
    passos.push(
      `<span style="color: red;">Lemos:</span> <span style="color: white;"><strong>${resultadoOctal}<span style="font-size: 60%; vertical-align: bottom;">8</span></strong></span>`
    )
    return passos.join("\n")
  }

  // Função confirmarNumero atualizada
  function confirmarNumero() {
    const decimalParaCalcular = getDecimalNumber()

    if (!decimalParaCalcular) {
      alert("Primeiro, digite um número decimal ou clique em SORTEAR!")
      return
    }

    let checkedOption = obterOpcaoSelecionada()
    if (!checkedOption) {
      alert("Selecione um tipo de conversão!")
      return
    }

    let respostaUsuario = inputNumber.value.trim().toUpperCase()
    let respostaEsperada = ""
    let calculo = ""

    if (
      checkedOption.nextSibling.textContent.includes("Decimal para binário")
    ) {
      respostaCorreta = decimalParaCalcular.toString(2)
      respostaEsperada = respostaCorreta
      calculo = calcularBinario(decimalParaCalcular).replace(/\n/g, "<br>")
    } else if (
      checkedOption.nextSibling.textContent.includes("Decimal para Hexadecimal")
    ) {
      respostaCorreta = decimalParaCalcular.toString(16).toUpperCase()
      respostaEsperada = "0x" + respostaCorreta
      calculo = calcularHexadecimal(decimalParaCalcular).replace(/\n/g, "<br>")
    } else if (
      checkedOption.nextSibling.textContent.includes("Decimal para Octal")
    ) {
      respostaCorreta = decimalParaCalcular.toString(8)
      respostaEsperada = respostaCorreta
      calculo = calcularOctal(decimalParaCalcular).replace(/\n/g, "<br>")
    }

    let respostaParaComparar = respostaUsuario
    if (checkedOption.nextSibling.textContent.includes("Hexadecimal")) {
      respostaParaComparar = respostaUsuario.replace(/^0X/, "")
    }

    let respostaCorretaUsuario = false
    if (checkedOption.nextSibling.textContent.includes("Hexadecimal")) {
      respostaCorretaUsuario = respostaParaComparar === respostaCorreta
    } else {
      respostaCorretaUsuario = respostaParaComparar === respostaCorreta
    }

    if (respostaCorretaUsuario) {
      inputNumber.style.backgroundColor = "green"
    } else {
      inputNumber.style.backgroundColor = "red"
      setTimeout(() => (inputNumber.style.backgroundColor = ""), 3000)
    }

    labelResposta.innerHTML = `Resposta: ${respostaEsperada}`
    labelCalculo.innerHTML = `<span style="color: rgb(0, 255, 255);">CÁLCULO:</span><br>${calculo}`

    if (
      checkedOption.nextSibling.textContent.includes("Decimal para binário")
    ) {
      labelObs.textContent = "OBS: A ordem que vai ficar começa por baixo"
    } else {
      labelObs.textContent = ""
    }
  }

  function obterOpcaoSelecionada() {
    return Array.from(checkboxes).find((chk) => chk.checked)
  }

  function Apagartudo() {
    inputNumber.value = ""
    inputNumber.style.backgroundColor = ""
    resultInput.value = ""
    numeroDecimal = null
    labelResposta.innerHTML = "Resposta:"
    labelCalculo.innerHTML = ""
    labelObs.textContent = ""
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false
    })
  }

  // Mantendo todas as funções originais disponíveis globalmente
  window.sortearNumero = sortearNumero
  window.confirmarNumero = confirmarNumero
  window.Apagartudo = Apagartudo
})
