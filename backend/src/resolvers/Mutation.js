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
        // first take a  copy of the update
        const updates = { ...args };
        // remove the ID from the update because this is not the ID that will used
        delete updates.id;
        return ctx.db.mutation.updateItem({
            data: updates,
            where: {
                id: args.id
            }
        }, info)
    }
};

module.exports = Mutations;
