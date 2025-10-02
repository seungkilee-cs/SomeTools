const fileInput = document.getElementById("fileInput");
const convertButton = document.getElementById("convertButton");
const fileListDiv = document.getElementById("fileList");

fileInput.addEventListener("change", function () {
  convertButton.disabled = fileInput.files.length === 0;
  updateFileList();
});

function updateFileList() {
  fileListDiv.innerHTML = "";

  const files = fileInput.files;
  const fileCount = files.length;

  if (fileCount > 0) {
    const fileListHeading = document.createElement("h2");
    fileListHeading.textContent = "Selected Files:";
    fileListDiv.appendChild(fileListHeading);

    const fileList = document.createElement("ul");

    for (let i = 0; i < fileCount; i++) {
      const file = files[i];
      const listItem = document.createElement("li");
      listItem.textContent = file.name;
      fileList.appendChild(listItem);
    }

    fileListDiv.appendChild(fileList);

    const fileCountText = document.createElement("p");
    fileCountText.textContent = `Total Files: ${fileCount}`;
    fileListDiv.appendChild(fileCountText);
  }
}

function convertFiles() {
  const files = fileInput.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = function (event) {
      const contents = event.target.result;
      const convertedContents = convertEncoding(contents);

      const convertedFile = new File(
        [convertedContents],
        addSuffixToFileName(file.name, "utf8"),
        { type: file.type }
      );
      downloadFile(convertedFile);
    };

    reader.readAsArrayBuffer(file);
  }
}

function convertEncoding(contents) {
  // Convert from EUC-KR to UTF-8
  const decoder = new TextDecoder("euc-kr");
  const encoder = new TextEncoder();

  const decodedData = decoder.decode(new Uint8Array(contents));
  const encodedData = encoder.encode(decodedData);

  return encodedData;
}

function addSuffixToFileName(fileName, suffix) {
  const dotIndex = fileName.lastIndexOf(".");
  const fileNameWithoutExt = fileName.substring(0, dotIndex);
  const fileExt = fileName.substring(dotIndex);

  return `${fileNameWithoutExt}.${suffix}${fileExt}`;
}

function downloadFile(file) {
  downloadLink.href = URL.createObjectURL(file);
  downloadLink.download = file.name;
  downloadLink.click();
}
