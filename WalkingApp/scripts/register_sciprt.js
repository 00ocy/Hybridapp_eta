document
  .querySelector(".button-large-register-iNu")
  .addEventListener("click", function () {
    var lastName = document.querySelector(".last-name-32Z").value;
    var firstName = document.querySelector(".first-name-Zf7").value;
    var email = document.querySelector(".email-U9o").value;
    var password = document.querySelector(".password-mYD").value;

    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lastName, firstName, email, password }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  });
