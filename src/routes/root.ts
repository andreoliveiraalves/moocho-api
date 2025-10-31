import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Moocho API</title>
        <meta name="description" content="Moocho API running. View documentation at /api-docs">
        <style>
            html, body {
                height: 100%;
                width: 100%;
                margin: 0;
                padding: 0;
                font-family: roboto, arial, sans-serif;
            }

            .container {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .content-container {
                display: flex;
                justify-content: center;
                height: 80vh;
            }

            .text {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
            }

            .mascot-container {
                height: 100%;
                width: 50%;
                display: flex;
                justify-content: flex-start;
                align-items: flex-end;
            }

            .mascot {
                max-height: 80%;
            }

            .github-link-container {
                height: 20vh;
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                margin-right: 2vw;
                margin-bottom: 2vh;
            }

            .github-link a {
                color: #333;
                font-weight: bold;
                text-decoration: none;
            }

            .github-link a:hover {
                color: #007bff;
                text-decoration: underline;
            }

            h2 {
                color: #4CAF50;
                margin: 0;
            }

            a {
                color: #007bff;
                text-decoration: none;
                font-weight: bold;
            }

            a:hover {
                text-decoration: underline;
            }

            @media (max-width: 600px) {
                .container {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                }

                .content-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    align-items: center;
                    height: 65vh;
                }

                .mascot-container {
                    height: 65%;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                }

                .github-link-container {
                    height: 35vh;
                }

                .mascot {
                    height: 100%;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content-container">
                <div class="text">
                    <h2>🟢 Moocho API is running!</h2>
                    <p>View API documentation at <a href="/api-docs">Swagger UI</a></p>
                </div>
                <div class="mascot-container">
                    <img class="mascot" src="/mascot.png" alt="Mascot">
                </div>
            </div>
            <div class="github-link-container">
                <div class="github-link">
                    Check our <a href="https://github.com/andreoliveiraalves/moocho-api" target="_blank">GitHub repo</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `)
})

export default router