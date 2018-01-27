const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        xoauth2: xoauth2.createXOAuth2Generator({
            user: 'getinsafeapp@gmail.com',
            clientId: '871830004828-1juqn1ojsruphrotim7oj682rl0cfong.apps.googleusercontent.com',
            clientSecret: 'fDAOk5cQwbOZlfGu8S0r2hSU',
            refreshToken: '1/cemb8FVbKaFMlbySzKZFknAmFxR7gJtXnsD7lKUET0U'
        })
    }
}))

var mailOptions = {
    from: 'Get in Safe Monitor Center <getinsafeapp@gmail.com>',
    to: 'sebastiangon11@gmail.com',
    subject: 'EMERGENCIA',
    text: `Hola Rocio: 
        Sebastian Gonzalez la ha seleccionado como contacto de emergencia y puede que haya sufrido un robo/secuestro mientras ingresaba a su hogar, por favor pongase en contacto con el lo antes posible.
        Equipo de seguridad de GetInSafe.
        `
}

transporter.sendMail(mailOptions, function (err, res) {
    if(err){
        console.log('Error', err);
    } else {
        console.log('Email Sent');
    }
})