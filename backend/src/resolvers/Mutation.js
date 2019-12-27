const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

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
    async requestReset(parent, args, ctx, info) {
        // 1. check if this is a real user
        const user = await ctx.db.query.user({ where: { email: args.email }});
        if (!user) {
            throw new Error(`No such user found for email ${email}`)
        }
        // 2. set a reset token and expiry on that user
        const randomBytesPromiseified = promisify(randomBytes)
        const resetToken = (await randomBytesPromiseified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 360000 // 1 hour from now
        const res = await ctx.db.mutation.updateUser({
            where: {email: args.email},
            data: { resetToken, resetTokenExpiry }
        })
        console.log(res)
        return { message: 'Thanks!' };
        // 3. email them the reset token
    },
    async resetPassword(parent, args, ctx, info) {
        // 1. check if the passwords match
        if (args.password !== args.confirmPassword) {
            throw new Error('passwords do not match');
        }
        // 2. check if it's a legit reset token
        // 3. check if its expired 
        const [user] = await ctx.db.query.users({
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000
            }
        });
        if (!user) {
            throw new Error('This token is either invalid or expired')
        }
        // 4. Hash their new password
        const password = await bcrypt.hash(args.password, 10)
        // 5. save the new password to the user and remove the reset token
        const updatedUser = await ctx.db.mutation.updateUser({
            where: { email: user.email },
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: null,
            }
        }) 
        // 6. generate JWT
        const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET)
        // 7. set the JWT cookie
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365
        })
        // 8. return the new user
        return updatedUser;
    }
};

module.exports = Mutations;
