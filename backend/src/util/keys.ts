export default {
   MONGO_HOST: process.env.MONGO_HOST || 'mongodb://localhost:27017/test',
   SERVER_PORT: process.env.SERVER_PORT  || '8081',
   JWT_SECRET: process.env.JWT_SECRET || 'naber_la_gevsek_angara_bebesiyiz_tabi_la_biz',
   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '90d',
}