import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

function App() {
  const [signupImage, setSignupImage] = useState(null);
  const [signinImage, setSigninImage] = useState(null);
  const [loginStatus, setLoginStatus] = useState("");
  const webcamRef = useRef(null);

  const handleSignup = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", signupImage);

    fetch("http://localhost:8000/signup", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  const handleSignin = (event) => {
    event.preventDefault();
    const pictureSrc = webcamRef.current.getScreenshot();
    const blob = dataURLtoBlob(pictureSrc);
    const file = new File([blob], "signinImage.jpeg", { type: "image/jpeg" });
    setSigninImage(file);

    const formData = new FormData();
    formData.append("image", file);

    fetch("http://localhost:8000/signin", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const verified = data.verified;
        if (verified) {
          setLoginStatus("Login successful");
        } else {
          setLoginStatus("Login failed");
        }
      })
      .catch((error) => console.error(error));
  };

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="App">
      <h1>Face Recognition Login</h1>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="file"
          accept="image/*"
          required
          onChange={(e) => setSignupImage(e.target.files[0])}
        />
        <button type="submit">Sign Up</button>
      </form>
      <h2>Sign In</h2>
      <form onSubmit={handleSignin}>
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
        <button type="submit">Sign In</button>
      </form>
      {loginStatus && <p>{loginStatus}</p>}
    </div>
  );
}

export default App;
