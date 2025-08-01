

export function showStatusMessage(status: number, statusMessage:string, type: "error" | "warning" | "success") {
  const statusText = document.getElementById("statusText");
  const statusMessageElement = document.getElementById("statusMessage");
  const statusAlert = document.getElementById("status-container");

  if (statusText && statusMessageElement && statusAlert) {
    statusText.textContent = status > 500 ? "Server Error" : "Client Error";
    statusMessageElement.textContent = statusMessage;

    switch (type) {
      case "error":
        statusAlert.classList.remove("status-warning");
        statusAlert.classList.remove("status-success");
        statusAlert.classList.add("status-error");
        break;
      case "warning":
    statusAlert.classList.remove("status-error");
        statusAlert.classList.remove("status-success");
        statusAlert.classList.add("status-warning");
        break;
      case "success":
        statusAlert.classList.remove("status-warning");
        statusAlert.classList.remove("status-error");
        statusAlert.classList.add("status-success");
        break;
    }

    statusAlert.classList.remove("hidden");
  }else{
    throw new Error("Status elements not found in the DOM");
  }
}