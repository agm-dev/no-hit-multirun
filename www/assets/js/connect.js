class Connect {
  connection = null
  connection_status = false
  ip_address = 'localhost'
  port = 8888

  start({ container, onMessage } = {}) {
    this.connection = new WebSocket(`ws://${this.ip_address}:${this.port}`)

    this.connection.onopen = () => {
      this.connection_status = true
      console.log('Connection established')

      if (container) {
        container.innerHTML = 'OK'
      }

      const event = new Event('websocketConnectionReady')
      document.dispatchEvent(event)
    }

    this.connection.onmessage = (ev) => {
      const data = JSON.parse(ev.data)
      console.log('Message received:', data)

      if (onMessage) onMessage(ev)
    }

    this.connection.onclose = () => {
      this.connection_status = false
      console.log('Connection closed')

      if (container) {
        container.innerHTML = 'DESCONECTADO'
      }
    }

    this.connection.onerror = (ev) => {
      this.connection_status = false
      console.error('Connection error:', ev)

      if (container) {
        document.querySelector('.window .title').innerHTML = 'ERROR'
      }
    }
  }

  sendMessage(type, data = {}) {
    if (this.connection_status === false) return

    const stringified = JSON.stringify({
      type,
      data
    })
    this.connection.send(stringified)
  }
}