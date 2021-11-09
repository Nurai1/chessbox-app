// import * as http from 'http';
import express from 'express';
import { fileURLToPath } from 'url';

const currentPath = fileURLToPath(import.meta.url);
const __dirname = currentPath.slice(0, currentPath.lastIndexOf('/'));

const app = express();

app.use('/static', express.static(__dirname + '/public'));

// // определяем Router
// const productRouter = express.Router();
// // определяем маршруты и их обработчики внутри роутера
// productRouter.use("/create", function(request, response){
//     response.send("Добавление товара");
// });
// productRouter.use("/:id", function(request, response){
//     response.send(`Товар ${request.params.id}`);
// });
// productRouter.use("/", function(request, response){
//     response.send("Список товаров");
// });
// сопотавляем роутер с конечной точкой "/products"
// app.use("/products", productRouter);

app.use("/about", function (request, response) {
    response.send("О сайте");
});

app.get("", function(request, response) {
    console.log(request.url);
    console.log(request.method);

    response.setHeader('userId', 322);
    response.setHeader('Content-Type', "text/plain; charset=ASCII;");
    response.redirect("home");
});

app.use('/books', (req, res) => {
    console.log(req.url);
    const id = req.url.slice(req.url.lastIndexOf('/') + 1, req.url.lastIndexOf('?'));
    const books = {
        1: "Tom Sower",
        2: "Martin Iden",
    };

    const author = req.query.author;

    res.send(`<h1>This is "${books[id]}" by important author. By authors ${author.name} and ${author.surname}</h1>`);
});

app.use((request, response, next) => {
    response.status(404).send('Resource not found.');
});

app.listen(3001);

// http.createServer(function(request, response) {
//     response.end("The name is " + process.argv[2] + " and age is " + process.argv[3]);
// })
//     .listen(3001, "127.0.0.1", function() {
//         console.log("Сервер слушает!");
//     });
