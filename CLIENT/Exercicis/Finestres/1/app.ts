function informacio(): string {
  // 1. Detecció de si és un dispositiu mòbil
  const isMobile = (): boolean => {
    const nav = navigator as any;
    if (nav.userAgentData?.mobile !== undefined) {
      return nav.userAgentData.mobile;
    }
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // 2. Detecció bàsica del sistema operatiu
  const getOS = (): string => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Win")) return "Windows";
    if (userAgent.includes("Mac")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("like Mac")) return "iOS";
    return "Desconegut";
  };

  // 3. Construcció de l'HTML
  return `
Informació sobre la pantalla
Amplada: ${window.screen.width}px
Alçada: ${window.screen.height}px
Amplada disponible: ${window.screen.availWidth}px
Alçada disponible: ${window.screen.availHeight}px

Informació sobre el navegador
User agent: ${navigator.userAgent}
Mobile device: ${isMobile() ? 'Sí' : 'No'}
Operating system: ${getOS()}
Browser language: ${navigator.language}

Informació sobre la URL actual
Hash: ${window.location.hash || '(buit)'}
Host: ${window.location.host}
Hostname: ${window.location.hostname}
Href: ${window.location.href}
Origin: ${window.location.origin}
Pathname: ${window.location.pathname}
Port: ${window.location.port || '(predeterminat)'}
Protocol: ${window.location.protocol}
Search: ${window.location.search || '(buit)'}
  `;
}

// 4. Inserció en el DOM (en el div amb id="div")
window.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("div");
  
  if (contenedor) {
    contenedor.innerHTML = informacio();
  } else {
    console.error("No s'ha trobat cap element amb id='div'");
  }
});