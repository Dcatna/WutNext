

const {Pool} = require('pg')

const connection = new Pool({
    user: "postgres.ghasvemjqkfxpkkafnbg",
    host: "aws-0-us-east-1.pooler.supabase.com",
    database: "postgres",
    password: "Vaprak08!234",
    port: 5432,
})

export default connection