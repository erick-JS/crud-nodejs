//cSpell:Ignore MONGOURI
const mongoose = require('mongoose')

//String de Conexão
const MONGOURI = process.env.MONGODB_URL

const InicializaMongoServer = async() =>{
    try{
        await mongoose.connect(MONGOURI, {
            useNewUrlParser: true, //utiliza o novo parse do mongo
            useCreateIndex: true, //permite a criação de índices
            useFindAndModify: false, //por padrão utilizará o findOneAndUpdate
            useUnifiedTopology: true //permite a descoberta de novos servidores
        })
        console.log('Conectado ao banco de dados!')
    }catch(e){
        console.log('Não foi possível se conectar ao banco de dados')
        console.error(e)
        throw e
    }
}

module.exports = InicializaMongoServer
