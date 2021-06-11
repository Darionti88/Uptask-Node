const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const {convert} = require('html-to-text')
const util = require('util')
const emailConfig = require('../Config/email');

let transporter = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    },
    // tls:{
    //   rejectUnauthorized: false
    // }
  });


  //generar HTML
  const generarHtml = (archivo, opciones = {})=>{
    const html = pug.renderFile(`${__dirname}/../Views/mails/${archivo}.pug`, opciones)
    return juice(html)
  }

exports.enviar = async (opciones)=>{
  const html = generarHtml(opciones.archivo, opciones)
  const text = convert(html)

  let mailOptions={
    from: 'UpTask<hornero.audiovisuales@gmail.com>',
    to: opciones.usuario.email,
    subject: opciones.subject,
    text,
    html,
  }
  const enviarEmail = util.promisify(transporter.sendMail(mailOptions, (err, info)=>{
    if(err){
      console.log(err)
      return
    }
  }), [])
  return enviarEmail.call(transporter, mailOptions)
  
}

  