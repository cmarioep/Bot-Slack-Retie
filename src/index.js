require('dotenv').config();
const { App } = require('@slack/bolt');


const app = new App({
    token: process.env.SLACK_APP_TOKEN,
    signingSecret: process.env.SLACK_APP_SIGNING_SECRET
});


app.message(({ message, say }) => {
    console.log(message.text);
    say(message.text);
});



app.message(/^\(calcularAreaCirculo , (\d+)\)$/, async ({ message, context }) => {
    console.log('llego un calculo');

    const radius = parseFloat(message.text.match(/^\(calcularAreaCirculo , (\d+)\)$/)[1]);
    const area = Math.PI * Math.pow(radius, 2);
    try {
        const result = await app.client.chat.postMessage({
            token: context.botToken,
            channel: "#dudas-tecnicas",
            text: `El área del círculo es ${area}`
        });
        console.log(result);
    } catch (error) {
        console.error(error);
        if (error.data.error === 'channel_not_found') {
            say("Canal no encontrado, por favor verifica el nombre del canal o si tienes permisos para enviar mensajes en el mismo.")
        } else if (error.data.error === 'missing_scope') {
            say("No tienes permisos para enviar mensajes en este canal, por favor contacta a un administrador.")
        } else {
            say("Lo siento, ha ocurrido un error inesperado. Por favor intenta de nuevo más tarde.")
        }
    }
});




app.message(/^\(calcularAreaCuadrado , (\d+)\)$/, async ({ message, say }) => {
    const side = parseFloat(message.text.match(/^\(calcularAreaCuadrado , (\d+)\)$/)[1]);
    const area = Math.pow(side, 2);
    await say(`El área del cuadrado es ${area}`);
});


app.error((error) => {
    console.log(error);
    say("Lo siento, ha ocurrido un error. Por favor verifica el formato del mensaje o intenta de nuevo más tarde.")
});


(async () => {
    // Start your app
    await app.start(process.env.PORT || 5173);

    console.log('⚡️ Bolt app is running!');

    // Send message to channel when bot starts
    try {
        const result = await app.client.chat.postMessage({
            token: process.env.SLACK_APP_TOKEN,
            channel: "#dudas-tecnicas",
            text: "El bot ha iniciado correctamente y esta listo para recibir preguntas"
        });

    } catch (error) {
        console.error(error);
    }

})();
