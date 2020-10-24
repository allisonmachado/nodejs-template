import mysql from "mysql";

import { CheckTypes } from "../../../lib/CheckTypes";
import { Connection } from "./Connection";
import { Logger } from "../../../lib/Logger";

export abstract class RespositoryTemplate {
    private readonly logger = new Logger(RespositoryTemplate.name);

    constructor(private connection: Connection) {
        this.logger.debug(`initialized`);
    }

    public query(sql: string, parameters: any[] = null): Promise<any> {
        let preparedStatement = sql;
        this.logger.debug(`query(${preparedStatement})`);
        if (!CheckTypes.isNullOrUndefined(parameters)) {
            preparedStatement = mysql.format(sql, parameters);
        }
        return new Promise((resolve, reject) => {
            this.connection.getPool().getConnection((err, conn) => {
                if (err) {
                    this.logger.error(`get connection: ${err}`);
                    reject(err);
                }
                conn.query(preparedStatement, (error, results) => {
                    conn.release();
                    if (error) {
                        this.logger.error(`query: ${error}`);
                        reject(error)
                    }
                    resolve(results);
                });
            });
        });
    }
}
