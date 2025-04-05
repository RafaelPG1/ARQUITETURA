document.addEventListener("DOMContentLoaded", function () {
  const binary1 = document.getElementById("binary1")
  const binary2 = document.getElementById("binary2")
  const result = document.getElementById("result")
  const calculateBtn = document.getElementById("calculate")
  const operationButtons = document.querySelectorAll(".operation-btn")
  const clearBtn = document.getElementById("clear-result")

  let selectedOperation = null

  // Selecionar/deselecionar operação
  operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const operation = button.dataset.operation

      // Se clicou na operação já selecionada, deseleciona
      if (selectedOperation === operation) {
        button.classList.remove("active")
        button.style.backgroundColor = "#333333"
        selectedOperation = null
      }
      // Se selecionou outra operação
      else {
        operationButtons.forEach((btn) => {
          btn.classList.remove("active")
          btn.style.backgroundColor = "#333333"
        })
        button.classList.add("active")
        button.style.backgroundColor = "#4CAF50"
        selectedOperation = operation
      }
    })
  })

  // Botão de limpar (×)
  clearBtn.addEventListener("click", function () {
    // Limpa todos os campos
    result.value = ""
    binary1.value = ""
    binary2.value = ""

    // Desativa a operação selecionada
    operationButtons.forEach((btn) => {
      btn.classList.remove("active")
      btn.style.backgroundColor = "#333333"
    })
    selectedOperation = null
  })

  // Funções de operação binária
  const binaryOperations = {
    add: (a, b) => {
      let result = ""
      let carry = 0
      const maxLength = Math.max(a.length, b.length)

      a = a.padStart(maxLength, "0")
      b = b.padStart(maxLength, "0")

      for (let i = maxLength - 1; i >= 0; i--) {
        const sum = parseInt(a[i]) + parseInt(b[i]) + carry
        result = (sum % 2) + result
        carry = Math.floor(sum / 2)
      }

      return (carry ? "1" : "") + result
    },

    sub: (a, b) => {
      const maxLength = Math.max(a.length, b.length) + 1
      a = a.padStart(maxLength, "0")
      b = b.padStart(maxLength, "0")

      let result = ""
      let borrow = 0

      for (let i = maxLength - 1; i >= 0; i--) {
        let bitA = parseInt(a[i]) - borrow
        const bitB = parseInt(b[i])

        if (bitA < bitB) {
          result = bitA + 2 - bitB + result
          borrow = 1
        } else {
          result = bitA - bitB + result
          borrow = 0
        }
      }

      return result.replace(/^0+/, "") || "0"
    },

    mul: (a, b) => {
      let result = "0"
      let shift = ""

      for (let i = b.length - 1; i >= 0; i--) {
        if (b[i] === "1") {
          result = binaryOperations.add(result, a + shift)
        }
        shift += "0"
      }

      return result
    },

    div: (a, b) => {
      if (b === "0") return "Erro: Divisão por zero"

      let remainder = ""
      let quotient = ""

      for (let i = 0; i < a.length; i++) {
        remainder += a[i]
        remainder = remainder.replace(/^0+/, "") || "0"

        if (binaryCompare(remainder, b) >= 0) {
          quotient += "1"
          remainder = binaryOperations.sub(remainder, b)
        } else {
          quotient += "0"
        }
      }

      return quotient.replace(/^0+/, "") || "0"
    },
  }

  // Funções auxiliares
  function binaryCompare(a, b) {
    a = a.replace(/^0+/, "") || "0"
    b = b.replace(/^0+/, "") || "0"

    if (a.length > b.length) return 1
    if (a.length < b.length) return -1

    for (let i = 0; i < a.length; i++) {
      if (a[i] > b[i]) return 1
      if (a[i] < b[i]) return -1
    }

    return 0
  }

  function isValidBinary(bin) {
    return /^[01]+$/.test(bin)
  }

  // Calcular
  calculateBtn.addEventListener("click", () => {
    if (!selectedOperation) {
      result.value = "Selecione uma operação"
      return
    }

    const num1 = binary1.value.trim()
    const num2 = binary2.value.trim()

    if (!num1 || !num2) {
      result.value = "Preencha ambos os campos"
      return
    }

    if (!isValidBinary(num1) || !isValidBinary(num2)) {
      result.value = "Use apenas 0 e 1"
      return
    }

    try {
      result.value = binaryOperations[selectedOperation](num1, num2)
    } catch (error) {
      result.value = "Erro no cálculo"
      console.error(error)
    }
  })

  // Validação em tempo real
  ;[binary1, binary2].forEach((input) => {
    input.addEventListener("input", function () {
      if (!isValidBinary(this.value.trim())) {
        this.style.borderColor = "#f00"
      } else {
        this.style.borderColor = "#444"
      }
    })
  })

  // Event listener para tecla Enter - Versão corrigida
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.keyCode === 13) {
      event.preventDefault() // Evita comportamento padrão

      // Foca no próximo campo se ainda não tiver operação selecionada
      if (!selectedOperation) {
        if (event.target === binary1) {
          binary2.focus()
        } else if (event.target === binary2) {
          // Se estiver no binary2 sem operação, mostra mensagem
          result.value = "Selecione uma operação"
        }
        return
      }

      // Se tiver operação selecionada, calcula
      calculateBtn.click()
    }
  })
})
