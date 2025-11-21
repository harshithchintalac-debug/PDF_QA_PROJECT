import React, { useState } from "react";

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerType, setAnswerType] = useState(null); // "answer" | "error" | null
  const [loading, setLoading] = useState(false);

  // Handle PDF file selection
  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  // Upload PDF to backend
  const handleUpload = async () => {
    if (!pdfFile) {
      alert("Please select a PDF file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfFile);

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/upload_pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || "PDF uploaded successfully!");
      } else {
        console.error("Upload error:", data);
        alert(data.error || "Failed to upload PDF. Check console for details.");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to upload PDF. Check console for details.");
    }
    setLoading(false);
  };

  // Ask a question about the uploaded PDF
  const handleAsk = async () => {
    if (!question.trim()) {
      alert("Please enter a question!");
      return;
    }

    setLoading(true);
    setAnswer("");
    setAnswerType(null);

    try {
      const response = await fetch("http://localhost:8000/ask_question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) {
        // backend returned non-2xx
        console.error("Ask error:", data);
        setAnswer(data.error || "Failed to get answer from backend.");
        setAnswerType("error");
      } else if (data.error) {
        // backend returned an application-level error
        setAnswer(data.error);
        setAnswerType("error");
      } else if (data.answer) {
        setAnswer(data.answer);
        setAnswerType("answer");
      } else {
        // fallback
        setAnswer("No answer received.");
        setAnswerType("error");
      }
    } catch (error) {
      console.error("Error asking question:", error);
      setAnswer("Failed to get answer from backend.");
      setAnswerType("error");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📄 PDF Q&A System</h1>

      <div style={styles.section}>
        <h3>Step 1: Upload your PDF</h3>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      </div>

      <div style={styles.section}>
        <h3>Step 2: Ask a Question</h3>
        <input
          type="text"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleAsk} disabled={loading}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      {answer && (
        <div
          style={{
            ...styles.answerBox,
            border: answerType === "error" ? "1px solid #ef4444" : "1px solid #10b981",
            backgroundColor: answerType === "error" ? "#fff1f2" : "#f3f4f6",
          }}
        >
          <h3 style={{ color: answerType === "error" ? "#991b1b" : "#065f46" }}>
            {answerType === "error" ? "Error:" : "Answer:"}
          </h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "40px",
    maxWidth: "600px",
    margin: "auto",
    textAlign: "center",
  },
  title: {
    color: "#1f2937",
  },
  section: {
    marginBottom: "30px",
  },
  input: {
    padding: "8px",
    width: "80%",
    marginRight: "10px",
  },
  answerBox: {
    borderRadius: "8px",
    padding: "20px",
    textAlign: "left",
  },
};

export default App;