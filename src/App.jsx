import { useRef, useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [values, setValues] = useState(Array(6).fill(""));
  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef([]);

  const handleInputChange = (index, event) => {
    const inputValue = event.target.value;
    const updatedInputValues = [...values];
    const updatedInputErrors = [...errors];

    //if previous inputs are empty, highlight error
    for (let i = 0; i < index; i++) {
      if (updatedInputValues[i] === "") {
        updatedInputErrors[i] = true;
      }
    }

    updatedInputValues[index] = inputValue;
    setValues(updatedInputValues);

    //highlight error if input is not number
    if (/^\d*$/.test(inputValue)) {
      updatedInputErrors[index] = false;
      setErrors(updatedInputErrors);
    } else {
      updatedInputErrors[index] = true;
      setErrors(updatedInputErrors);
    }

    //focus on next input after entering value
    if (inputValue && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handlePaste = (event) => {
    //prevent default behavior of paste so that it wouldn't try to paste all in one input
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text");
    //only paste if valid numbers of length 6, check
    if (/^\d{6}$/.test(pastedData)) {
      const updatedInputValues = pastedData.split("");
      const updatedInputErrors = Array(6).fill(false);

      setValues(updatedInputValues);
      setErrors(updatedInputErrors);
      inputRef.current[5].focus();
    } else {
      setErrorMessage("Invalid Verification Code!");
    }
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const code = values.join("");
    try {
      const response = await fetch(`${API_URL}/api/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        navigate("/success");
      } else {
        setErrorMessage(data.error);
      }
    } catch (error) {
      setErrorMessage("Something went wrong on the server.");
    }
  };

  return (
    <div className="main-container">
      <h1 className="heading">Verification Code:</h1>
      <div className="verification-inputs" onPaste={handlePaste}>
        {values.map((value, index) => (
          <input
            key={index}
            ref={(el) => (inputRef.current[index] = el)}
            type="text"
            maxLength="1"
            value={value}
            onChange={(event) => handleInputChange(index, event)}
            className={
              errors[index]
                ? "verification-input error-highlight"
                : "verification-input"
            }
          />
        ))}
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button className="button" onClick={handleSubmit}>
        SUBMIT
      </button>
    </div>
  );
};

export default App;
