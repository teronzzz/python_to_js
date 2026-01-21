// ---- 1. Компиляция текста из поля Python ----
async function transpile() {
    const pythonCode = document.getElementById("pythonCode").value;
    const jsCodeArea = document.getElementById("jsCode");

    if (!pythonCode) {
        jsCodeArea.value = "❌ Нет Python кода!";
        return;
    }

    jsCodeArea.value = "⏳ Компиляция...";

    try {
        const response = await fetch("http://127.0.0.1:5000/transpile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: pythonCode })
        });

        const data = await response.json();

        if (data.error) {
            jsCodeArea.value = "❌ Ошибка:\n" + data.error;
        } else {
            jsCodeArea.value = data.result;
        }

    } catch (err) {
        jsCodeArea.value = "❌ Ошибка соединения с сервером";
    }
}

// ---- 2. Загрузка .py файла в редактор ----
function loadFileToEditor() {
    const input = document.getElementById("fileInput");
    const file = input.files[0];
    const fileNameSpan = document.getElementById("fileName");

    if (!file) {
        fileNameSpan.textContent = "Файл не выбран";
        return;
    }

    fileNameSpan.textContent = file.name;

    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById("pythonCode").value = e.target.result;
    };
    reader.readAsText(file);
}

// ---- 3. Компиляция выбранного файла ----
async function compilePythonFile() {
    const input = document.getElementById("fileInput");
    if (!input.files || input.files.length === 0) {
        alert("Выберите файл для компиляции");
        return;
    }

    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = async function(e) {
        const code = e.target.result;
        document.getElementById("pythonCode").value = code;

        // Отправка на сервер для компиляции
        const jsCodeArea = document.getElementById("jsCode");
        jsCodeArea.value = "⏳ Компиляция файла...";

        try {
            const response = await fetch("http://127.0.0.1:5000/transpile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: code })
            });

            const data = await response.json();

            if (data.error) {
                jsCodeArea.value = "❌ Ошибка:\n" + data.error;
            } else {
                jsCodeArea.value = data.result;
            }

        } catch (err) {
            jsCodeArea.value = "❌ Ошибка соединения с сервером";
        }
    };
    reader.readAsText(file);
}

// ---- 4. Скачивание JS кода ----
function downloadJS() {
    const jsCode = document.getElementById("jsCode").value;

    if (!jsCode) {
        alert("Нет JS кода для сохранения");
        return;
    }

    const blob = new Blob([jsCode], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "output.js";
    a.click();

    URL.revokeObjectURL(url);
}

// ---- 5. Обновление имени выбранного файла ----
function updateFileName() {
    const input = document.getElementById("fileInput");
    const fileNameSpan = document.getElementById("fileName");

    if (input.files.length > 0) {
        fileNameSpan.textContent = input.files[0].name;
    } else {
        fileNameSpan.textContent = "Файл не выбран";
    }
}
