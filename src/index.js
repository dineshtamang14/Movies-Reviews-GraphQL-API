const { createSchema, createYoga } = require("graphql-yoga")
const { users, movies, reviews } = require("./sampleData")
const { createServer } = require("node:http")

// schema
const typeDefs = `
    type Query {
        movie: String!
    }
`

const resolvers = {
    Query: {
        movie: () => "The Lego Movie"
    }
}

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

server.listen(4000, () => {
    console.info('Server is running on http://localhost:4000/graphql')
})