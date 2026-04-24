import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div class="app-container">
  <div class="card">
    <h1>CSV to PDF Converter</h1>
    <p class="subtitle">
      Upload your CSV file and instantly generate a clean, professional PDF.
    </p>

    <div class="actions">
      <input type="file" id="fileInput" accept=".csv" hidden />
      <button id="uploadBtn" class="primary-btn">
        Upload CSV
      </button>
    </div>

    <div id="fileInfo" class="status"></div>

    <button id="convertBtn" class="convert-btn" disabled>
      Convert to PDF
    </button>

    <div id="result" class="status"></div>
  </div>
</div>
`

const uploadBtn = document.querySelector<HTMLButtonElement>('#uploadBtn')!
const fileInput = document.querySelector<HTMLInputElement>('#fileInput')!
const convertBtn = document.querySelector<HTMLButtonElement>('#convertBtn')!
const fileInfo = document.querySelector<HTMLDivElement>('#fileInfo')!
const result = document.querySelector<HTMLDivElement>('#result')!

let selectedFile: File | null = null

uploadBtn.addEventListener('click', () => {
  fileInput.click()
})

fileInput.addEventListener('change', () => {
  if (fileInput.files && fileInput.files.length > 0) {
    selectedFile = fileInput.files[0]
    fileInfo.innerHTML = `✅ Selected file: <strong>${selectedFile.name}</strong>`
    convertBtn.disabled = false
  }
})

convertBtn.addEventListener('click', async () => {
  if (!selectedFile) return

  convertBtn.textContent = "Converting..."
  convertBtn.disabled = true

  const formData = new FormData()
  formData.append("file", selectedFile)

  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) throw new Error("Conversion failed")

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = "converted.pdf"
    document.body.appendChild(a)
    a.click()
    a.remove()

    result.innerHTML = "✅ PDF downloaded successfully!"
  } catch (error) {
    result.innerHTML = "❌ Error converting file."
  }

  convertBtn.textContent = "Convert to PDF"
  convertBtn.disabled = false
})