const { createSchema, createYoga, createPubSub } = require("graphql-yoga")
const { PrismaClient } = require("@prisma/client")
const { users, movies, reviews } = require("./sampleData")
const { createServer } = require("node:http")
const { importSchema } = require('graphql-import');
const resolvers = require("./resolvers")
const typeDefs = importSchema('./src/schema.graphql');

// schemas
// GraphQL Scaler Types: String, Int, Float, Boolean, ID
const prisma = new PrismaClient()
const pubsub = createPubSub()

const yoga = createYoga({ 
    schema: createSchema({
        typeDefs,
        resolvers
    }),
    context: {
        users,
        movies,
        reviews,
        pubsub,
        prisma
    } 
})

const server = createServer(yoga);
const PORT = 4000 || process.env.PORT;
server.listen(PORT, () => {
    console.info(`Server is running on http://localhost:${PORT}/graphql`)
})