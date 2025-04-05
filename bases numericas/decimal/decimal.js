document.addEventListener("DOMContentLoaded", function () {
  let numeroSorteado = null
  let respostaCorreta = ""

  const maxNumberInput = document.getElementById("max-number")
  const resultInput = document.getElementById("result")
  const inputNumber = document.getElementById("input-number")
  const checkboxes = document.querySelectorAll(".checkbox")
  const labelResposta = document.createElement("label")
  const labelCalculo = document.createElement("div")
  const labelObs = document.createElement("div")

  labelResposta.innerText = "Resposta:"
  labelResposta.style.fontWeight = "bold"
  labelResposta.style.marginTop = "10px"
  labelResposta.style.color = "red" // Adicionando cor vermelha para "Resposta:"

  labelCalculo.style.fontWeight = "bold"
  labelCalculo.style.marginTop = "10px"
  labelCalculo.style.lineHeight = "1.8" // Ajuste o valor conforme necessário

  labelObs.style.fontWeight = "bold"
  labelObs.style.marginTop = "10px"
  labelCalculo.style.whiteSpace = "pre-line"

  document.body.appendChild(labelResposta)
  document.body.appendChild(labelCalculo)
  document.body.appendChild(labelObs)

function sortearNumero() {
  const maxNumber = parseInt(maxNumberInput.value, 10) || 100
  numeroDecimal = Math.floor(Math.random() * maxNumber) + 1
  resultInput.value = numeroDecimal
  inputNumber.value = ""
  labelResposta.textContent = "Resposta:"
  labelCalculo.textContent = ""
  labelObs.textContent = ""
}

function calcularBinario(numero) {
  if (numero === 0) return "0 ÷ 2 = 0 → resto = 0"

  let passos = []
  let restos = []
  let num = numero

  while (num > 0) {
    const quociente = Math.floor(num / 2)
    const resto = num % 2
    passos.push(`${num} ÷ 2 = ${quociente} → resto = ${resto}`)
    restos.unshift(resto)
    num = quociente
  }

  passos.push(`<span style="color:red">Resultado:</span> ${restos.join("")}`)
  return passos.join("<br>")
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

    // Calcula os quocientes e restos e armazena-os
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

    // Adiciona o último quociente
    restoArray.push(quociente)

    // Observa a ordem e converte para octal
    passos.push(`Último quociente (${quociente}) → primeiro dígito`)
    passos.push(
      `Observamos que a ordem que vai ficar começa por baixo (o último quociente) e vai até o resto (subindo).`
    )
    let resultadoOctal = restoArray.reverse().join("")
    passos.push(
      `<span style="color: red;">Lemos:</span> <span style="color: white;"><strong>${resultadoOctal}<span style="font-size: 60%; vertical-align: bottom;">8</span></strong></span>`
    )
    return passos.join("\n")
  }

  // Exemplos de uso:
  console.log(calcularOctal(60))
  console.log(calcularOctal(98))

function confirmarNumero() {
  // Verifica se há número digitado
  const numeroDigitado = resultInput.value.trim()
  if (!numeroDigitado) {
    alert("Digite um número ou clique em Sortear!")
    return
  }

  // Verifica se é número válido
  if (!/^\d+$/.test(numeroDigitado)) {
    alert("Digite apenas números decimais (0-9)!")
    return
  }

  const decimal = parseInt(numeroDigitado, 10)
  const checkedOption = obterOpcaoSelecionada()

  if (!checkedOption) {
    alert("Selecione um tipo de conversão!")
    return
  }

  const respostaUsuario = inputNumber.value.trim()
  let respostaCorreta = ""
  let calculo = ""

  if (checkedOption.value === "binario") {
    respostaCorreta = decimal.toString(2)
    calculo = calcularBinario(decimal)

    // Verificação da resposta
    if (respostaUsuario === respostaCorreta) {
      inputNumber.style.backgroundColor = "green"
    } else {
      inputNumber.style.backgroundColor = "red"
      setTimeout(() => (inputNumber.style.backgroundColor = ""), 3000)
    }

    labelResposta.innerHTML = `Resposta: ${respostaCorreta}`
    labelCalculo.innerHTML = `<span style="color: cyan; font-weight: bold;">CÁLCULO:</span><br>${calculo}`
    labelObs.textContent = "OBS: Ler os restos de baixo para cima"
  }

  // Conversão para Hexadecimal
  else if (checkedOption.value === "hexadecimal") {
    respostaEsperada = "0x" + decimal.toString(16).toUpperCase()
    calculo = calcularHexadecimal(decimal)

    // Remove o prefixo 0x para comparação
    const respostaParaComparar = respostaUsuario.replace(/^0x/i, "")
    const respostaCorreta = decimal.toString(16).toUpperCase()

    if (respostaParaComparar === respostaCorreta) {
      inputNumber.style.backgroundColor = "green"
    } else {
      inputNumber.style.backgroundColor = "red"
      setTimeout(() => (inputNumber.style.backgroundColor = ""), 3000)
    }

    labelResposta.innerHTML = `Resposta: ${respostaEsperada}`
    labelCalculo.innerHTML = `<span style="color: rgb(0, 255, 255); font-weight: bold;">CÁLCULO:</span><br>${calculo}`
    labelObs.textContent = ""
  }
  // Conversão para Octal
  else if (checkedOption.value === "octal") {
    respostaEsperada = decimal.toString(8)
    calculo = calcularOctal(decimal)

    if (respostaUsuario === respostaEsperada) {
      inputNumber.style.backgroundColor = "green"
    } else {
      inputNumber.style.backgroundColor = "red"
      setTimeout(() => (inputNumber.style.backgroundColor = ""), 3000)
    }

    labelResposta.innerHTML = `Resposta: ${respostaEsperada}`
    labelCalculo.innerHTML = `<span style="color: rgb(0, 255, 255); font-weight: bold;">CÁLCULO:</span><br>${calculo}`
    labelObs.textContent = ""
  }

  // Limpa o campo de entrada após 3 segundos (apenas para respostas erradas)
  if (inputNumber.style.backgroundColor === "red") {
    setTimeout(() => {
      inputNumber.value = ""
    }, 3000)
  }
}

  function obterOpcaoSelecionada() {
    return Array.from(checkboxes).find((chk) => chk.checked)
  }
  function Apagartudo() {
    // Limpa as entradas e saídas
    inputNumber.value = ""
    inputNumber.style.backgroundColor = ""
    resultInput.value = ""

    // Limpa os labels de cálculo e resposta
    labelResposta.innerHTML = "Resposta:"
    labelCalculo.innerHTML = ""
    labelObs.textContent = ""

    // Desmarca todas as checkboxes
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false
    })

    console.log("Tudo foi apagado!")
  }

  window.sortearNumero = sortearNumero
  window.confirmarNumero = confirmarNumero
  window.Apagartudo = Apagartudo // Expõe a função para o escopo global
})
