
export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-sotero-green to-sotero-green-light border-t mt-auto shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <img 
              src="/lovable-uploads/bb91b581-7de6-47fa-a14f-a64304b8b3d3.png" 
              alt="UniJorge" 
              className="h-12"
            />
            <img 
              src="/lovable-uploads/e6d812d0-e170-42d8-a965-1a8961d7b294.png" 
              alt="NITE" 
              className="h-12"
            />
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-white/90 mb-1 drop-shadow-sm">
              Projeto acadêmico desenvolvido por estudantes da UniJorge
            </p>
            <p className="text-sm text-white/90 mb-1 drop-shadow-sm">
              em parceria com a Sotero Ambiental
            </p>
            <p className="text-sm text-white/80 drop-shadow-sm">
              Contato: contato@soteroambiental.com.br
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
