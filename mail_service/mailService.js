import { mail_service_endpoint } from './mail_service.config';

/* mailList = [{ to: { name: 'receptor name', mail: 'receptor mail' }, from: { name: 'app user name' } }] */

export const sendMail = (mailList) => {
    const mails = mailList.map((mail) => {
        return generateMail(mail);
    });

    postMail(mails);
};

generateMail = (mail) => {
    return {
        from: 'Get in Safe Monitor Center <getinsafeapp@gmail.com>',
        to: mail.to.mail,
        subject: "EMERGENCIA",
        text:
        `Hola ${mail.to.name}: 
            ${mail.from.name} te ha seleccionado como contacto de emergencia y puede que haya sufrido un robo/secuestro mientras ingresaba a su hogar, por favor pongase en contacto con ${mail.from.name} lo antes posible.
        Equipo de seguridad de GetInSafe.`
    }
};

postMail = (mailBody) => {
    fetch(mail_service_endpoint, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(mailBody),
    })
    .then((data) => {
        console.log('MailService postMessageSuccess: ', JSON.stringify(data));
    })
    .catch((err) => {
        console.log('MailService Error on postMail: ', err);
    });
};
