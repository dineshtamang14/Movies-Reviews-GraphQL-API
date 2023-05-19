const { createSchema, createYoga } = require("graphql-yoga")
const { users, movies, reviews } = require("./sampleData")
const { createServer } = require("node:http")
const { importSchema } = require('graphql-import');
const resolvers = require("./resolvers")
const typeDefs = importSchema('./src/schema.graphql');

// schemas
// GraphQL Scaler Types: String, Int, Float, Boolean, ID

const yoga = createYoga({ 
    schema: createSchema({
        typeDefs,
        resolvers
    }),
    context: {
        users,
        movies,
        reviews
    } 
})

const server = createServer(yoga);
const PORT = 5000 | process.env.PORT;
server.listen(PORT, () => {
    console.info(`Server is running on http://localhost:${PORT}/graphql`)
})