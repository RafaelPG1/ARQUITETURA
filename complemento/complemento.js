document.addEventListener("DOMContentLoaded", function () {
  const binaryInput = document.getElementById("binaryInput")
  const result = document.getElementById("result")
  const calculateBtn = document.getElementById("calculate")
  const clearBtn = document.getElementById("clear-btn")
  const operationButtons = document.querySelectorAll(".operation-btn")
  const padCheckbox = document.getElementById("padTo8Bits")

  let selectedOperation = null

  // Selecionar operação
  operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      operationButtons.forEach((btn) => {
        btn.classList.remove("active")
        btn.style.backgroundColor = "#333"
      })

      if (selectedOperation === button.dataset.operation) {
        selectedOperation = null
      } else {
        button.classList.add("active")
        button.style.backgroundColor = "#4CAF50"
        selectedOperation = button.dataset.operation
      }
    })
  })

  // Limpar campos
  clearBtn.addEventListener("click", () => {
    binaryInput.value = ""
    result.value = ""
    operationButtons.forEach((btn) => {
      btn.classList.remove("active")
      btn.style.backgroundColor = "#333"
    })
    selectedOperation = null
    binaryInput.focus()
  })

  // Funções de complemento
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
      result.style.color = "#4CAF50"
      binaryInput.style.borderColor = "#444"

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

      const paddedNum = maybePadBits(num)
      binaryInput.value = paddedNum

      const operationResult = complementOperations[selectedOperation](paddedNum)
      result.value = maybePadBits(operationResult)
    } catch (error) {
      result.value = error.message
      result.style.color = "#ff5555"
      binaryInput.style.borderColor = "#ff5555"
    }
  }

  // Event listeners
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

  binaryInput.focus()
})
