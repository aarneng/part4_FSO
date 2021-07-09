const app = require("./app")
const config = require("./utils/config")
const http = require("http")

const PORT = config.PORT

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
