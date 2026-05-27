import app from "./app";
import config from "./config"

const main = () => {
  app.listen(config.port, () => {
  
  console.log(`Express server is running on  http://localhost:${config.port} `)
})
}

main()