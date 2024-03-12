const mammoth = require('mammoth');

const fileInput = document.getElementById('file-input');
const documentContainer = document.getElementById('document-container');

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    readWordDocument(file);
  } else {
    alert('Please select a Word document (.docx)');
  }
});

function readWordDocument(file) {
  mammoth.convertToHtml({ path: file.path })
    .then((result) => {
      documentContainer.innerHTML = result.value;
    })
    .catch((error) => {
      console.error(error);
    });
}