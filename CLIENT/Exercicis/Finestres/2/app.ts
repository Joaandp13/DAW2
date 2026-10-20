function informacio(): string {
  const isMobile = (): boolean => {
    const nav = navigator as any;
    if (nav.userAgentData?.mobile !== undefined) {
      return nav.userAgentData.mobile;
    }
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const getOS = (): string => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Win")) return "Windows";
    if (userAgent.includes("Mac")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("like Mac")) return "iOS";
    return "Desconegut";
  };

  return `
    <h3>Informació sobre la pantalla</h3>
    <ul>
      <li><strong>Amplada:</strong> ${window.screen.width}px</li>
      <li><strong>Alçada:</strong> ${window.screen.height}px</li>
      <li><strong>Amplada disponible:</strong> ${window.screen.availWidth}px</li>
      <li><strong>Alçada disponible:</strong> ${window.screen.availHeight}px</li>
    </ul>

    <h3>Informació sobre el navegador</h3>
    <ul>
      <li><strong>User agent:</strong> ${navigator.userAgent}</li>
      <li><strong>Mobile device:</strong> ${isMobile() ? 'Sí' : 'No'}</li>
      <li><strong>Operating system:</strong> ${getOS()}</li>
      <li><strong>Browser language:</strong> ${navigator.language}</li>
    </ul>

    <h3>Informació sobre la URL actual</h3>
    <ul>
      <li><strong>Hash:</strong> ${window.location.hash || '<i>(buit)</i>'}</li>
      <li><strong>Host:</strong> ${window.location.host}</li>
      <li><strong>Hostname:</strong> ${window.location.hostname}</li>
      <li><strong>Href:</strong> ${window.location.href}</li>
      <li><strong>Origin:</strong> ${window.location.origin}</li>
      <li><strong>Pathname:</strong> ${window.location.pathname}</li>
      <li><strong>Port:</strong> ${window.location.port || '<i>(predeterminat)</i>'}</li>
      <li><strong>Protocol:</strong> ${window.location.protocol}</li>
      <li><strong>Search:</strong> ${window.location.search || '<i>(buit)</i>'}</li>
    </ul>
  `;
}

function setFrame(url: string, f: HTMLIFrameElement): void {
  try {
    if (!url || url.trim() === "") {
      const frameDoc = f.contentDocument || f.contentWindow?.document;
      
      if (!frameDoc) {
        throw new Error("No s'ha pogut accedir al document de l'iframe.");
      }

      frameDoc.open();
      frameDoc.write(`
        <!DOCTYPE html>
        <html lang="ca">
        <head><meta charset="UTF-8"></head>
        <body>${informacio()}</body>
        </html>
      `);
      frameDoc.close();
    } else {
      f.src = url;
    }
  } catch (error: any) {
    alert(`Error en carregar el marc: ${error.message || error}`);
  }
}

// Event Listeners al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  // 1. Cargar información en el <div id="div">
  const divInfo = document.getElementById("div");
  if (divInfo) {
    divInfo.innerHTML = informacio();
  }

  // 2. Configurar el evento del botón "Marc"
  const btnMarc = document.getElementById("btnMarc");
  const inputUrl = document.getElementById("urlInput") as HTMLInputElement;
  const frame = document.getElementById("meuFrame") as HTMLIFrameElement;

  if (btnMarc && inputUrl && frame) {
    btnMarc.addEventListener("click", () => {
      setFrame(inputUrl.value, frame);
    });
  }
});