const whatsappUrl =
  "https://api.whatsapp.com/send?phone=573005687950&text=Hola%20Barrios%20Valencia%20Abogados,%20quiero%20asesor%C3%ADa.";

export function WhatsappBubble() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50 focus-visible:outline-none"
      aria-label="Iniciar conversación por WhatsApp"
    >
      <span className="sr-only">Escríbenos por WhatsApp</span>
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 opacity-75" aria-hidden />
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#0B1220]/20 transition hover:scale-105 focus-visible:ring-4 focus-visible:ring-[#25D366]/40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          viewBox="0 0 24 24"
          fill="currentColor"
          role="img"
          aria-hidden
        >
          <path d="M12.04 2C6.58 2 2.18 6.32 2.18 11.69c0 2.01.67 3.87 1.82 5.39L2 22l4.97-1.58a10.21 10.21 0 0 0 5.07 1.34c5.46 0 9.86-4.32 9.86-9.69C21.9 6.32 17.5 2 12.04 2Zm0 17.54c-1.65 0-3.19-.48-4.48-1.3l-.32-.2-2.95.94.96-2.81-.21-.29a7.48 7.48 0 0 1-1.4-4.33c0-4.21 3.5-7.64 7.8-7.64 4.3 0 7.8 3.43 7.8 7.64s-3.5 7.65-7.8 7.65Zm4.19-5.59c-.23-.12-1.35-.67-1.56-.75-.21-.09-.36-.12-.5.12-.15.23-.58.75-.71.91-.13.15-.26.17-.49.06-.23-.12-.95-.35-1.81-1.13-.67-.6-1.12-1.34-1.24-1.56-.13-.23-.01-.35.1-.46.1-.1.23-.27.35-.4.12-.15.16-.23.24-.38.08-.15.04-.29-.02-.41-.06-.12-.5-1.19-.69-1.63-.18-.44-.37-.38-.5-.38h-.43c-.15 0-.4.06-.61.29-.21.23-.81.79-.81 1.92 0 1.12.83 2.2.95 2.35.12.15 1.62 2.6 3.93 3.53.55.24.98.38 1.32.49.55.17 1.05.15 1.45.09.44-.06 1.35-.55 1.54-1.09.19-.54.19-1 .13-1.09-.06-.09-.21-.15-.44-.27Z" />
        </svg>
      </span>
    </a>
  );
}
