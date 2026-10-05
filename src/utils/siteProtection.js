export function enableSiteProtection() {
  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();

    if (
      key === "f12" ||
      (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key)) ||
      (event.ctrlKey && key === "u")
    ) {
      event.preventDefault();
    }
  };

  document.addEventListener("contextmenu", handleContextMenu);
  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("contextmenu", handleContextMenu);
    document.removeEventListener("keydown", handleKeyDown);
  };
}