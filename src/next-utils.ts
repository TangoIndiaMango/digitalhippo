import next from "next";

const PORT = Number(process.env.PORT) || 3000;

// create a next app
export const nextApp = next({
    dev: process.env.NODE_ENV !== "production",
    port: PORT,
})


// self host next js app, nextjs logic gets handled
export const nextHandler = nextApp.getRequestHandler();