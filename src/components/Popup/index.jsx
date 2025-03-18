import React from "react";

export function Popup() {
  //const [mensagem, setMensagem] = useState("Clique no botão!");

  return (
    <div style={{ width: 200, padding: 10 }}>
      <h2>Olá, mundo! 🚀</h2>
      <button onClick={() => alert("alo")}>
        Clique Aqui
      </button>
    </div>
  );
}