exports.up = knex => knex.schema.createTable("links", table => {
    table.increments("id");
    table.text("url");
    table.integer("notes_id").references("id").inTable("notes").onDelete("CASCADE");
    //table.integer("user_id").reference("id").inTable("users");

    table.timestamp("created_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("links");