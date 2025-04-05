document.addEventListener("DOMContentLoaded", function () {
  let numeroBinario = null
  let respostaCorreta = ""

  const resultInput = document.getElementById("result")
  const inputBinario = document.getElementById("input-number")
  const checkboxes = document.querySelectorAll(".checkbox")
  const labelResposta = document.createElement("label")
  const labelCalculo = document.createElement("div")
  const labelObs = document.createElement("div")

  // Configuração dos elementos de exibição
  labelResposta.innerText = "Resposta:"
  labelResposta.style.fontWeight = "bold"
  labelResposta.style.marginTop = "10px"
  labelCalculo.style.fontWeight = "bold"
  labelResposta.style.color = "red"
  labelCalculo.style.marginTop = "10px"
  labelCalculo.style.lineHeight = "1.8"
  labelCalculo.style.whiteSpace = "pre-line"
  labelObs.style.fontWeight = "bold"
  labelObs.style.marginTop = "10px"

  document.body.appendChild(labelResposta)
  document.body.appendChild(labelCalculo)
  document.body.appendChild(labelObs)

  // Função para validar número binário
  function isValidBinary(binStr) {
    return /^[01]+$/.test(binStr)
  }

  // Função para sortear número
  function sortearNumero() {
    let valorDecimal = Math.floor(Math.random() * 100) + 1
    numeroBinario = valorDecimal.toString(2)
    resultInput.value = numeroBinario
    inputBinario.value = ""
    labelResposta.textContent = "Resposta:"
    labelCalculo.textContent = ""
    labelObs.textContent = ""
    console.log(`Sorteado: ${numeroBinario} (decimal: ${valorDecimal})`)
  }

  // Função para obter o número binário (digitado ou sorteado)
  function getBinaryNumber() {
    const digitado = resultInput.value.trim()

    if (digitado && !isValidBinary(digitado)) {
      alert("Por favor, digite um número binário válido (apenas 0s e 1s)")
      return null
    }

    return digitado || numeroBinario
  }

  // Função para calcular conversão para decimal
  function calcularDecimal(binario) {
    let soma = 0
    let termos = []
    let valores = []

    for (let i = 0; i < binario.length; i++) {
      let digito = binario[binario.length - 1 - i]
      let valor = parseInt(digito) * Math.pow(2, i)
      termos.push(
        `${digito} × 2<span style="font-size: 60%; vertical-align: top;">${i}</span>`
      )
      valores.push(valor.toString())
      soma += valor
    }

    let calculoExpressao = termos.reverse().join(" + ")
    let calculoValores = valores.reverse().join(" + ") + ` = ${soma}`
    let resultadoFormatado = `<span style="color: red; font-weight: bold;">Lemos: </span><span style="color: white; font-weight: bold;">${soma}<span style="font-size: 60%; vertical-align: bottom;">10</span></span>`

    return {
      expressao: `${calculoExpressao}<br>${calculoValores}<br>${resultadoFormatado}`,
      soma,
    }
  }

  // Função para calcular hexadecimal (primeira forma)
  function calcularHexadecimalPrimeiraForma(binario) {
    let resultadoDecimal = calcularDecimal(binario)
    let decimal = resultadoDecimal.soma
    let passosBinarioParaDecimal = `<span style="color: green; font-weight: bold;">Passo 1: Converter de binário para decimal</span><br>${resultadoDecimal.expressao}`

    let passosHex = []
    let restoArray = []
    let quociente = decimal

    passosHex.push(
      `<span style="color: green; font-weight: bold;">Passo 2: Converter de decimal para hexadecimal</span>`
    )

    while (quociente >= 16) {
      let novoQuociente = Math.floor(quociente / 16)
      let resto = quociente % 16
      let restoHex = resto.toString(16).toUpperCase()
      passosHex.push(
        `${quociente} ÷ 16 = ${novoQuociente} (quociente) → (16x${novoQuociente}) = ${
          novoQuociente * 16
        } - ${quociente} = ${resto} (resto)`
      )
      restoArray.push(restoHex)
      quociente = novoQuociente
    }

    restoArray.push(quociente.toString(16).toUpperCase())
    passosHex.push(`Último quociente (${quociente}) → Primeiro dígito`)
    passosHex.push(
      "Observamos que a ordem que vai ficar começa por baixo (o último quociente) e vai até o resto (subindo)."
    )

    let resultadoHex = restoArray.reverse().join("")
    passosHex.push(
      `<span style="color: red; font-weight: bold;">Lemos: </span><span style="color: white; font-weight: bold;">0x${resultadoHex}</span>`
    )

    return `<span style="color: #0066cc; font-weight: bold;">PRIMEIRA FORMA: Binário para Decimal para Hexadecimal</span><br>${passosBinarioParaDecimal}<br><br>${passosHex.join("<br>")}`
  }

  // Função para calcular hexadecimal (segunda forma)
  function calcularHexadecimalSegundaForma(binario) {
    if (binario.length % 4 !== 0) {
      binario = binario.padStart(Math.ceil(binario.length / 4) * 4, "0")
    }

    let grupos = []
    for (let i = 0; i < binario.length; i += 4) {
      grupos.push(binario.slice(i, i + 4))
    }

    let pesos = [8, 4, 2, 1]
    let valoresHexadecimais = []
    let detalhes = []

    grupos.forEach((grupo) => {
      let soma = 0
      let detalhesGrupo = []
      for (let i = 0; i < grupo.length; i++) {
        const bit = parseInt(grupo[i])
        const valor = bit * pesos[i]
        soma += valor
        detalhesGrupo.push(`${bit}×${pesos[i]}`)
      }
      valoresHexadecimais.push(soma.toString(16).toUpperCase())
      detalhes.push(`${grupo} → ${detalhesGrupo.join(" + ")} = ${soma}`)
    })

    let resultadoHex = `0x${valoresHexadecimais.join("")}`
    return (
      `<span style="color: yellow; font-weight: bold;">SEGUNDA FORMA: Binário para Hexadecimal</span><br>` +
      `<span style="color: green; font-weight: bold;">Passo 1: Separar em grupos de 4 bits</span><br>${grupos.join(
        " - "
      )}<br><br>` +
      `<span style="color: green; font-weight: bold;">Passo 2: Associar os pesos (8421) e calcular os valores decimais</span><br>` +
      detalhes.join("<br>") +
      `<br><br>Passo 3: Juntar os valores<br><span style="color: red; font-weight: bold;">Lemos: </span><span style="color: white; font-weight: bold;">${resultadoHex}</span>`
    )
  }

  // Função para calcular octal (primeira forma)
  function calcularOctalPrimeiraForma(binario) {
    let resultadoDecimal = calcularDecimal(binario)
    let decimal = resultadoDecimal.soma
    let passosBinarioParaDecimal = `<span style="color: green; font-weight: bold;">Passo 1: Converter de binário para decimal</span><br>${resultadoDecimal.expressao}`

    let passosOctal = []
    let restoArray = []
    let quociente = decimal

    passosOctal.push(
      `<span style="color: green; font-weight: bold;">Passo 2: Converter de decimal para octal</span>`
    )

    while (quociente >= 8) {
      let novoQuociente = Math.floor(quociente / 8)
      let resto = quociente % 8
      passosOctal.push(
        `${quociente} ÷ 8 = ${novoQuociente} (quociente) → (8x${novoQuociente}) = ${
          novoQuociente * 8
        } - ${quociente} = ${resto} (resto)`
      )
      restoArray.push(resto)
      quociente = novoQuociente
    }

    restoArray.push(quociente)
    passosOctal.push(`Último quociente (${quociente}) → Primeiro dígito`)
    passosOctal.push(
      "Observamos que a ordem que vai ficar começa por baixo (o último quociente) e vai até o resto (subindo)."
    )

    let resultadoOctal = restoArray.reverse().join("")
    passosOctal.push(
      `<span style="color: red; font-weight: bold;">Lemos: </span><span style="color: white; font-weight: bold;">${resultadoOctal}<span style="font-size: 60%; vertical-align: bottom;">8</span></span>`
    )

    return `<span style="color: #0066cc; font-weight: bold;">PRIMEIRA FORMA: Binário para Decimal para Octal</span><br>${passosBinarioParaDecimal}<br><br>${passosOctal.join("<br>")}`
  }

  // Função para calcular octal (segunda forma)
  function calcularOctalSegundaForma(binario) {
    if (binario.length % 3 !== 0) {
      binario = binario.padStart(Math.ceil(binario.length / 3) * 3, "0")
    }

    let grupos = []
    for (let i = 0; i < binario.length; i += 3) {
      grupos.push(binario.slice(i, i + 3))
    }

    let pesos = [4, 2, 1]
    let valoresOctais = []
    let detalhes = []

    grupos.forEach((grupo) => {
      let soma = 0
      let detalhesGrupo = []
      for (let i = 0; i < grupo.length; i++) {
        const bit = parseInt(grupo[i])
        const valor = bit * pesos[i]
        soma += valor
        detalhesGrupo.push(`${bit}×${pesos[i]}`)
      }
      valoresOctais.push(soma.toString())
      detalhes.push(`${grupo} → ${detalhesGrupo.join(" + ")} = ${soma}`)
    })

    let resultadoOctal = valoresOctais.join("")
    return (
      `<span style="color: yellow; font-weight: bold;">SEGUNDA FORMA: Binário para Octal</span><br>` +
      `<span style="color: green; font-weight: bold;">Passo 1: Separar em grupos de 3 bits</span><br>${grupos.join(
        " - "
      )}<br><br>` +
      `<span style="color: green; font-weight: bold;">Passo 2: Associar os pesos (421) e calcular os valores decimais</span><br>` +
      detalhes.join("<br>") +
      `<br><br>Passo 3: Juntar os valores<br><span style="color: red; font-weight: bold;">Lemos: </span><span style="color: white; font-weight: bold;">${resultadoOctal}<span style="font-size: 60%; vertical-align: bottom;">8</span></span>`
    )
  }

  // Função para obter a opção selecionada
  function obterOpcaoSelecionada() {
    return Array.from(checkboxes).find((chk) => chk.checked)
  }

  // Função principal de confirmação
  function confirmarNumero() {
    const binarioParaCalcular = getBinaryNumber()

    if (!binarioParaCalcular) {
      alert("Primeiro, digite um número binário ou clique em SORTEAR!")
      return
    }

    let checkedOption = obterOpcaoSelecionada()
    if (!checkedOption) {
      alert("Selecione um tipo de conversão!")
      return
    }

    let respostaUsuario = inputBinario.value.trim()
    let respostaEsperada = ""
    let calculo = ""
    let respostaLimpa = ""

    if (
      checkedOption.nextSibling.textContent.includes("Binário para Decimal")
    ) {
      let resultadoDecimal = calcularDecimal(binarioParaCalcular)
      respostaEsperada = resultadoDecimal.soma.toString()
      respostaLimpa = respostaEsperada
      calculo = resultadoDecimal.expressao
    } else if (
      checkedOption.nextSibling.textContent.includes("Binário para Hexadecimal")
    ) {
      let primeiraForma = calcularHexadecimalPrimeiraForma(binarioParaCalcular)
      let segundaForma = calcularHexadecimalSegundaForma(binarioParaCalcular)
      let resultadoHex = parseInt(binarioParaCalcular, 2)
        .toString(16)
        .toUpperCase()
      respostaEsperada = "0x" + resultadoHex
      respostaLimpa = resultadoHex
      calculo = `${primeiraForma}<br><br>${segundaForma}`
    } else if (
      checkedOption.nextSibling.textContent.includes("Binário para Octal")
    ) {
      let primeiraForma = calcularOctalPrimeiraForma(binarioParaCalcular)
      let segundaForma = calcularOctalSegundaForma(binarioParaCalcular)
      let resultadoOctal = parseInt(binarioParaCalcular, 2).toString(8)
      respostaEsperada = resultadoOctal
      respostaLimpa = resultadoOctal
      calculo = `${primeiraForma}<br><br>${segundaForma}`
    }

    let respostaCorreta = false

    if (
      checkedOption.nextSibling.textContent.includes("Binário para Hexadecimal")
    ) {
      respostaCorreta =
        respostaUsuario === respostaLimpa ||
        respostaUsuario === "0x" + respostaLimpa
    } else {
      respostaCorreta = respostaUsuario === respostaLimpa
    }

    if (respostaCorreta) {
      inputBinario.style.backgroundColor = "green"
    } else {
      inputBinario.style.backgroundColor = "red"
      setTimeout(() => (inputBinario.style.backgroundColor = ""), 3000)
    }

    labelResposta.innerHTML = `Resposta: ${respostaEsperada}`
    labelCalculo.innerHTML = `<span style="color: rgb(0, 255, 255); font-weight: bold;">CÁLCULO:</span><br>${calculo}`
  }

  // Função para limpar tudo
  function Apagartudo() {
    inputBinario.value = ""
    inputBinario.style.backgroundColor = ""
    resultInput.value = ""
    numeroBinario = null
    labelResposta.innerHTML = "Resposta:"
    labelCalculo.innerHTML = ""
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false
    })
  }

  // Event listeners
  document.getElementById("limpar-btn").addEventListener("click", Apagartudo)

  // Expor funções para o escopo global
  window.sortearNumero = sortearNumero
  window.confirmarNumero = confirmarNumero
  window.Apagartudo = Apagartudo
})
