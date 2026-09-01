'use client'
import { useEffect } from 'react'

// Regista a abertura da página. Não escreve nada no dispositivo — sem cookies,
// sem localStorage, sem sessionStorage — e é por isso que este site não precisa
// de banner de consentimento. As visitas repetidas separam-se no servidor.
// De onde a pessoa veio, reduzido ao nome do servidor. O `document.referrer`
// inteiro podia trazer termos de pesquisa ou identificadores na query; para o
// relatório basta 'google.com'. Visita direta fica em branco, que é resposta.
const deOndeVeio = () => {
  try { return new URL(document.referrer).hostname } catch { return '' }
}

export default function Registar({ servico }) {
  useEffect(() => {
    if (!servico?.rastrear) return
    const enviar = (corpo, beacon) => {
      const url = `${servico.api}/api/track`
      const dados = JSON.stringify({ caminho: servico.site, ...corpo })
      // Ao sair da página um `fetch` normal é cancelado antes de chegar. O
      // `sendBeacon` é entregue pelo browser depois de a página morrer — e vai
      // como texto simples de propósito, que é o que o dispensa de pedir
      // autorização ao servidor primeiro, coisa que já não haveria tempo de fazer.
      if (beacon && navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([dados], { type: 'text/plain' }))
        return
      }
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: dados,
        keepalive: true,
      }).catch(() => {})
    }

    enviar({ tipo: 'view', origem: deOndeVeio() })

    // Tempo com a página à frente, não tempo com o separador aberto: um site
    // deixado aberto a noite inteira contaria doze horas e não diria nada.
    let desde = document.visibilityState === 'visible' ? Date.now() : 0
    let somados = 0
    let entregue = false

    const parar = () => {
      if (desde) { somados += Date.now() - desde; desde = 0 }
    }
    const aoMudar = () => {
      if (document.visibilityState === 'visible') { if (!desde) desde = Date.now(); return }
      parar()
      if (entregue || somados < 2000) return
      entregue = true
      enviar({ tipo: 'saida', duracao: Math.round(somados / 1000) }, true)
    }

    document.addEventListener('visibilitychange', aoMudar)
    // O `pagehide` apanha o iOS, onde fechar o separador nem sempre passa pelo
    // `visibilitychange`.
    window.addEventListener('pagehide', aoMudar)
    return () => {
      document.removeEventListener('visibilitychange', aoMudar)
      window.removeEventListener('pagehide', aoMudar)
    }
  }, [servico])

  return null
}
