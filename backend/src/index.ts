import App from './app';

const app = new App([], Number(process.env.PORT) || 5000);
app.listen();
