import knex, { Knex } from "knex";

export const getKnex = (): Knex => {
    const { DB_HOST: host, DB_CATALOG: database, DB_USERNAME: user, DB_PASSWORD: password } = process.env;
    return knex({
        client: "mssql",
        connection: {
            host,
            database,
            user,
            password,
            options: {
                enableArithAbort: true
            }
        }
    });
};
