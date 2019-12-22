const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Mutations = {
    async createItem(parent, args, ctx, info) {
        // TODO: check if they are logged in

        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info)
        console.log(item)
        return item;
    },
    updateItem(parent, args, ctx, info) {
        // first take a copy of the update
        const updates = { ...args };
        // remove the ID from the update because this is not the ID that will used
        delete updates.id;
        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
    },
    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };
        // 1. find the item
        const item = await ctx.db.query.item( {where} , `{ id title }`);
        // check if the user has permissions
            // TODO
        // delete it!
        return ctx.db.mutation.deleteItem({ where }, info);
    },
    async signup(parent, args, ctx, info) {
        // lowercase their email
        args.email = args.email.toLowerCase();
        // hash their password
        const password = await bcrypt.hash(args.password, 10);
        // create the user in the database
        const user = await ctx.db.mutation.createUser(
        {
            data: {
                ...args,
                password,
                permissions: { set: ['USER'] },
            },
        }, 
        info);
        // create the JWT token for them to be signed in after signing up
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
        // set the jwt as a cookie on the response
        ctx.response.cookie('token', token, {
            httpOnly: 'true',
            maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
        });
        // then we retun the user to the browser
        return user;
    },
    async signin(parent, { email, password }, ctx, info) {
        // 1. check if there is a user with that email
        const user = await ctx.db.query.user({ where: { email } });
        if (!user) {
            throw new Error(`No such user found for email ${email}`)
        }
        // 2. check if the password is correct
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error(`Invalid Password!`);
        }
        // 3. generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // 4. set the cookie with the token
        ctx.response.cookie('token', token, {
            httpOnly: 'true',
            maxAge: 1000 * 60 * 60 * 24 * 365
        })
        // 5. return the user
        return user;
    },
    signout(parent, args, ctx, info) {
        ctx.response.clearCookie('token');
        return { messgae: 'Goodbye' };
    },
};

module.exports = Mutations;
