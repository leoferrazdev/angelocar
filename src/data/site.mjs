export const SITE = {
  brandName: 'Ângelo Car Oficina Mecânica',
  shortName: 'Ângelo Car',
  legalName: 'ANGELO RICARDO BARBOZA PEREIRA - ME',
  cnpj: '15.048.987/0001-91',
  domain: 'https://angelocar.com.br',
  email: 'angelocarapp@gmail.com',
  phoneDisplay: '(51) 98428-1009',
  phoneHref: '+5551984281009',
  landlineDisplay: '(51) 3241-7954',
  landlineHref: '+555132417954',
  whatsappNumber: '5551984281009',
  address: {
    street: 'Av. Vicente Monteggia, 333',
    neighborhood: 'Cavalhada',
    city: 'Porto Alegre',
    state: 'RS',
    postalCode: '91740-290',
    country: 'BR',
    full: 'Av. Vicente Monteggia, 333 - Cavalhada, Porto Alegre - RS, 91740-290'
  },
  geo: {
    latitude: -30.0979562,
    longitude: -51.2252153,
    plusCode: 'WQ2F+RW Porto Alegre, RS'
  },
  hours: {
    workshopLabel: 'Todos os dias, das 08h às 19h (atendimento por ordem de chegada)',
    emergencyLabel: 'Plantão Socorro Mecânico Móvel 24 horas (inclusive madrugada)',
    airConditioningLabel: 'Segunda a Sexta 08h–18h30 | Sábado 08h–13h'
  },
  gbp: {
    mapsUrl: 'https://www.google.com/maps/place/%C3%82ngelo+Car+Oficina+Mec%C3%A2nica/@-30.0979562,-51.2252153,17z/data=!4m6!3m5!1s0x9519826099897c97:0x7358932e52d741fb!8m2!3d-30.0979562!4d-51.2252153!16s%2Fg%2F11bw51cyb0?hl=pt-BR',
    reviewUrl: 'https://g.page/r/CftB11Iuk1hzEBM/review',
    embedUrl: 'https://www.google.com/maps?q=Av.+Vicente+Monteggia,+333,+Cavalhada,+Porto+Alegre,+RS&hl=pt-BR&z=16&output=embed',
    ratingValue: '4.1',
    reviewCount: 267
  },
  neighborhoods: [
    'Cavalhada',
    'Tristeza',
    'Camaquã',
    'Ipanema',
    'Cristal',
    'Nonoai',
    'Vila Nova',
    'Teresópolis',
    'Vila Assunção',
    'Pedra Redonda',
    'Hípica',
    'Restinga',
    'Menino Deus',
    'Azenha',
    'Centro Histórico'
  ],
  reviews: [
    {
      author: 'Cliente verificado no Google',
      service: 'Socorro Mecânico 24h',
      text: 'Meu carro parou na Zona Sul fora do horário comercial e o atendimento da Ângelo Car foi muito rápido. Resolveram o problema no local e explicaram tudo com transparência.'
    },
    {
      author: 'Cliente verificado no Google',
      service: 'Ar-Condicionado Automotivo',
      text: 'Fiz a recarga de gás e o reparo de um vazamento no ar-condicionado. O carro voltou a gelar no mesmo dia, preço justo e atendimento direto com quem entende.'
    },
    {
      author: 'Cliente verificado no Google',
      service: 'Oficina Mecânica na Cavalhada',
      text: 'Oficina de confiança na Av. Vicente Monteggia. Passaram o scanner, mostraram exatamente a peça com defeito e não tentaram empurrar serviço desnecessário.'
    }
  ],
  gallery: [
    {
      src: '/assets/img/fachada-angelo-car-4x3.webp',
      width: 960,
      height: 720,
      alt: 'Fachada da Ângelo Car Oficina Mecânica na Av. Vicente Monteggia, 333 na Cavalhada, Porto Alegre',
      caption: 'Fachada oficial — Av. Vicente Monteggia, 333 (Cavalhada)'
    },
    {
      src: '/assets/img/interior-elevadores-oficina.webp',
      width: 960,
      height: 720,
      alt: 'Interior da oficina mecânica Ângelo Car com elevadores automotivos em Porto Alegre',
      caption: 'Estrutura com elevadores automotivos para manutenção rápida e segura'
    },
    {
      src: '/assets/img/rampa-acesso-oficina.webp',
      width: 960,
      height: 720,
      alt: 'Rampa de acesso fácil para veículos na Ângelo Car Oficina Mecânica na Zona Sul de Porto Alegre',
      caption: 'Acesso direto pela Av. Vicente Monteggia com pátio próprio'
    }
  ],
  // IDs prontos para preencher assim que o cliente/gestor ativar o GTM/GA4 no novo domínio
  tracking: {
    gtmId: '',
    ga4Id: '',
    googleAdsId: 'AW-806732779'
  }
};

export function buildWhatsappUrl(message) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
