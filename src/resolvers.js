const resolvers = {
    Query: {
        movies: async (parent, args, ctx, info) => {
            // return ctx.movies
            return await ctx.prisma.movie.findMany();
        },

        users: async (parent, args, ctx, info) => {
            // return ctx.users;
            return await ctx.prisma.user.findMany();
        },

        reviews: async (parent, args, ctx, info) => {
            // return ctx.reviews
            return await ctx.prisma.review.findMany();
        }
    },
    Mutation: {
        async signup(parent, args, ctx, info){
            // const user = {
            //     id: `100${ctx.users.length + 1}`,
            //     name: args.name,
            //     email: args.email
            // }
            const user = await ctx.prisma.user.create({
                data: {
                    name: args.name,
                    email: args.email
                }
            });
            return user;
        },

        async createMovie(parent, args, ctx, info){
            // const movie = {
            //     id: `200${ctx.movies.length + 1}`,
            //     title: args.title
            // }

            const movie = await ctx.prisma.movie.create({
                data: {
                    title: args.title
                }
            });
            return movie;
        },

        async createReview(parent, args, ctx, info) {
            // const review = {
            //     id: `300${ctx.reviews.length + 1}`,
            //     movie: args.movieId,
            //     reviewText: args.reviewText,
            //     rating: args.rating,
            //     user: args.userId
            // }

            const user = await ctx.prisma.user.findUnique({
                where: {
                  id: Number(args.userId) 
                }
            });
            const movie = await ctx.prisma.movie.findUnique({
                where: {
                  id: Number(args.movieId) 
                }
            });
            
            if(!user){
                throw new Error("user does not exist");
            }

            if(!movie){
                throw new Error("movie does not exist");
            }

            const review = await ctx.prisma.review.create({
                data: {
                    movie: {
                        connect: {
                            id: args.movieId
                        }
                    },
                    reviewText: args.reviewText,
                    rating: args.rating,
                    user: {
                        connect: {
                            id: args.userId
                        }
                    }
                }
            });

            ctx.pubsub.publish('newReview', { review });
            return review;
        }
    },
    Subscription: {
        review: {
            subscribe(parent, args, ctx, info) {
                return ctx.pubsub.subscribe('newReview')
            }
        }
    },

    Review: {
        movie: async (parent, args, ctx, info) => {
            // return ctx.movies.find(movie => {
            //     return movie.id === parent.movie
            // })

            const review = await ctx.prisma.review.findUnique({
                where: { id: parent.id },
                include: { movie: true },
            });
            
            return review.movie;
        },

        user: async (parent, args, ctx, info) => {
            // return ctx.users.find(user => {
            //     return user.id === parent.user
            // })

            const review = await ctx.prisma.review.findUnique({
                where: { id: parent.id },
                include: { user: true },
            });
            
            return review.user;
        }
    },

    User: {
        reviews: (parent, args, ctx, info) => {
            return ctx.reviews.filter(review => {
                return review.user === parent.id
            })
        }
    },

    Movie: {
        reviews: async (parent, args, ctx, info) => {
            // return ctx.reviews.filter(review => {
            //     return review.id === parent.reviews
            // })

            const review = await ctx.prisma.movie.findUnique({
                where: { id: parent.id },
                include: { review: true },
            });
            
            return review.user;
        }
    }
}


module.exports = resolvers