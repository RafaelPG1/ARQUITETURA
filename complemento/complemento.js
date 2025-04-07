document.addEventListener("DOMContentLoaded", function () {
  // Elementos do DOM
  const decimalInput = document.getElementById("decimalInput")
  const binaryInput = document.getElementById("binaryInput")
  const result = document.getElementById("result")
  const calculateBtn = document.getElementById("calculate")
  const clearBtn = document.getElementById("clear-btn")
  const operationButtons = document.querySelectorAll(".operation-btn")
  const padCheckbox = document.getElementById("padTo8Bits")
  const signOptions = document.getElementById("signOptions")

  // Estado da aplicação
  let selectedOperation = null

  // Selecionar operação
  operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      operationButtons.forEach((btn) => {
        btn.classList.remove("active")
        btn.style.backgroundColor = "#333"
      })

      if (selectedOperation === button.dataset.operation) {
        // Deseleciona se clicar novamente
        selectedOperation = null
        signOptions.style.display = "none"
      } else {
        // Seleciona nova operação
        button.classList.add("active")
        button.style.backgroundColor = "#4CAF50"
        selectedOperation = button.dataset.operation

        // Mostra/oculta opções de sinal conforme a operação
        signOptions.style.display =
          selectedOperation === "sinalMagnitude" ? "flex" : "none"
      }
    })
  })

  // Limpar campos
  clearBtn.addEventListener("click", () => {
    decimalInput.value = ""
    binaryInput.value = ""
    result.value = ""
    operationButtons.forEach((btn) => {
      btn.classList.remove("active")
      btn.style.backgroundColor = "#333"
    })
    selectedOperation = null
    signOptions.style.display = "none"
    binaryInput.focus()
  })

  // Operações de complemento
  const complementOperations = {
    complemento1: (binary) => {
      if (!/^[01]+$/.test(binary)) {
        throw new Error("Entrada inválida")
      }
      return binary
        .split("")
        .map((bit) => (bit === "0" ? "1" : "0"))
        .join("")
    },

    complemento2: (binary) => {
      if (!/^[01]+$/.test(binary)) {
        throw new Error("Entrada inválida")
      }

      const comp1 = binary
        .split("")
        .map((bit) => (bit === "0" ? "1" : "0"))
        .join("")

      let carry = 1
      let result = ""

      for (let i = comp1.length - 1; i >= 0; i--) {
        const sum = parseInt(comp1[i]) + carry
        result = (sum % 2) + result
        carry = Math.floor(sum / 2)
      }

      if (carry) {
        result = "1" + result
      }

      return result
    },

    sinalMagnitude: (binary) => {
      if (!/^[01]+$/.test(binary)) {
        throw new Error("Entrada inválida")
      }

      // Verifica qual opção de sinal está selecionada
      const isNegative = document.getElementById("negativeSign").checked

      // Determina o bit de sinal
      const signBit = isNegative ? "1" : "0"

      // Se o número já tiver um bit de sinal (primeiro bit), substitui
      if (binary.length > 0) {
        return signBit + binary.substring(1)
      }

      return signBit
    },
  }

  // Converter decimal para binário
  function decimalToBinary(decimal) {
    const num = parseInt(decimal)
    if (isNaN(num)) {
      throw new Error("Digite um número decimal válido")
    }
    return Math.abs(num).toString(2)
  }

  // Completar com zeros se necessário
  function maybePadBits(binary) {
    if (padCheckbox.checked) {
      return binary.padStart(8, "0")
    }
    return binary
  }

  // Validar entrada binária
  function isValidBinary(bin) {
    return /^[01]+$/.test(bin)
  }

  // Função principal de cálculo
  function calculate() {
    try {
      // Reset de estilos
      result.style.color = "#4caf50"
      binaryInput.style.borderColor = "#444"
      decimalInput.style.borderColor = "#444"

      // Converter decimal para binário se houver entrada
      if (decimalInput.value.trim()) {
        const binary = decimalToBinary(decimalInput.value.trim())
        binaryInput.value = maybePadBits(binary)
      }

      // Validações
      if (!selectedOperation) {
        throw new Error("Selecione uma operação")
      }

      const num = binaryInput.value.trim()

      if (!num) {
        throw new Error("Digite um número binário")
      }

      if (!isValidBinary(num)) {
        throw new Error("Use apenas 0 e 1")
      }

      // Aplica padding se necessário
      const paddedNum = maybePadBits(num)
      binaryInput.value = paddedNum

      // Executa a operação selecionada
      const operationResult = complementOperations[selectedOperation](paddedNum)
      result.value = maybePadBits(operationResult)
    } catch (error) {
      // Tratamento de erros
      result.value = error.message
      result.style.color = "#ff5555"
      if (error.message.includes("decimal")) {
        decimalInput.style.borderColor = "#ff5555"
      } else {
        binaryInput.style.borderColor = "#ff5555"
      }
    }
  }

  // Event Listeners
  calculateBtn.addEventListener("click", calculate)

  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      calculate()
    }
  })

  binaryInput.addEventListener("input", function () {
    if (this.value.trim() === "" || isValidBinary(this.value.trim())) {
      this.style.borderColor = "#444"
    } else {
      this.style.borderColor = "#ff5555"
    }
  })

  decimalInput.addEventListener("input", function () {
    if (this.value.trim() === "" || !isNaN(this.value.trim())) {
      this.style.borderColor = "#444"
    } else {
      this.style.borderColor = "#ff5555"
    }
  })

  // Foco inicial no campo binário
  binaryInput.focus()
})
