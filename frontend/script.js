async function transpile() {
    const pythonCode = document.getElementById("pythonCode").value;
    const jsCodeArea = document.getElementById("jsCode");

    jsCodeArea.value = "⏳ Компиляция...";

    try {
        const response = await fetch("http://localhost:5000/transpile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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
